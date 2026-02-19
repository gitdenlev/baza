import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from '../database/database.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponse, AuthTokens, TokenPayload } from './types/auth.types';

@Injectable()
export class AuthService {
  private readonly SALT_ROUNDS = 12;
  private readonly ACCESS_TOKEN_EXPIRY = '15m';
  private readonly REFRESH_TOKEN_EXPIRY = '7d';
  private readonly REFRESH_TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;

  constructor(
    private readonly db: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const existingUser = await this.db.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, this.SALT_ROUNDS);

    const user = await this.db.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name || null,
      },
    });

    const tokens = await this.generateTokens(user.id, user.email);

    await this.saveRefreshToken(user.id, tokens.refreshToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      tokens,
    };
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.db.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const tokens = await this.generateTokens(user.id, user.email);

    await this.saveRefreshToken(user.id, tokens.refreshToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      tokens,
    };
  }

  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    try {
      const payload = this.jwtService.verify<TokenPayload>(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const storedTokens = await this.db.refreshToken.findMany({
        where: {
          userId: payload.sub,
          expiresAt: { gt: new Date() },
        },
      });

      let validToken = false;
      for (const stored of storedTokens) {
        if (await bcrypt.compare(refreshToken, stored.tokenHash)) {
          validToken = true;
          await this.db.refreshToken.delete({ where: { id: stored.id } });
          break;
        }
      }

      if (!validToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const tokens = await this.generateTokens(payload.sub, payload.email);

      await this.saveRefreshToken(payload.sub, tokens.refreshToken);

      return tokens;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string): Promise<void> {
    await this.db.refreshToken.deleteMany({
      where: { userId },
    });
  }

  async getProfile(userId: string) {
    const user = await this.db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }

  private async generateTokens(
    userId: string,
    email: string,
  ): Promise<AuthTokens> {
    const payload: TokenPayload = { sub: userId, email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: this.ACCESS_TOKEN_EXPIRY,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: this.REFRESH_TOKEN_EXPIRY,
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private async saveRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const tokenHash = await bcrypt.hash(refreshToken, 10);

    await this.db.refreshToken.create({
      data: {
        tokenHash,
        userId,
        expiresAt: new Date(Date.now() + this.REFRESH_TOKEN_EXPIRY_MS),
      },
    });

    await this.db.refreshToken.deleteMany({
      where: {
        userId,
        expiresAt: { lt: new Date() },
      },
    });
  }
}
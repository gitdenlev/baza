// import { Injectable } from '@nestjs/common';
// import { PrismaClient } from '../../generated/prisma/client';

// @Injectable()
// export class DatabaseService extends PrismaClient {
//   constructor() {
//     super({
//       datasources: {
//         db: {
//           url: process.env.DATABASE_URL,
//         },
//       },
//     });
//   }

//   async onModuleDestroy() {
//     await this.$disconnect();
//   }

//   async onModuleInit() {
//     await this.$connect();
//   }
// }

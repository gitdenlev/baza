import { ApiProperty } from '@nestjs/swagger';

export class StorageUsageDto {
  @ApiProperty({
    example: 524288000,
    description: 'Bytes used by active files',
  })
  usedBytes: bigint;

  @ApiProperty({
    example: 10485760,
    description: 'Bytes used by trashed files',
  })
  trashBytes: bigint;

  @ApiProperty({ example: 1073741824, description: 'Total quota in bytes' })
  quotaBytes: bigint;

  @ApiProperty({ example: 539267064, description: 'Free space in bytes' })
  freeBytes: bigint;

  @ApiProperty({ example: 48.83, description: 'Percent of quota used' })
  percentUsed: number;
}

import { ApiProperty } from '@nestjs/swagger';

export class RequestRentDto {
  @ApiProperty()
  auto_id: number;
  @ApiProperty()
  start_date: Date;
  @ApiProperty()
  end_date: Date;
}

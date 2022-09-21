import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { RentService } from './rent.service';
import { RequestRentDto } from './dto/request-rent.dto';

@Controller('/rent')
export class RentController {
  constructor(private rentService: RentService) {}
  @Post()
  create(@Body() dto: RequestRentDto) {
    return this.rentService.create(dto);
  }

  @Get('')
  async getAll(@Query('limit') limit: number, @Query('skip') skip: number) {
    const items = await this.rentService.list(limit, skip);
    const totalCount = await this.rentService.count();
    return { totalCount, items };
  }

  @Get('/:id')
  show(@Param('id') id: number) {
    return this.rentService.show(id);
  }

  @Get('/car/:id')
  listByCarId(@Param('id') id: number) {
    return this.rentService.listRentsByAutoId(id);
  }

  @Get('/report/:month')
  async getMonthRentsReport(@Param('month') month: number) {
    const items = await this.rentService.getMonthRentsReport(month);
    return { items };
  }
}

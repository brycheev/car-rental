import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreateAutoDto } from './dto/create-auto.dto';
import { AutoService } from './auto.service';

@Controller('/auto')
export class AutoController {
  constructor(private autoService: AutoService) {}

  @Post()
  create(@Body() dto: CreateAutoDto) {
    return this.autoService.create(dto);
  }

  @Get('/:id/status')
  checkStatus(@Param('id') id: number) {
    return this.autoService.checkStatus(id);
  }

  @Get()
  async list(@Query('skip') skip: number, @Query('limit') limit: number) {
    const items = await this.autoService.list({ limit, skip });
    const totalCount = await this.autoService.count();
    return { totalCount, items };
  }

  @Get('/:id')
  show(@Param('id') id: number) {
    return this.autoService.show(id);
  }
}

import { Module } from '@nestjs/common';
import { RentService } from './rent.service';
import { AutoService } from '../auto/auto.service';
import { AutoRepository } from '../auto/repostory/auto.repository';
import { RentRepository } from './repository/rent.repository';
import { DbModule } from '../db/db.module';

@Module({
  imports: [DbModule],
  providers: [RentService, AutoService, AutoRepository, RentRepository],
})
export class RentModule {}

import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateAutoDto } from './dto/create-auto.dto';
import { RentService } from '../rent/rent.service';
import * as moment from 'moment';
import { AutoRentStatus } from '../util/auto-rent-status';
import { AutoRepository } from './repostory/auto.repository';
import { AutoEntity } from './entity/auto.entity';
import { RentPeriod } from '../util/rent-period';
import { RentEntity } from '../rent/entity/rent.entity';

@Injectable()
export class AutoService {
  constructor(
    @Inject(forwardRef(() => RentService))
    private readonly rentService: RentService,
    private readonly autoRepository: AutoRepository,
  ) {}

  create(dto: CreateAutoDto): Promise<AutoEntity> {
    const entity: AutoEntity = new AutoEntity(dto);
    return this.autoRepository.create(entity);
  }

  async list({ limit = 10, skip = 0 }) {
    return await this.autoRepository.list({ skip, limit });
  }

  count(): Promise<number> {
    return this.autoRepository.count();
  }

  show(id: number): Promise<AutoEntity> {
    return this.autoRepository.getById(id);
  }

  async checkStatus(
    id: number,
    startDate = new Date(),
  ): Promise<{ status: string }> {
    const auto: AutoEntity = await this.autoRepository.getById(id);
    const rent: RentEntity = await this.rentService.getByAutoId(auto.id);
    if (!rent) {
      return { status: AutoRentStatus.AVAILABLE };
    }

    const rentEndDate = moment(rent.end_date);
    if (rentEndDate.isSameOrAfter(moment())) {
      return { status: AutoRentStatus.IN_REST };
    }

    const dateForNextRent = rentEndDate.add(RentPeriod.PAUSE, 'day');
    if (dateForNextRent.isSameOrAfter(moment(startDate))) {
      return { status: AutoRentStatus.UNAVAILABLE };
    }

    return { status: AutoRentStatus.AVAILABLE };
  }
}

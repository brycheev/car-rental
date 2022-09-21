import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import * as moment from 'moment';
import { AutoService } from '../auto/auto.service';
import { RequestRentDto } from './dto/request-rent.dto';
import { AutoRentStatus } from '../util/auto-rent-status';
import { RentRepository } from './repository/rent.repository';
import { RentEntity } from './entity/rent.entity';
import { Tariff } from '../util/tariff';
import { RentPeriod } from '../util/rent-period';
import * as _ from 'lodash';

@Injectable()
export class RentService {
  constructor(
    @Inject(forwardRef(() => AutoService))
    private readonly autoService: AutoService,
    private readonly rentRepository: RentRepository,
  ) {}

  async getByAutoId(id: number) {
    return await this.rentRepository.getOneByAutoId(id);
  }

  async create(dto: RequestRentDto): Promise<RentEntity> {
    if (!this.isWorkDay(dto.start_date, dto.end_date)) {
      throw new ForbiddenException({
        message:
          'You cannot rent a car during this period, because the start or end is non-working days',
      });
    }
    const autoStatus = await this.autoService.checkStatus(
      dto.auto_id,
      dto.start_date,
    );
    if (autoStatus.status === AutoRentStatus.UNAVAILABLE) {
      throw new ForbiddenException({
        message: 'This auto is unavailable for rent',
      });
    }
    if (autoStatus.status === AutoRentStatus.IN_REST) {
      throw new ForbiddenException({
        message: `You can't rent this auto because it's for rent`,
      });
    }

    const range = this.getDateRangeDays(dto.start_date, dto.end_date);
    if (range > RentPeriod.MAX || range < RentPeriod.MIN) {
      throw new ForbiddenException({
        message:
          'Invalid value for end_date, you can rent auto only for 1-30 days',
      });
    }
    const entity = new RentEntity({ ...dto, price: this.calcPrice(range) });
    return await this.rentRepository.create(entity);
  }

  list(limit = 10, skip = 0): Promise<Array<RentEntity>> {
    return this.rentRepository.list(skip, limit);
  }

  count(): Promise<number> {
    return this.rentRepository.count();
  }

  listRentsByAutoId(id: number): Promise<Array<RentEntity>> {
    return this.rentRepository.getAllByAutoId(id);
  }

  show(id: number): Promise<RentEntity> {
    return this.rentRepository.getOneById(id);
  }

  async getMonthRentsReport(month: number): Promise<Array<any>> {
    let rents = await this.rentRepository.getByMonth(month);
    if (!rents.length) {
      return [];
    }
    rents = rents.map((rent) => ({
      ...rent,
      days: this.getDateRangeDays(rent.start_date, rent.end_date),
    }));
    const groups = _.groupBy(rents, 'auto_id');
    const autos = _.keys(groups).map((key) => ({
      auto_id: +key,
      state_number: groups[key][0].state_number,
      total_days: groups[key].reduce((acc, x) => acc + x.days, 0),
    }));
    return autos.map((car) => ({
      ...car,
      percentage:
        Math.round((100 / moment(month, 'M').daysInMonth()) * car.total_days) +
        '%',
    }));
  }

  private isWorkDay(startDate: Date, andDate: Date): boolean {
    const sDateDay = moment(startDate).weekday();
    const eDateDay = moment(andDate).weekday();
    return (
      !RentPeriod.NON_WORKING_DAYS.includes(sDateDay) &&
      !RentPeriod.NON_WORKING_DAYS.includes(eDateDay) &&
      startDate < andDate
    );
  }

  private getDateRangeDays(startDate: Date, andDate: Date): number {
    return moment(andDate).diff(startDate, 'days');
  }

  private calcPrice(days: number): number {
    let total = 0;
    for (let i = 1; i <= days; i++) {
      total +=
        Tariff.TARIFFS.find(
          (tariff) => tariff.daysRange.from <= i && tariff.daysRange.to >= i,
        )?.tariff || 0;
    }
    return total;
  }
}

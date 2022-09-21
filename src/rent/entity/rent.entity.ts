// import { AutoEntity } from '../../auto/entity/auto.entity';

export class RentEntity {
  constructor({ auto_id, start_date, end_date, price }) {
    this.auto_id = auto_id;
    this.start_date = start_date;
    this.end_date = end_date;
    this.price = price;
  }
  id: number;
  auto_id: number;
  start_date: Date;
  end_date: Date;
  price: number;
  created_date = new Date();
}

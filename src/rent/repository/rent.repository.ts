import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { RentEntity } from '../entity/rent.entity';
import * as moment from 'moment';
import { PG_CONNECTION } from '../../contstants';

@Injectable()
export class RentRepository {
  constructor(@Inject(PG_CONNECTION) private db) {}
  async getOneById(id: number) {
    const query = `SELECT * FROM rent WHERE id=$1`;
    const params = [id];
    const rents = await this.db.query(query, params);
    if (!rents.rows.length) {
      throw new NotFoundException();
    }
    return rents.rows[0];
  }

  async create(entity: RentEntity): Promise<RentEntity> {
    const query = `INSERT INTO rent (auto_id, start_date, end_date, price) values ($1, $2, $3, $4) RETURNING *`;
    const params = [
      entity.auto_id,
      moment(entity.start_date).utc(true),
      moment(entity.end_date).utc(true),
      entity.price,
    ];
    const rent = await this.db.query(query, params);
    return rent.rows[0];
  }

  async list(skip, limit): Promise<Array<RentEntity>> {
    const query =
      'SELECT * FROM rent OFFSET ($1) ROWS FETCH NEXT ($2) ROWS ONLY';
    const params = [skip, limit];
    const rents = await this.db.query(query, params);
    return rents.rows;
  }

  async count(): Promise<number> {
    const query = 'SELECT COUNT(*) FROM rent';
    const rents = await this.db.query(query);
    return rents.rows[0]?.count || 0;
  }

  async getByMonth(month = moment().month()): Promise<Array<RentEntity>> {
    const query = `SELECT * FROM rent INNER JOIN auto ON auto.id = rent.auto_id WHERE EXTRACT(MONTH FROM start_date) = $1`;
    const params = [month];
    const rents = await this.db.query(query, params);
    return rents.rows;
  }

  async getOneByAutoId(id: number): Promise<RentEntity> {
    const query = `SELECT * FROM rent WHERE auto_id = $1 ORDER BY created_date DESC LIMIT 1`;
    const params = [id];
    const rents = await this.db.query(query, params);
    return rents.rows[0];
  }

  async getAllByAutoId(id: number): Promise<Array<RentEntity>> {
    const query = `SELECT * FROM rent WHERE auto_id = $1`;
    const params = [id];
    const rents = await this.db.query(query, params);
    return rents.rows;
  }
}

import { AutoEntity } from '../entity/auto.entity';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PG_CONNECTION } from '../../contstants';

@Injectable()
export class AutoRepository {
  constructor(@Inject(PG_CONNECTION) private db) {}
  async create(auto: AutoEntity) {
    const query = `INSERT INTO auto (brand, model, state_number, vin_code) values ($1, $2, $3, $4) RETURNING *`;
    const params = [auto.brand, auto.model, auto.state_number, auto.vin_code];
    const data = await this.db.query(query, params);
    if (!data.rows.length) {
      throw new NotFoundException();
    }
    return data.rows[0];
  }

  async getById(id: number): Promise<AutoEntity> {
    const query = `SELECT * FROM auto WHERE id = $1`;
    const params = [id];
    const res = await this.db.query(query, params);
    if (!res.rows.length) {
      throw new NotFoundException();
    }
    return res.rows[0];
  }

  async list({ skip = 10, limit = 0 }) {
    const query = `SELECT * FROM auto OFFSET ($1) ROWS FETCH NEXT ($2) ROWS ONLY`;
    const params = [skip, limit];
    const data = await this.db.query(query, params);
    return data.rows;
  }

  async count(): Promise<number> {
    const query = `SELECT COUNT(*) FROM auto`;
    const data = await this.db.query(query);
    return +data.rows[0]?.count || 0;
  }
}

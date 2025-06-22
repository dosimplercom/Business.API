import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class CalendarRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async getEvents(
    staff_id: number,
    business_id: number,
    start_date: Date,
    end_date: Date,
  ): Promise<any[]> {
    const result = await this.dataSource.query(
      `SELECT public.get_scheduler_events($1, $2, $3, $4)`,
      [staff_id, business_id, start_date, end_date],
    );
    return result[0]?.get_scheduler_events;
  }
}

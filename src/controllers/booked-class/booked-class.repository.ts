import { Injectable } from '@nestjs/common';
import {
  BookedClassCreateDto,
  BookedClassUpdateDto,
} from './dto/booked-class.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import {
  ChangeEventStatusDto,
  RescheduleRequestDto,
} from '../appointment/dto/appointment.dto';
import { CurrentUser } from 'src/shared/middleware/current-user.middleware';

@Injectable()
export class BookedClassRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async getById(id: number, businessId: number) {
    const result = await this.dataSource.query(
      'SELECT get_booked_class($1, $2)',
      [id, businessId],
    );
    return result[0]?.get_booked_class || null;
  }

  async create(data: BookedClassCreateDto) {
    const result = await this.dataSource.query(
      'SELECT create_booked_class($1)',
      [JSON.stringify(data)],
    );
    return result[0]?.create_booked_class || null;
  }

  async update(id: number, data: BookedClassUpdateDto) {
    const result = await this.dataSource.query(
      'SELECT update_booked_class($1, $2)',
      [id, JSON.stringify(data)],
    );
    return result[0]?.update_booked_class || null;
  }

  async delete(id: number, _businessId: number) {
    await this.dataSource.query(
      'UPDATE booked_class SET deleted = TRUE WHERE id = $1',
      [id],
    );
  }

  async reschedule(appointmentId: number, data: RescheduleRequestDto) {
    const res = await this.dataSource.query(
      'SELECT * FROM reschedule_booked_class($1, $2)',
      [appointmentId, JSON.stringify(data)],
    );
    return res[0]?.reschedule_booked_class;
  }

  async changeStatus(dto: ChangeEventStatusDto, user: CurrentUser) {
    await this.dataSource.query(
      'CALL update_booked_class_status($1, $2, $3, $4, $5)',
      [dto.event_id, dto.status_id, dto.comment, user.business_id, user.id],
    );
  }
}

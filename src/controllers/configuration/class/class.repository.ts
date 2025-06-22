import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { ClassCreationDto, ClassManipulationDto, ClassUpdateDto } from './dto/class.dto';

function roundMinTo5(minutes: number) {
  if (minutes % 5 > 0) {
    return Math.round(minutes / 5) * 5;
  }
  return minutes;
}

@Injectable()
export class ClassRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async getAllClasses(business_id: number) {
    const query = `SELECT * FROM class WHERE business_id = $1 AND deleted = false`;
    const result = await this.dataSource.query(query, [business_id]);
    return result.rows;
  }

  async getById(id: number, business_id: number)  {
    const query = `SELECT * FROM class WHERE id = $1 AND business_id = $2`;
    const result = await this.dataSource.query(query, [id, business_id]);
    return result.rows;
  }

  async add(data: ClassManipulationDto, business_id: number)  {
    const dData: ClassCreationDto = {
      business_id,
      name: data.name,
      description: data.description,
      default_duration_in_minutes: roundMinTo5(data.default_duration_in_minutes),
      default_buffer_time_in_minutes: roundMinTo5(data.default_buffer_time_in_minutes),
      default_cost: data.default_cost,
      capacity: data.capacity,
      available_for_online_booking: data.available_for_online_booking,
    };
    // Assuming you have a helper insert function on your db connection
    const result = await this.dataSource.query(
      `INSERT INTO class (business_id, name, description, default_duration_in_minutes, default_buffer_time_in_minutes, default_cost, capacity, available_for_online_booking)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [
        dData.business_id,
        dData.name,
        dData.description,
        dData.default_duration_in_minutes,
        dData.default_buffer_time_in_minutes,
        dData.default_cost,
        dData.capacity,
        dData.available_for_online_booking,
      ],
    );
    return result.rows[0];
  }

  async update(id: number, data: ClassManipulationDto)  {
    const dData: ClassUpdateDto = {
      name: data.name,
      description: data.description,
      default_duration_in_minutes: roundMinTo5(data.default_duration_in_minutes),
      default_buffer_time_in_minutes: roundMinTo5(data.default_buffer_time_in_minutes),
      default_cost: data.default_cost,
      capacity: data.capacity,
      available_for_online_booking: data.available_for_online_booking,
    };

    const result = await this.dataSource.query(
      `UPDATE class SET
        name = $1,
        description = $2,
        default_duration_in_minutes = $3,
        default_buffer_time_in_minutes = $4,
        default_cost = $5,
        capacity = $6,
        available_for_online_booking = $7
      WHERE id = $8
      RETURNING *`,
      [
        dData.name,
        dData.description,
        dData.default_duration_in_minutes,
        dData.default_buffer_time_in_minutes,
        dData.default_cost,
        dData.capacity,
        dData.available_for_online_booking,
        id,
      ],
    );

    return result.rowCount === 0 ? null : result.rows[0];
  }

  async delete(id: number, business_id: number): Promise<void> {
    await this.dataSource.query(
      `UPDATE class SET deleted = true WHERE id = $1 AND business_id = $2`,
      [id, business_id],
    );
  }
}

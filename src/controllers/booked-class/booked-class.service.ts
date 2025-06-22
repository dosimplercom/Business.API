import { Injectable } from '@nestjs/common';
import { BookedClassRepository } from './booked-class.repository';
import { DateTime } from 'luxon';
import {
  BookedClassCreateDto,
  BookedClassPayloadDto,
  BookedClassUpdateDto,
} from './dto/booked-class.dto';
import {
  ChangeEventStatusDto,
  ReschedulePayloadDto,
  RescheduleRequestDto,
} from '../appointment/dto/appointment.dto';
import { roundMinTo5 } from 'src/shared/methods';
import { CurrentUser } from 'src/shared/middleware/current-user.middleware';

@Injectable()
export class BookedClassService {
  constructor(private readonly repo: BookedClassRepository) {}

  async get(classId: number, businessId: number) {
    return this.repo.getById(classId, businessId);
  }

  async create(payload: BookedClassPayloadDto, user: CurrentUser) {
    const dateTime = DateTime.fromMillis(payload.date_mls);
    const duration = roundMinTo5(payload.duration_in_minutes);
    const buffer = roundMinTo5(payload.buffer_time_in_minutes);

    const data: BookedClassCreateDto = {
      ...payload,
      date: dateTime.toISODate()!,
      start_time: dateTime.toFormat('HH:mm:ss'),
      duration_in_minutes: duration,
      buffer_time_in_minutes: buffer,
      status_id: 2,
      business_id: user.business_id,
      caller_staff_id: user.id,
    };

    return this.repo.create(data);
  }

  async update(
    classId: number,
    payload: BookedClassPayloadDto,
    user: CurrentUser,
  ) {
    const dateTime = DateTime.fromMillis(payload.date_mls);
    const duration = roundMinTo5(payload.duration_in_minutes);
    const buffer = roundMinTo5(payload.buffer_time_in_minutes);

    const data: BookedClassUpdateDto = {
      ...payload,
      date: dateTime.toISODate()!,
      start_time: dateTime.toFormat('HH:mm:ss'),
      duration_in_minutes: duration,
      buffer_time_in_minutes: buffer,
      business_id: user.business_id,
      caller_staff_id: user.id,
    };

    return this.repo.update(classId, data);
  }

  async delete(classId: number, businessId: number) {
    return this.repo.delete(classId, businessId);
  }

  async reschedule(
    classId: number,
    payload: ReschedulePayloadDto,
    business_id: number,
  ) {
    const dateTime = DateTime.fromMillis(payload.date_mls);
    const data: RescheduleRequestDto = {
      ...payload,
      business_id,
      date: dateTime.toISODate()!,
      start_time: dateTime.toFormat('HH:mm:ss'),
    };
    return this.repo.reschedule(classId, data);
  }

  async changeStatus(body: ChangeEventStatusDto, user: any) {
    return this.repo.changeStatus(body, user);
  }
}

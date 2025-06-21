import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { DateTime } from 'luxon';
import {
  ChangeEventStatusDto,
  AppointmentCreateDto,
  AppointmentCreatePayloadDto,
  AppointmentUpdateDto,
  AppointmentUpdatePayloadDto,
  ReschedulePayloadDto,
  RescheduleRequestDto,
} from './dto/appointment.dto';
import { getFullName } from 'src/shared/methods';
import { CurrentUser } from 'src/shared/middleware/current-user.middleware';
import { AccountRepository } from '../account/account.repository';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly accountRepository: AccountRepository,
  ) {}

  /**
   * Validates the caller by checking if the user exists in the business.
   * Throws an error if the user does not exist.
   * @param id - User ID
   * @param business_id - Business ID
   */
  private async validateCaller(id: number, business_id: number): Promise<void> {
    await this.accountRepository.getById(id, business_id);
  }

  async bookAppointment(dto: AppointmentCreatePayloadDto, user: CurrentUser) {
    await this.validateCaller(user.id, user.business_id);

    const dateTime = DateTime.fromMillis(dto.date_mls);
    const data: AppointmentCreateDto = {
      ...dto,
      business_id: user.business_id,
      date: dateTime.toISODate(),
      start_time: dateTime.toFormat('HH:mm:ss'),
    };

    const result = await this.dataSource.query(
      'SELECT * FROM create_appointment($1)',
      [JSON.stringify(data)],
    );
    return result[0]?.create_appointment;
  }

  async getAppointment(appointmentId: number, user: CurrentUser) {
    await this.validateCaller(user.id, user.business_id);
    const result = await this.dataSource.query(
      'SELECT * FROM get_appointment($1, $2, $3)',
      [appointmentId, user.business_id, user.id],
    );
    return result[0]?.get_appointment;
  }

  async updateAppointment(
    appointmentId: number,
    dto: AppointmentUpdatePayloadDto,
    user: CurrentUser,
  ) {
    await this.validateCaller(user.id, user.business_id);

    const dateTime = DateTime.fromMillis(dto.date_mls);
    const data: AppointmentUpdateDto = {
      ...dto,
      business_id: user.business_id,
      date: dateTime.toISODate(),
      start_time: dateTime.toFormat('HH:mm:ss'),
    };

    const result = await this.dataSource.query(
      'SELECT * FROM update_appointment($1, $2)',
      [appointmentId, JSON.stringify(data)],
    );
    return result[0]?.update_appointment;
  }

  async deleteAppointment(appointmentId: number, user: CurrentUser) {
    await this.validateCaller(user.id, user.business_id);
    await this.dataSource.query('CALL delete_appointment($1, $2, $3)', [
      appointmentId,
      user.business_id,
      user.id,
    ]);
  }

  async rescheduleAppointment(
    appointmentId: number,
    dto: ReschedulePayloadDto,
    user: any,
  ) {
    await this.validateCaller(user.id, user.business_id);
    const dateTime = DateTime.fromMillis(dto.date_mls);
    const data: RescheduleRequestDto = {
      ...dto,
      business_id: user.business_id,
      date: dateTime.toISODate(),
      start_time: dateTime.toFormat('HH:mm:ss'),
    };

    const result = await this.dataSource.query(
      'SELECT * FROM reschedule_appointment($1, $2)',
      [appointmentId, JSON.stringify(data)],
    );
    return result[0]?.reschedule_appointment;
  }

  private async getPendingAppointments(staffId: number | null, user: any) {
    await this.validateCaller(user.id, user.business_id);
    const result = await this.dataSource.query(
      'SELECT get_appointments_by_status FROM public.get_appointments_by_status($1,$2,$3)',
      [1, user.business_id, staffId],
    );
    return result[0]?.get_appointments_by_status || [];
  }

  async getPendingAppointmentsList(staffId: number | null, user: any) {
    const appointments = await this.getPendingAppointments(staffId, user);
    if (!appointments || appointments.length === 0) {
      return [];
    }
    return appointments.map((item: any) => ({
      ...item,
      staff_full_name: getFullName(item.staff_first_name, item.staff_last_name),
      customer_full_name: getFullName(
        item.customer_first_name,
        item.customer_last_name,
      ),
    }));
  }

  async getPendingAppointmentsCount(staffId: number | null, user: any) {
    const appointments = await this.getPendingAppointments(staffId, user);
    if (!appointments || appointments.length === 0) {
      return 0;
    }
    return appointments.length;
  }

  async changeAppointmentStatus(dto: ChangeEventStatusDto, user: any) {
    await this.validateCaller(user.id, user.business_id);
    await this.dataSource.query(
      'CALL update_appointment_status($1, $2, $3, $4, $5)',
      [dto.event_id, dto.status_id, dto.comment, user.business_id, user.id],
    );
  }
}

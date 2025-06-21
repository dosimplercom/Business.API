import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { Request } from 'express';
import {
  AppointmentCreatePayloadDto,
  AppointmentUpdatePayloadDto,
  ChangeEventStatusDto,
  PendingAppointmentListPayloadDto,
  ReschedulePayloadDto,
} from './dto/appointment.dto';
import { AuthenticatedGuard } from 'src/shared/guards/jwt-auth.guard';

@UseGuards(AuthenticatedGuard)
@Controller('api/appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post('create')
  async bookAppointment(
    @Body() dto: AppointmentCreatePayloadDto,
    @Req() req: Request,
  ) {
    return this.appointmentService.bookAppointment(dto, req.currentUser);
  }

  @Get(':appointment_id/get')
  async getAppointment(
    @Param('appointment_id') id: number,
    @Req() req: Request,
  ) {
    return this.appointmentService.getAppointment(id, req.currentUser);
  }

  @Put(':appointment_id/update')
  async updateAppointment(
    @Param('appointment_id') id: number,
    @Body() dto: AppointmentUpdatePayloadDto,
    @Req() req: Request,
  ) {
    return this.appointmentService.updateAppointment(id, dto, req.currentUser);
  }

  @Delete(':appointment_id/delete')
  async deleteAppointment(
    @Param('appointment_id') id: number,
    @Req() req: Request,
  ) {
    return this.appointmentService.deleteAppointment(id, req.currentUser);
  }

  @Post(':appointment_id/reschedule')
  async rescheduleAppointment(
    @Param('appointment_id') id: number,
    @Body() dto: ReschedulePayloadDto,
    @Req() req: Request,
  ) {
    return this.appointmentService.rescheduleAppointment(
      id,
      dto,
      req.currentUser,
    );
  }

  @Post('pending-appointments-list')
  async getPendingAppointmentsList(
    @Body() dto: PendingAppointmentListPayloadDto,
    @Req() req: Request,
  ) {
    return this.appointmentService.getPendingAppointmentsList(
      dto.staff_id,
      req.currentUser,
    );
  }

  @Post('pending-appointments-count')
  async getPendingAppointmentsCount(
    @Body() dto: PendingAppointmentListPayloadDto,
    @Req() req: Request,
  ) {
    return this.appointmentService.getPendingAppointmentsCount(
      dto.staff_id,
      req.currentUser,
    );
  }

  @Post('change-status')
  async changeAppointmentStatus(
    @Body() dto: ChangeEventStatusDto,
    @Req() req: Request,
  ) {
    return this.appointmentService.changeAppointmentStatus(
      dto,
      req.currentUser,
    );
  }
}

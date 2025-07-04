import {
  Controller,
  Get,
  Put,
  Param,
  Req,
  Body,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthenticatedGuard } from 'src/shared/guards/jwt-auth.guard';
import { StaffServiceService } from './staff-service.service';

@Controller('api/staff/:staff_id/service-assigned')
@UseGuards(AuthenticatedGuard)
export class StaffServiceController {
  constructor(private readonly staffService: StaffServiceService) {}

  @Get()
  async getAssignedServices(
    @Req() req: Request,
    @Param('staff_id') staff_id: number,
  ) {
    return this.staffService.getAssignedServices(
      staff_id,
      req.currentUser.business_id,
      req.currentUser.id,
    );
  }

  @Put()
  async setAssignedServices(
    @Req() req: Request,
    @Param('staff_id') staff_id: number,
    @Body('assigned_services') assigned_services: number[],
  ) {
    return this.staffService.setAssignedServices(
      staff_id,
      req.currentUser.business_id,
      req.currentUser.id,
      assigned_services,
    );
  }
}

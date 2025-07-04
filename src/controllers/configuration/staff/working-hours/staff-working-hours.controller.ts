import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthenticatedGuard } from 'src/shared/guards/jwt-auth.guard';
import { StaffWorkingHoursService } from './staff-working-hours.service';
import {
  StaffWorkingHoursCreateDto,
  StaffWorkingHoursUpdateDto,
} from './dto/staff-working-hours-create.dto';

@Controller('api/staff/:staff_id/workinghours')
@UseGuards(AuthenticatedGuard)
export class StaffWorkingHoursController {
  constructor(private readonly whService: StaffWorkingHoursService) {}

  @Get('get-all')
  async getAll(@Req() req: Request, @Param('staff_id') staff_id: number) {
    return this.whService.getAll(
      req.currentUser.id,
      staff_id,
      req.currentUser.business_id,
    );
  }

  @Get('workinghours/:workinghour_id')
  async getOne(@Param('workinghour_id') id: number) {
    return this.whService.getOne(id);
  }

  @Post('add')
  async add(
    @Param('staff_id') staff_id: number,
    @Body() dto: StaffWorkingHoursCreateDto,
  ) {
    return this.whService.add(staff_id, dto);
  }

  @Put(':workinghour_id/update')
  async update(
    @Param('workinghour_id') id: number,
    @Param('staff_id') staff_id: number,
    @Body() dto: StaffWorkingHoursUpdateDto,
  ) {
    return this.whService.update(id, staff_id, dto);
  }

  @Delete(':workinghour_id')
  async delete(@Param('workinghour_id') id: number) {
    return this.whService.delete(id);
  }

  @Delete('day/:sys_day_id/delete')
  async deleteForDay(
    @Param('staff_id') staff_id: number,
    @Param('sys_day_id') sys_day_id: number,
  ) {
    return this.whService.deleteForDay(staff_id, sys_day_id);
  }
}

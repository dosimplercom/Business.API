import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthenticatedGuard } from 'src/shared/guards/jwt-auth.guard';
import { BusinessWorkingHoursService } from './business-workinghours.service';
import { Request } from 'express';
import { BusinessWorkingHoursPayloadDTO } from './dto/business-workinghours.dto';

@Controller('api/business/working-hours')
@UseGuards(AuthenticatedGuard)
export class BusinessWorkingHoursController {
  constructor(private readonly service: BusinessWorkingHoursService) {}

  @Post('add')
  async add(@Req() req: Request, @Body() dto: BusinessWorkingHoursPayloadDTO) {
    return this.service.add(req.currentUser.business_id, dto);
  }

  @Get('get-all')
  async getByBusiness(@Req() req: Request) {
    return this.service.getAll(req.currentUser.business_id);
  }

  @Get(':workinghour_id/get')
  async getOne(@Param('workinghour_id', ParseIntPipe) workinghour_id: number) {
    return this.service.get(workinghour_id);
  }

  @Put(':workinghour_id/update')
  async update(
    @Param('workinghour_id', ParseIntPipe) workinghour_id: number,
    @Body() dto: BusinessWorkingHoursPayloadDTO,
  ) {
    return this.service.update(workinghour_id, dto);
  }

  @Delete(':workinghour_id/delete')
  async delete(@Param('workinghour_id', ParseIntPipe) workinghour_id: number) {
    return this.service.delete(workinghour_id);
  }

  @Delete('day/:sys_day_id/delete')
  async deleteForDay(
    @Req() req: Request,
    @Param('sys_day_id', ParseIntPipe) sys_day_id: number,
  ) {
    return this.service.deleteForDay(req.currentUser.business_id, sys_day_id);
  }
}

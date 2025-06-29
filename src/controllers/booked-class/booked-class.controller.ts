import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ChangeEventStatusDto,
  ReschedulePayloadDto,
} from '../appointment/dto/appointment.dto';
import { AuthenticatedGuard } from 'src/shared/guards/jwt-auth.guard';
import { BookedClassService } from './booked-class.service';
import { BookedClassPayloadDto } from './dto/booked-class.dto';
import { Request } from 'express';

@Controller('api/booked-class')
@UseGuards(AuthenticatedGuard)
export class BookedClassController {
  constructor(private readonly bookedClassService: BookedClassService) {}
  @Post('create')
  create(@Body() payload: BookedClassPayloadDto, @Req() req: Request) {
    return this.bookedClassService.create(payload, req.currentUser);
  }
  @Get(':id/get')
  get(@Param('id') id: number, @Req() req: Request) {
    return this.bookedClassService.get(id, req.currentUser.business_id);
  }

  @Put(':id/update')
  update(
    @Param('id') id: number,
    @Body() payload: BookedClassPayloadDto,
    @Req() req: Request,
  ) {
    return this.bookedClassService.update(id, payload, req.currentUser);
  }

  @Delete(':id/delete')
  delete(@Param('id') id: number, @Req() req: Request) {
    return this.bookedClassService.delete(id, req.currentUser.business_id);
  }

  @Post(':id/reschedule')
  reschedule(
    @Param('id') id: number,
    @Body() payload: ReschedulePayloadDto,
    @Req() req: Request,
  ) {
    return this.bookedClassService.reschedule(
      id,
      payload,
      req.currentUser.business_id,
    );
  }

  @Post('change-status')
  changeStatus(@Body() body: ChangeEventStatusDto, @Req() req: Request) {
    return this.bookedClassService.changeStatus(body, req.currentUser);
  }
}

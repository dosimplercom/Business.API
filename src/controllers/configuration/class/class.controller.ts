import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClassService } from './class.service';

import { Request } from 'express';
import { AuthenticatedGuard } from 'src/shared/guards/jwt-auth.guard';
import { ClassManipulationDto } from './dto/class.dto';

@UseGuards(AuthenticatedGuard)
@Controller('api/class')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Get('all')
  async getAll(@Req() req: Request) {
    const business_id = req.currentUser?.business_id;
    return this.classService.getAll(business_id);
  }

  @Get(':class_id/get')
  async getById(@Param('class_id') class_id: number, @Req() req: Request) {
    const business_id = req.currentUser?.business_id;
    return this.classService.getById(class_id, business_id);
  }

  @Post('create')
  async add(@Body() dto: ClassManipulationDto, @Req() req: Request) {
    const business_id = req.currentUser?.business_id;
    return this.classService.add(dto, business_id);
  }

  @Put(':class_id/update')
  async update(
    @Param('class_id') class_id: number,
    @Body() dto: ClassManipulationDto,
    @Req() req: Request,
  ) {
    const business_id = req.currentUser?.business_id;
    return this.classService.update(class_id, dto, business_id);
  }

  @Delete(':class_id/delete')
  async delete(@Param('class_id') class_id: number, @Req() req: Request) {
    const business_id = req.currentUser?.business_id;
    await this.classService.delete(class_id, business_id);
  }
}

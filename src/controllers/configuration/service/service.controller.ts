import {
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthenticatedGuard } from 'src/shared/guards/jwt-auth.guard';
import { ServiceService } from './service.service';
import { CreateServiceDto, UpdateServiceDto } from './dto/service.dto';

@Controller('api/service')
@UseGuards(AuthenticatedGuard)
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Get('get-all')
  async getAll(@Req() req: Request) {
    return this.serviceService.getAll(req.currentUser.business_id);
  }

  @Get(':id/get')
  async getOne(@Req() req: Request, @Param('id') id: number) {
    return this.serviceService.getOne(id, req.currentUser.business_id);
  }

  @Post('create')
  async add(@Req() req: Request, @Body() dto: CreateServiceDto) {
    return this.serviceService.add(dto, req.currentUser.business_id);
  }

  @Post('/sendEmail')
  async sendICSFile(@Req() req: Request) {
    return this.serviceService.sendICSFile(
      req.currentUser.id,
      req.currentUser.business_id,
    );
  }

  @Put(':id/update')
  async update(
    @Req() req: Request,
    @Param('id') id: number,
    @Body() dto: UpdateServiceDto,
  ) {
    return this.serviceService.update(id, dto, req.currentUser.business_id);
  }

  @Delete(':id/delete')
  async delete(@Req() req: Request, @Param('id') id: number) {
    return this.serviceService.delete(id, req.currentUser.business_id);
  }
}

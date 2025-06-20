import {
  Controller,
  Post,
  Put,
  Get,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { Request } from 'express';

import { RegisterBusinessStaffDto, UpdateStaffDto } from '../dto/account.dto';
import { AuthenticatedGuard } from 'src/guards/jwt-auth.guard';
import { AccountService } from '../account.service';

@UseGuards(AuthenticatedGuard)
@Controller('api/staff')
export class StaffController {
  constructor(private readonly accountService: AccountService) {}

  @Get()
  async getAllStaff(@Req() req: Request) {
    return await this.accountService.getAllStaff(req.currentUser.business_id);
  }

  @Post()
  async addStaff(@Req() req: Request, @Body() dto: RegisterBusinessStaffDto) {
    return await this.accountService.addStaff(req.currentUser.business_id, dto);
  }

  @Put(':staff_id')
  async updateStaff(
    @Req() req: Request,
    @Param('staff_id') staff_id: string,
    @Body() dto: UpdateStaffDto,
  ) {
    const user = req.currentUser;
    return await this.accountService.updateStaff(
      +staff_id,
      dto,
      dto,
      user.business_id,
      user.id,
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':staff_id')
  async deleteStaff(@Req() req: Request, @Param('staff_id') staffId: string) {
    await this.accountService.deleteStaff(
      +staffId,
      req.currentUser.business_id,
      req.currentUser.id,
    );
  }
}

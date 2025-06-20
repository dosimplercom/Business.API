import {
  Controller,
  Get,
  Req,
  UseGuards,
  Post,
  Body,
} from '@nestjs/common';
import { Request } from 'express';

import {
  SearchCustomersDto,
} from '../dto/account.dto';
import { AccountService } from '../account.service';
import { AuthenticatedGuard } from 'src/guards/jwt-auth.guard';

@UseGuards(AuthenticatedGuard)
@Controller('api/customer')
export class CustomerController {
  constructor(private readonly accountService: AccountService) {}

  @Get('all')
  async getAllCustomers(@Req() req: Request) {
    return await this.accountService.getAllCustomers(
      req.currentUser.business_id,
    );
  }
  @Post('search') 
  async searchCustomers(
    @Req() req: Request,
    @Body() body: SearchCustomersDto,
  ) {
    return await this.accountService.searchCustomers(
      body.pattern,
      req.currentUser.business_id,
    );
  }
}

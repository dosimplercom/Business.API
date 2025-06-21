import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import { AccountService } from '../account.service';
import { Request } from 'express';
import { KeyValueDto } from '../dto/account.dto';
import { AuthenticatedGuard } from 'src/shared/guards/jwt-auth.guard';

@UseGuards(AuthenticatedGuard)
@Controller('api/account-preference')
export class PreferenceController {
  constructor(private readonly accountService: AccountService) {}

  @Get()
  async getStaffPreferences(@Req() req: Request) {
    return await this.accountService.getStaffPreferences(req.currentUser.id);
  }
  @Put()
  async updateStaffPreference(@Req() req: Request, @Body() body: KeyValueDto) {
    await this.accountService.updateStaffPreference(req.currentUser.id, body);
    return { success: true };
  }
}

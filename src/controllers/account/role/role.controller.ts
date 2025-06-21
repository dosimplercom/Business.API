import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { AuthenticatedGuard } from 'src/shared/guards/jwt-auth.guard';
import { RoleService } from './role.service';

@UseGuards(AuthenticatedGuard)
@Controller('api/role')
export class RoleController {
  constructor(private readonly rolesService: RoleService) {}

  @Get('all')
  async getAllRoles(@Req() req: Request) {
    return await this.rolesService.getAllRoles(req.currentUser.business_id);
  }
}

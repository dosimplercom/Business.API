import {
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from 'src/entities/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
  ) {}

  async getAllRoles(businessId: number) {
    return (
      await this.roleRepo
        .createQueryBuilder('role')
        .where('role.business_id = :businessId', { businessId })
        .orWhere('role.system_role = true')
        .getMany()
    ).map((m) => ({
      id: m.id,
      name: m.name,
      description: m.description,
    }));
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AccountService } from '../../../account/account.service';
import { AccountRepository } from 'src/controllers/account/account.repository';

@Injectable()
export class StaffServiceService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly accountRepo: AccountRepository,
  ) {}

  private async validateCaller(id: number, business_id: number): Promise<void> {
    await this.accountRepo.getById(id, business_id);
  }

  async getAssignedServices(
    staff_id: number,
    business_id: number,
    callerId: number,
  ) {
    await this.validateCaller(callerId, business_id);
    const result = await this.dataSource.query(
      `SELECT ss.service_id FROM staff_service ss
       INNER JOIN entity e ON e.id = ss.entity_id
       INNER JOIN service s ON ss.service_id = s.id
       WHERE e.id = $1 AND e.business_id = $2 AND e.deleted = false`,
      [staff_id, business_id],
    );
    return result.map((row: any) => row.service_id);
  }

  async setAssignedServices(
    staff_id: number,
    business_id: number,
    callerId: number,
    assigned_services: number[],
  ) {
    await this.validateCaller(callerId, business_id);
    await this.dataSource.query(`CALL update_staff_services($1, $2, $3)`, [
      staff_id,
      business_id,
      JSON.stringify(assigned_services),
    ]);
    return { message: 'Assigned services updated successfully' };
  }
}

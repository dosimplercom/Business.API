// src/modules/account/account.repository.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { getFullName } from 'src/shared/methods';
import { DropdownItemExDTO } from 'src/shared/models/dropdown.model';
import {
  AccountListDTO,
  CustomerDTO,
  StaffEntityCreationResponseCT,
} from './dto/account.model';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAuth } from 'src/entities/user-auth.entity';

@Injectable()
export class AccountRepository {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(UserAuth)
    private readonly userAuthRepo: Repository<UserAuth>,
  ) {}
  /** Validates the caller by checking if the user exists in the business.
   * Throws an error if the user does not exist.
   * @param entity_id - User ID
   * @param business_id - Business ID, Optional, If provided, checks if the user belongs to the business.
   * @return UserAuth
   */
  async getById(entity_id: number, business_id: number | null = null) {
    const user_auth = await this.userAuthRepo.findOne({
      where: { entity_id },
      relations: ['entity'],
    });

    if (!user_auth) {
      throw new BadRequestException('resources.account.not_found');
    }
    if (business_id && user_auth.entity.business_id !== business_id) {
      throw new BadRequestException('resources.account.not_found');
    }
    return user_auth;
  }
  async getByEmail(email: string, throwException = true) {
    const user_auth = await this.userAuthRepo.findOne({
      where: { email },
      relations: ['entity'],
    });

    if (throwException && !user_auth) {
      throw new BadRequestException('resources.account.not_found');
    }

    return user_auth;
  }

  async saveUser(user: UserAuth) {
    return this.userAuthRepo.save(user);
  }
  async isEmailUsedForStaff(email: string): Promise<boolean> {
    const res = await this.dataSource.query(
      `SELECT e.id FROM entity e 
       INNER JOIN user_auth u ON u.entity_id = e.id 
       WHERE e.sys_entity_type_id = 1 AND u.email = $1`,
      [email],
    );
    return res.length > 0;
  }
  async registerStaff(
    data: any,
    isStaff: boolean,
    business_id: number | null = null,
  ): Promise<StaffEntityCreationResponseCT> {
    const res = await this.dataSource.query(
      `SELECT * FROM register_entity($1, $2, $3)`,
      [JSON.stringify(data), isStaff, business_id],
    );
    return res[0];
  }

  async getAllStaff(businessId: number): Promise<AccountListDTO[]> {
    const query = `
      SELECT e.id, e.first_name, e.last_name, s.url, u.email, u.email_verified, u.role_id, 
             r.name as role_name, r.description as role_description 
      FROM entity e 
      INNER JOIN user_auth u ON u.entity_id = e.id 
      INNER JOIN role r ON r.id = u.role_id 
      LEFT JOIN staff s ON s.entity_id = e.id 
      WHERE e.deleted = FALSE AND e.business_id = $1
    `;
    const result = await this.dataSource.query(query, [businessId]);

    return result.map(
      (row: any): AccountListDTO => ({
        id: row.id,
        full_name: getFullName(row.first_name, row.last_name),
        first_name: row.first_name,
        last_name: row.last_name,
        email: row.email,
        email_verified: row.email_verified,
        url: row.url,
        role_id: row.role_id,
        role: {
          id: row.role_id,
          name: row.role_name,
          description: row.role_description,
        } as DropdownItemExDTO,
      }),
    );
  }

  async getAllCustomers(businessId: number): Promise<CustomerDTO[]> {
    const query = `
      SELECT e.id, e.first_name, e.last_name, c.is_guest 
      FROM customer c 
      INNER JOIN entity e ON c.entity_id = e.id 
      WHERE e.business_id = $1 AND e.deleted = false 
      ORDER BY e.first_name, e.last_name
    `;
    const result = await this.dataSource.query(query, [businessId]);

    return result.map(
      (row: any): CustomerDTO => ({
        id: row.id,
        full_name: getFullName(row.first_name, row.last_name),
        first_name: row.first_name,
        last_name: row.last_name,
        is_guest: row.is_guest,
      }),
    );
  }
  async searchCustomers(pattern: string, business_id: number) {
    const query = `SELECT * FROM search_customers_by_name_pattern($1,$2)`;
    return await this.dataSource.query(query, [pattern, business_id]);
  }

  async deleteStaff(
    staff_id: number,
    business_id: number,
    caller_id: number,
  ): Promise<boolean> {
    await this.dataSource.query(`SELECT public.remove_account($1, $2)`, [
      staff_id,
      business_id,
      //caller_id
    ]);
    return true;
  }

  async getStaffPreferences(staffId: number) {
    const result = await this.dataSource.query(
      `SELECT preferences FROM staff_preference WHERE staff_id = $1`,
      [staffId],
    );
    return result[0]?.preferences || {};
  }

  async updateStaffPreference(staffId: number, key: string, value: string) {
    await this.dataSource.query(
      `INSERT INTO staff_preference (staff_id, preferences)
       VALUES ($1, jsonb_set('{}'::jsonb, $2, $3::jsonb, true))
       ON CONFLICT (staff_id) DO UPDATE
       SET preferences = jsonb_set(staff_preference.preferences, $2, $3::jsonb, true)`,
      [staffId, `{${key}}`, JSON.stringify(value)],
    );
  }
}

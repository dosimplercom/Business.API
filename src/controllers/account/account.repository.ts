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
  async getById(entity_id: number) {
    const user_auth = await this.userAuthRepo.findOne({
      where: { entity_id },
      relations: ['entity'],
    });

    if (!user_auth) {
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
  async checkEmailUsedForStaff(email: string): Promise<boolean> {
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

  async getStaffPreferences(staffId: number) {
    const result = await this.dataSource.query(
      `SELECT preferences FROM staff_preference WHERE staff_id = $1`,
      [staffId],
    );
    return result[0]?.preferences || {};
  }

  async deleteStaff(
    id: number,
    businessId: number,
    caller_id: number,
  ): Promise<boolean> {
    await this.dataSource.query(`SELECT public.remove_account($1, $2)`, [
      id,
      businessId,
      //caller_id
    ]);
    return true;
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

  // async getById(id: number) {
  //   const res = await this.dataSource.query(
  //     `SELECT e.*, u.* FROM entity e
  //      INNER JOIN user_auth u ON e.id = u.entity_id
  //      WHERE e.id = $1`,
  //     [id],
  //   );
  //   return res[0];
  // }

  // async getByEmail(email: string) {
  //   const res = await this.dataSource.query(
  //     `SELECT e.*, u.* FROM entity e
  //      INNER JOIN user_auth u ON e.id = u.entity_id
  //      WHERE u.email = $1`,
  //     [email],
  //   );
  //   return res[0];
  // }

  // async updateStaffEmailVerified(id: number) {
  //   return this.dataSource.query(
  //     `UPDATE user_auth SET email_verified = true WHERE entity_id = $1`,
  //     [id],
  //   );
  // }

  // async getAllRoles(businessId: number) {
  //   const sql = `
  //     SELECT id, name, description
  //     FROM role
  //     WHERE system_role = TRUE OR business_id = $1`;

  //   return await this.dataSource.query(sql, [businessId]);
  // }

  // async getRoleById(id: number) {
  //   const result = await this.dataSource.query(
  //     `SELECT * FROM role WHERE id = $1`,
  //     [id],
  //   );
  //   return result[0];
  // }

  // async updateStaffPassword(id: number, password: string) {
  //   return this.dataSource.query(
  //     `UPDATE user_auth SET password = $1 WHERE entity_id = $2`,
  //     [password, id],
  //   );
  // }

  // // TODO: Review this. move to SP or something.
  // //
  // async updateStaff(staff_id: number, dto: UpdateStaffDto) {
  //   let userUpdate: any = {};
  //   let entityUpdate: any = {};

  //   if (dto.email) {
  //     userUpdate.email = dto.email;
  //     userUpdate.email_verified = false;
  //   }
  //   if (dto.password) {
  //     userUpdate.password = dto.password;
  //   }
  //   if (!!dto.role_id) {
  //     userUpdate.role_id = dto.role_id;
  //   }
  //   if (Object.keys(userUpdate).length > 0) {
  //     userUpdate.updated_at = new Date().toISOString();
  //   }

  //   if (dto.first_name) {
  //     entityUpdate.first_name = dto.first_name;
  //   }
  //   if (dto.last_name) {
  //     entityUpdate.last_name = dto.last_name;
  //   }

  //   let [user] =
  //     Object.keys(userUpdate).length == 0
  //       ? await this.dataSource.query(
  //           'SELECT * FROM user_auth WHERE entity_id = $1',
  //           [staff_id],
  //         )
  //       : [null];
  //   if (!user) {
  //     const columns = Object.keys(userUpdate);
  //     const values = Object.values(userUpdate);
  //     const setClause = columns
  //       .map((col, index) => `${col} = $${index + 1}`)
  //       .join(', ');
  //     const sql = `UPDATE user_auth SET ${setClause} WHERE entity_id = $${
  //       columns.length + 1
  //     } RETURNING *`;

  //     [user] = await this.dataSource.query(sql, [...values, staff_id]);
  //   }

  //   let [entity] =
  //     Object.keys(entityUpdate).length == 0
  //       ? await this.dataSource.query(
  //           'SELECT * FROM entity WHERE entity_id = $1',
  //           [staff_id],
  //         )
  //       : [null];
  //   if (!entity) {
  //     const columns = Object.keys(entityUpdate);
  //     const values = Object.values(entityUpdate);
  //     const setClause = columns
  //       .map((col, index) => `${col} = $${index + 1}`)
  //       .join(', ');
  //     const sql = `UPDATE entity SET ${setClause} WHERE entity_id = $${
  //       columns.length + 1
  //     } RETURNING *`;

  //     [entity] = await this.dataSource.query(sql, [...values, staff_id]);
  //   }

  //   return { user, entity };
  // }
}

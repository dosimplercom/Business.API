import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BusinessCreateDto } from './dto/business.dto';
import { Business } from 'src/entities/business.entity';

@Injectable()
export class BusinessRepository {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    @InjectRepository(Business) private readonly bizRepo: Repository<Business>,
  ) {}

  async getById(id: number) {
    return this.bizRepo.findOne({ where: { id } });
  }

  async addBusiness(data: BusinessCreateDto) {
    return this.dataSource.query(`SELECT * FROM register_business($1)`, [
      JSON.stringify(data),
    ]);
  }

  async getSupportedLanguages(business_id: number, entity_id: number) {
    const res = await this.dataSource.query(
      `SELECT l.id, l.name, l.code, bl.sort
       FROM business_language bl
       INNER JOIN sys_language l on l.id = bl.language_id
       INNER JOIN entity e ON e.business_id = bl.business_id
       WHERE bl.business_id = $1 AND e.id = $2
       ORDER BY sort ASC`,
      [business_id, entity_id],
    );
    return res;
  }

  async setSupportedLanguages(
    business_id: number,
    entity_id: number,
    supported_languages: number[],
  ) {
    await this.dataSource.query(`CALL setup_business_language($1, $2, $3)`, [
      business_id,
      entity_id,
      JSON.stringify(supported_languages),
    ]);
  }

  async setAppointmentApproval(business_id: number, requires: boolean) {
    const biz = await this.getById(business_id);
    if (!biz) {
      throw new BadRequestException('resources.status.not_found');
    }
    biz.appointment_requires_approval = requires;
    return this.bizRepo.save(biz);
  }
}

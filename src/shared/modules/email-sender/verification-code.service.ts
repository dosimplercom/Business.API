import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { EmailTokenCreateDTO } from './email-token.model';
import { EmailToken } from 'src/entities/email-token.entity';

@Injectable()
export class VerificationCodeService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    @InjectRepository(EmailToken)
    private emailTokenRepo: Repository<EmailToken>,
  ) {}

  generateCode(length = 6): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  async getLatestEmailVerificationToken(entity_id: number) {
    const sql = `
      SELECT * 
      FROM email_token 
      WHERE used = FALSE AND entity_id = $1 
      ORDER BY created_at DESC 
      LIMIT 1`;
    const res = await this.dataSource.query(sql, [entity_id]);
    return res[0];
  }

  async getEmailToken(entity_id: number, token: string) {
    const res = await this.emailTokenRepo.find({
      where: { entity_id, token, used: false },
    });
    return res[0];
  }

  async addEmailVerificationToken(entity_id: number) {
    try {
      const toUpdate = await this.emailTokenRepo.findOne({
        where: { id: entity_id },
      });
      if (!!toUpdate) {
        toUpdate.expires_at = toUpdate.created_at;
        this.emailTokenRepo.save(toUpdate);
      }
      const emailToken = this.emailTokenRepo.create({
        entity_id,
        token: this.generateCode(),
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
        created_at: new Date(),
        used: false,
      });

      return this.emailTokenRepo.save(emailToken);
    } catch (error) {
      console.error('Error adding email token:', error);
      throw error;
    }
  }

  async setVerificationTokenAsUsed(emailToken: EmailToken) {
    try {
      emailToken.used = true;
      const result = await this.emailTokenRepo.save(emailToken);
      return result[0];
    } catch (error) {
      console.error('Error updating token:', error);
      throw error;
    }
  }
}

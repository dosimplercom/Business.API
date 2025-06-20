import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { EmailToken } from 'src/entities/email-token.entity';

@Injectable()
export class EmailTokenRepository {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    @InjectRepository(EmailToken)
    private emailTokenRepo: Repository<EmailToken>,
  ) {}

  private generateCode(length = 6): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }
  async create(entity_id: number) {
    try {
      // Reset any existing unused tokens for the entity
      // This ensures that only one active token exists at a time
      const sql = `
      UPDATE email_token SET expires_at = created_at
      WHERE used = FALSE AND entity_id = $1`;
      await this.dataSource.query(sql, [entity_id]);

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
  async getLatest(entity_id: number) {
    const sql = `
      SELECT * 
      FROM email_token 
      WHERE used = FALSE AND entity_id = $1 
      ORDER BY created_at DESC 
      LIMIT 1`;
    const res = await this.dataSource.query(sql, [entity_id]);
    return res[0];
  }
  async get(entity_id: number, token: string) {
    const res = await this.emailTokenRepo.find({
      where: { entity_id, token, used: false },
    });
    return res[0];
  }
  async markAsUsed(emailToken: EmailToken) {
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
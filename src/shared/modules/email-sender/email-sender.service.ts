//
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import { DataSource } from 'typeorm';
import { EmailTokenRepository } from './email-token.repository';
import { ICSFileDto, SendEmailBodyDTO } from './email-body.model';

@Injectable()
export class EmailSenderService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly eTokenRepo: EmailTokenRepository,
  ) {}

  // Retrieve the authentication token to communicate with notification API
  private async getAuthToken(): Promise<string> {
    try {
      const result = await this.dataSource.query(
        `SELECT * FROM notifications.get_api_auth_token()`,
      );
      return result[0]?.get_api_auth_token;
    } catch (error) {
      console.error('Failed to execute get_api_auth_token:', error);
      throw error;
    }
  }

  private async sendEmail(body: SendEmailBodyDTO): Promise<void> {
    const authToken = await this.getAuthToken();

    let icsContent = '';
    if (body?.icsData) {
      icsContent = this.createIcsString(body.icsData);
    }
    try {
      await axios.post(
        'https://notify-api.dosimpler.com/api/notifications/sendemail',
        {
          senderName: 'DOSIMPLER',
          senderEmail: 'dosimpler.com@gmail.com',
          userId: body.entity_id,
          recipientEmail: body.recipientEmail,
          subject: body.subject,
          message: body.message,
          attachments: !!icsContent
            ? [
                {
                  content: Buffer.from(icsContent).toString('base64'),
                  filename: 'event.ics',
                  type: 'text/calendar',
                  disposition: 'attachment',
                },
              ]
            : [],
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        },
      );
    } catch (error) {
      const errorMessage = `Failed to send an email with subject ${body.subject}`;
      console.error(errorMessage, error?.response?.data || error.message);
      //throw new HttpException(errorMessage, HttpStatus.SERVICE_UNAVAILABLE);
    }
  }
  private createIcsString(icsData: ICSFileDto): string {
    return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//app.DoSimpler.com//NONSGML v1.0//EN
BEGIN:VEVENT
UID:app@dosimpler.com
SUMMARY:${icsData.eventTitle}
DTSTAMP:${icsData.stampDate}
DTSTART:${icsData.startDate}
DTEND:${icsData.endDate}
LOCATION:${icsData.location}
DESCRIPTION:${icsData.description}
END:VEVENT
END:VCALENDAR`;
  }

  async sendAccountAddedEmail(entityId: number, email: string): Promise<void> {
    await this.sendEmail({
      entity_id: entityId,
      recipientEmail: email,
      subject: 'New Invitation to join the team',
      message: `You were invited to join the Team on https://app.dosimpler.com 
      // Should we send single use link to set the password ? 
      // What is the workflow? `,
      icsData: null,
    });
  }

  async sendVerificationCode(
    entityId: number,
    email: string,
    restrictedMode: boolean,
  ): Promise<void> {
    let latestToken = await this.eTokenRepo.getLatest(entityId);

    const shouldGenerateNewToken =
      !latestToken ||
      !restrictedMode ||
      (restrictedMode &&
        new Date(latestToken.created_at) < new Date(Date.now() - 60 * 1000));

    if (shouldGenerateNewToken) {
      latestToken = await this.eTokenRepo.create(entityId);
    } else {
      latestToken = null;
    }

    if (!!latestToken) {
      console.log(
        `Sending email now with verification code: ${latestToken.token}`,
      );

      await this.sendEmail({
        entity_id: entityId,
        recipientEmail: email,
        subject: 'Email Verification',
        message: `Your verification code is ${latestToken.token}`,
        icsData: null,
      });
    }
  }

  async sendEmailChangeAlert(
    entity_id: number,
    oldEmail: string,
    newEmail: string,
    passwordChanged: boolean,
  ) {
    let message = `${
      !!newEmail
        ? `Your email associated with your DOSIMPLER.com account has been changed to   ${newEmail} .`
        : ``
    }
    ${passwordChanged ? `Your password has been changed as well.` : ``}`;
    message = message.trim();

    if (!!message) {
      await this.sendEmail({
        entity_id: entity_id,
        recipientEmail: oldEmail,
        subject: 'Security Alert! Email Changed',
        message: message,
        icsData: null,
      });
    }
  }

  async sendEmailWithICS(body: SendEmailBodyDTO) {
    await this.sendEmail(body);
  }
}

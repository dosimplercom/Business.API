//
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import { DataSource } from 'typeorm';
import { VerificationCodeService } from './verification-code.service';

@Injectable()
export class EmailSenderService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly verificationCodeService: VerificationCodeService,
  ) {
    // Initialization code if needed
  }

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
  private async sendVerificationCodeByEmail(
    entityId: number,
    email: string,
    code: string,
  ): Promise<void> {
    const authToken = await this.getAuthToken();

    try {
      await axios.post(
        'https://notify-api.dosimpler.com/api/notifications/sendemail',
        {
          userId: entityId,
          senderName: 'DOSIMPLER',
          senderEmail: 'dosimpler.com@gmail.com',
          recipientEmail: email,
          subject: 'Email Verification',
          message: `Your verification code is ${code}`,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        },
      );
    } catch (error) {
      console.error(
        'Failed to send email verification code:',
        error?.response?.data || error.message,
      );
      throw new HttpException(
        'Failed to send verification email',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
  async sendAccountAddedEmail(entityId: number, email: string): Promise<void> {
    const authToken = await this.getAuthToken();
    try {
      await axios.post(
        'https://notify-api.dosimpler.com/api/notifications/sendemail',
        {
          userId: entityId,
          senderName: 'DOSIMPLER',
          senderEmail: 'dosimpler.com@gmail.com',
          recipientEmail: email,
          subject: 'New Invitation to join the team',
          message: `You were invited to join the Team on https://app.dosimpler.com 
      // Should we send single use link to set the password ? 
      // What is the workflow? `,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        },
      );
    } catch (error) {
      console.error(
        'Failed to send email sendAccountAddedEmail:',
        error?.response?.data || error.message,
      );
      throw new HttpException(
        'Failed to send account added email',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  async sendVerificationCode(
    entityId: number,
    email: string,
    restrictedMode: boolean,
  ): Promise<void> {
    let latestToken =
      await this.verificationCodeService.getLatestEmailVerificationToken(
        entityId,
      );

    const shouldGenerateNewToken =
      !latestToken ||
      !restrictedMode ||
      (restrictedMode &&
        new Date(latestToken.created_at) < new Date(Date.now() - 60 * 1000));

    if (shouldGenerateNewToken) {
      latestToken =
        await this.verificationCodeService.addEmailVerificationToken(entityId);
    } else {
      latestToken = null;
    }

    if (!!latestToken) {
      console.log(
        `Sending email now with verification code: ${latestToken.token}`,
      );
      await this.sendVerificationCodeByEmail(
        entityId,
        email,
        latestToken.token,
      );
    }
  }

  async sendEmailChangeAlert(
    entity_id: number,
    oldEmail: string,
    newEmail: string,
    passwordChanged: boolean,
  ) {
    const authToken = await this.getAuthToken();

    let message = `${
      !!newEmail
        ? `Your email associated with your DOSIMPLER.com account has been changed to   ${newEmail} .`
        : ``
    }
    ${passwordChanged ? `Your password has been changed as well.` : ``}`;
    message = message.trim();
    if (!!message.trim()) {
      var res = await axios.post(
        'https://notify-api.dosimpler.com/api/notifications/sendemail',
        {
          userId: entity_id,
          senderName: 'DOSIMPLER',
          senderEmail: 'dosimpler.com@gmail.com',
          recipientEmail: oldEmail,
          subject: 'Security Alert! Email Changed',
          message: message,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        },
      );
    }
  }
}

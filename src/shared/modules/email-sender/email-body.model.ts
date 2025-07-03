export interface SendEmailBodyDTO {
  entity_id: number;
  recipientEmail: string;
  subject: string;
  message: string;
  icsData: ICSFileDto | null;
}

export interface ICSFileDto {
  eventTitle: string;
  stampDate: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
}

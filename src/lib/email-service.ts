import nodemailer from 'nodemailer';

export interface EmailTemplateData {
  from_name: string;
  input_email: string;
  subject: string;
  message: string;
  timestamp?: string;
}

export interface SendEmailParams {
  to: string;
  subject: string;
  text: string;
}

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(
    host: string,
    port: number,
    secure: boolean,
    auth: { user: string; pass: string },
  ) {
    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth,
    });
  }

  async sendEmail({ to, subject, text }: SendEmailParams): Promise<boolean> {
    try {
      const info = await this.transporter.sendMail({
        from: process.env.RECIPIENT_EMAIL,
        to,
        subject,
        text,
      });

      console.log('Message sent: %s', info.messageId);
      return true;
    } catch (error) {
      console.error('Ошибка при отправке письма:', error);
      return false;
    }
  }
}

let emailService: EmailService | null = null;

export function initEmailService() {
  if (!emailService) {
    emailService = new EmailService(
      process.env.EMAIL_HOST || 'smtp.example.com',
      Number(process.env.EMAIL_PORT) || 587,
      process.env.EMAIL_SECURE === 'true',
      {
        user: process.env.EMAIL_USER || 'username',
        pass: process.env.EMAIL_PASSWORD || 'password',
      }
    );
  }
  return emailService;
}

export async function sendContactFormEmail(formData: EmailTemplateData): Promise<boolean> {
  const service = initEmailService();

  const timestamp = formData.timestamp || new Date().toLocaleString('ru-RU');

  const body = `
Новое сообщение с формы обратной связи:

Имя: ${formData.from_name}
Email: ${formData.input_email}
Тема: ${formData.subject}
Сообщение: ${formData.message}
Время: ${timestamp}
  `.trim();

  return service.sendEmail({
    to: process.env.RECIPIENT_EMAIL || 'forgenet@inbox.ru',
    subject: formData.subject || 'Новое сообщение',
    text: body,
  });
}

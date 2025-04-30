import nodemailer from 'nodemailer';
import { compile } from 'handlebars';
import fs from 'fs';
import path from 'path';

// Типы данных для шаблона письма и параметров отправки
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
  templateData: EmailTemplateData;
  templateName: string;
}

export class EmailService {
  private transporter: nodemailer.Transporter;
  private templatesDir: string;

  constructor(
    host: string,
    port: number,
    secure: boolean,
    auth: { user: string; pass: string },
    templatesDir: string
  ) {
    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth,
    });

    this.templatesDir = templatesDir;
  }

  // Метод для подготовки HTML-шаблона
  private async prepareTemplate(
    templateName: string,
    data: EmailTemplateData
  ): Promise<string> {
    try {
      const templatePath = path.join(this.templatesDir, `${templateName}.html`);
      
      const templateContent = await fs.promises.readFile(templatePath, 'utf-8');
      
      const template = compile(templateContent);
      
      if (!data.timestamp) {
        const now = new Date();
        
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        
        data.timestamp = `${day}.${month}.${year} ${hours}:${minutes}`;
      }
      
      return template(data);
    } catch (error) {
      console.error('Ошибка при подготовке шаблона:', error);
      throw new Error('Не удалось подготовить HTML-шаблон письма');
    }
  }

  async sendEmail({ to, subject, templateData, templateName }: SendEmailParams): Promise<boolean> {
    try {
      const html = await this.prepareTemplate(templateName, templateData);
      
      const info = await this.transporter.sendMail({
        from: process.env.RECIPIENT_EMAIL,
        to,
        subject,
        html,
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
      },
      path.join(process.cwd(), 'email-templates')
    );
  }
  return emailService;
}
export async function sendContactFormEmail(formData: EmailTemplateData): Promise<boolean> {
  const service = initEmailService();
  
  return service.sendEmail({
    to: process.env.RECIPIENT_EMAIL || 'forgenet@inbox.ru',
    subject: formData.subject || 'Новое сообщение с формы обратной связи',
    templateData: formData,
    templateName: 'contact-form',
  });
}
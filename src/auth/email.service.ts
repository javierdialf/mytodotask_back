import { Injectable, InternalServerErrorException } from "@nestjs/common";
import * as nodemailer from 'nodemailer';
import { EMAIL_RESET_PASSWORD_INFORMATION } from "src/common";
import { ENVS_NODEMAILER} from "src/config";



@Injectable()
export class EmailService {
  private transport: nodemailer.Transporter;

    constructor() {
     this.transport = nodemailer.createTransport({
        host: ENVS_NODEMAILER.nodemailer_host,
        port: ENVS_NODEMAILER.nodemailer_port,
        
        auth: {
          user: ENVS_NODEMAILER.nodemailer_mail_user,
          pass: ENVS_NODEMAILER.nodemailer_mail_password,
        },
      });
    }

    

    public async sendResetPasswordEmail(userEmail: string, resetToken: string): Promise<void> {
      try {
          const resetPasswordLink = EMAIL_RESET_PASSWORD_INFORMATION.RESET_PASSWORD_LINK(resetToken);
          const htmlTextInformation = EMAIL_RESET_PASSWORD_INFORMATION.HTML_INFORMATION(resetPasswordLink); 
  
          const options = {
              from: EMAIL_RESET_PASSWORD_INFORMATION.APP_NAME,
              to: userEmail,
              subject: EMAIL_RESET_PASSWORD_INFORMATION.SUBJECT_EMAIL,
              html: htmlTextInformation
          };
  
          await this.transport.sendMail(options);
          console.log(`Reset email sent successfully to ${userEmail}`);
      } catch (error) {
          console.error('Error sending reset password email:', error);
          throw new InternalServerErrorException('Could not send reset email');
      }
  }
  

}
import { Injectable } from "@nestjs/common";
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

    

    public sendResetPasswordEmail(userEmail: string, resetToken: string): void {
      const resetPasswordLink = EMAIL_RESET_PASSWORD_INFORMATION.RESET_PASSWORD_LINK(resetToken);
      const htmlTextInformation = EMAIL_RESET_PASSWORD_INFORMATION.HTML_INFORMATION(resetPasswordLink); 

      const options = {
        from: EMAIL_RESET_PASSWORD_INFORMATION.APP_NAME, //el que lo vaya a usar que cambie esto por el nombre de la app y tambien en el html o si no que lo quite.
        to: userEmail,
        subject: EMAIL_RESET_PASSWORD_INFORMATION.SUBJECT_EMAIL,
        html: htmlTextInformation
      }

      this.transport.sendMail(options);
    }

}
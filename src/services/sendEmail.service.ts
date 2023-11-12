import ejs from 'ejs';
import path from 'path';
import { Transporter } from 'nodemailer';

import { config } from '../config/keys';
import mailConfig from '../config/nodemailer.config';

export enum EmailType {
    signup = 'Signup',
    login = 'Login',
    reset = 'reset'
}

async function sendEmail(email: string, confirmationCode: string, type: EmailType): Promise<void> {
    try {
        const templatePath: string = path.join(__dirname, '../templates/', 'email.ejs');
        const htmlContent = await ejs.renderFile(templatePath, { type, confirmationCode, date: Date.now() });
        const transporter = (await mailConfig()) as Transporter;

        const mailOptions = {
            from: config.nodemailer.user,
            to: email,
            subject: `${type === EmailType.reset ? 'Recover' : 'Confirm'}  your account`,
            html: htmlContent
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error(`Error sending email to ${email}`, error);
        throw error;
    }
}

export default sendEmail;

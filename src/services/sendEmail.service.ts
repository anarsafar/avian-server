/* eslint-disable import/no-extraneous-dependencies */
import ejs from 'ejs';
import path from 'path';
import sgMail from '@sendgrid/mail';

import { config } from '../config/keys';

export enum EmailType {
    signup = 'Signup',
    login = 'Login',
    reset = 'reset'
}

async function sendEmail(email: string, confirmationCode: string, type: EmailType): Promise<void> {
    try {
        const templatePath: string = path.join(__dirname, '../templates/', 'email.ejs');
        const htmlContent = await ejs.renderFile(templatePath, { type, confirmationCode, date: Date.now() });

        sgMail.setApiKey(config.sendGrid.sendGridKey);

        const mailOptions = {
            from: config.sendGrid.sendGridMail,
            to: email,
            subject: `${type === EmailType.reset ? 'Recover' : 'Confirm'}  your account`,
            html: htmlContent
        };

        await sgMail.send(mailOptions);
    } catch (error) {
        console.error(`Error sending email to ${email}`, error);
        throw error;
    }
}

export default sendEmail;

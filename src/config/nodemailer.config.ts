import nodemailer, { SentMessageInfo, Transporter } from 'nodemailer';

import { google } from 'googleapis';
import { config } from '../config/keys';

/**
 * Configures and returns a nodemailer transporter object for sending emails using OAuth2 authentication.
 *
 * @example
 * const transporter = await mailConfig();
 *
 * @returns {Promise<Transporter<SentMessageInfo>>} A Promise that resolves to a nodemailer transporter object or rejects with an error.
 */
const mailConfig = async (): Promise<Transporter<SentMessageInfo> | unknown> => {
    try {
        const oAuth2Client = new google.auth.OAuth2(config.nodemailer.clientId, config.nodemailer.clientSecret, config.nodemailer.redirectURL);
        oAuth2Client.setCredentials({ refresh_token: config.nodemailer.refreshToken });

        const accessToken = (await oAuth2Client.getAccessToken()) as any;

        const transporter = nodemailer.createTransport({
            service: config.nodemailer.emailService,
            auth: {
                type: 'OAuth2',
                user: config.nodemailer.user,
                clientId: config.nodemailer.clientId,
                clientSecret: config.nodemailer.clientSecret,
                refreshToken: config.nodemailer.refreshToken,
                accessToken: accessToken.res.data.access_token
            }
        } as any);

        return transporter;
    } catch (error) {
        throw error;
    }
};

export default mailConfig;

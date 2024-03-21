"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailType = void 0;
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
const mail_1 = __importDefault(require("@sendgrid/mail"));
const keys_1 = require("../config/keys");
var EmailType;
(function (EmailType) {
    EmailType["signup"] = "Signup";
    EmailType["login"] = "Login";
    EmailType["reset"] = "reset";
})(EmailType || (exports.EmailType = EmailType = {}));
async function sendEmail(email, confirmationCode, type) {
    try {
        const templatePath = path_1.default.join(__dirname, '../../templates/', 'email.ejs');
        const htmlContent = await ejs_1.default.renderFile(templatePath, { type, confirmationCode, date: Date.now() });
        mail_1.default.setApiKey(keys_1.config.sendGrid.sendGridKey);
        const mailOptions = {
            from: keys_1.config.sendGrid.sendGridMail,
            to: email,
            subject: `${type === EmailType.reset ? 'Recover' : 'Confirm'}  your account`,
            html: htmlContent
        };
        await mail_1.default.send(mailOptions);
    }
    catch (error) {
        console.error(`Error sending email to ${email}`, error);
        throw error;
    }
}
exports.default = sendEmail;

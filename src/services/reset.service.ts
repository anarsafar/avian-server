import bcrypt from 'bcrypt';

import { PasswordValidate } from '../api/resetPassword/reset.validate';
import User from '../models/User.model';

interface ResetResult {
    error?: string;
    message?: string;
}

const resetPasswordService = async (password: string, confirmPassword: string, email: string): Promise<ResetResult> => {
    let result: ResetResult = {};

    const data = {
        password,
        confirmPassword,
        email
    };

    PasswordValidate.parse(data);

    const existingUser = await User.findOne({ 'authInfo.email': email });

    if (!existingUser?.resetPassword?.confirmed) {
        result.error = 'Please confirm your email';
        return result;
    }

    if (existingUser) {
        const isPasswordSame = await bcrypt.compare(password, existingUser.authInfo.password);
        if (isPasswordSame) {
            result.error = 'Your new password must be different from old password';
        } else {
            existingUser.authInfo.password = await bcrypt.hash(password, 10);

            existingUser.resetPassword = {
                confirmationCode: '',
                confirmed: false
            };

            existingUser.markModified(`authInfo`);
            existingUser.markModified(`resetPassword`);
            await existingUser.save();

            result.message = 'Password changed successfully';
        }
    } else {
        result.error = 'User does not exist';
    }

    return result;
};

export default resetPasswordService;

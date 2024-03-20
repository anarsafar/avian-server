"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = void 0;
const reset_service_1 = __importDefault(require("../../services/reset.service"));
const resetPassword = async (req, res, next) => {
    const { password, confirmPassword, email } = req.body;
    try {
        const result = await (0, reset_service_1.default)(password, confirmPassword, email);
        res.status(result.error ? 400 : 200).json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.resetPassword = resetPassword;
//# sourceMappingURL=reset.handler.js.map
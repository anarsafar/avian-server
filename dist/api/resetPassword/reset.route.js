"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const reset_handler_1 = require("./reset.handler");
const middlewares_1 = require("../../middlewares");
const reset_validate_1 = require("./reset.validate");
const resetPasswordRouter = express_1.default.Router();
resetPasswordRouter.patch('/', (0, middlewares_1.validateRequest)({ body: reset_validate_1.PasswordValidate }), reset_handler_1.resetPassword);
exports.default = resetPasswordRouter;

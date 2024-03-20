"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middlewares_1 = require("../../middlewares");
const confirmation_validate_1 = require("./confirmation.validate");
const confirmation_handler_1 = require("./confirmation.handler");
const router = express_1.default.Router();
router.post('/', (0, middlewares_1.validateRequest)({ body: confirmation_validate_1.ConfrimationValidate }), confirmation_handler_1.confirmUser);
router.post('/send-verification', (0, middlewares_1.validateRequest)({ body: confirmation_validate_1.ConfirmationBase }), confirmation_handler_1.sendVerification);
router.post('/get-expiration', (0, middlewares_1.validateRequest)({ body: confirmation_validate_1.ConfirmationBase }), confirmation_handler_1.getExpiration);
exports.default = router;
//# sourceMappingURL=confirmation.route.js.map
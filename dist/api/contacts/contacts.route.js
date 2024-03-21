"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middlewares_1 = require("../../middlewares");
const blacklist_middleware_1 = __importDefault(require("../../middlewares/blacklist.middleware"));
const jwt_middleware_1 = __importDefault(require("../../middlewares/jwt.middleware"));
const contacts_handler_1 = require("./contacts.handler");
const contacts_valitate_1 = require("./contacts.valitate");
const contactRoute = express_1.default.Router();
contactRoute.get('/', blacklist_middleware_1.default, jwt_middleware_1.default, contacts_handler_1.getContacts);
contactRoute.post('/', blacklist_middleware_1.default, jwt_middleware_1.default, (0, middlewares_1.validateRequest)({ body: contacts_valitate_1.ValidateContact }), contacts_handler_1.addContact);
contactRoute.post('/:contactId', blacklist_middleware_1.default, jwt_middleware_1.default, (0, middlewares_1.validateRequest)({ body: contacts_valitate_1.ValidateAction }), contacts_handler_1.blockOrDeleteContact);
exports.default = contactRoute;

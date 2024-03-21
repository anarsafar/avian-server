"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenType = void 0;
const mongoose_1 = require("mongoose");
const Blacklist_model_1 = __importDefault(require("../models/Blacklist.model"));
var TokenType;
(function (TokenType) {
    TokenType["Access"] = "access";
    TokenType["Refresh"] = "refresh";
})(TokenType || (exports.TokenType = TokenType = {}));
const addToBlacklist = async (token, decodedTokenExp, type) => {
    const session = await (0, mongoose_1.startSession)();
    session.startTransaction();
    try {
        const existingToken = await Blacklist_model_1.default.findOne({ token });
        if (existingToken) {
            console.log('Token already exists in the blacklist');
            return;
        }
        const expiration = new Date(decodedTokenExp * 1000);
        if (type === TokenType.Access) {
            expiration.setHours(expiration.getHours() + 5);
        }
        else if (type === TokenType.Refresh) {
            expiration.setDate(expiration.getDate() + 7);
        }
        const newBlacklistToken = new Blacklist_model_1.default({
            token,
            expiration,
            type
        });
        await newBlacklistToken.save({ session });
        await session.commitTransaction();
    }
    catch (error) {
        throw error;
    }
    finally {
        session.endSession();
    }
};
exports.default = addToBlacklist;

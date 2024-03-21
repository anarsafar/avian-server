"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduler = void 0;
const node_schedule_1 = __importDefault(require("node-schedule"));
const Blacklist_model_1 = __importDefault(require("../models/Blacklist.model"));
const keys_1 = require("../config/keys");
const logMessage = (message) => {
    console.log(`[${new Date().toISOString()}] ${message}`);
};
const cleanupBlacklist = async () => {
    try {
        const now = new Date();
        await Blacklist_model_1.default.deleteMany({ expiration: { $lt: now } })
            .maxTimeMS(12000)
            .exec();
        console.log('Expired tokens removed from blacklist');
    }
    catch (error) {
        if (error.name === 'MongooseError' && error.message.includes('buffering timed out')) {
            console.error('Database operation timed out:', logMessage(error));
        }
        else {
            console.error('Error cleaning up blacklist:', logMessage(error));
        }
    }
};
const scheduler = () => node_schedule_1.default.scheduleJob(`${keys_1.config.scheduleConfig}`, cleanupBlacklist);
exports.scheduler = scheduler;

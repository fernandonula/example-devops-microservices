"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// MongoDB - Mongoose
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_update_if_current_1 = require("mongoose-update-if-current");
const { Schema } = mongoose_1.default;
const ShiftsSchema = new Schema({
    date: { type: String },
    status: { type: String },
    hours: { type: Number },
}, {
    strict: false,
    toObject: {
        virtuals: true,
    },
    toJSON: {
        virtuals: true,
    },
    timestamps: true,
});
ShiftsSchema.plugin(mongoose_update_if_current_1.updateIfCurrentPlugin, { strategy: "timestamp" });
const Shifts = mongoose_1.default.model("shifts", ShiftsSchema);
exports.default = Shifts;

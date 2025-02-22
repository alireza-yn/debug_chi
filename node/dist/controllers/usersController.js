"use strict";
// src/controllers/usersController.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const usersService_1 = __importDefault(require("../services/usersService"));
// دریافت تمام کاربران
const getUsers = (req, res) => {
    try {
        const users = usersService_1.default.getAllUsers();
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ message: 'خطا در دریافت کاربران' });
    }
};
// دریافت یک کاربر بر اساس شناسه
const getUserById = (req, res) => {
    const userId = parseInt(req.params.id);
    try {
        const user = usersService_1.default.getUserById(userId);
        if (!user) {
            res.status(404).json({ message: 'کاربر پیدا نشد' });
        }
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'خطا در دریافت کاربر' });
    }
};
exports.default = { getUsers, getUserById };

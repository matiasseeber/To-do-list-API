import Express from 'express';
import bcryptjs from 'bcryptjs';
import jwt from "jsonwebtoken";
import app from '../app';
import { genericFindOne } from '../helpers/genericGets';
import { genericUpdate } from '../helpers/genericUpdate';

export async function verifyEmail(req: Express.Request, res: Express.Response) {
    try {
        let user = await genericFindOne("users", { email: req.body.username, verification_code: req.body.verification_code });
        if (!user) {
            return res.status(400).json({ msg: "Invalid username - verification code combination." });
        } else {
            const { id, last_verification_code_sent_at } = user;
            if ((new Date(last_verification_code_sent_at).getTime() - new Date().getTime()) < 1800000) { //check if more than half an hour has passed
                user = await genericUpdate("users", { id }, {
                    last_verification_at: new Date()
                });
                const token = jwt.sign(user, app.get("secretKey"), {
                    expiresIn: "24h"
                })
                res.status(200).json({ token, msg: "Email verified successfully.", status: 200 });
            } else {
                res.status(400).json({ msg: "The verification code is no longer valid." });
            }
        }
    } catch (error) {
        res.status(400).json(error);
    }
}

export async function changeUserPassword(req: Express.Request, res: Express.Response) {
    try {
        if (!req.body.password) return res.status(400).json({ msg: "password parameter is required." })
        const hashedPassword = await bcryptjs.hash(req.body.password, 10);
        await genericUpdate("users", { id: req.decoded.id }, {
            password: hashedPassword
        });
        res.status(200).json({ msg: "Password was changed successfully..." })
    } catch (error) {
        res.status(400).json(error);
    }
}
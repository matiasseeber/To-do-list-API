import { customSalt } from '../app';
import { Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import { genericUpdate } from '../helpers/genericUpdate';

export async function changeUserPassword(req: Request, res: Response) {
    try {
        if (!req.body.password) return res.status(400).json({ msg: "password parameter is required." })
        const hashedPassword = await bcryptjs.hash(req.body.password, customSalt);
        await genericUpdate("users", { id: req.decoded.id }, {
            password: hashedPassword
        });
        res.status(200).json({ msg: "Password was changed successfully..." })
    } catch (error) {
        res.status(400).json(error);
    }
}
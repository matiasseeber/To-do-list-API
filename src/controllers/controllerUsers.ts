import Express from 'express';
import { createUserModel } from '../model/modelUsers';
import { sendEmail } from '../helpers/emails/sendEmail';

export async function createUser(req: Express.Request, res: Express.Response) {
    try {
        const verification_code = Math.floor(100000 + Math.random() * 900000);
        const response = await createUserModel(req.body, verification_code);
        sendEmail(req.body.email, "Verify your account", "verifyEmailTemplate.html", { verification_code });
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json(error);
    }
}
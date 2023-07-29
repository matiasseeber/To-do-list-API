import app, { customSalt } from '../../app';

import jwt from "jsonwebtoken";
import { Request, Response } from 'express';
import randomstring from "randomstring";
import bcryptjs from 'bcryptjs';
import { genericFindOne } from '../../helpers/genericGets';
import { genericInsert } from '../../helpers/genericInsert';
import { genericUpdate } from '../../helpers/genericUpdate';

import { Iusers } from "../../types";
import { sendEmail } from '../../helpers/emails/sendEmail';

export async function loginController(req: Request, res: Response) {
    function generateRefreshToken(user_id: number, generated_token: string) {
        return genericInsert("refresh_tokens", {
            user_id,
            token: generated_token
        })
    }
    const { email, password, refresh_token } = req.body;

    if ((!email || !password) && !refresh_token) {
        return res.status(400).json({ err: "Refresh token or User and Password fields are required." });
    }

    const jwtDuration = `${process.env.JWT_HOURS_DURATION || 1}h`;
    const jwtOptions = {
        expiresIn: jwtDuration
    };

    console.log("Login")
    console.log("Client: " + req.headers["user-agent"])
    console.log("JWT duration: " + JSON.stringify(jwtOptions));

    const selectUsers = {
        id: true,
        username: true,
        email: true
    };

    if (email && password) {
        try {
            const hashedPassword = await bcryptjs.hash(password, customSalt);
            let user = await genericFindOne("users", {
                email,
                password: hashedPassword,
                NOT: {
                    OR: [
                        { last_verification_at: null },
                        { password: null }
                    ]
                }
            }, undefined, selectUsers);

            if (!user) {
                return res.status(401).json({ err: "No user exists with that user-password combination." });
            }

            const token = jwt.sign(user, app.get("secretKey"), jwtOptions);

            const generated_token = randomstring.generate(22);

            await generateRefreshToken(user.id, generated_token);

            res.status(200).json({ msg: "Successfull login!", token, refresh_token: generated_token, user });
        } catch (error) {
            console.log(error);
            res.status(400).json({ error });
        }
    } else {
        try {
            const refresh_token_record = await genericFindOne("refresh_tokens", {
                token: refresh_token,
                created_at: { gte: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000) }
            }, {
                users: {
                    select: selectUsers
                }
            })

            if (!refresh_token_record) {
                return res.status(401).json({ msg: "The refresh token is invalid." });
            }

            const { users: user } = refresh_token_record;

            const token = jwt.sign(user, app.get("secretKey"), jwtOptions);

            const generated_token = randomstring.generate(22);
            await generateRefreshToken(user.id, generated_token);

            res.status(200).json({ msg: "Successfull login!", token, refresh_token: generated_token, user });
        } catch (error) {
            console.log(error);
            res.status(400).json(error);
        }
    }
}

export async function registerController(req: Request, res: Response) {
    try {
        const verification_code = Math.floor(100000 + Math.random() * 900000);
        const user: Iusers = req.body;
        const { email, username } = user;
        const response = await genericInsert("users", {
            email, username, verification_code
        });
        sendEmail(req.body.email, "Verify your account", "verifyEmailTemplate.html", { verification_code });
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json(error);
    }
}

export async function verifyEmail(req: Request, res: Response) {
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
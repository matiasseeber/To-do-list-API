import { Iusers } from "../types";
import { connection } from "./connection";

export async function createUserModel(user: Iusers, verification_code: number) {
    const { email, username } = user;
    return connection.users.create({
        data: {
            email, username,
            verification_code,
            last_verification_code_sent_at: new Date()
        }
    })
}
import { Request, Response } from 'express';
import { genericGetAll } from '../helpers/genericGets';
import { genericInsert } from '../helpers/genericInsert';
import { Itodos_by_users } from '../types';

const table = "todos";

export async function getAllTodos(req: Request, res: Response) {
    try {
        const response = await genericGetAll(table, {
            user_id: req.decoded.id,
            active: true
        })
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json(error);
    }
}

export async function createTodo(req: Request, res: Response) {
    try {
        const data: Itodos_by_users = req.body;
        const response = await genericInsert(table, {
            ...data,
            user_id: req.decoded.id
        })
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json(error);
    }
}
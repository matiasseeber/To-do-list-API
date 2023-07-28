import { connection } from "../model/connection";

export function genericUpdate(table: string, where: any, data: any) {
    return connection[table].update({
        where,
        data
    });
}
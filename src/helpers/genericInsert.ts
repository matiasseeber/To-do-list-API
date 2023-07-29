import { connection } from "../model/connection";

export function genericInsert(table: string, data: any, include?: any) {
    return connection[table].create({
        data,
        include
    });
}

export function genericCreateMany(table: string, data: any, include?: any) {
    return connection[table].createMany({
        data,
        include
    });
}

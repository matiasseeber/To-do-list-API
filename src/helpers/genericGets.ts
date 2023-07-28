import { connection } from "../model/connection";

export function genericGetAllActives(table: string, include?: any) {
    return connection[table].findMany({
        where: {
            active: true
        },
        include
    })
}

export function genericGetAll(table: string, where?: any, include?: any, select?: any, orderBy?: any) {
    return connection[table].findMany({
        select,
        where,
        include,
        orderBy
    })
}

export function genericGetById(table: string, id: number, include?: any, select?: any) {
    return connection[table].findMany({
        where: {
            active: true,
            id
        },
        include,
        select
    })
}

export function genericFindOne(table: string, where: any, include?: any, select?: any) {
    return connection[table].findFirst({
        where,
        include,
        select
    })
}
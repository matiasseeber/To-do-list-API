import {
    users,
    refresh_tokens,
    todos
} from '@prisma/client';

export interface Iusers extends Partial<users> {
    todos_by_users?: Itodos_by_users[];
    refresh_tokens?: Irefresh_tokens[];
}

export interface Irefresh_tokens extends Partial<refresh_tokens> {
    
}

export interface Itodos_by_users extends Partial<todos> {
    
}
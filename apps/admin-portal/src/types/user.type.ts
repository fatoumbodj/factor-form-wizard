export type UserInfo = {
    firstname?: string;
    lastname?: string;
    email?: string;
    role?: UserRole;
}

export type UserRole = 'ADMIN' | 'USER'

export type UserSession = {
    token: string;
}
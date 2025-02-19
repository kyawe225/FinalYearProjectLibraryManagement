import { Role } from "./role";

export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    phone: string;
    roleId: string;
    userType: string;
    userStatus: string;
    createdAt: Date;
    updatedAt: Date;
    role : Role;
}


export interface UserCreate{
    name: string;
    email: string;
    password: string;
    phone: string;
    roleId: string;
    userType: string;
    userStatus: string;
}
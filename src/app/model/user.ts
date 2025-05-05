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
    role: Role;
}


export interface UserCreate {
    name: string;
    email: string;
    password: string;
    phone: string;
    roleId: string;
    userType: string;
    userStatus: string;
}

export interface Staff {
    id: string;
    firstName: string;
    lastName: string;
    position: string;
    department?: string;
    email?: string;
    phone?: string;
    dateHired: string; // DateOnly becomes string in TypeScript
    username: string;
    passwordHash: string;
    status: string;
}

export interface StaffCreate {
    firstName: string;
    lastName: string;
    address?: string;
    phone?: string;
    email?: string;
    position: string;
    department: string;
    dateOfBirth?: string; // DateOnly becomes string in TypeScript
    membershipDate: string; // DateOnly becomes string in TypeScript
    password?: string;
    dateHired: string; // DateTime becomes string in TypeScript
    username: string;
}

export interface Member {
    id: string;
    first_name: string;
    last_name: string;
    address?: string;
    phone_number?: string;
    email?: string;
    date_of_birth?: Date| null; // DateOnly becomes string in TypeScript
    membership_date: Date| null; // DateOnly becomes string in TypeScript
    membership_expiry?: Date | null; // DateOnly becomes string in TypeScript
    password?: string;
    membership_status: string;
}

export interface MemberCreate {
    first_name: string;
    last_name: string;
    address?: string;
    phone_number?: string;
    email?: string;
    date_of_birth?: Date|null; // DateOnly becomes string in TypeScript
    membership_date: Date|null; // DateOnly becomes string in TypeScript
    membership_expiry?: Date | null; // DateOnly becomes string in TypeScript
    membership_status?: string;
    password?: string;
}

export type MemberAction = 'create' | 'edit' | 'view' | 'delete' | 'close';

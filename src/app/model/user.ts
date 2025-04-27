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
    firstName: string;
    lastName: string;
    address?: string;
    phoneNumber?: string;
    email?: string;
    dateOfBirth?: Date; // DateOnly becomes string in TypeScript
    membershipDate: Date; // DateOnly becomes string in TypeScript
    membershipExpiry?: Date; // DateOnly becomes string in TypeScript
    password?: string;
    membershipStatus: string;
}

export interface MemberCreate {
    firstName: string;
    lastName: string;
    address?: string;
    phoneNumber?: string;
    email?: string;
    dateOfBirth?: string; // DateOnly becomes string in TypeScript
    membershipDate: string; // DateOnly becomes string in TypeScript
    password?: string;
}
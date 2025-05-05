export interface Login {
    email: string;
    password: string;
}

export interface Register {
    email: string;
    password: string;
    confirm_password: string;
    name: string;
}

export interface Staff {
    id: string;
    first_name: string;
    last_name: string;
    position: string;
    department: string | null;
    email: string | null;
    phone: string | null;
    date_hired: Date; // TypeScript doesn't have DateOnly, using Date instead
    username: string;
    status: string;
}

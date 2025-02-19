export interface Role{
    name : string;
    description : string;
    createdAt : Date;
    updatedAt : Date;
    id : string;
}

export interface RoleCreate{
    name: string;
    description: string;
}
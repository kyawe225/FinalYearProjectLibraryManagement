export interface Publisher {
    id: string;
    name: string;
    description: string;
    phoneNumber: string;
    email: string;
    address: string;
    createdDate: Date;
    updatedDate: Date;
}


export interface PublisherCreate{
    name: string;
    description: string;
    phoneNumber: string;
    email: string;
    address: string;
}
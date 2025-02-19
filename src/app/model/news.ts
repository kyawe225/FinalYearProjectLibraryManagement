export interface News {
    title: string;
    content: string;
    createdAt : Date;
    user: string; // userName 
    userId : string;
    id: string;
    type: string;
}

export interface NewsCreate{
    title : string;
    content : string;
    isPublish : boolean;
}

import { Staff } from "./auth";
import { Branch } from "./branch";

export interface News {
    id: string;
    news_id: string;
    title: string;
    content: string;
    publication_date: Date;
    expiry_date: Date | null;
    published_by_id: string;
    branch_id: string;
    importance_level: string;
    visibility: string;
    category: string;
    image_url: string;
    published_by: Staff;
    branch: Branch;
}

export interface NewsCreate {
    title: string;
    content: string;
    publication_date: Date;
    expiry_date: Date | null;
    published_by_id: string;
    branch_id: string;
    importance_level: string;
    visibility: string;
    category: string;
    image_url: string;
}

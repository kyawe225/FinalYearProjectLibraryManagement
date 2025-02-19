export interface Book {
    title: string;
    authors: string;
    isbn: string;
    publisher: string;
    publicationYear: number;// finsihed
    genre: string; 
    language: string; // finished
    pageCount: number;
    coverImage: string;
    description: string;
    status: string;
    category: string;
    edition: string;
    format: string;
    dateAdded: Date;
    createdAt: Date;
    updatedAt: Date;
    id : string;
}


export interface BookCreate{
    title: string;
    authors: string;
    isbn: string;
    publisher: string;
    publicationYear: number;
    genre: string;
    language: string;
    pageCount: number;
    coverImage: string;
    description: string;
    status: string;
    category: string;
    edition: string;
    format: string;
    dateAdded: Date;
}
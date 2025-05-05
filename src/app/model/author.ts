export interface author{
  author_id:string;
  first_name:string;
  last_name:string;
  biography?:string;
  date_of_birth: Date;
}

export interface authorCreate{
  first_name:string;
  last_name:string;
  biography?:string;
  date_of_birth: Date;
}


// src/app/models/author.model.ts
export interface Author {
  author_id: string;
  first_name: string;
  last_name: string;
  biography?: string;
  date_of_birth?: Date;
}

export interface AuthorRequest {
  first_name: string;
  last_name: string;
  biography?: string;
  date_of_birth?: Date;
}

export interface AuthorResponse {
  success: boolean;
  data?: Author;
  message?: string;
}

export interface AuthorsResponse {
  success: boolean;
  data?: Author[];
  message?: string;
  total?: number;
}


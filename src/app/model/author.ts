export interface author{
  authorId:string;
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


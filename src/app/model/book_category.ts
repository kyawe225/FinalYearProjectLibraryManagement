export interface book_category{
  id : string;
  name: string;
  parent_category : book_category;
  description: string;
}

export interface book_category_create{
  name: string;
  description : string;
  parent_category_id ?: string;
}

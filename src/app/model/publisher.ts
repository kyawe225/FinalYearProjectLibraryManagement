export interface Publisher {
    id: string;
    name: string;
    description: string;
    phone_number: string;
    email: string;
    address: string;
    createdDate: Date;
    updatedDate: Date;
}


export interface PublisherCreate{
    name: string;
    description: string;
    phone_number: string;
    email: string;
    address: string;
}
// Publisher model based on database schema
// export interface Publisher {
//     publisher_id: string;
//     name: string;
//     address?: string;
//     contact_person?: string;
//     phone?: string;
//     email?: string;
//     website?: string;
//   }
  
  // Response format for API calls
  export interface PublisherResponse {
    data: Publisher[];
    total: number;
    success: boolean;
    message: string;
  }
  
  // Single publisher response
  export interface SinglePublisherResponse {
    data: Publisher;
    success: boolean;
    message: string;
  }
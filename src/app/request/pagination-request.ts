export interface PaginationRequest {
    page : number;
    pageSize : number;
    keywords : Map<string, string>;
    filters : Map<string, string>;
}

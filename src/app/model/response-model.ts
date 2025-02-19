export interface ResponseModel<T> {
    status : string;
    message : string;
    data : T;
}

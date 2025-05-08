namespace LibraryManagement.Infrastructure.ViewModel;

public class ResponseModel<T>
{
    public string status { set; get; }
    public string message { set; get; }
    public T data { set; get; }
    public ResponseModel()
    {
    }

    public ResponseModel(T data, string status)
    {
        this.data = data;
        this.status = status;
    }
}

public class PaginatedResponseModel<T>
{
    public string status { set; get; }
    public string message { set; get; }
    public T data { set; get; }
    public int total { set; get; }
}

public struct HttpStatusResponse
{
    public const string OK = "OK";
    public const string FAILED = "NG";
}
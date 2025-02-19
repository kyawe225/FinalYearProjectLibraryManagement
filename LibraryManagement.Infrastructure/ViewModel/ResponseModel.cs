namespace LibraryManagement.Infrastructure.ViewModel;

public class ResponseModel<T>
{
    public string status { set; get; }
    public string message { set; get; }
    public T data { set; get; }
}

public class HttpStatusResponse
{
    public const string OK = "OK";
    public const string FAILED = "NG";
}
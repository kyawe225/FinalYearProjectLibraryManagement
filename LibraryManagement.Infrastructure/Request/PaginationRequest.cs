using System;

namespace LibraryManagement.Infrastructure.Request;

public class PaginationRequest
{
    public int Page{set;get;}
    public int PageSize{set;get;}
    public Dictionary<string,string> keywords{set;get;}
    public Dictionary<string,string> filters;
}

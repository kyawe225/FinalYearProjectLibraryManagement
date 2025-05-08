using System.Security.Claims;
using Microsoft.AspNetCore.Http;

namespace LibraryManagement.Infrastructure;

public interface ICredentialContext
{
    string getUserId();
    string getUserRole();
    string getEmail();
    string getName();
}

public class CredentialContext : ICredentialContext
{
    private readonly IHttpContextAccessor _context;
    public CredentialContext(IHttpContextAccessor context)
    {
        _context = context;
    }
    public string getUserId()
    {
        return _context.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "";
    }

    public string getUserRole()
    {
        return _context.HttpContext?.User?.FindFirst(ClaimTypes.Role)?.Value ?? "";
    }
    public string getEmail()
    {
        return _context.HttpContext?.User?.FindFirst(ClaimTypes.Email)?.Value ?? "";
    }
    public string getName()
    {
        return _context.HttpContext?.User.FindFirst(ClaimTypes.Name)?.Value ?? "";
    }
}
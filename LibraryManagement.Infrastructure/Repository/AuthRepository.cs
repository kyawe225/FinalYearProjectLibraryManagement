using LibraryManagement.Core.Entities;

using LibraryManagement.Infrastructure.Context;
using LibraryManagement.Infrastructure.Services;
using LibraryManagement.Infrastructure.ViewModel.User;
using Microsoft.EntityFrameworkCore;

namespace LibraryManagement.Infrastructure.Repository;

public interface IAuthRepository
{
    public Task<LoginResponse?> Login(LoginViewModel loginViewModel);
    public Task<bool> RegisterMember(RegisterViewModel registerViewModel);
}

public class AuthRepository : IAuthRepository
{
    private readonly ITokenService _tokenService;
    private readonly LibraryManagementContext _context;
    private readonly ICredentialContext credentialContext;

    public AuthRepository(ITokenService service, LibraryManagementContext context, ICredentialContext context1)
    {
        _tokenService = service;
        _context = context;
        credentialContext = context1;
    }

    public async Task<LoginResponse?> Login(LoginViewModel loginViewModel)
    {
        var user = await _context.Staff.Where(p => p.Email == loginViewModel.Email).AsNoTracking().FirstOrDefaultAsync();
        if (user != null)
        {
            if (Utils.Verify(loginViewModel.Password, user.PasswordHash))
            {
                var token = _tokenService.GenerateStaffToken(user);
                return token;
            }
        }
        var student = await _context.Members.Where(p => p.Email == loginViewModel.Email).AsNoTracking().FirstOrDefaultAsync();
        if (student != null)
        {
            if (Utils.Verify(loginViewModel.Password, student.PasswordHash))
            {
                var studentToken = _tokenService.GenerateStudentToken(student);
                return studentToken;
            }
        }
        return null;
    }

    public async Task<bool> RegisterMember(RegisterViewModel registerViewModel)
    {
        Member member = registerViewModel.toUserTable();
        //someone check isstudnet or not
        _context.Members.Add(member);
        await _context.SaveChangesAsync();
        return true;
    }
}
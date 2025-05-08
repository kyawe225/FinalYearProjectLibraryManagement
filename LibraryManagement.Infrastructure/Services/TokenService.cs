using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using LibraryManagement.Core.Entities;
using LibraryManagement.Infrastructure.ViewModel.User;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace LibraryManagement.Infrastructure.Services;

public interface ITokenService
{
    public LoginResponse GenerateStaffToken(Staff model);
    public LoginResponse GenerateStudentToken(Member model);
}

public class TokenService : ITokenService
{
    private IConfiguration _configuration;

    public TokenService(IConfiguration configuration)
    {
        _configuration = configuration;
    }
    
    public LoginResponse GenerateStaffToken(Staff model)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]);
        var expires = DateTime.UtcNow.AddHours(1);
        var tokenDescriptor = new SecurityTokenDescriptor()
        {
            Subject = new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.NameIdentifier, model.Id),
                new Claim(ClaimTypes.Role, "staff"),
                new Claim(ClaimTypes.Email, model.Email),
                new Claim(ClaimTypes.Name, model.FirstName + " " + model.LastName),
                // Add more claims as needed
            }),
            Expires = expires,
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
            Issuer = _configuration["Jwt:Issuer"], // Add this line
            Audience = _configuration["Jwt:Audience"] 
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return new LoginResponse { token = tokenHandler.WriteToken(token), data = new ProfileResponse(model), expires = expires };
    }

    public LoginResponse GenerateStudentToken(Member model)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]);
        var expires = DateTime.UtcNow.AddDays(1);
        var tokenDescriptor = new SecurityTokenDescriptor()
        {
            Subject = new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.NameIdentifier, model.Id),
                new Claim(ClaimTypes.Role, "student"),
                new Claim(ClaimTypes.Email, model.Email),
                new Claim(ClaimTypes.Name, model.FirstName + " "+ model.LastName),
                // Add more claims as needed
            }),
            Expires = expires,
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
            Issuer = _configuration["Jwt:Issuer"], // Add this line
            Audience = _configuration["Jwt:Audience"] 
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return new LoginResponse { token = tokenHandler.WriteToken(token),data = new ProfileResponse(model), expires = expires };
    }
}
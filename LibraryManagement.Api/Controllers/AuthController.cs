using LibraryManagement.Infrastructure.Repository;
using LibraryManagement.Infrastructure.ViewModel;
using LibraryManagement.Infrastructure.ViewModel.User;
using Microsoft.AspNetCore.Mvc;

namespace LibraryManagement.Api.Controllers;


[ApiController]
[Route("api/[controller]/[action]")]
public class AuthController : ControllerBase
{
    private readonly IAuthRepository _repositroyAuthRepository;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IAuthRepository repository, ILogger<AuthController> logger)
    {
        _repositroyAuthRepository = repository;
        _logger = logger;
    }
    
    [HttpPost]
    public async Task<IActionResult> Login(LoginViewModel loginViewModel)
    {
        var response = new ResponseModel<LoginResponse?>()
        {
            status = HttpStatusResponse.OK,
            data = await _repositroyAuthRepository.Login(loginViewModel),
            message = "success"
        };
        return Ok(response);
    }
    [HttpPost]
    public async Task<IActionResult> Register(RegisterViewModel registerViewModel)
    {
        var response = new ResponseModel<bool>()
        {
            status = HttpStatusResponse.OK,
            data = await _repositroyAuthRepository.RegisterMember(registerViewModel),
            message = "success"
        };
        return Ok(response);
    }
}
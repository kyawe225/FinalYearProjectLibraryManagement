namespace LibraryManagement.Infrastructure.ViewModel.User;

public class LoginViewModel
{
    public string Email { set; get; }
    public string Password { set; get; }
}

public class LoginResponse
{
    public string token { set; get; }
    public DateTime expires { set; get; }
}
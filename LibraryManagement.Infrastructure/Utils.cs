using Isopoh.Cryptography.Argon2;


namespace LibraryManagement.Infrastructure;

public class Utils
{
    public static T ParseEnum<T>(string value)
    {
        return (T) Enum.Parse(typeof(T), value, true);
    }
    
    public static string Encode(string password)
    {
        var passwordHash = Argon2.Hash(password);
        return passwordHash;
    }

    public static bool Verify(string password, string encodedPassword)
    {
        return Argon2.Verify(encodedPassword, password);
    }

    public static bool SendEmail(string email , string password){
        return true;
    }

    public static string ulid(string prefix){
        return $"{prefix}_{Ulid.NewUlid().ToString()}";
    }
}
using System.Net.Mail;
using MailKit.Net.Smtp;
using Microsoft.Extensions.Configuration;
using MimeKit;

namespace LibraryManagement.Infrastructure.Services;

public class SmtpEmailService{
    private readonly IConfiguration _config;
    public SmtpEmailService (IConfiguration config){
        _config = config;
    }

    public async Task SendEmailAsync(MailMessage emailMessage)
    {
    //     var smtpSettings = _config.GetSection("SmtpSettings");

    //     var email = new MimeMessage();
    //     email.From.Add(new MailboxAddress(smtpSettings["SenderName"], smtpSettings["SenderEmail"]));
    //     foreach(var i in emailMessage.To){
    //         email.To.Add(new MailboxAddress(i.DisplayName, i.Address));
    //     }
        
    //     email.Subject = emailMessage.Subject;

    //     var bodyBuilder = new BodyBuilder { HtmlBody = emailMessage.Body };
    //     email.Body = bodyBuilder.ToMessageBody();

    //     using var smtp = new MailKit.Net.Smtp.SmtpClient();
    //     try
    //     {
    //         await smtp.ConnectAsync(smtpSettings["Server"], int.Parse(smtpSettings["Port"]), bool.Parse(smtpSettings["UseSSL"]));
            
    //         if (bool.Parse(smtpSettings["UseStartTls"]))
    //         {
    //             await smtp.();
    //         }

    //         await smtp.AuthenticateAsync(smtpSettings["Username"], smtpSettings["Password"]);
    //         await smtp.SendAsync(email);
    //     }
    //     finally
    //     {
    //         await smtp.DisconnectAsync(true);
    //     }
    }
}
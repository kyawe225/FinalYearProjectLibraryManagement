using LibraryManagement.Infrastructure.ViewModel;
using Microsoft.AspNetCore.Mvc;

namespace LibraryManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FeedbackController: ControllerBase{
    private readonly IFeedbackRepository feedback;

    public FeedbackController(IFeedbackRepository feedback)
    {
        this.feedback = feedback;
    }

    [HttpPost]
    public ActionResult save(FeedbackCreateViewModel viewModel){
        var response = this.feedback.save(viewModel);
        return Ok(new ResponseModel<bool>(){ status = HttpStatusResponse.OK,message= "Thanks for feedback for library application improvements", data = response});
    }
}
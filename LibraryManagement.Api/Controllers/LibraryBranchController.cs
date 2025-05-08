using LibraryManagement.Infrastructure.Repository;
using LibraryManagement.Infrastructure.ViewModel;
using LibraryManagement.Infrastructure.ViewModel.Book;
using LibraryManagement.Infrastructure.ViewModel.LibraryBranch;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LibraryManagement.Api.Controllers;

[ApiController]
[Route("/api/branch")]
//completed
public class LibraryBranchController : ControllerBase
{
    private readonly ILibraryBranchRepository _repository;
    private readonly ILogger<LibraryBranchController> _logger;

    public LibraryBranchController(ILibraryBranchRepository repository, ILogger<LibraryBranchController> logger)
    {
        _repository = repository;
        _logger = logger;
    }
    
    [HttpGet("{Id}")]
    public async Task<IActionResult> Index(string Id)
    {
        return Ok(new ResponseModel<LibraryBranchViewModel>()
            { status = HttpStatusResponse.OK, data =await _repository.FindById(Id), message = "fetch Successfully" });
    }
    
    [HttpGet]
    public async Task<IActionResult> Index()
    {
        return Ok(new ResponseModel<IEnumerable<LibraryBranchViewModel>>()
            { status = HttpStatusResponse.OK, data =await _repository.GetAll(), message = "fetch Successfully" });
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] LibraryBranchCreateViewModel model)
    {
        bool result = _repository.Create(model);
        if (result == true)
        {
            return Ok(new ResponseModel<bool>() { status = HttpStatusResponse.OK, message = "Created Successfully", data = true });
        }
        return Ok(new ResponseModel<bool>() { status = HttpStatusResponse.FAILED, message = "Failed to create Category" });
    }

    [HttpPut("{Id}")]
    [Authorize]
    public async Task<IActionResult> Update(string Id, [FromBody] LibraryBranchCreateViewModel model)
    {
        bool result = _repository.Update(Id, model);
        if (result == true)
        {
            return Ok(new ResponseModel<bool>() { status = HttpStatusResponse.OK, message = "Updated Successfully", data = true });
        }
        return Ok(new ResponseModel<bool>() { status = HttpStatusResponse.FAILED, message = "Failed to update Category" });
    }

    [HttpDelete("{Id}")]
    [Authorize]
    public async Task<IActionResult> Delete(string Id)
    {
        bool result = _repository.Delete(Id);
        if (result == true)
        {
            return Ok(new ResponseModel<bool>() { status = HttpStatusResponse.OK, data = true, message = "Deleted Successfully" });
        }
        return Ok(new ResponseModel<bool>()
        { status = HttpStatusResponse.FAILED, data = false, message = "Failed to Delete Category" });
    }

    // [HttpPost("search")]
    // public async Task<IActionResult> Search([FromBody] BookSearchRequest request){
    //     return Ok(this._repository.Search(request));
    // }
}
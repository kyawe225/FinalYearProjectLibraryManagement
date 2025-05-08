using LibraryManagement.Infrastructure.Repository;
using LibraryManagement.Infrastructure.ViewModel;
using LibraryManagement.Infrastructure.ViewModel.Category;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LibraryManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
//completed
public class CategoryController : ControllerBase
{
    private readonly ICategoryRepository _repository;
    private readonly ILogger<CategoryController> _logger;

    public CategoryController(ICategoryRepository repository, ILogger<CategoryController> logger)
    {
        _repository = repository;
        _logger = logger;
    }


    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> Index()
    {
        return Ok(new ResponseModel<IEnumerable<CategoryViewModel>>()
        { status = HttpStatusResponse.OK, data = await _repository.GetAll(), message = "fetch Successfully" });
    }

    [HttpGet("{Id}")]
    [AllowAnonymous]
    public async Task<IActionResult> Index(string Id)
    {
        return Ok(new ResponseModel<CategoryViewModel>()
        { status = HttpStatusResponse.OK, data = await _repository.FindById(Id), message = "fetch Successfully" });
    }

    [HttpPost]
    
    public async Task<IActionResult> Create([FromBody] CategoryCreateViewModel model)
    {
        bool result = _repository.Create(model);
        if (result == true)
        {
            return Ok(new ResponseModel<bool>() { status = HttpStatusResponse.OK, message = "Created Successfully", data = true });
        }
        return Ok(new ResponseModel<bool>() { status = HttpStatusResponse.FAILED, message = "Failed to create Category" });
    }
    
    [HttpPut("{Id}")]
    public async Task<IActionResult> Update(string Id , [FromBody] CategoryCreateViewModel model)
    {
        bool result = _repository.Update(Id,model);
        if (result == true)
        {
            return Ok(new ResponseModel<bool>() { status = HttpStatusResponse.OK, message = "Updated Successfully", data = true});
        }
        return Ok(new ResponseModel<bool>() { status = HttpStatusResponse.FAILED, message = "Failed to update Category" });
    }

    [HttpDelete("{Id}")]
    public async Task<IActionResult> Delete(string Id)
    {
        bool result = _repository.Delete(Id);
        if (result == true)
        {
            return Ok(new ResponseModel<bool>() { status = HttpStatusResponse.OK , data = true, message = "Deleted Successfully" });
        }
        return Ok(new ResponseModel<bool>()
            { status = HttpStatusResponse.FAILED , data = false, message = "Failed to Delete Category" });
    }
}
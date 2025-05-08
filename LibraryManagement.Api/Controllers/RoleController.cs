// using LibraryManagement.Infrastructure.Repository;
// using LibraryManagement.Infrastructure.ViewModel;
// using LibraryManagement.Infrastructure.ViewModel.Role;
// using Microsoft.AspNetCore.Mvc;

// namespace LibraryManagement.Api.Controllers;

// [ApiController]
// [Route("api/[controller]")]
// public class RoleController : ControllerBase
// {
//     private readonly IRoleRepository _repository;
//     private readonly ILogger<WishBookController> _logger;

//     public RoleController(IRoleRepository repository, ILogger<WishBookController> logger)
//     {
//         _repository = repository;
//         _logger = logger;
//     }
    
//     [HttpGet("{Id}")]
//     public async Task<IActionResult> Index(string Id)
//     {
//         return Ok(new ResponseModel<RoleViewModel>()
//             { status = HttpStatusResponse.OK, data =await _repository.FindById(Id), message = "fetch Successfully" });
//     }
    
//     [HttpGet]
//     public async Task<IActionResult> Index()
//     {
//         return Ok(new ResponseModel<IEnumerable<RoleViewModel>>()
//             { status = HttpStatusResponse.OK, data =await _repository.GetAll(), message = "fetch Successfully" });
//     }

//     [HttpPost]
//     public async Task<IActionResult> Create([FromBody] RoleCreateViewModel model)
//     {
//         bool result = _repository.Create(model);
//         if (result == true)
//         {
//             return Ok(new ResponseModel<bool>() { status = HttpStatusResponse.OK, message = "Created Successfully", data = true});
//         }
//         return Ok(new ResponseModel<bool>() { status = HttpStatusResponse.FAILED, message = "Failed to create Category" });
//     }
    
//     [HttpPut("{Id}")]
//     public async Task<IActionResult> Update(string Id , [FromBody] RoleCreateViewModel model)
//     {
//         bool result = _repository.Update(Id,model);
//         if (result == true)
//         {
//             return Ok(new ResponseModel<bool>() { status = HttpStatusResponse.OK, message = "Updated Successfully", data = true});
//         }
//         return Ok(new ResponseModel<bool>() { status = HttpStatusResponse.FAILED, message = "Failed to update Category" });
//     }

//     [HttpDelete("{Id}")]
//     public async Task<IActionResult> Delete(string Id)
//     {
//         bool result = _repository.Delete(Id);
//         if (result == true)
//         {
//             return Ok(new ResponseModel<bool>() { status = HttpStatusResponse.OK , data = true, message = "Deleted Successfully" });
//         }
//         return Ok(new ResponseModel<bool>()
//             { status = HttpStatusResponse.FAILED , data = false, message = "Failed to Delete Category" });
//     }
// }
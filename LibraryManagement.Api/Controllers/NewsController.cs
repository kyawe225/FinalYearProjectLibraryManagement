using LibraryManagement.Infrastructure.Repository;
using Microsoft.AspNetCore.Mvc;
using LibraryManagement.Infrastructure.ViewModel;
using LibraryManagement.Infrastructure.ViewModel.News;
using LibraryManagement.Infrastructure.Request;

namespace LibraryManagement.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NewsController : ControllerBase
    {
        private readonly INewsRepository _repository;
        private readonly ILogger<NewsController> _logger;
        public NewsController(INewsRepository newsRepository, ILogger<NewsController> logger)
        {
            _logger = logger;
            _repository = newsRepository;
        }

        [HttpGet("{Id}")]
        public async Task<IActionResult> Index(string Id)
        {
            return Ok(new ResponseModel<NewsViewModel>()
            { status = HttpStatusResponse.OK, data = await _repository.FindById(Id), message = "fetch Successfully" });
        }

        [HttpGet]
        public async Task<IActionResult> Index()
        {
            return Ok(new ResponseModel<IEnumerable<NewsViewModel>>()
            { status = HttpStatusResponse.OK, data = await _repository.GetAll(), message = "fetch Successfully" });
        }

        [HttpPost("latest")]
        public async Task<IActionResult> Index([FromBody] PaginationRequest request)
        {
            return Ok(new ResponseModel<IEnumerable<NewsViewModel>>()
            { status = HttpStatusResponse.OK, data = await _repository.getLatestNews(request), message = "fetch Successfully" });
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] NewsCreateViewModel model)
        {
            bool result = _repository.Create(model);
            if (result == true)
            {
                return Ok(new ResponseModel<bool>() { status = HttpStatusResponse.OK, message = "Created Successfully", data = true });
            }
            return Ok(new ResponseModel<bool>() { status = HttpStatusResponse.FAILED, message = "Failed to create News" });
        }

        [HttpPut("{Id}")]
        public async Task<IActionResult> Update(string Id, [FromBody] NewsCreateViewModel model)
        {
            bool result = _repository.Update(Id, model);
            if (result == true)
            {
                return Ok(new ResponseModel<bool>() { status = HttpStatusResponse.OK, message = "Updated Successfully", data = true });
            }
            return Ok(new ResponseModel<bool>() { status = HttpStatusResponse.FAILED, message = "Failed to update News" });
        }

        [HttpDelete("{Id}")]
        public async Task<IActionResult> Delete(string Id)
        {
            bool result = _repository.Delete(Id);
            if (result == true)
            {
                return Ok(new ResponseModel<bool>() { status = HttpStatusResponse.OK, data = true, message = "Deleted Successfully" });
            }
            return Ok(new ResponseModel<bool>()
            { status = HttpStatusResponse.FAILED, data = false, message = "Failed to Delete News" });
        }
    }
}

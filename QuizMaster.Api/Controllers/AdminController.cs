using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using QuizMaster.Api.SignalR;
using QuizMaster.Api.Filters;
using QuizMaster.Application.Admin;
using QuizMaster.Domain;
using System.Collections.Generic;

namespace TodoApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly IMediator mediator;
        private readonly IHubContext<QuizHub> hubContext;

        public AdminController(IMediator mediator, IHubContext<QuizHub> hubContext)
        {
            this.hubContext = hubContext;
            this.mediator = mediator;
        }


        [ServiceFilter(typeof(AdminApiKeyAuthAttribute))]
        [HttpGet("quizzes")]
        public async Task<ActionResult<List<Quiz>>> GetQuizzes()
        {
            var quizzes = await mediator.Send(new Quizzes.Query());

            if (quizzes == null)
            {
                return NotFound();
            }

            return Ok(quizzes);
        }

        [ServiceFilter(typeof(AdminApiKeyAuthAttribute))]
        [HttpGet("questions")]
        public async Task<ActionResult<List<QuizQuestion>>> GetQuestions()
        {
            var quizQuestions = await mediator.Send(new QuizQuestions.Query());

            if (quizQuestions == null)
            {
                return NotFound();
            }

            return Ok(quizQuestions);
        }        

        [ServiceFilter(typeof(AdminApiKeyAuthAttribute))]
        [HttpPost("updatesetting")]
        public async Task<ActionResult<Contestant>> UpdateSetting(UpdateGeneralSetting.Command updateCommand)
        {
            var setting = await mediator.Send(updateCommand);
            if (setting == null)
            {
                return NotFound();
            }
            return Ok();
        }

    }
}
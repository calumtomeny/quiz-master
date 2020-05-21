using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using QuizMaster.Api.SignalR;
using QuizMaster.Application;
using QuizMaster.Application.Quizzes;
using QuizMaster.Domain;

namespace TodoApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuizzesController : ControllerBase
    {
        private readonly IMediator mediator;

        private readonly IHubContext<QuizHub> hubContext;

        public QuizzesController(IMediator mediator, IHubContext<QuizHub> hubContext)
        {
            this.mediator = mediator;
            this.hubContext = hubContext;
        }

        // GET api/values
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Quiz>>> Get(string quizCode)
        {
            return Ok(await mediator.Send(new List.Query() { QuizCode = quizCode }));
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Quiz>> Get(Guid id)
        {
            var quiz = await mediator.Send(new Details.Query(id));
            return Ok(quiz);
        }

        [HttpGet("{id}/Contestants")]
        public async Task<ActionResult<Contestant>> GetContestants(Guid id)
        {
            var quiz = await mediator.Send(new QuizMaster.Application.Contestants.List.Query(id));
            return Ok(quiz);
        }


        // POST api/values
        [HttpPost]
        public async Task<ActionResult<Quiz>> Post(Create.Command command)
        {
            return Ok(await mediator.Send(command));
        }

        [HttpPost("{id}/command/quizmastermessage")]
        public async Task<ActionResult> Start(QuizMasterMessage message, Guid id)
        {
            await hubContext.Clients.Group(id.ToString()).SendAsync("ContestantUpdate", message);
            return Ok();
        }

        [HttpPost("{id}/command/participantmessage")]
        public async Task<ActionResult> Start(ParticipantMessage message, Guid id)
        {
            await hubContext.Clients.Group(id.ToString()).SendAsync("QuizMasterUpdate", message);
            return Ok();
        }

        // POST api/quizzes/{id}/questions
        [HttpPost("{id}/questions")]
        public async Task<ActionResult<List<QuizQuestion>>> QuizQuestions(List<QuizMaster.Application.Questions.Create.CommandItem> command, Guid id)
        {
            return Ok(await mediator.Send(new QuizMaster.Application.Questions.Create.Command() { QuizItems = command, QuizId = id }));
        }

        // GET api/quizzes/{id}/questions
        [HttpGet("{id}/questions")]
        public async Task<ActionResult<List<QuizQuestion>>> Questions(Guid id)
        {
            return Ok(await mediator.Send(new QuizMaster.Application.Questions.List.Query() { QuizId = id }));
        }


        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
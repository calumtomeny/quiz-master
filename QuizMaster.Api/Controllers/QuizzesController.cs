using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using QuizMaster.Api.Filters;
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
        [ServiceFilter(typeof(ApiKeyAuthAttribute))]
        [HttpGet("{id}")]
        public async Task<ActionResult<Quiz>> Get(string id)
        {
            var quiz = await mediator.Send(new Details.Query(id));

            if (quiz == null)
            {
                return NotFound();
            }

            return Ok(await mediator.Send(new Details.Query(id)));
        }

        [HttpGet("{id}/name")]
        public async Task<ActionResult<String>> GetQuizName(string id)
        {
            var quiz = await mediator.Send(new Details.Query(id));

            if (quiz == null)
            {
                return NotFound();
            }

            return Ok(mediator.Send(new Details.Query(id)).Result.Name);
        }

        [HttpGet("{id}/details/{participantId}")]
        public async Task<ActionResult<Details.ParticipantQuizDetails>> GetParticipantQuizDetails(string id, Guid participantId)
        {
            var quizDetails = await mediator.Send(new Details.ParticipantQuery(id, participantId));

            if (quizDetails == null)
            {
                return NotFound();
            }
            return Ok(quizDetails);
        }

        [ServiceFilter(typeof(ApiKeyAuthAttribute))]
        [HttpGet("{id}/details")]
        public async Task<ActionResult<Details.QuizMasterQuizDetails>> GetQuizMasterQuizDetails(string id)
        {
            var quizDetails = await mediator.Send(new Details.QuizMasterQuery(id));

            if (quizDetails == null)
            {
                return NotFound();
            }
            return Ok(quizDetails);
        }

        [HttpGet("{id}/state")]
        public async Task<ActionResult<Details.QuizStateValues>> GetQuizState(string id)
        {
            var quiz = await mediator.Send(new Details.Query(id));

            if (quiz == null)
            {
                return NotFound();
            }

            return Ok(new Details.QuizStateValues()
            {
                QuizState = quiz.State,
                QuestionNo = quiz.QuestionNo,
                QuestionStartTime = quiz.QuestionStartTime
            });
        }

        [ServiceFilter(typeof(ApiKeyAuthAttribute))]
        [HttpGet("{id}/contestants")]
        public async Task<ActionResult<Contestant>> GetContestants(string id)
        {
            var quiz = await mediator.Send(new QuizMaster.Application.Contestants.List.Query(id));
            return Ok(quiz);
        }

        [ServiceFilter(typeof(ApiKeyAuthAttribute))]
        [HttpPost("{id}/resetcontestants")]
        public async Task<ActionResult<Contestant>> ResetContestants(Reset.EmptyCommand command, string id)
        {
            var quiz = await mediator.Send(new Reset.Command(id));

            var message = new QuizMasterMessage();
            message.Kick = true;

            await hubContext.Clients.Group(id.ToString()).SendAsync("ContestantUpdate", message);
            return Ok();
        }

        [ServiceFilter(typeof(ApiKeyAuthAttribute))]
        [HttpPost("{id}")]
        public async Task<ActionResult<Contestant>> UpdateQuiz(Update.CommandBody commandBody, string id)
        {
            var quiz = await mediator.Send(new Update.Command() { QuizCode = id, CommandBody = commandBody });

            return Ok();
        }

        [ServiceFilter(typeof(ApiKeyAuthAttribute))]
        [HttpPost("{id}/updatecontestantanswers")]
        public async Task<ActionResult<List<Contestant>>> UpdateContestantAnswers(QuizMaster.Application.ContestantAnswers.Update.RequestBody requestBody, string id)
        {
            var contestants = await mediator.Send(
                new QuizMaster.Application.ContestantAnswers.Update.Command()
                {
                    QuizCode = id,
                    QuestionNo = requestBody.QuestionNo,
                    AnswerUpdates = requestBody.AnswerUpdates
                }
            );

            if (contestants == null)
            {
                return NotFound();
            }

            return Ok(contestants);
        }

        // POST api/values
        [HttpPost]
        public async Task<ActionResult<Quiz>> Post(Create.Command command)
        {
            var item = await mediator.Send(command);
            return CreatedAtAction("Get", new { id = item.Code }, item);
        }

        [ServiceFilter(typeof(ApiKeyAuthAttribute))]
        [HttpPost("{id}/command/quizmastermessage")]
        public async Task<ActionResult> Start(QuizMasterMessage message, string id)
        {
            var quiz = await mediator.Send(new Details.Query(id));

            if (quiz == null)
            {
                return NotFound();
            }

            await hubContext.Clients.Group(id.ToString()).SendAsync("ContestantUpdate", message);
            return Ok();
        }

        [HttpPost("{id}/command/participantmessage")]
        public async Task<ActionResult> Start(ParticipantMessage message, string id)
        {
            var contestantAnswer = await mediator.Send(
                new QuizMaster.Application.ContestantAnswers.Create.Command(
                    id,
                    message.QuestionNo,
                    message.ParticipantId,
                    message.Answer,
                    message.AnswerTimeLeftInMs,
                    message.AnswerTimeLeftAsAPercentage
                )
            );
            if (contestantAnswer == null)
            {
                return NotFound();
            }

            await hubContext.Clients.Group(id.ToString()).SendAsync("QuizMasterUpdate", message);
            return Ok();
        }

        // POST api/quizzes/{id}/questions
        [ServiceFilter(typeof(ApiKeyAuthAttribute))]
        [HttpPost("{id}/questions")]
        public async Task<ActionResult<List<QuizQuestion>>> QuizQuestions(List<QuizMaster.Application.Questions.Create.CommandItem> command, string id)
        {
            return Ok(await mediator.Send(new QuizMaster.Application.Questions.Create.Command() { QuizItems = command, QuizCode = id }));
        }

        // GET api/quizzes/{id}/questions
        [ServiceFilter(typeof(ApiKeyAuthAttribute))]
        [HttpGet("{id}/questions")]
        public async Task<ActionResult<List<QuizQuestion>>> Questions(string id)
        {
            return Ok(await mediator.Send(new QuizMaster.Application.Questions.List.Query() { QuizCode = id }));
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
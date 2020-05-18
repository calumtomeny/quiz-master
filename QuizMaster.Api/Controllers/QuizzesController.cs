using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using QuizMaster.Application.Quizzes;
using QuizMaster.Domain;

namespace TodoApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuizzesController : ControllerBase
    {
        private readonly IMediator mediator;

        public QuizzesController(IMediator mediator)
        {
            this.mediator = mediator;
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

        // POST api/values
        [HttpPost]
        public async Task<ActionResult<Quiz>> Post(Create.Command command)
        {
            return Ok(await mediator.Send(command));
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
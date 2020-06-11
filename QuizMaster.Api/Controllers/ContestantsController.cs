using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using QuizMaster.Api.SignalR;
using QuizMaster.Application.Contestants;
using QuizMaster.Domain;

namespace TodoApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContestantsController : ControllerBase
    {
        private readonly IMediator mediator;
        private readonly IHubContext<QuizHub> hubContext;

        public ContestantsController(IMediator mediator, IHubContext<QuizHub> hubContext)
        {
            this.hubContext = hubContext;
            this.mediator = mediator;
        }

        // POST api/values
        [HttpPost]
        public async Task<ActionResult<Contestant>> Post(Create.Command command)
        {
            var contestant = await mediator.Send(command);
            await hubContext.Clients.Group(command.QuizCode.ToString()).SendAsync("ContestantJoined", contestant);
            return Ok(contestant);
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
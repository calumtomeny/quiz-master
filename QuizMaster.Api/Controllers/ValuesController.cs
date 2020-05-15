using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizMaster.Domain;
using QuizMaster.Persistence;

namespace TodoApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuizzesController : ControllerBase
    {
        private readonly QuizContext context;

        public QuizzesController(QuizContext context)
        {
            this.context = context;
        }

        // GET api/values
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Quiz>>> Get()
        {
            var quizzes = await context.Quiz.ToListAsync();
            return Ok(quizzes);
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<Quiz>>> Get(Guid id)
        {
            var quiz = await context.Quiz.FindAsync(id);
            return Ok(quiz);
        }

        // POST api/values
        [HttpPost]
        public void Post([FromBody] string value)
        {
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
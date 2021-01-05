using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using QuizMaster.Application.Contestants;
using QuizMaster.Persistence;
using Microsoft.EntityFrameworkCore;

namespace QuizMaster.Api.Filters
{

    public class ContestantsApiKeyAuthAttribute : Attribute, IAsyncActionFilter
    {
        private readonly QuizContext quizContext;

        public ContestantsApiKeyAuthAttribute(QuizContext context)
        {
            this.quizContext = context;
        }
        private const string ApiKeyHeaderName = "ApiKey";
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            //var currentId = context.RouteData.Values["id"].ToString();
            if (!context.HttpContext.Request.Headers.TryGetValue(ApiKeyHeaderName, out var apiKey))
            {
                context.Result = new UnauthorizedResult();
                return;
            }

            var quiz = quizContext.Quiz.Include(x => x.Contestants).SingleOrDefault(x => x.Key == apiKey.ToString());
            if (quiz == null)
            {
                context.Result = new UnauthorizedResult();
                return;
            }

            var parsed = false;
            var notfound = false;
            if(context.ActionArguments.ContainsKey("commandList"))
            {
                var contestantUpdates = context.ActionArguments["commandList"] as List<Update.Command>;
                if (contestantUpdates != null){
                    foreach(var command in contestantUpdates)
                    {
                        var contestant = quiz.Contestants.SingleOrDefault(x => x.Id == command.ContestantId);
                        if(contestant == null)
                        {
                            context.Result = new UnauthorizedResult();
                            return;
                        }
                    }
                    parsed = true;
                    if(contestantUpdates.Count == 0){
                        notfound = true;
                    }
                }
            }

            if(!parsed)
            {
                if(context.ActionArguments.ContainsKey("id"))
                {
                    var contestantId = context.ActionArguments["id"] as Guid?;
                    if (contestantId != null)
                    {
                        var contestant = quiz.Contestants.SingleOrDefault(x => x.Id == contestantId);
                        if(contestant == null)
                        {
                            context.Result = new UnauthorizedResult();
                            return;
                        }                    
                    }
                    parsed = true;
                }
            }

            if(notfound || !parsed)
            {
                context.Result = new NotFoundResult();
                return;                
            }
            await next();
        }
    }
}
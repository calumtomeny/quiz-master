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

    /*This filter class authenticates the user using the apiKey header attribute which should contain the Quiz Key
    Unlike the ApiKeyAuthAttribute class, this class is for use with the ContestantsController API set, where actions
        are typically done on Contestant objects without a Quiz Code necessarily being supplied
    In this case, the filter checks that all Contestant objects being updated are participants of a quiz for which the user has the specific key*/
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
            //Read the apiKey header, if not present return Unauthorized
            if (!context.HttpContext.Request.Headers.TryGetValue(ApiKeyHeaderName, out var apiKey))
            {
                context.Result = new UnauthorizedResult();
                return;
            }

            //Check apiKey is valid for an existing quiz. If not return Unauthorized
            var quiz = quizContext.Quiz.Include(x => x.Contestants).SingleOrDefault(x => x.Key == apiKey.ToString());
            if (quiz == null)
            {
                context.Result = new UnauthorizedResult();
                return;
            }

            var parsed = false;
            var notfound = false;
            //Handle Multi-Contestant updates where a commandList is provided.  
            //If any contestant is not part of the quiz for which the key is valid return Unauthorized
            if (context.ActionArguments.ContainsKey("commandList"))
            {
                var contestantUpdates = context.ActionArguments["commandList"] as List<Update.Command>;
                if (contestantUpdates != null)
                {
                    foreach (var command in contestantUpdates)
                    {
                        var contestant = quiz.Contestants.SingleOrDefault(x => x.Id == command.ContestantId);
                        if (contestant == null)
                        {
                            context.Result = new UnauthorizedResult();
                            return;
                        }
                    }
                    parsed = true;
                    if (contestantUpdates.Count == 0)
                    {
                        notfound = true;
                    }
                }
            }

            //If already been parsed, no need to be handled again
            if (!parsed)
            {
                //Handle singular Contestant updates where a contestant id is provided. 
                //If the contestant is not part of the quiz for which the key is valid return Unauthorized 
                if (context.ActionArguments.ContainsKey("id"))
                {
                    var contestantId = context.ActionArguments["id"] as Guid?;
                    if (contestantId != null)
                    {
                        var contestant = quiz.Contestants.SingleOrDefault(x => x.Id == contestantId);
                        if (contestant == null)
                        {
                            context.Result = new UnauthorizedResult();
                            return;
                        }
                    }
                    else
                    {
                        notfound = true;
                    }
                    parsed = true;
                }
            }

            //In case of invalid request parameters or invalid contestant ids return Not Found
            if (notfound || !parsed)
            {
                context.Result = new NotFoundResult();
                return;
            }

            //If it gets to here the authentication has succeeded and the API call is made
            await next();
        }
    }
}
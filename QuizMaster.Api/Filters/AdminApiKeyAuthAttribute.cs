using System;
using System.Text;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using QuizMaster.Persistence;

namespace QuizMaster.Api.Filters
{

    public class AdminApiKeyAuthAttribute : Attribute, IAsyncActionFilter
    {
        private readonly QuizContext quizContext;

        public AdminApiKeyAuthAttribute(QuizContext context)
        {
            this.quizContext = context;
        }
        private const string ApiKeyHeaderName = "AdminApiKey";
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var apiKeySecret = quizContext.GeneralSettings.SingleOrDefault(x => x.Name == "AdminApiKey").Value;

            if (!context.HttpContext.Request.Headers.TryGetValue(ApiKeyHeaderName, out var apiKey))
            {
                context.Result = new UnauthorizedResult();
                return;
            }

            apiKey = Convert.ToBase64String(Encoding.UTF8.GetBytes(apiKey));
            if (apiKeySecret != apiKey)
            {
                context.Result = new UnauthorizedResult();
                return;
            }
            await next();
        }
    }
}
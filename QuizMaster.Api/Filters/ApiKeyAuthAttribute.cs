using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using QuizMaster.Persistence;

namespace QuizMaster.Api.Filters
{

	public class ApiKeyAuthAttribute : Attribute, IAsyncActionFilter
	{
		private readonly QuizContext quizContext;

		public ApiKeyAuthAttribute(QuizContext context)
		{
			this.quizContext = context;
		}
		private const string ApiKeyHeaderName = "ApiKey";
		public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
		{
			var currentId = context.RouteData.Values["id"].ToString();

			var quiz = quizContext.Quiz.SingleOrDefault(x => x.Code == currentId);

			if (!context.HttpContext.Request.Headers.TryGetValue(ApiKeyHeaderName, out var apiKey))
			{
				context.Result = new UnauthorizedResult();
				return;
			}

			if (quiz == null)
			{
				context.Result = new NotFoundResult();
				return;
			}

			if (quiz.Key != apiKey)
			{
				context.Result = new UnauthorizedResult();
				return;
			}
			await next();
		}
	}
}
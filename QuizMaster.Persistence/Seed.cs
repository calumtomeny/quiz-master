using System;
using System.Text;
using System.Collections.Generic;
using System.Linq;
using QuizMaster.Domain;

namespace QuizMaster.Persistence
{
    public class Seed
    {
        public static void SeedData(QuizContext context)
        {
            if (!context.Quiz.Any())
            {
                var quizzes = new List<Quiz>() {
                    new Quiz(name: "AOE Quiz"),
                    new Quiz(name: "Music Quiz"),
                    new Quiz(name: "Sports Quiz")
                };
                context.Quiz.AddRange(quizzes);
                context.SaveChanges();
            }

            if (!context.GeneralSettings.Any())
            {
                var settings = new List<GeneralSetting>() {
                    new GeneralSetting("AdminApiKey",Convert.ToBase64String(Encoding.UTF8.GetBytes("greenharpsichord88"))),
                };
                context.GeneralSettings.AddRange(settings);
                context.SaveChanges();
            }
        }

    }
}

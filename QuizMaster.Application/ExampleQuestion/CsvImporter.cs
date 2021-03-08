using QuizMaster.Domain;
using QuizMaster.Persistence;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System.Globalization;
using System.IO;
using CsvHelper;
namespace QuizMaster.Application.ExampleQuestions
{
    public class CsvImporter
    {  
        public void Import(string connectionString)
        {
            using(var reader = new StreamReader("AppData//questions.csv"))
            using(var csv = new CsvReader(reader, CultureInfo.InvariantCulture))
            {
                var optionsBuilder = new DbContextOptionsBuilder<QuizContext>();
                    optionsBuilder.UseSqlite(connectionString);

                var context = new QuizContext(optionsBuilder.Options);
                var csvRecords = csv.GetRecords<QuestionRow>().ToList(); 

                TextInfo textInfo = new CultureInfo("en-GB", false).TextInfo;
               
                csvRecords = csvRecords.Where(x => !string.IsNullOrWhiteSpace(x.Question) && !string.IsNullOrWhiteSpace(x.Answer)).ToList();

                context.Database.ExecuteSqlRaw("DELETE FROM [ExampleQuestions]");

                context.ExampleQuestions.AddRange(csvRecords.Select(x => new ExampleQuestion(x.Question, x.Answer)));

                context.SaveChanges();
            }             
        }
    }
}
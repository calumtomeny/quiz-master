using Microsoft.EntityFrameworkCore;
using QuizMaster.Domain;

namespace QuizMaster.Persistence
{
    public class QuizContext : DbContext
    {
        public QuizContext(DbContextOptions options) : base(options)
        {

        }

        public DbSet<Quiz> Quiz { get; set; }
        public DbSet<Contestant> Contestants { get; set; }
        public DbSet<QuizQuestion> QuizQuestions { get; set; }
        public DbSet<ContestantAnswer> ContestantAnswers { get; set; }
        public DbSet<ExampleQuestion> ExampleQuestions { get; set; }
        public DbSet<GeneralSetting> GeneralSettings { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<GeneralSetting>().HasKey(g => g.Name);
        }
    }
}

using System;
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

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<Quiz>().HasData(
                new Quiz { Id = Guid.NewGuid(), Name = "AOE Quiz" },
                new Quiz { Id = Guid.NewGuid(), Name = "Sports Quiz" }
            );
        }
    }
}

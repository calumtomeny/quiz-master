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
        public DbSet<Contestant> Contestants { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {

        }
    }
}

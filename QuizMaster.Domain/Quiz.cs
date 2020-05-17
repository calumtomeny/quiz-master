using System;
using System.Collections.Generic;

namespace QuizMaster.Domain
{
    public class Quiz
    {
        public Quiz(string name)
        {
            Id = Guid.NewGuid();
            Code = GenerateCode();
            Name = name;
        }

        public Guid Id { get; private set; }
        public String Name { get; private set; }
        public String Code { get; private set; }
        public List<Contestant> Contestants { get; set; }

        static string GenerateCode()
        {
            // Taken from: https://stackoverflow.com/a/41723783/193717
            var ticks = new DateTime(2016, 1, 1).Ticks;
            var ans = DateTime.Now.Ticks - ticks;
            var uniqueId = ans.ToString("x");
            return uniqueId;
        }
    }
}

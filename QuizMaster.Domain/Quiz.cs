using System;
using System.Collections.Generic;
using System.Security.Cryptography;

namespace QuizMaster.Domain
{
    public class Quiz
    {
        public Quiz(string name)
        {
            this.Id = Guid.NewGuid();
            this.Name = name;
            this.Code = GenerateCode();
            this.Key = GenerateKey();
            this.State = QuizState.QuizNotStarted;
            this.QuestionNo = 0;
            this.QuestionStartTime = 0;
        }

        public Quiz(Guid id, String name, String code)
        {
            this.Id = id;
            this.Name = name;
            this.Code = code;
        }
        public Guid Id { get; private set; }
        public String Name { get; private set; }
        public String Code { get; private set; }
        public String Key { get; private set; }
        public QuizState State { get; set; }
        public int QuestionNo { get; set; }
        public long QuestionStartTime { get; set; }
        public List<Contestant> Contestants { get; set; }
        public List<QuizQuestion> QuizQuestions { get; set; }

        static string GenerateCode()
        {
            // Taken from: https://stackoverflow.com/a/41723783/193717
            var ticks = new DateTime(2016, 1, 1).Ticks;
            var ans = DateTime.Now.Ticks - ticks;
            var uniqueId = ans.ToString("x");
            return uniqueId;
        }

        static string GenerateKey()
        {
            // Taken from: https://stackoverflow.com/a/18730859/193717 
            var key = new byte[32];
            using (var generator = RandomNumberGenerator.Create())
                generator.GetBytes(key);
            string apiKey = Convert.ToBase64String(key);
            return apiKey;
        }
    }
}

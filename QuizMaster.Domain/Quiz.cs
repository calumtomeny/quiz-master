﻿using System;
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
            this.QuestionTimeInSeconds = 30;
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
        public int QuestionTimeInSeconds { get; set; }

        static string GenerateCode()
        {
            var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            var length = 4;
            var stringChars = new char[length];
            var random = new Random();

            for (int i = 0; i < length; i++)
            {
                stringChars[i] = chars[random.Next(chars.Length)];
            }

            var uniqueId = new String(stringChars);
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


using System;

namespace QuizMaster.Domain
{
    public class GeneralSetting
    {
        public GeneralSetting(String name, String value)
        {
            Name = name;
            Value = value;
        }

        public String Name { get; set; }
        public String Value { get; set; }
    }
}
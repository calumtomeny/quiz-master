class QuizQuestion{
    constructor(question: string, answer: string, number: number) {
        this.Question = question;
        this.Answer = answer;
        this.Number = number;        
    }
    Question: string;
    Answer: string;
    Number: number;
}

export default QuizQuestion;
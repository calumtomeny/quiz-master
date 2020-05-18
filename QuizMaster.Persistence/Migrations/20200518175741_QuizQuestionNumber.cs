using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizMaster.Persistence.Migrations
{
    public partial class QuizQuestionNumber : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Number",
                table: "QuizQuestions",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Number",
                table: "QuizQuestions");
        }
    }
}

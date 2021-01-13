using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizMaster.Persistence.Migrations
{
    public partial class ContestantBonusPoints : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "BonusPoints",
                table: "Contestants",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "BonusPoints",
                table: "ContestantAnswers",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "Correct",
                table: "ContestantAnswers",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Fastest",
                table: "ContestantAnswers",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BonusPoints",
                table: "Contestants");

            migrationBuilder.DropColumn(
                name: "BonusPoints",
                table: "ContestantAnswers");

            migrationBuilder.DropColumn(
                name: "Correct",
                table: "ContestantAnswers");

            migrationBuilder.DropColumn(
                name: "Fastest",
                table: "ContestantAnswers");
        }
    }
}

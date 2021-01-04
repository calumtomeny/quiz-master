using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizMaster.Persistence.Migrations
{
    public partial class ContestantScore : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Score",
                table: "Contestants",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Score",
                table: "Contestants");
        }
    }
}

using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizMaster.Persistence.Migrations
{
    public partial class QuizApiKey : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Key",
                table: "Quiz",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Key",
                table: "Quiz");
        }
    }
}

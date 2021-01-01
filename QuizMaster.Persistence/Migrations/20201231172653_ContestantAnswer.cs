using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizMaster.Persistence.Migrations
{
    public partial class ContestantAnswer : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ContestantAnswers",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    QuizQuestionId = table.Column<Guid>(nullable: false),
                    ContestantId = table.Column<Guid>(nullable: false),
                    Answer = table.Column<string>(nullable: true),
                    TimeRemainingMs = table.Column<long>(nullable: false),
                    PercentageTimeRemaining = table.Column<float>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContestantAnswers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ContestantAnswers_Contestants_ContestantId",
                        column: x => x.ContestantId,
                        principalTable: "Contestants",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ContestantAnswers_QuizQuestions_QuizQuestionId",
                        column: x => x.QuizQuestionId,
                        principalTable: "QuizQuestions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ContestantAnswers_ContestantId",
                table: "ContestantAnswers",
                column: "ContestantId");

            migrationBuilder.CreateIndex(
                name: "IX_ContestantAnswers_QuizQuestionId",
                table: "ContestantAnswers",
                column: "QuizQuestionId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ContestantAnswers");
        }
    }
}

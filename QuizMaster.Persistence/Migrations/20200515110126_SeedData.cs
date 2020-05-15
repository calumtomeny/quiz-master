using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizMaster.Persistence.Migrations
{
    public partial class SeedData : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Quiz",
                columns: new[] { "Id", "Name" },
                values: new object[] { new Guid("588686c0-4c6a-4f23-ad84-5f041b53c1f3"), "AOE Quiz" });

            migrationBuilder.InsertData(
                table: "Quiz",
                columns: new[] { "Id", "Name" },
                values: new object[] { new Guid("442dfff5-7df9-44f0-a190-383d9c04f78e"), "Sports Quiz" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Quiz",
                keyColumn: "Id",
                keyValue: new Guid("442dfff5-7df9-44f0-a190-383d9c04f78e"));

            migrationBuilder.DeleteData(
                table: "Quiz",
                keyColumn: "Id",
                keyValue: new Guid("588686c0-4c6a-4f23-ad84-5f041b53c1f3"));
        }
    }
}

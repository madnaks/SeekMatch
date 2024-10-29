using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SeekMatch.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RenameFinishToEndForEducationTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "FinishYear",
                table: "Educations",
                newName: "EndYear");

            migrationBuilder.RenameColumn(
                name: "FinishMonth",
                table: "Educations",
                newName: "EndMonth");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "EndYear",
                table: "Educations",
                newName: "FinishYear");

            migrationBuilder.RenameColumn(
                name: "EndMonth",
                table: "Educations",
                newName: "FinishMonth");
        }
    }
}

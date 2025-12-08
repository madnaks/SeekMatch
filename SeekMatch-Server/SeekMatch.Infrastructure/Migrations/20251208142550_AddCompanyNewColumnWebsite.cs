using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SeekMatch.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddCompanyNewColumnWebsite : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Website",
                table: "Companies",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Website",
                table: "Companies");
        }
    }
}

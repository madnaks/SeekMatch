using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SeekMatch.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddCompanyNewColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "PhoneNumber",
                table: "Companies",
                newName: "Phone");

            migrationBuilder.AddColumn<int>(
                name: "City",
                table: "Companies",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Country",
                table: "Companies",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Companies",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Region",
                table: "Companies",
                type: "integer",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "City",
                table: "Companies");

            migrationBuilder.DropColumn(
                name: "Country",
                table: "Companies");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Companies");

            migrationBuilder.DropColumn(
                name: "Region",
                table: "Companies");

            migrationBuilder.RenameColumn(
                name: "Phone",
                table: "Companies",
                newName: "PhoneNumber");
        }
    }
}

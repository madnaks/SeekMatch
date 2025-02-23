using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SeekMatch.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateAddressAttributesTalent : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Address",
                table: "Talents");

            migrationBuilder.DropColumn(
                name: "State",
                table: "Talents");

            migrationBuilder.RenameColumn(
                name: "Zip",
                table: "Talents",
                newName: "Country");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Country",
                table: "Talents",
                newName: "Zip");

            migrationBuilder.AddColumn<string>(
                name: "Address",
                table: "Talents",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "State",
                table: "Talents",
                type: "text",
                nullable: true);
        }
    }
}

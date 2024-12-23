using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SeekMatch.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddIsFreelancerColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsFreelancer",
                table: "Recruiters",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsFreelancer",
                table: "Recruiters");
        }
    }
}

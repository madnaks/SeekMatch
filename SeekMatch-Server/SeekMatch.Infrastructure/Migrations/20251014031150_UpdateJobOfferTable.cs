using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SeekMatch.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateJobOfferTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Description",
                table: "JobOffers",
                newName: "Overview");

            migrationBuilder.AddColumn<string>(
                name: "AdditionalRequirements",
                table: "JobOffers",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CompanyInfo",
                table: "JobOffers",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PositionDetails",
                table: "JobOffers",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Qualifications",
                table: "JobOffers",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AdditionalRequirements",
                table: "JobOffers");

            migrationBuilder.DropColumn(
                name: "CompanyInfo",
                table: "JobOffers");

            migrationBuilder.DropColumn(
                name: "PositionDetails",
                table: "JobOffers");

            migrationBuilder.DropColumn(
                name: "Qualifications",
                table: "JobOffers");

            migrationBuilder.RenameColumn(
                name: "Overview",
                table: "JobOffers",
                newName: "Description");
        }
    }
}

using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SeekMatch.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateJobApplicationAndExpressApplication : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_ExpressApplications_JobApplicationId",
                table: "ExpressApplications");

            migrationBuilder.DropColumn(
                name: "ExpressApplicationId",
                table: "JobApplications");

            migrationBuilder.CreateIndex(
                name: "IX_ExpressApplications_JobApplicationId",
                table: "ExpressApplications",
                column: "JobApplicationId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_ExpressApplications_JobApplicationId",
                table: "ExpressApplications");

            migrationBuilder.AddColumn<string>(
                name: "ExpressApplicationId",
                table: "JobApplications",
                type: "text",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ExpressApplications_JobApplicationId",
                table: "ExpressApplications",
                column: "JobApplicationId");
        }
    }
}

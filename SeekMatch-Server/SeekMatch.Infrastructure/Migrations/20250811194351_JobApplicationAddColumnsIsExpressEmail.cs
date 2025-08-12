using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SeekMatch.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class JobApplicationAddColumnsIsExpressEmail : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_JobApplications_Talents_TalentId",
                table: "JobApplications");

            migrationBuilder.AlterColumn<string>(
                name: "TalentId",
                table: "JobApplications",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "JobApplications",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsExpress",
                table: "JobApplications",
                type: "boolean",
                nullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_JobApplications_Talents_TalentId",
                table: "JobApplications",
                column: "TalentId",
                principalTable: "Talents",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_JobApplications_Talents_TalentId",
                table: "JobApplications");

            migrationBuilder.DropColumn(
                name: "Email",
                table: "JobApplications");

            migrationBuilder.DropColumn(
                name: "IsExpress",
                table: "JobApplications");

            migrationBuilder.AlterColumn<string>(
                name: "TalentId",
                table: "JobApplications",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_JobApplications_Talents_TalentId",
                table: "JobApplications",
                column: "TalentId",
                principalTable: "Talents",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}

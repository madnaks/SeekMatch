using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SeekMatch.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddProfileFieldsToTalent : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Address",
                table: "Talents",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "City",
                table: "Talents",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateOnly>(
                name: "DateOfBirth",
                table: "Talents",
                type: "date",
                nullable: false,
                defaultValue: new DateOnly(1, 1, 1));

            migrationBuilder.AddColumn<string>(
                name: "Phone",
                table: "Talents",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProfileTitle",
                table: "Talents",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "State",
                table: "Talents",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Zip",
                table: "Talents",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Address",
                table: "Talents");

            migrationBuilder.DropColumn(
                name: "City",
                table: "Talents");

            migrationBuilder.DropColumn(
                name: "DateOfBirth",
                table: "Talents");

            migrationBuilder.DropColumn(
                name: "Phone",
                table: "Talents");

            migrationBuilder.DropColumn(
                name: "ProfileTitle",
                table: "Talents");

            migrationBuilder.DropColumn(
                name: "State",
                table: "Talents");

            migrationBuilder.DropColumn(
                name: "Zip",
                table: "Talents");
        }
    }
}

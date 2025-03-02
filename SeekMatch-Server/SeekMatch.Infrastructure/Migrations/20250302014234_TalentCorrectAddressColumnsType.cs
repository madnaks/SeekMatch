using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SeekMatch.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class TalentCorrectAddressColumnsType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Ensure non-numeric values are set to NULL before changing type
            migrationBuilder.Sql("UPDATE \"Talents\" SET \"ProvinceOrRegion\" = NULL WHERE \"ProvinceOrRegion\" !~ '^[0-9]+$' OR \"ProvinceOrRegion\" = '';");
            migrationBuilder.Sql("UPDATE \"Talents\" SET \"City\" = NULL WHERE \"City\" !~ '^[0-9]+$' OR \"City\" = '';");

            // Convert column type to integer using explicit casting
            migrationBuilder.Sql("ALTER TABLE \"Talents\" ALTER COLUMN \"ProvinceOrRegion\" TYPE integer USING NULLIF(\"ProvinceOrRegion\", '')::integer;");
            migrationBuilder.Sql("ALTER TABLE \"Talents\" ALTER COLUMN \"City\" TYPE integer USING NULLIF(\"City\", '')::integer;");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "ProvinceOrRegion",
                table: "Talents",
                type: "text",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "City",
                table: "Talents",
                type: "text",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);
        }
    }
}

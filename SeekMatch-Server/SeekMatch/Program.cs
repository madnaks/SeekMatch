using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SeekMatch.Application.Interfaces;
using SeekMatch.Application.Services;
using SeekMatch.Core.Entities;
using SeekMatch.Core.Interfaces;
using SeekMatch.Core.Repositories;
using SeekMatch.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add Identity services
builder.Services.AddIdentityCore<User>()
    .AddEntityFrameworkStores<SeekMatchDbContext>()
    .AddApiEndpoints();

// Add Authentication and Authorization services
builder.Services.AddAuthorization();
builder.Services.AddAuthentication().AddCookie(IdentityConstants.ApplicationScheme)
    .AddBearerToken(IdentityConstants.BearerScheme);

// Configure the database context with Npgsql
builder.Services.AddEntityFrameworkNpgsql().AddDbContext<SeekMatchDbContext>(opt =>
    opt.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register services
builder.Services.AddScoped<ITalentService, TalentService>();

//Register repositories
builder.Services.AddScoped<ITalentRepository, TalentRepository>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("localhostOrigin", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();

    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    // add localhost origin in development environment
    app.UseCors("localhostOrigin");
}

app.UseHttpsRedirection();

app.MapIdentityApi<User>();

app.UseAuthorization();

app.MapControllers();

app.Run();

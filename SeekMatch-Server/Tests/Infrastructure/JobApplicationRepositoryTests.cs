using Microsoft.EntityFrameworkCore;
using SeekMatch.Core.Entities;
using SeekMatch.Core.Enums;
using SeekMatch.Infrastructure;
using SeekMatch.Infrastructure.Repositories;

namespace SeekMatch.Tests.Infrastructure;

public class JobApplicationRepositoryTests : IDisposable
{
    private readonly SeekMatchDbContext _dbContext;
    private readonly JobApplicationRepository _sut;

    public JobApplicationRepositoryTests()
    {
        var options = new DbContextOptionsBuilder<SeekMatchDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _dbContext = new SeekMatchDbContext(options);
        _sut = new JobApplicationRepository(_dbContext);
    }

    public void Dispose() => _dbContext.Dispose();

    #region GetByIdAsync

    [Fact]
    public async Task GetByIdAsync_WhenExists_ReturnsApplicationWithIncludes()
    {
        var (recruiter, talent, jobOffer) = await SeedBaseEntitiesAsync();
        var (application, _) = await SeedExpressApplicationAsync("app-1", jobOffer, talent: talent);

        var result = await _sut.GetByIdAsync("app-1");

        Assert.NotNull(result);
        Assert.Equal("app-1", result!.Id);
        Assert.NotNull(result.JobOffer);
        Assert.NotNull(result.ExpressApplication);
    }

    [Fact]
    public async Task GetByIdAsync_WhenNotFound_ThrowsException()
    {
        await Assert.ThrowsAsync<Exception>(() => _sut.GetByIdAsync("ghost"));
    }

    #endregion

    #region GetByIdWithTalentDetailsAsync

    [Fact]
    public async Task GetByIdWithTalentDetailsAsync_WhenExists_ReturnsTalentWithResumes()
    {
        var (_, talent, jobOffer) = await SeedBaseEntitiesAsync();
        var resume = new Resume { Id = "res-1", TalentId = talent.Id, Talent = talent, IsPrimary = true, FilePath = "...", Title="Title" };
        await _dbContext.Resumes.AddAsync(resume);
        await SeedApplicationAsync("app-1", jobOffer, talent);
        await _dbContext.SaveChangesAsync();

        var result = await _sut.GetByIdWithTalentDetailsAsync("app-1");

        Assert.NotNull(result);
        Assert.NotNull(result!.Talent);
        Assert.Single(result.Talent!.Resumes);
    }

    [Fact]
    public async Task GetByIdWithTalentDetailsAsync_WhenNotFound_ThrowsException()
    {
        await Assert.ThrowsAsync<Exception>(() => _sut.GetByIdWithTalentDetailsAsync("ghost"));
    }

    #endregion

    #region GetAllByTalentAsync

    [Fact]
    public async Task GetAllByTalentAsync_ReturnsOnlyApplicationsForSpecificTalent()
    {
        var (recruiter, talent1, jobOffer) = await SeedBaseEntitiesAsync();
        var talent2 = CreateTalent("talent-2", "Jane", "Smith");
        await _dbContext.Talents.AddAsync(talent2);
        await SeedApplicationAsync("app-1", jobOffer, talent1);
        await SeedApplicationAsync("app-2", jobOffer, talent2);
        await _dbContext.SaveChangesAsync();

        var result = await _sut.GetAllByTalentAsync("talent-1");

        Assert.Single(result!);
        Assert.Equal("talent-1", result![0].TalentId);
    }

    [Fact]
    public async Task GetAllByTalentAsync_IncludesJobOffer()
    {
        var (_, talent, jobOffer) = await SeedBaseEntitiesAsync();
        await SeedApplicationAsync("app-1", jobOffer, talent);

        var result = await _sut.GetAllByTalentAsync("talent-1");

        Assert.NotNull(result![0].JobOffer);
        Assert.Equal("job-1", result[0].JobOffer!.Id);
    }

    [Fact]
    public async Task GetAllByTalentAsync_WhenNoApplications_ReturnsEmptyList()
    {
        var result = await _sut.GetAllByTalentAsync("talent-ghost");

        Assert.NotNull(result);
        Assert.Empty(result!);
    }

    #endregion

    #region FindByTalentAndJobOfferAsync

    [Fact]
    public async Task FindByTalentAndJobOfferAsync_WhenExists_ReturnsApplication()
    {
        var (_, talent, jobOffer) = await SeedBaseEntitiesAsync();
        await SeedApplicationAsync("app-1", jobOffer, talent);

        var result = await _sut.FindByTalentAndJobOfferAsync("talent-1", "job-1");

        Assert.NotNull(result);
        Assert.Equal("app-1", result!.Id);
    }

    [Fact]
    public async Task FindByTalentAndJobOfferAsync_WhenNotExists_ReturnsNull()
    {
        var result = await _sut.FindByTalentAndJobOfferAsync("talent-1", "job-1");

        Assert.Null(result);
    }

    #endregion

    #region FindByEmailAndExpressApplicationAsync

    [Fact]
    public async Task FindByEmailAndExpressApplicationAsync_WhenExists_ReturnsApplication()
    {
        var (_, _, jobOffer) = await SeedBaseEntitiesAsync();
        await SeedExpressApplicationAsync("app-1", jobOffer, email: "john@test.com");

        var result = await _sut.FindByEmailAndExpressApplicationAsync("john@test.com", "job-1");

        Assert.NotNull(result);
        Assert.Equal("app-1", result!.Id);
    }

    [Fact]
    public async Task FindByEmailAndExpressApplicationAsync_WhenEmailDoesNotMatch_ReturnsNull()
    {
        var (_, _, jobOffer) = await SeedBaseEntitiesAsync();
        await SeedExpressApplicationAsync("app-1", jobOffer, email: "john@test.com");

        var result = await _sut.FindByEmailAndExpressApplicationAsync("other@test.com", "job-1");

        Assert.Null(result);
    }

    #endregion

    #region ApplyAsync

    [Fact]
    public async Task ApplyAsync_PersistsApplicationAndReturnsTrue()
    {
        var (_, talent, jobOffer) = await SeedBaseEntitiesAsync();
        var application = new JobApplication
        {
            Id = "app-1",
            JobOfferId = "job-1",
            JobOffer = jobOffer,
            TalentId = "talent-1",
            Talent = talent,
            AppliedAt = DateTime.UtcNow
        };

        var result = await _sut.ApplyAsync(application);

        Assert.True(result);
        Assert.NotNull(await _dbContext.JobApplications.FindAsync("app-1"));
    }

    #endregion

    #region ExpressApplyAsync

    [Fact]
    public async Task ExpressApplyAsync_PersistsBothApplicationAndExpressDataAndReturnsTrue()
    {
        var (_, _, jobOffer) = await SeedBaseEntitiesAsync();
        var application = new JobApplication
        {
            Id = "app-1",
            JobOfferId = "job-1",
            JobOffer = jobOffer,
            IsExpress = true,
            AppliedAt = DateTime.UtcNow
        };
        var expressApp = new ExpressApplication
        {
            Id = "expr-1",
            FirstName = "John",
            LastName = "Doe",
            Email = "john@test.com",
            JobApplicationId = "app-1",
            JobApplication = application
        };

        var result = await _sut.ExpressApplyAsync(application, expressApp);

        Assert.True(result);
        Assert.NotNull(await _dbContext.JobApplications.FindAsync("app-1"));
        Assert.NotNull(await _dbContext.ExpressApplications.FindAsync("expr-1"));
    }

    #endregion

    #region ShortList

    [Fact]
    public async Task ShortList_WhenApplicationExists_SetsStatusToShortlistedAndReturnsTrue()
    {
        var (_, talent, jobOffer) = await SeedBaseEntitiesAsync();
        await SeedApplicationAsync("app-1", jobOffer, talent);

        var result = await _sut.ShortList("app-1");

        Assert.True(result);
        var updated = await _dbContext.JobApplications.FindAsync("app-1");
        Assert.Equal(JobApplicationStatus.Shortlisted, updated!.Status);
    }

    [Fact]
    public async Task ShortList_WhenNotFound_ReturnsFalse()
    {
        var result = await _sut.ShortList("ghost");

        Assert.False(result);
    }

    #endregion

    #region InterviewScheduled

    [Fact]
    public async Task InterviewScheduled_WhenApplicationExists_SetsStatusAndDetailsAndReturnsTrue()
    {
        var (_, talent, jobOffer) = await SeedBaseEntitiesAsync();
        await SeedApplicationAsync("app-1", jobOffer, talent);
        var interviewDate = new DateTime(2026, 6, 15, 10, 0, 0, DateTimeKind.Utc);

        var result = await _sut.InterviewScheduled("app-1", "Teams", interviewDate);

        Assert.True(result);
        var updated = await _dbContext.JobApplications.FindAsync("app-1");
        Assert.Equal(JobApplicationStatus.InterviewScheduled, updated!.Status);
        Assert.Equal("Teams", updated.InterviewPlatform);
        Assert.Equal(interviewDate, updated.InterviewDate);
    }

    [Fact]
    public async Task InterviewScheduled_WhenNotFound_ReturnsFalse()
    {
        var result = await _sut.InterviewScheduled("ghost", "Teams", DateTime.UtcNow);

        Assert.False(result);
    }

    #endregion

    #region Hire

    [Fact]
    public async Task Hire_WhenApplicationExists_SetsStatusToHiredAndReturnsTrue()
    {
        var (_, talent, jobOffer) = await SeedBaseEntitiesAsync();
        await SeedApplicationAsync("app-1", jobOffer, talent);

        var result = await _sut.Hire("app-1");

        Assert.True(result);
        var updated = await _dbContext.JobApplications.FindAsync("app-1");
        Assert.Equal(JobApplicationStatus.Hired, updated!.Status);
    }

    [Fact]
    public async Task Hire_WhenNotFound_ReturnsFalse()
    {
        var result = await _sut.Hire("ghost");

        Assert.False(result);
    }

    #endregion

    #region RejectAsync

    [Fact]
    public async Task RejectAsync_WhenApplicationExists_SetsStatusAndReasonAndReturnsTrue()
    {
        var (_, talent, jobOffer) = await SeedBaseEntitiesAsync();
        await SeedApplicationAsync("app-1", jobOffer, talent);

        var result = await _sut.RejectAsync("app-1", "Not a fit");

        Assert.True(result);
        var updated = await _dbContext.JobApplications.FindAsync("app-1");
        Assert.Equal(JobApplicationStatus.Rejected, updated!.Status);
        Assert.Equal("Not a fit", updated.RejectionReason);
    }

    [Fact]
    public async Task RejectAsync_WhenNotFound_ReturnsFalse()
    {
        var result = await _sut.RejectAsync("ghost", "Not a fit");

        Assert.False(result);
    }

    #endregion

    #region DeleteAsync

    [Fact]
    public async Task DeleteAsync_WhenExists_RemovesAndReturnsTrue()
    {
        var (_, talent, jobOffer) = await SeedBaseEntitiesAsync();
        await SeedApplicationAsync("app-1", jobOffer, talent);

        var result = await _sut.DeleteAsync("app-1");

        Assert.True(result);
        Assert.Null(await _dbContext.JobApplications.FindAsync("app-1"));
    }

    [Fact]
    public async Task DeleteAsync_WhenNotFound_ReturnsFalse()
    {
        var result = await _sut.DeleteAsync("ghost");

        Assert.False(result);
    }

    #endregion

    #region Helpers

    private async Task<(Recruiter, Talent, JobOffer)> SeedBaseEntitiesAsync()
    {
        var recruiter = CreateRecruiter("rec-1");
        var talent = CreateTalent("talent-1");
        var jobOffer = CreateJobOffer("job-1", recruiter);

        await _dbContext.Recruiters.AddAsync(recruiter);
        await _dbContext.Talents.AddAsync(talent);
        await _dbContext.JobOffers.AddAsync(jobOffer);
        await _dbContext.SaveChangesAsync();

        return (recruiter, talent, jobOffer);
    }

    private async Task<JobApplication> SeedApplicationAsync(string id, JobOffer jobOffer, Talent talent)
    {
        var application = new JobApplication
        {
            Id = id,
            JobOfferId = jobOffer.Id,
            JobOffer = jobOffer,
            TalentId = talent.Id,
            Talent = talent,
            AppliedAt = DateTime.UtcNow
        };
        await _dbContext.JobApplications.AddAsync(application);
        await _dbContext.SaveChangesAsync();
        return application;
    }

    private async Task<(JobApplication, ExpressApplication)> SeedExpressApplicationAsync(
        string id, JobOffer jobOffer, Talent? talent = null, string email = "express@test.com")
    {
        var application = new JobApplication
        {
            Id = id,
            JobOfferId = jobOffer.Id,
            JobOffer = jobOffer,
            TalentId = talent?.Id,
            Talent = talent,
            IsExpress = true,
            AppliedAt = DateTime.UtcNow
        };
        var expressApp = new ExpressApplication
        {
            Id = $"expr-{id}",
            FirstName = "Express",
            LastName = "User",
            Email = email,
            JobApplicationId = id,
            JobApplication = application
        };
        application.ExpressApplication = expressApp;
        await _dbContext.JobApplications.AddAsync(application);
        await _dbContext.ExpressApplications.AddAsync(expressApp);
        await _dbContext.SaveChangesAsync();
        return (application, expressApp);
    }

    private static Recruiter CreateRecruiter(string id) => new()
    {
        Id = id,
        FirstName = "Rec",
        LastName = "Ruiter",
        User = new User { Id = id, Email = $"{id}@test.com", Role = UserRole.Recruiter }
    };

    private static Talent CreateTalent(string id, string firstName = "John", string lastName = "Doe") => new()
    {
        Id = id,
        FirstName = firstName,
        LastName = lastName,
        User = new User { Id = id, Email = $"{id}@test.com", Role = UserRole.Talent }
    };

    private static JobOffer CreateJobOffer(string id, Recruiter recruiter) => new()
    {
        Id = id,
        Title = "Developer",
        Description = "A great job",
        Location = "Montreal",
        IsActive = true,
        RecruiterId = recruiter.Id,
        Recruiter = recruiter
    };

    #endregion
}
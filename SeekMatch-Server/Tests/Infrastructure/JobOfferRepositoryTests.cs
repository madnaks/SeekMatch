using Microsoft.EntityFrameworkCore;
using SeekMatch.Core.Entities;
using SeekMatch.Core.Enums;
using SeekMatch.Infrastructure;
using SeekMatch.Infrastructure.Repositories;

namespace SeekMatch.Tests.Infrastructure;

public class JobOfferRepositoryTests : IDisposable
{
    private readonly SeekMatchDbContext _dbContext;
    private readonly JobOfferRepository _sut;

    public JobOfferRepositoryTests()
    {
        var options = new DbContextOptionsBuilder<SeekMatchDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _dbContext = new SeekMatchDbContext(options);
        _sut = new JobOfferRepository(_dbContext);
    }

    public void Dispose() => _dbContext.Dispose();

    #region GetAllAsync

    [Fact]
    public async Task GetAllAsync_WithNoFilters_ReturnsAllActiveJobOffers()
    {
        var recruiter = CreateRecruiter("rec-1");
        await _dbContext.Recruiters.AddAsync(recruiter);
        await _dbContext.JobOffers.AddRangeAsync(
            CreateJobOffer("job-1", recruiter, isActive: true),
            CreateJobOffer("job-2", recruiter, isActive: true),
            CreateJobOffer("job-3", recruiter, isActive: false)
        );
        await _dbContext.SaveChangesAsync();

        var result = await _sut.GetAllAsync(new JobOfferFilter());

        Assert.NotNull(result);
        Assert.Equal(2, result!.Count);
        Assert.All(result, j => Assert.True(j.IsActive));
    }

    [Fact]
    public async Task GetAllAsync_FilterByTitle_ReturnsMatchingJobOffers()
    {
        var recruiter = CreateRecruiter("rec-1");
        await _dbContext.Recruiters.AddAsync(recruiter);
        await _dbContext.JobOffers.AddRangeAsync(
            CreateJobOffer("job-1", recruiter, title: "Senior Developer", isActive: true),
            CreateJobOffer("job-2", recruiter, title: "Junior Developer", isActive: true),
            CreateJobOffer("job-3", recruiter, title: "QA Engineer", isActive: true)
        );
        await _dbContext.SaveChangesAsync();

        var result = await _sut.GetAllAsync(new JobOfferFilter { Title = "Developer" });

        Assert.NotNull(result);
        Assert.Equal(2, result!.Count);
        Assert.All(result, j => Assert.Contains("Developer", j.Title));
    }

    [Fact]
    public async Task GetAllAsync_FilterByCompanyName_ReturnsMatchingJobOffers()
    {
        var recruiter = CreateRecruiter("rec-1");
        await _dbContext.Recruiters.AddAsync(recruiter);
        await _dbContext.JobOffers.AddRangeAsync(
            CreateJobOffer("job-1", recruiter, companyName: "Acme Corp", isActive: true),
            CreateJobOffer("job-2", recruiter, companyName: "Other Inc", isActive: true)
        );
        await _dbContext.SaveChangesAsync();

        var result = await _sut.GetAllAsync(new JobOfferFilter { CompanyName = "Acme" });

        Assert.Single(result!);
        Assert.Equal("Acme Corp", result![0].CompanyName);
    }

    [Fact]
    public async Task GetAllAsync_FilterByJobType_ReturnsMatchingJobOffers()
    {
        var recruiter = CreateRecruiter("rec-1");
        await _dbContext.Recruiters.AddAsync(recruiter);
        await _dbContext.JobOffers.AddRangeAsync(
            CreateJobOffer("job-1", recruiter, type: JobType.FullTime, isActive: true),
            CreateJobOffer("job-2", recruiter, type: JobType.PartTime, isActive: true),
            CreateJobOffer("job-3", recruiter, type: JobType.FullTime, isActive: true)
        );
        await _dbContext.SaveChangesAsync();

        var result = await _sut.GetAllAsync(new JobOfferFilter { Type = JobType.FullTime });

        Assert.Equal(2, result!.Count);
        Assert.All(result, j => Assert.Equal(JobType.FullTime, j.Type));
    }

    [Fact]
    public async Task GetAllAsync_FilterByWorkplaceType_ReturnsMatchingJobOffers()
    {
        var recruiter = CreateRecruiter("rec-1");
        await _dbContext.Recruiters.AddAsync(recruiter);
        await _dbContext.JobOffers.AddRangeAsync(
            CreateJobOffer("job-1", recruiter, workplaceType: WorkplaceType.Remote, isActive: true),
            CreateJobOffer("job-2", recruiter, workplaceType: WorkplaceType.OnSite, isActive: true)
        );
        await _dbContext.SaveChangesAsync();

        var result = await _sut.GetAllAsync(new JobOfferFilter { WorkplaceType = WorkplaceType.Remote });

        Assert.Single(result!);
        Assert.Equal(WorkplaceType.Remote, result![0].WorkplaceType);
    }

    [Fact]
    public async Task GetAllAsync_WhenNoActiveOffers_ReturnsEmptyList()
    {
        var recruiter = CreateRecruiter("rec-1");
        await _dbContext.Recruiters.AddAsync(recruiter);
        await _dbContext.JobOffers.AddAsync(CreateJobOffer("job-1", recruiter, isActive: false));
        await _dbContext.SaveChangesAsync();

        var result = await _sut.GetAllAsync(new JobOfferFilter());

        Assert.NotNull(result);
        Assert.Empty(result!);
    }

    #endregion

    #region GetAllByRecruiterAsync

    [Fact]
    public async Task GetAllByRecruiterAsync_ReturnsOnlyOffersForSpecificRecruiter()
    {
        var recruiter1 = CreateRecruiter("rec-1");
        var recruiter2 = CreateRecruiter("rec-2");
        await _dbContext.Recruiters.AddRangeAsync(recruiter1, recruiter2);
        await _dbContext.JobOffers.AddRangeAsync(
            CreateJobOffer("job-1", recruiter1, isActive: true),
            CreateJobOffer("job-2", recruiter1, isActive: true),
            CreateJobOffer("job-3", recruiter2, isActive: true)
        );
        await _dbContext.SaveChangesAsync();

        var result = await _sut.GetAllByRecruiterAsync("rec-1");

        Assert.Equal(2, result!.Count);
        Assert.All(result, j => Assert.Equal("rec-1", j.RecruiterId));
    }

    [Fact]
    public async Task GetAllByRecruiterAsync_IncludesJobApplications()
    {
        var recruiter = CreateRecruiter("rec-1");
        var talent = CreateTalent("talent-1");
        var jobOffer = CreateJobOffer("job-1", recruiter, isActive: true);
        var application = new JobApplication
        {
            Id = "app-1",
            JobOfferId = "job-1",
            JobOffer = jobOffer,
            TalentId = "talent-1",
            Talent = talent
        };
        await _dbContext.Recruiters.AddAsync(recruiter);
        await _dbContext.Talents.AddAsync(talent);
        await _dbContext.JobOffers.AddAsync(jobOffer);
        await _dbContext.JobApplications.AddAsync(application);
        await _dbContext.SaveChangesAsync();

        var result = await _sut.GetAllByRecruiterAsync("rec-1");

        Assert.Single(result![0].JobApplications);
    }

    [Fact]
    public async Task GetAllByRecruiterAsync_WhenNoOffers_ReturnsEmptyList()
    {
        var result = await _sut.GetAllByRecruiterAsync("rec-ghost");

        Assert.NotNull(result);
        Assert.Empty(result!);
    }

    #endregion

    #region GetAllByCompanyAsync

    [Fact]
    public async Task GetAllByCompanyAsync_ReturnsOnlyOffersForSpecificCompany()
    {
        var company1 = new Company { Id = "co-1", Name = "Acme", Phone="123123", Address="123 Street" };
        var company2 = new Company { Id = "co-2", Name = "Other", Phone = "123123", Address = "123 Street" };
        var recruiter1 = CreateRecruiter("rec-1", companyId: "co-1");
        var recruiter2 = CreateRecruiter("rec-2", companyId: "co-2");
        await _dbContext.Companies.AddRangeAsync(company1, company2);
        await _dbContext.Recruiters.AddRangeAsync(recruiter1, recruiter2);
        await _dbContext.JobOffers.AddRangeAsync(
            CreateJobOffer("job-1", recruiter1, isActive: true),
            CreateJobOffer("job-2", recruiter2, isActive: true)
        );
        await _dbContext.SaveChangesAsync();

        var result = await _sut.GetAllByCompanyAsync("co-1");

        Assert.Single(result!);
        Assert.Equal("rec-1", result![0].RecruiterId);
    }

    #endregion

    #region GetByIdAsync

    [Fact]
    public async Task GetByIdAsync_WhenExists_ReturnsJobOfferWithIncludes()
    {
        var recruiter = CreateRecruiter("rec-1");
        var talent = CreateTalent("talent-1");
        var jobOffer = CreateJobOffer("job-1", recruiter, isActive: true);
        var application = new JobApplication
        {
            Id = "app-1",
            JobOfferId = "job-1",
            JobOffer = jobOffer,
            TalentId = "talent-1",
            Talent = talent
        };
        await _dbContext.Recruiters.AddAsync(recruiter);
        await _dbContext.Talents.AddAsync(talent);
        await _dbContext.JobOffers.AddAsync(jobOffer);
        await _dbContext.JobApplications.AddAsync(application);
        await _dbContext.SaveChangesAsync();

        var result = await _sut.GetByIdAsync("job-1");

        Assert.NotNull(result);
        Assert.Equal("job-1", result!.Id);
        Assert.Single(result.JobApplications);
        Assert.NotNull(result.JobApplications[0].Talent);
    }

    [Fact]
    public async Task GetByIdAsync_WhenNotFound_ReturnsNull()
    {
        var result = await _sut.GetByIdAsync("ghost");

        Assert.Null(result);
    }

    #endregion

    #region CreateAsync

    [Fact]
    public async Task CreateAsync_PersistsJobOfferAndReturnsTrue()
    {
        var recruiter = CreateRecruiter("rec-1");
        await _dbContext.Recruiters.AddAsync(recruiter);
        await _dbContext.SaveChangesAsync();

        var jobOffer = CreateJobOffer("job-1", recruiter, isActive: true);
        var result = await _sut.CreateAsync(jobOffer);

        Assert.True(result);
        var saved = await _dbContext.JobOffers.FindAsync("job-1");
        Assert.NotNull(saved);
    }

    #endregion

    #region UpdateAsync

    [Fact]
    public async Task UpdateAsync_WhenJobOfferExists_UpdatesAndReturnsTrue()
    {
        var recruiter = CreateRecruiter("rec-1");
        var jobOffer = CreateJobOffer("job-1", recruiter, isActive: true);
        await _dbContext.Recruiters.AddAsync(recruiter);
        await _dbContext.JobOffers.AddAsync(jobOffer);
        await _dbContext.SaveChangesAsync();

        _dbContext.Entry(jobOffer).State = EntityState.Detached;
        jobOffer.Title = "Updated Title";
        var result = await _sut.UpdateAsync(jobOffer);

        Assert.True(result);
        var updated = await _dbContext.JobOffers.FindAsync("job-1");
        Assert.Equal("Updated Title", updated!.Title);
    }

    #endregion

    #region DeleteAsync

    [Fact]
    public async Task DeleteAsync_WhenExists_RemovesAndReturnsTrue()
    {
        var recruiter = CreateRecruiter("rec-1");
        var jobOffer = CreateJobOffer("job-1", recruiter, isActive: true);
        await _dbContext.Recruiters.AddAsync(recruiter);
        await _dbContext.JobOffers.AddAsync(jobOffer);
        await _dbContext.SaveChangesAsync();

        var result = await _sut.DeleteAsync("job-1");

        Assert.True(result);
        Assert.Null(await _dbContext.JobOffers.FindAsync("job-1"));
    }

    [Fact]
    public async Task DeleteAsync_WhenNotFound_ReturnsFalse()
    {
        var result = await _sut.DeleteAsync("ghost");

        Assert.False(result);
    }

    #endregion

    #region BookmarkAsync / UnBookmarkAsync / IsBookmarkedAsync

    [Fact]
    public async Task BookmarkAsync_WhenBothExist_CreatesBookmarkAndReturnsTrue()
    {
        var recruiter = CreateRecruiter("rec-1");
        var talent = CreateTalent("talent-1");
        var jobOffer = CreateJobOffer("job-1", recruiter, isActive: true);
        await _dbContext.Recruiters.AddAsync(recruiter);
        await _dbContext.Talents.AddAsync(talent);
        await _dbContext.JobOffers.AddAsync(jobOffer);
        await _dbContext.SaveChangesAsync();

        var bookmark = new Bookmark { Id = "bm-1", TalentId = "talent-1", JobOfferId = "job-1" };
        var result = await _sut.BookmarkAsync(bookmark);

        Assert.True(result);
        Assert.Equal(1, await _dbContext.Bookmarks.CountAsync());
    }

    [Fact]
    public async Task BookmarkAsync_WhenJobOfferDoesNotExist_ThrowsException()
    {
        var talent = CreateTalent("talent-1");
        await _dbContext.Talents.AddAsync(talent);
        await _dbContext.SaveChangesAsync();

        var bookmark = new Bookmark { Id = "bm-1", TalentId = "talent-1", JobOfferId = "ghost" };

        await Assert.ThrowsAsync<Exception>(() => _sut.BookmarkAsync(bookmark));
    }

    [Fact]
    public async Task UnBookmarkAsync_WhenBookmarkExists_RemovesAndReturnsTrue()
    {
        var recruiter = CreateRecruiter("rec-1");
        var talent = CreateTalent("talent-1");
        var jobOffer = CreateJobOffer("job-1", recruiter, isActive: true);
        var bookmark = new Bookmark { Id = "bm-1", TalentId = "talent-1", JobOfferId = "job-1", Talent = talent, JobOffer = jobOffer };
        await _dbContext.Recruiters.AddAsync(recruiter);
        await _dbContext.Talents.AddAsync(talent);
        await _dbContext.JobOffers.AddAsync(jobOffer);
        await _dbContext.Bookmarks.AddAsync(bookmark);
        await _dbContext.SaveChangesAsync();

        var result = await _sut.UnBookmarkAsync(new Bookmark { TalentId = "talent-1", JobOfferId = "job-1" });

        Assert.True(result);
        Assert.Equal(0, await _dbContext.Bookmarks.CountAsync());
    }

    [Fact]
    public async Task UnBookmarkAsync_WhenBookmarkDoesNotExist_ReturnsFalse()
    {
        var result = await _sut.UnBookmarkAsync(new Bookmark { TalentId = "talent-1", JobOfferId = "ghost" });

        Assert.False(result);
    }

    [Fact]
    public async Task IsBookmarkedAsync_WhenBookmarkExists_ReturnsTrue()
    {
        var recruiter = CreateRecruiter("rec-1");
        var talent = CreateTalent("talent-1");
        var jobOffer = CreateJobOffer("job-1", recruiter, isActive: true);
        var bookmark = new Bookmark { Id = "bm-1", TalentId = "talent-1", JobOfferId = "job-1", Talent = talent, JobOffer = jobOffer };
        await _dbContext.Recruiters.AddAsync(recruiter);
        await _dbContext.Talents.AddAsync(talent);
        await _dbContext.JobOffers.AddAsync(jobOffer);
        await _dbContext.Bookmarks.AddAsync(bookmark);
        await _dbContext.SaveChangesAsync();

        var result = await _sut.IsBookmarkedAsync("job-1", "talent-1");

        Assert.True(result);
    }

    [Fact]
    public async Task IsBookmarkedAsync_WhenBookmarkDoesNotExist_ReturnsFalse()
    {
        var result = await _sut.IsBookmarkedAsync("job-1", "talent-1");

        Assert.False(result);
    }

    #endregion

    #region Helpers

    private static Recruiter CreateRecruiter(string id, string? companyId = null) => new()
    {
        Id = id,
        FirstName = "Rec",
        LastName = "Ruiter",
        CompanyId = companyId,
        User = new User { Id = id, Email = $"{id}@test.com", Role = UserRole.Recruiter }
    };

    private static Talent CreateTalent(string id) => new()
    {
        Id = id,
        FirstName = "John",
        LastName = "Doe",
        User = new User { Id = id, Email = $"{id}@test.com", Role = UserRole.Talent }
    };

    private static JobOffer CreateJobOffer(
        string id,
        Recruiter recruiter,
        string title = "Developer",
        string? companyName = null,
        JobType type = JobType.FullTime,
        WorkplaceType workplaceType = WorkplaceType.OnSite,
        bool isActive = true) => new()
        {
            Id = id,
            Title = title,
            Description = "A great job",
            Location = "Montreal",
            CompanyName = companyName,
            Type = type,
            WorkplaceType = workplaceType,
            IsActive = isActive,
            RecruiterId = recruiter.Id,
            Recruiter = recruiter
        };

    #endregion
}
using Microsoft.EntityFrameworkCore;
using SeekMatch.Core.Entities;
using SeekMatch.Core.Enums;
using SeekMatch.Infrastructure;
using SeekMatch.Infrastructure.Repositories;

namespace SeekMatch.Tests.Infrastructure;

public class TalentRepositoryTests : IDisposable
{
    private readonly SeekMatchDbContext _dbContext;
    private readonly TalentRepository _sut;

    public TalentRepositoryTests()
    {
        var options = new DbContextOptionsBuilder<SeekMatchDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _dbContext = new SeekMatchDbContext(options);
        _sut = new TalentRepository(_dbContext);
    }

    public void Dispose() => _dbContext.Dispose();

    #region CreateAsync

    [Fact]
    public async Task CreateAsync_PersistsTalentToDatabase()
    {
        var talent = CreateTalent("user-1");

        await _sut.CreateAsync(talent);

        var saved = await _dbContext.Talents.FindAsync("user-1");
        Assert.NotNull(saved);
        Assert.Equal("John", saved!.FirstName);
        Assert.Equal("Doe", saved.LastName);
    }

    [Fact]
    public async Task CreateAsync_MultipleTalents_AllArePersisted()
    {
        var talent1 = CreateTalent("user-1");
        var talent2 = CreateTalent("user-2", "Jane", "Smith");

        await _sut.CreateAsync(talent1);
        await _sut.CreateAsync(talent2);

        var count = await _dbContext.Talents.CountAsync();
        Assert.Equal(2, count);
    }

    #endregion

    #region GetAsync

    [Fact]
    public async Task GetAsync_WhenTalentExists_ReturnsTalentWithIncludes()
    {
        var talent = CreateTalent("user-1");
        talent.Educations.Add(new Education
        {
            Id = "edu-1",
            Institution = "McGill",
            StartYear = 2019,
            StartMonth = 9,
            Talent = talent,
            TalentId = "user-1"
        });
        talent.Experiences.Add(new Experience
        {
            Id = "exp-1",
            CompanyName = "Acme",
            StartYear = 2022,
            StartMonth = 1,
            Talent = talent,
            TalentId = "user-1"
        });
        await _dbContext.Talents.AddAsync(talent);
        await _dbContext.SaveChangesAsync();

        var result = await _sut.GetAsync("user-1");

        Assert.NotNull(result);
        Assert.Single(result!.Educations);
        Assert.Single(result.Experiences);
        Assert.Equal("McGill", result.Educations[0].Institution);
        Assert.Equal("Acme", result.Experiences[0].CompanyName);
    }

    [Fact]
    public async Task GetAsync_WhenTalentNotFound_ReturnsNull()
    {
        var result = await _sut.GetAsync("ghost");

        Assert.Null(result);
    }

    [Fact]
    public async Task GetAsync_OrdersEducationsByStartYearDescending()
    {
        var talent = CreateTalent("user-1");
        talent.Educations.AddRange(new[]
        {
            new Education { Id = "edu-1", Institution = "Old School", StartYear = 2015, StartMonth = 9, Talent = talent, TalentId = "user-1" },
            new Education { Id = "edu-2", Institution = "New School", StartYear = 2020, StartMonth = 9, Talent = talent, TalentId = "user-1" },
            new Education { Id = "edu-3", Institution = "Mid School", StartYear = 2018, StartMonth = 9, Talent = talent, TalentId = "user-1" }
        });
        await _dbContext.Talents.AddAsync(talent);
        await _dbContext.SaveChangesAsync();

        var result = await _sut.GetAsync("user-1");

        Assert.Equal("New School", result!.Educations[0].Institution);
        Assert.Equal("Mid School", result.Educations[1].Institution);
        Assert.Equal("Old School", result.Educations[2].Institution);
    }

    [Fact]
    public async Task GetAsync_OrdersExperiencesByStartYearDescending()
    {
        var talent = CreateTalent("user-1");
        talent.Experiences.AddRange(new[]
        {
            new Experience { Id = "exp-1", CompanyName = "First Job", StartYear = 2016, StartMonth = 1, Talent = talent, TalentId = "user-1" },
            new Experience { Id = "exp-2", CompanyName = "Latest Job", StartYear = 2023, StartMonth = 3, Talent = talent, TalentId = "user-1" },
            new Experience { Id = "exp-3", CompanyName = "Mid Job", StartYear = 2019, StartMonth = 6, Talent = talent, TalentId = "user-1" }
        });
        await _dbContext.Talents.AddAsync(talent);
        await _dbContext.SaveChangesAsync();

        var result = await _sut.GetAsync("user-1");

        Assert.Equal("Latest Job", result!.Experiences[0].CompanyName);
        Assert.Equal("Mid Job", result.Experiences[1].CompanyName);
        Assert.Equal("First Job", result.Experiences[2].CompanyName);
    }

    [Fact]
    public async Task GetAsync_WhenSameStartYear_OrdersByStartMonthDescending()
    {
        var talent = CreateTalent("user-1");
        talent.Educations.AddRange(new[]
        {
            new Education { Id = "edu-1", Institution = "Jan School", StartYear = 2020, StartMonth = 1, Talent = talent, TalentId = "user-1" },
            new Education { Id = "edu-2", Institution = "Sep School", StartYear = 2020, StartMonth = 9, Talent = talent, TalentId = "user-1" }
        });
        await _dbContext.Talents.AddAsync(talent);
        await _dbContext.SaveChangesAsync();

        var result = await _sut.GetAsync("user-1");

        Assert.Equal("Sep School", result!.Educations[0].Institution);
        Assert.Equal("Jan School", result.Educations[1].Institution);
    }

    #endregion

    #region SaveChangesAsync

    [Fact]
    public async Task SaveChangesAsync_WhenTalentIsUpdated_ReturnsTrueAndPersistsChanges()
    {
        var talent = CreateTalent("user-1");
        await _dbContext.Talents.AddAsync(talent);
        await _dbContext.SaveChangesAsync();

        talent.FirstName = "UpdatedName";
        talent.ProfileTitle = "Senior Dev";

        var result = await _sut.SaveChangesAsync(talent);

        var updated = await _dbContext.Talents.FindAsync("user-1");
        Assert.True(result);
        Assert.Equal("UpdatedName", updated!.FirstName);
        Assert.Equal("Senior Dev", updated.ProfileTitle);
    }

    [Fact]
    public async Task SaveChangesAsync_UpdatesCorrectTalent_DoesNotAffectOthers()
    {
        var talent1 = CreateTalent("user-1");
        var talent2 = CreateTalent("user-2", "Jane", "Smith");
        await _dbContext.Talents.AddRangeAsync(talent1, talent2);
        await _dbContext.SaveChangesAsync();

        talent1.FirstName = "Updated";
        await _sut.SaveChangesAsync(talent1);

        var unchanged = await _dbContext.Talents.FindAsync("user-2");
        Assert.Equal("Jane", unchanged!.FirstName);
    }

    #endregion

    #region GetBookmarks

    [Fact]
    public async Task GetBookmarks_WhenBookmarksExist_ReturnsBookmarksWithJobOfferIncluded()
    {
        var talent = CreateTalent("user-1");
        var recruiter = CreateRecruiter("rec-1");
        var jobOffer = new JobOffer
        {
            Id = "job-1",
            Title = "Dev",
            Description = "Desc",
            Location = "MTL",
            RecruiterId = "rec-1",
            Recruiter = recruiter
        };
        var bookmark = new Bookmark { Id = "bm-1", TalentId = "user-1", JobOfferId = "job-1", Talent = talent, JobOffer = jobOffer };

        await _dbContext.Talents.AddAsync(talent);
        await _dbContext.Recruiters.AddAsync(recruiter);
        await _dbContext.JobOffers.AddAsync(jobOffer);
        await _dbContext.Bookmarks.AddAsync(bookmark);
        await _dbContext.SaveChangesAsync();

        var result = await _sut.GetBookmarks("user-1");

        Assert.NotNull(result);
        Assert.Single(result!);
        Assert.Equal("job-1", result![0].JobOfferId);
        Assert.NotNull(result[0].JobOffer);
        Assert.Equal("Dev", result[0].JobOffer!.Title);
    }

    [Fact]
    public async Task GetBookmarks_WhenNoBookmarks_ReturnsEmptyList()
    {
        var talent = CreateTalent("user-1");
        await _dbContext.Talents.AddAsync(talent);
        await _dbContext.SaveChangesAsync();

        var result = await _sut.GetBookmarks("user-1");

        Assert.NotNull(result);
        Assert.Empty(result!);
    }

    [Fact]
    public async Task GetBookmarks_OnlyReturnsBookmarksForSpecificTalent()
    {
        var talent1 = CreateTalent("user-1");
        var talent2 = CreateTalent("user-2", "Jane", "Smith");
        var recruiter = CreateRecruiter("rec-1");
        var jobOffer1 = new JobOffer { Id = "job-1", Title = "Dev", Description = "D", Location = "L", RecruiterId = "rec-1", Recruiter = recruiter };
        var jobOffer2 = new JobOffer { Id = "job-2", Title = "QA", Description = "D", Location = "L", RecruiterId = "rec-1", Recruiter = recruiter };
        var bookmark1 = new Bookmark { Id = "bm-1", TalentId = "user-1", JobOfferId = "job-1", Talent = talent1, JobOffer = jobOffer1 };
        var bookmark2 = new Bookmark { Id = "bm-2", TalentId = "user-2", JobOfferId = "job-2", Talent = talent2, JobOffer = jobOffer2 };

        await _dbContext.Talents.AddRangeAsync(talent1, talent2);
        await _dbContext.Recruiters.AddAsync(recruiter);
        await _dbContext.JobOffers.AddRangeAsync(jobOffer1, jobOffer2);
        await _dbContext.Bookmarks.AddRangeAsync(bookmark1, bookmark2);
        await _dbContext.SaveChangesAsync();

        var result = await _sut.GetBookmarks("user-1");

        Assert.Single(result!);
        Assert.Equal("job-1", result![0].JobOfferId);
    }

    #endregion

    #region Helpers

    private static Talent CreateTalent(string id, string firstName = "John", string lastName = "Doe") => new()
    {
        Id = id,
        FirstName = firstName,
        LastName = lastName,
        User = new User { Id = id, Email = $"{firstName.ToLower()}@test.com", Role = UserRole.Talent }
    };

    private static Recruiter CreateRecruiter(string id) => new()
    {
        Id = id,
        FirstName = "Rec",
        LastName = "Ruiter",
        User = new User { Id = id, Email = "rec@test.com", Role = UserRole.Recruiter }
    };

    #endregion
}
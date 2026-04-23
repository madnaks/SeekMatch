using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Moq;
using SeekMatch.Application.DTOs.Recruiter;
using SeekMatch.Application.DTOs.Representative;
using SeekMatch.Application.Interfaces;
using SeekMatch.Application.Services;
using SeekMatch.Core.Entities;
using SeekMatch.Core.Enums;
using SeekMatch.Infrastructure.Interfaces;

namespace SeekMatch.Tests.Application.Recruiter;

public class JobOfferServiceTests
{
    private readonly Mock<IJobOfferRepository> _jobOfferRepositoryMock;
    private readonly Mock<IMapper> _mapperMock;
    private readonly Mock<UserManager<User>> _userManagerMock;
    private readonly Mock<IRepresentativeService> _representativeServiceMock;
    private readonly Mock<IRecruiterService> _recruiterServiceMock;
    private readonly JobOfferService _sut;

    public JobOfferServiceTests()
    {
        _jobOfferRepositoryMock = new Mock<IJobOfferRepository>();
        _mapperMock = new Mock<IMapper>();
        _representativeServiceMock = new Mock<IRepresentativeService>();
        _recruiterServiceMock = new Mock<IRecruiterService>();

        var store = new Mock<IUserStore<User>>();
        _userManagerMock = new Mock<UserManager<User>>(
            store.Object, null!, null!, null!, null!, null!, null!, null!, null!);

        _sut = new JobOfferService(
            _jobOfferRepositoryMock.Object,
            _mapperMock.Object,
            _userManagerMock.Object,
            _representativeServiceMock.Object,
            _recruiterServiceMock.Object);
    }

    // ─── GetAllAsync ────────────────────────────────────────────────────────────

    [Fact]
    public async Task GetAllAsync_ReturnsMappedJobOffers()
    {
        var filters = new JobOfferFilterDto();
        var filter = new JobOfferFilter();
        var jobOffers = new List<JobOffer> { CreateJobOffer() };
        var dtos = new List<JobOfferDto> { new() { Title = "Dev", Description = "Desc", Location = "MTL" } };

        _mapperMock.Setup(m => m.Map<JobOfferFilter>(filters)).Returns(filter);
        _jobOfferRepositoryMock.Setup(r => r.GetAllAsync(filter)).ReturnsAsync(jobOffers);
        _mapperMock.Setup(m => m.Map<IList<JobOfferDto>>(jobOffers)).Returns(dtos);

        var result = await _sut.GetAllAsync(filters);

        Assert.NotNull(result);
        Assert.Single(result!);
    }

    [Fact]
    public async Task GetAllAsync_WhenRepositoryReturnsNull_ReturnsNull()
    {
        var filters = new JobOfferFilterDto();
        _mapperMock.Setup(m => m.Map<JobOfferFilter>(filters)).Returns(new JobOfferFilter());
        _jobOfferRepositoryMock.Setup(r => r.GetAllAsync(It.IsAny<JobOfferFilter>())).ReturnsAsync((IList<JobOffer>?)null);
        _mapperMock.Setup(m => m.Map<IList<JobOfferDto>>(null)).Returns((IList<JobOfferDto>?)null!);

        var result = await _sut.GetAllAsync(filters);

        Assert.Null(result);
    }

    // ─── GetByIdAsync ────────────────────────────────────────────────────────────

    [Fact]
    public async Task GetByIdAsync_WhenFound_ReturnsMappedDto()
    {
        var jobOffer = CreateJobOffer();
        var dto = new JobOfferDto { Title = "Dev", Description = "Desc", Location = "MTL" };

        _jobOfferRepositoryMock.Setup(r => r.GetByIdAsync("job-1")).ReturnsAsync(jobOffer);
        _mapperMock.Setup(m => m.Map<JobOfferDto>(jobOffer)).Returns(dto);

        var result = await _sut.GetByIdAsync("job-1");

        Assert.NotNull(result);
        Assert.Equal("Dev", result!.Title);
    }

    [Fact]
    public async Task GetByIdAsync_WhenNotFound_ReturnsNull()
    {
        _jobOfferRepositoryMock.Setup(r => r.GetByIdAsync("missing")).ReturnsAsync((JobOffer?)null);
        _mapperMock.Setup(m => m.Map<JobOfferDto>(null)).Returns((JobOfferDto?)null!);

        var result = await _sut.GetByIdAsync("missing");

        Assert.Null(result);
    }

    // ─── GetAllByRecruiterAsync ──────────────────────────────────────────────────

    [Fact]
    public async Task GetAllByRecruiterAsync_ReturnsDtosWithStats()
    {
        var app = new JobApplicationDto { Status = JobApplicationStatus.Submitted };
        var jobOfferDto = new JobOfferDto
        {
            Title = "Dev",
            Description = "Desc",
            Location = "MTL",
            JobApplications = new List<JobApplicationDto> { app }
        };
        var dtos = new List<JobOfferDto> { jobOfferDto };

        _jobOfferRepositoryMock.Setup(r => r.GetAllByRecruiterAsync("recruiter-1"))
            .ReturnsAsync(new List<JobOffer>());
        _mapperMock.Setup(m => m.Map<IList<JobOfferDto>>(It.IsAny<IList<JobOffer>>())).Returns(dtos);

        var result = await _sut.GetAllByRecruiterAsync("recruiter-1");

        Assert.NotNull(result);
        Assert.NotNull(result![0].Stats);
        Assert.Equal(1, result[0].Stats!.Total);
        Assert.Equal(1, result[0].Stats!.Submitted);
    }

    // ─── GetAllByCompanyAsync ────────────────────────────────────────────────────

    [Fact]
    public async Task GetAllByCompanyAsync_WhenUserIsRepresentative_ReturnsJobOffers()
    {
        var user = new User { Role = UserRole.Representative };
        var companyDto = new CompanyDto()
        {
            Name = "Tesla",
            Phone = "123",
            Address = "123 Street",
        };
        var representativeDto = new RepresentativeDto { CompanyId = "company-1", FirstName = "Harry", LastName="Potter", CompanyDto = companyDto };
        var dtos = new List<JobOfferDto>();

        _userManagerMock.Setup(u => u.FindByIdAsync("user-1")).ReturnsAsync(user);
        _representativeServiceMock.Setup(s => s.GetAsync("user-1")).ReturnsAsync(representativeDto);
        _jobOfferRepositoryMock.Setup(r => r.GetAllByCompanyAsync("company-1")).ReturnsAsync(new List<JobOffer>());
        _mapperMock.Setup(m => m.Map<IList<JobOfferDto>>(It.IsAny<IList<JobOffer>>())).Returns(dtos);

        var result = await _sut.GetAllByCompanyAsync("user-1");

        Assert.NotNull(result);
    }

    [Fact]
    public async Task GetAllByCompanyAsync_WhenUserIsCompanyRecruiter_ReturnsJobOffers()
    {
        var user = new User { Role = UserRole.CompanyRecruiter };
        var companyDto = new CompanyDto()
        {
            Name = "Tesla",
            Phone = "123",
            Address = "123 Street",
        };
        var recruiterDto = new RecruiterDto { CompanyId = "company-2", FirstName = "Harry", LastName = "Potter", Email = "harry.potter@gmail.com", CompanyDto = companyDto };
        var dtos = new List<JobOfferDto>();

        _userManagerMock.Setup(u => u.FindByIdAsync("user-2")).ReturnsAsync(user);
        _recruiterServiceMock.Setup(s => s.GetAsync("user-2")).ReturnsAsync(recruiterDto);
        _jobOfferRepositoryMock.Setup(r => r.GetAllByCompanyAsync("company-2")).ReturnsAsync(new List<JobOffer>());
        _mapperMock.Setup(m => m.Map<IList<JobOfferDto>>(It.IsAny<IList<JobOffer>>())).Returns(dtos);

        var result = await _sut.GetAllByCompanyAsync("user-2");

        Assert.NotNull(result);
    }

    [Fact]
    public async Task GetAllByCompanyAsync_WhenUserNotFound_ReturnsNull()
    {
        _userManagerMock.Setup(u => u.FindByIdAsync("ghost")).ReturnsAsync((User?)null);

        var result = await _sut.GetAllByCompanyAsync("ghost");

        Assert.Null(result);
    }

    [Fact]
    public async Task GetAllByCompanyAsync_WhenRepresentativeNotFound_ReturnsNull()
    {
        var user = new User { Role = UserRole.Representative };
        _userManagerMock.Setup(u => u.FindByIdAsync("user-1")).ReturnsAsync(user);
        _representativeServiceMock.Setup(s => s.GetAsync("user-1")).ReturnsAsync((RepresentativeDto?)null);

        var result = await _sut.GetAllByCompanyAsync("user-1");

        Assert.Null(result);
    }

    // ─── CreateAsync ─────────────────────────────────────────────────────────────

    [Fact]
    public async Task CreateAsync_WhenSuccessful_ReturnsTrue()
    {
        var dto = new JobOfferDto { Title = "Dev", Description = "Desc", Location = "MTL" };
        var entity = CreateJobOffer();

        _mapperMock.Setup(m => m.Map<JobOffer>(dto)).Returns(entity);
        _jobOfferRepositoryMock.Setup(r => r.CreateAsync(It.IsAny<JobOffer>())).ReturnsAsync(true);

        var result = await _sut.CreateAsync(dto, "recruiter-1");

        Assert.True(result);
        _jobOfferRepositoryMock.Verify(r => r.CreateAsync(It.Is<JobOffer>(j =>
            j.RecruiterId == "recruiter-1" && !string.IsNullOrEmpty(j.Id))), Times.Once);
    }

    [Fact]
    public async Task CreateAsync_WhenRepositoryFails_ReturnsFalse()
    {
        var dto = new JobOfferDto { Title = "Dev", Description = "Desc", Location = "MTL" };
        _mapperMock.Setup(m => m.Map<JobOffer>(dto)).Returns(CreateJobOffer());
        _jobOfferRepositoryMock.Setup(r => r.CreateAsync(It.IsAny<JobOffer>())).ReturnsAsync(false);

        var result = await _sut.CreateAsync(dto, "recruiter-1");

        Assert.False(result);
    }

    // ─── UpdateAsync ─────────────────────────────────────────────────────────────

    [Fact]
    public async Task UpdateAsync_WhenJobOfferExists_ReturnsTrue()
    {
        var dto = new JobOfferDto { Id = "job-1", Title = "Updated", Description = "Desc", Location = "MTL" };
        var existing = CreateJobOffer();

        _jobOfferRepositoryMock.Setup(r => r.GetByIdAsync("job-1")).ReturnsAsync(existing);
        _jobOfferRepositoryMock.Setup(r => r.UpdateAsync(existing)).ReturnsAsync(true);

        var result = await _sut.UpdateAsync(dto);

        Assert.True(result);
        _mapperMock.Verify(m => m.Map(dto, existing), Times.Once);
    }

    [Fact]
    public async Task UpdateAsync_WhenJobOfferNotFound_ThrowsException()
    {
        var dto = new JobOfferDto { Id = "missing", Title = "X", Description = "D", Location = "L" };
        _jobOfferRepositoryMock.Setup(r => r.GetByIdAsync("missing")).ReturnsAsync((JobOffer?)null);

        await Assert.ThrowsAsync<Exception>(() => _sut.UpdateAsync(dto));
    }

    [Fact]
    public async Task UpdateAsync_WhenDtoIsNull_ReturnsFalse()
    {
        var result = await _sut.UpdateAsync(null!);

        Assert.False(result);
    }

    [Fact]
    public async Task UpdateAsync_WhenIdIsEmpty_ReturnsFalse()
    {
        var dto = new JobOfferDto { Id = "", Title = "X", Description = "D", Location = "L" };

        var result = await _sut.UpdateAsync(dto);

        Assert.False(result);
    }

    // ─── DeleteAsync ─────────────────────────────────────────────────────────────

    [Fact]
    public async Task DeleteAsync_WhenSuccessful_ReturnsTrue()
    {
        _jobOfferRepositoryMock.Setup(r => r.DeleteAsync("job-1")).ReturnsAsync(true);

        var result = await _sut.DeleteAsync("job-1");

        Assert.True(result);
    }

    // ─── BookmarkAsync / UnBookmarkAsync ─────────────────────────────────────────

    [Fact]
    public async Task BookmarkAsync_CreatesCorrectBookmarkAndReturnsTrue()
    {
        _jobOfferRepositoryMock
            .Setup(r => r.BookmarkAsync(It.Is<Bookmark>(b => b.JobOfferId == "job-1" && b.TalentId == "talent-1")))
            .ReturnsAsync(true);

        var result = await _sut.BookmarkAsync("job-1", "talent-1");

        Assert.True(result);
    }

    [Fact]
    public async Task UnBookmarkAsync_RemovesCorrectBookmarkAndReturnsTrue()
    {
        _jobOfferRepositoryMock
            .Setup(r => r.UnBookmarkAsync(It.Is<Bookmark>(b => b.JobOfferId == "job-1" && b.TalentId == "talent-1")))
            .ReturnsAsync(true);

        var result = await _sut.UnBookmarkAsync("job-1", "talent-1");

        Assert.True(result);
    }

    [Fact]
    public async Task IsBookmarkedAsync_ReturnsTrueWhenBookmarked()
    {
        _jobOfferRepositoryMock.Setup(r => r.IsBookmarkedAsync("job-1", "talent-1")).ReturnsAsync(true);

        var result = await _sut.IsBookmarkedAsync("job-1", "talent-1");

        Assert.True(result);
    }

    // ─── Helpers ─────────────────────────────────────────────────────────────────

    private static JobOffer CreateJobOffer() => new()
    {
        Id = "job-1",
        Title = "Developer",
        Description = "Develop things",
        Location = "Montreal",
        RecruiterId = "recruiter-1",
        Recruiter = new Core.Entities.Recruiter { Id = "recruiter-1", FirstName = "John", LastName = "Doe", User = new User() }
    };
}
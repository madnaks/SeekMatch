using AutoMapper;
using Moq;
using SeekMatch.Application.DTOs.Recruiter;
using SeekMatch.Application.Interfaces;
using SeekMatch.Application.Services;
using SeekMatch.Core.Entities;
using SeekMatch.Infrastructure.Interfaces;
using System.Net;

namespace SeekMatch.Tests.Application.Recruiter;

public class JobApplicationServiceTests
{
    private readonly Mock<IJobApplicationRepository> _jobApplicationRepositoryMock;
    private readonly Mock<IJobOfferRepository> _jobOfferRepositoryMock;
    private readonly Mock<IEmailService> _emailServiceMock;
    private readonly Mock<IFileStorageService> _fileStorageServiceMock;
    private readonly Mock<INotificationService> _notificationServiceMock;
    private readonly Mock<IMapper> _mapperMock;
    private readonly JobApplicationService _sut;

    public JobApplicationServiceTests()
    {
        _jobApplicationRepositoryMock = new Mock<IJobApplicationRepository>();
        _jobOfferRepositoryMock = new Mock<IJobOfferRepository>();
        _emailServiceMock = new Mock<IEmailService>();
        _fileStorageServiceMock = new Mock<IFileStorageService>();
        _notificationServiceMock = new Mock<INotificationService>();
        _mapperMock = new Mock<IMapper>();

        _sut = new JobApplicationService(
            _jobApplicationRepositoryMock.Object,
            _jobOfferRepositoryMock.Object,
            _emailServiceMock.Object,
            _fileStorageServiceMock.Object,
            _notificationServiceMock.Object,
            _mapperMock.Object);
    }

    #region ApplyAsync

    [Fact]
    public async Task ApplyAsync_WhenNotAlreadyApplied_CreatesApplicationAndReturnsTrue()
    {
        _jobApplicationRepositoryMock
            .Setup(r => r.FindByTalentAndJobOfferAsync("talent-1", "job-1"))
            .ReturnsAsync((JobApplication?)null);
        _jobApplicationRepositoryMock
            .Setup(r => r.ApplyAsync(It.IsAny<JobApplication>()))
            .ReturnsAsync(true);

        var result = await _sut.ApplyAsync("talent-1", "job-1");

        Assert.True(result);
        _jobApplicationRepositoryMock.Verify(r => r.ApplyAsync(It.Is<JobApplication>(a =>
            a.TalentId == "talent-1" &&
            a.JobOfferId == "job-1" &&
            !string.IsNullOrEmpty(a.Id))), Times.Once);
    }

    [Fact]
    public async Task ApplyAsync_WhenAlreadyApplied_ThrowsException()
    {
        _jobApplicationRepositoryMock
            .Setup(r => r.FindByTalentAndJobOfferAsync("talent-1", "job-1"))
            .ReturnsAsync(new JobApplication { JobOfferId = "job-1" });

        await Assert.ThrowsAsync<Exception>(() => _sut.ApplyAsync("talent-1", "job-1"));
    }

    #endregion

    #region ExpressApplyAsync

    [Fact]
    public async Task ExpressApplyAsync_WhenValid_SavesFileAndCreatesApplication()
    {
        var dto = new ExpressApplicationDto { Email = "john@test.com", FirstName = "John", LastName = "Doe" };
        var expressApp = new ExpressApplication { Email = "john@test.com", FirstName = "John", LastName = "Doe", JobApplicationId = "1" };
        var jobOffer = new JobOffer
        {
            Id = "job-1",
            Title = "Dev",
            Description = "Desc",
            Location = "MTL",
            RecruiterId = "r-1",
            Recruiter = new Core.Entities.Recruiter { FirstName = "John", LastName = "Doe", User = new User() }
        };
        var cvStream = new MemoryStream(new byte[] { 1, 2, 3 });

        _mapperMock.Setup(m => m.Map<ExpressApplication>(dto)).Returns(expressApp);
        _jobApplicationRepositoryMock
            .Setup(r => r.FindByEmailAndExpressApplicationAsync("john@test.com", "job-1"))
            .ReturnsAsync((JobApplication?)null);
        _jobOfferRepositoryMock.Setup(r => r.GetByIdAsync("job-1")).ReturnsAsync(jobOffer);
        _fileStorageServiceMock.Setup(f => f.SaveFileAsync(cvStream, It.IsAny<string>())).ReturnsAsync("/uploads/cv.pdf");
        _jobApplicationRepositoryMock
            .Setup(r => r.ExpressApplyAsync(It.IsAny<JobApplication>(), It.IsAny<ExpressApplication>()))
            .ReturnsAsync(true);

        var result = await _sut.ExpressApplyAsync(dto, "job-1", cvStream, "cv.pdf");

        Assert.True(result);
        _emailServiceMock.Verify(e => e.SendExpressApplicationConfirmationAsync(expressApp, jobOffer), Times.Once);
    }

    [Fact]
    public async Task ExpressApplyAsync_WhenEmailAlreadyApplied_ThrowsException()
    {
        var dto = new ExpressApplicationDto { Email = "john@test.com", FirstName = "John", LastName = "Doe" };
        _mapperMock.Setup(m => m.Map<ExpressApplication>(dto))
            .Returns(new ExpressApplication { Email = "john@test.com", FirstName = "John", LastName = "Doe", JobApplicationId = "1" });
        _jobApplicationRepositoryMock
            .Setup(r => r.FindByEmailAndExpressApplicationAsync("john@test.com", "job-1"))
            .ReturnsAsync(new JobApplication { JobOfferId = "job-1" });

        await Assert.ThrowsAsync<Exception>(() =>
            _sut.ExpressApplyAsync(dto, "job-1", Stream.Null, "cv.pdf"));
    }

    [Fact]
    public async Task ExpressApplyAsync_WhenJobOfferNotFound_ThrowsException()
    {
        var dto = new ExpressApplicationDto { Email = "john@test.com", FirstName = "John", LastName = "Doe" };
        _mapperMock.Setup(m => m.Map<ExpressApplication>(dto))
            .Returns(new ExpressApplication { Email = "john@test.com", FirstName = "John", LastName = "Doe", JobApplicationId = "1" });
        _jobApplicationRepositoryMock
            .Setup(r => r.FindByEmailAndExpressApplicationAsync(It.IsAny<string>(), It.IsAny<string>()))
            .ReturnsAsync((JobApplication?)null);
        _jobOfferRepositoryMock.Setup(r => r.GetByIdAsync("missing")).ReturnsAsync((JobOffer?)null);

        await Assert.ThrowsAsync<Exception>(() =>
            _sut.ExpressApplyAsync(dto, "missing", Stream.Null, "cv.pdf"));
    }

    #endregion

    #region RejectAsync

    [Fact]
    public async Task RejectAsync_WhenTalentApplication_SendsNotification()
    {
        var jobApp = new JobApplication
        {
            Id = "app-1",
            JobOfferId = "job-1",
            TalentId = "talent-1",
            IsExpress = false
        };

        _jobApplicationRepositoryMock.Setup(r => r.RejectAsync("app-1", "Not a fit")).ReturnsAsync(true);
        _jobApplicationRepositoryMock.Setup(r => r.GetByIdAsync("app-1")).ReturnsAsync(jobApp);

        await _sut.RejectAsync("app-1", "Not a fit");

        _notificationServiceMock.Verify(n => n.CreateNotificationAsync("talent-1", "Not a fit"), Times.Once);
        _emailServiceMock.Verify(e => e.SendExpressApplicationRejectionAsync(It.IsAny<JobApplication>()), Times.Never);
    }

    [Fact]
    public async Task RejectAsync_WhenExpressApplication_SendsEmail()
    {
        var expressApp = new ExpressApplication { Email = "john@test.com", FirstName = "John", LastName = "Doe", JobApplicationId = "1" };
        var jobApp = new JobApplication
        {
            Id = "app-1",
            JobOfferId = "job-1",
            IsExpress = true,
            ExpressApplication = expressApp
        };

        _jobApplicationRepositoryMock.Setup(r => r.RejectAsync("app-1", "Not a fit")).ReturnsAsync(true);
        _jobApplicationRepositoryMock.Setup(r => r.GetByIdAsync("app-1")).ReturnsAsync(jobApp);

        await _sut.RejectAsync("app-1", "Not a fit");

        _emailServiceMock.Verify(e => e.SendExpressApplicationRejectionAsync(jobApp), Times.Once);
        _notificationServiceMock.Verify(n => n.CreateNotificationAsync(It.IsAny<string>(), It.IsAny<string>()), Times.Never);
    }

    #endregion

    #region DownloadResume

    [Fact]
    public async Task DownloadResume_WhenApplicationNotFound_ReturnsNotFound()
    {
        _jobApplicationRepositoryMock
            .Setup(r => r.GetByIdWithTalentDetailsAsync("app-1"))
            .ReturnsAsync((JobApplication?)null);

        var result = await _sut.DownloadResume("app-1");

        Assert.False(result.Success);
        Assert.Equal(HttpStatusCode.NotFound, result.StatusCode);
    }

    [Fact]
    public async Task DownloadResume_WhenTalentHasNoPrimaryResume_ReturnsNotFound()
    {
        var talent = new Core.Entities.Talent { FirstName = "John", LastName = "Doe", User = new User() };
        var jobApp = new JobApplication
        {
            Id = "app-1",
            JobOfferId = "job-1",
            IsExpress = false,
            Talent = talent
        };

        _jobApplicationRepositoryMock
            .Setup(r => r.GetByIdWithTalentDetailsAsync("app-1"))
            .ReturnsAsync(jobApp);

        var result = await _sut.DownloadResume("app-1");

        Assert.False(result.Success);
        Assert.Equal(HttpStatusCode.NotFound, result.StatusCode);
    }

    [Fact]
    public async Task DownloadResume_WhenExpressApplicationHasFile_ReturnsFileStream()
    {
        var stream = new MemoryStream(new byte[] { 1, 2, 3 });
        var expressApp = new ExpressApplication
        {
            Email = "john@test.com",
            FirstName = "John",
            LastName = "Doe",
            FilePath = "/uploads/cv.pdf",
            JobApplicationId = "1"
        };
        var jobApp = new JobApplication
        {
            Id = "app-1",
            JobOfferId = "job-1",
            IsExpress = true,
            ExpressApplication = expressApp
        };

        _jobApplicationRepositoryMock
            .Setup(r => r.GetByIdWithTalentDetailsAsync("app-1"))
            .ReturnsAsync(jobApp);
        _fileStorageServiceMock
            .Setup(f => f.OpenReadAsync("/uploads/cv.pdf"))
            .ReturnsAsync(stream);

        var result = await _sut.DownloadResume("app-1");

        Assert.True(result.Success);
        Assert.Equal("cv.pdf", result.Value!.FileName);
    }

    #endregion

    #region StatusTransitions

    [Fact]
    public async Task ShortList_WhenSuccessful_ReturnsTrue()
    {
        _jobApplicationRepositoryMock.Setup(r => r.ShortList("app-1")).ReturnsAsync(true);
        Assert.True(await _sut.ShortList("app-1"));
    }

    [Fact]
    public async Task Hire_WhenSuccessful_ReturnsTrue()
    {
        _jobApplicationRepositoryMock.Setup(r => r.Hire("app-1")).ReturnsAsync(true);
        Assert.True(await _sut.Hire("app-1"));
    }

    [Fact]
    public async Task DeleteAsync_WhenSuccessful_ReturnsTrue()
    {
        _jobApplicationRepositoryMock.Setup(r => r.DeleteAsync("app-1")).ReturnsAsync(true);
        Assert.True(await _sut.DeleteAsync("app-1"));
    }

    #endregion
}
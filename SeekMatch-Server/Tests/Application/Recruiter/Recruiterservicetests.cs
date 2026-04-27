using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Moq;
using SeekMatch.Application.DTOs.Recruiter;
using SeekMatch.Application.DTOs.Representative;
using SeekMatch.Application.Services;
using SeekMatch.Core.Entities;
using SeekMatch.Core.Enums;
using SeekMatch.Infrastructure.Interfaces;

namespace SeekMatch.Tests.Application.Recruiter;

public class RecruiterServiceTests
{
    private readonly Mock<IRecruiterRepository> _recruiterRepositoryMock;
    private readonly Mock<ISettingRepository> _settingRepositoryMock;
    private readonly Mock<IEmailService> _emailServiceMock;
    private readonly Mock<IMapper> _mapperMock;
    private readonly Mock<UserManager<User>> _userManagerMock;
    private readonly RecruiterService _sut;

    public RecruiterServiceTests()
    {
        _recruiterRepositoryMock = new Mock<IRecruiterRepository>();
        _settingRepositoryMock = new Mock<ISettingRepository>();
        _emailServiceMock = new Mock<IEmailService>();
        _mapperMock = new Mock<IMapper>();

        var store = new Mock<IUserStore<User>>();
        _userManagerMock = new Mock<UserManager<User>>(
            store.Object, null!, null!, null!, null!, null!, null!, null!, null!);

        _sut = new RecruiterService(
            _recruiterRepositoryMock.Object,
            _settingRepositoryMock.Object,
            _emailServiceMock.Object,
            _mapperMock.Object,
            _userManagerMock.Object);
    }

    #region RegisterAsync

    [Fact]
    public async Task RegisterAsync_WhenUserCreationSucceeds_CreatesRecruiterAndSetting()
    {
        var dto = new RegisterRecruiterDto
        {
            Email = "recruiter@test.com",
            Password = "Pass@123",
            FirstName = "John",
            LastName = "Doe",
            Setting = new SettingDto { Language = "en" }
        };

        _userManagerMock
            .Setup(u => u.CreateAsync(It.IsAny<User>(), dto.Password))
            .ReturnsAsync(IdentityResult.Success);

        var result = await _sut.RegisterAsync(dto);

        Assert.True(result.Succeeded);
        _recruiterRepositoryMock.Verify(r => r.CreateAsync(It.Is<Core.Entities.Recruiter>(rec =>
            rec.FirstName == "John" &&
            rec.LastName == "Doe" &&
            rec.IsFreelancer == true)), Times.Once);
        _settingRepositoryMock.Verify(s => s.CreateAsync(It.Is<Setting>(st =>
            st.Language == "en")), Times.Once);
    }

    [Fact]
    public async Task RegisterAsync_WhenUserCreationFails_ReturnsFailedResultWithoutCreatingRecruiter()
    {
        var dto = new RegisterRecruiterDto
        {
            Email = "bad@test.com",
            Password = "weak",
            FirstName = "John",
            LastName = "Doe"
        };

        var failedResult = IdentityResult.Failed(new IdentityError { Description = "Password too weak" });

        _userManagerMock
            .Setup(u => u.CreateAsync(It.IsAny<User>(), dto.Password))
            .ReturnsAsync(failedResult);

        var result = await _sut.RegisterAsync(dto);

        Assert.False(result.Succeeded);
        _recruiterRepositoryMock.Verify(r => r.CreateAsync(It.IsAny<Core.Entities.Recruiter>()), Times.Never);
        _settingRepositoryMock.Verify(s => s.CreateAsync(It.IsAny<Setting>()), Times.Never);
    }

    [Fact]
    public async Task RegisterAsync_SetsUserRoleToRecruiter()
    {
        var dto = new RegisterRecruiterDto
        {
            Email = "recruiter@test.com",
            Password = "Pass@123",
            FirstName = "John",
            LastName = "Doe"
        };

        _userManagerMock
            .Setup(u => u.CreateAsync(It.IsAny<User>(), dto.Password))
            .ReturnsAsync(IdentityResult.Success);

        await _sut.RegisterAsync(dto);

        _userManagerMock.Verify(u => u.CreateAsync(
            It.Is<User>(user =>
                user.Role == UserRole.Recruiter &&
                user.Email == "recruiter@test.com" &&
                user.UserName == "recruiter@test.com"),
            dto.Password), Times.Once);
    }

    #endregion

    #region GetAsync

    [Fact]
    public async Task GetAsync_WhenRecruiterExists_ReturnsMappedDto()
    {
        var recruiter = CreateRecruiter();
        var companyDto = new CompanyDto()
        {
            Name = "Tesla",
            Address = "123 Street",
            Phone = "123"
        };
        var dto = new RecruiterDto
        {
            Email = "recruiter@test.com",
            FirstName = "John",
            LastName = "Doe",
            CompanyId = "",
            CompanyDto = companyDto
        };

        _recruiterRepositoryMock.Setup(r => r.GetAsync("user-1")).ReturnsAsync(recruiter);
        _mapperMock.Setup(m => m.Map<RecruiterDto>(recruiter)).Returns(dto);

        var result = await _sut.GetAsync("user-1");

        Assert.NotNull(result);
        Assert.Equal("John", result!.FirstName);
    }

    [Fact]
    public async Task GetAsync_WhenRecruiterNotFound_ReturnsNull()
    {
        _recruiterRepositoryMock.Setup(r => r.GetAsync("ghost")).ReturnsAsync((Core.Entities.Recruiter?)null);
        _mapperMock.Setup(m => m.Map<RecruiterDto>(null)).Returns((RecruiterDto?)null!);

        var result = await _sut.GetAsync("ghost");

        Assert.Null(result);
    }

    #endregion

    #region SaveAboutYouAsync

    [Fact]
    public async Task SaveAboutYouAsync_WhenRecruiterExists_UpdatesNamesAndReturnsTrue()
    {
        var recruiter = CreateRecruiter();
        var dto = new SeekMatch.Application.DTOs.Recruiter.AboutYouDto { FirstName = "Jane", LastName = "Smith" };

        _recruiterRepositoryMock.Setup(r => r.GetAsync("user-1")).ReturnsAsync(recruiter);
        _recruiterRepositoryMock.Setup(r => r.SaveChangesAsync(recruiter)).ReturnsAsync(true);

        var result = await _sut.SaveAboutYouAsync(dto, "user-1");

        Assert.True(result);
        Assert.Equal("Jane", recruiter.FirstName);
        Assert.Equal("Smith", recruiter.LastName);
    }

    [Fact]
    public async Task SaveAboutYouAsync_WhenRecruiterNotFound_ReturnsFalse()
    {
        _recruiterRepositoryMock.Setup(r => r.GetAsync("ghost")).ReturnsAsync((Core.Entities.Recruiter?)null);

        var result = await _sut.SaveAboutYouAsync(new SeekMatch.Application.DTOs.Recruiter.AboutYouDto { FirstName = "X", LastName = "Y" }, "ghost");

        Assert.False(result);
        _recruiterRepositoryMock.Verify(r => r.SaveChangesAsync(It.IsAny<Core.Entities.Recruiter>()), Times.Never);
    }

    #endregion

    #region UpdateProfilePictureAsync

    [Fact]
    public async Task UpdateProfilePictureAsync_WhenRecruiterExists_SavesPictureAndReturnsTrue()
    {
        var recruiter = CreateRecruiter();
        var pictureData = new byte[] { 1, 2, 3 };

        _recruiterRepositoryMock.Setup(r => r.GetAsync("user-1")).ReturnsAsync(recruiter);
        _recruiterRepositoryMock.Setup(r => r.SaveChangesAsync(recruiter)).ReturnsAsync(true);

        var result = await _sut.UpdateProfilePictureAsync(pictureData, "user-1");

        Assert.True(result);
        Assert.Equal(pictureData, recruiter.ProfilePicture);
    }

    [Fact]
    public async Task UpdateProfilePictureAsync_WhenRecruiterNotFound_ReturnsFalse()
    {
        _recruiterRepositoryMock.Setup(r => r.GetAsync("ghost")).ReturnsAsync((Core.Entities.Recruiter?)null);

        var result = await _sut.UpdateProfilePictureAsync(new byte[] { 1 }, "ghost");

        Assert.False(result);
        _recruiterRepositoryMock.Verify(r => r.SaveChangesAsync(It.IsAny<Core.Entities.Recruiter>()), Times.Never);
    }

    #endregion

    #region DeleteProfilePictureAsync

    [Fact]
    public async Task DeleteProfilePictureAsync_WhenRecruiterExists_NullsOutPictureAndReturnsTrue()
    {
        var recruiter = CreateRecruiter();
        recruiter.ProfilePicture = new byte[] { 1, 2, 3 };

        _recruiterRepositoryMock.Setup(r => r.GetAsync("user-1")).ReturnsAsync(recruiter);
        _recruiterRepositoryMock.Setup(r => r.SaveChangesAsync(recruiter)).ReturnsAsync(true);

        var result = await _sut.DeleteProfilePictureAsync("user-1");

        Assert.True(result);
        Assert.Null(recruiter.ProfilePicture);
    }

    [Fact]
    public async Task DeleteProfilePictureAsync_WhenRecruiterNotFound_ReturnsFalse()
    {
        _recruiterRepositoryMock.Setup(r => r.GetAsync("ghost")).ReturnsAsync((Core.Entities.Recruiter?)null);

        var result = await _sut.DeleteProfilePictureAsync("ghost");

        Assert.False(result);
    }

    #endregion

    #region CreateAsync (Company Recruiter)

    [Fact]
    public async Task CreateAsync_WhenUserCreationSucceeds_CreatesRecruiterAndSendsEmail()
    {
        var companyDto = new CompanyDto()
        {
            Name = "Tesla",
            Address = "123 Street",
            Phone = "123"
        };
        var dto = new RecruiterDto
        {
            Email = "newrec@company.com",
            FirstName = "Alice",
            LastName = "Martin",
            CompanyId = "company-1",
            CompanyDto = companyDto
        };

        _userManagerMock
            .Setup(u => u.CreateAsync(It.IsAny<User>(), It.IsAny<string>()))
            .ReturnsAsync(IdentityResult.Success);

        var result = await _sut.CreateAsync(dto, "company-1");

        Assert.True(result.Succeeded);
        _recruiterRepositoryMock.Verify(r => r.CreateAsync(It.Is<Core.Entities.Recruiter>(rec =>
            rec.FirstName == "Alice" &&
            rec.LastName == "Martin" &&
            rec.CompanyId == "company-1")), Times.Once);
        _emailServiceMock.Verify(e => e.SendCompanyRecruterCreationAsync(
            It.IsAny<Core.Entities.Recruiter>(),
            It.IsAny<string>()), Times.Once);
    }

    [Fact]
    public async Task CreateAsync_SetsUserRoleToCompanyRecruiter()
    {
        var companyDto = new CompanyDto()
        {
            Name = "Tesla",
            Address = "123 Street",
            Phone = "123"
        };
        var dto = new RecruiterDto
        {
            Email = "newrec@company.com",
            FirstName = "Alice",
            LastName = "Martin",
            CompanyId = "company-1",
            CompanyDto = companyDto
        };

        _userManagerMock
            .Setup(u => u.CreateAsync(It.IsAny<User>(), It.IsAny<string>()))
            .ReturnsAsync(IdentityResult.Success);

        await _sut.CreateAsync(dto, "company-1");

        _userManagerMock.Verify(u => u.CreateAsync(
            It.Is<User>(user =>
                user.Role == UserRole.CompanyRecruiter &&
                user.IsTemporaryPassword == true),
            It.IsAny<string>()), Times.Once);
    }

    [Fact]
    public async Task CreateAsync_WhenUserCreationFails_DoesNotCreateRecruiterOrSendEmail()
    {
        var companyDto = new CompanyDto()
        {
            Name = "Tesla",
            Address = "123 Street",
            Phone = "123"
        };
        var dto = new RecruiterDto
        {
            Email = "bad@company.com",
            FirstName = "Alice",
            LastName = "Martin",
            CompanyId = "company-1",
            CompanyDto = companyDto
        };

        _userManagerMock
            .Setup(u => u.CreateAsync(It.IsAny<User>(), It.IsAny<string>()))
            .ReturnsAsync(IdentityResult.Failed(new IdentityError { Description = "Email taken" }));

        var result = await _sut.CreateAsync(dto, "company-1");

        Assert.False(result.Succeeded);
        _recruiterRepositoryMock.Verify(r => r.CreateAsync(It.IsAny<Core.Entities.Recruiter>()), Times.Never);
        _emailServiceMock.Verify(e => e.SendCompanyRecruterCreationAsync(
            It.IsAny<Core.Entities.Recruiter>(), It.IsAny<string>()), Times.Never);
    }

    #endregion

    #region UpdateAsync (Company Recruiter)

    [Fact]
    public async Task UpdateAsync_WhenRecruiterExists_MapsAndUpdatesAndReturnsTrue()
    {
        var companyDto = new CompanyDto()
        {
            Name = "Tesla",
            Address = "123 Street",
            Phone = "123"
        };
        var dto = new RecruiterDto
        {
            Id = "user-1",
            Email = "rec@company.com",
            FirstName = "Updated",
            LastName = "Name",
            CompanyId = "company-1",
            CompanyDto = companyDto
        };
        var existing = CreateRecruiter();

        _recruiterRepositoryMock.Setup(r => r.GetAsync("user-1")).ReturnsAsync(existing);
        _recruiterRepositoryMock.Setup(r => r.UpdateAsync(existing)).ReturnsAsync(true);

        var result = await _sut.UpdateAsync(dto, "company-1");

        Assert.True(result);
        _mapperMock.Verify(m => m.Map(dto, existing), Times.Once);
    }

    [Fact]
    public async Task UpdateAsync_WhenRecruiterNotFound_ThrowsException()
    {
        var companyDto = new CompanyDto()
        {
            Name = "Tesla",
            Address = "123 Street",
            Phone = "123"
        };
        var dto = new RecruiterDto
        {
            Id = "missing",
            Email = "x@x.com",
            FirstName = "X",
            LastName = "Y",
            CompanyId = "c-1",
            CompanyDto = companyDto
        };

        _recruiterRepositoryMock.Setup(r => r.GetAsync("missing")).ReturnsAsync((Core.Entities.Recruiter?)null);

        await Assert.ThrowsAsync<Exception>(() => _sut.UpdateAsync(dto, "company-1"));
    }

    [Fact]
    public async Task UpdateAsync_WhenDtoIsNull_ReturnsFalse()
    {
        var result = await _sut.UpdateAsync(null!, "company-1");

        Assert.False(result);
    }

    [Fact]
    public async Task UpdateAsync_WhenIdIsEmpty_ReturnsFalse()
    {
        var companyDto = new CompanyDto()
        {
            Name = "Tesla",
            Address = "123 Street",
            Phone = "123"
        };
        var dto = new RecruiterDto
        {
            Id = "",
            Email = "x@x.com",
            FirstName = "X",
            LastName = "Y",
            CompanyId = "c-1",
            CompanyDto = companyDto
        };

        var result = await _sut.UpdateAsync(dto, "company-1");

        Assert.False(result);
        _recruiterRepositoryMock.Verify(r => r.GetAsync(It.IsAny<string>()), Times.Never);
    }

    #endregion

    #region Helpers

    private static Core.Entities.Recruiter CreateRecruiter() => new()
    {
        Id = "user-1",
        FirstName = "John",
        LastName = "Doe",
        User = new User { Id = "user-1", Email = "recruiter@test.com", Role = UserRole.Recruiter }
    };

    #endregion
}
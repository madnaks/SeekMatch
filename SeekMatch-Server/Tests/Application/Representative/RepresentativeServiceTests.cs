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

namespace SeekMatch.Tests.Application.Representative;

public class RepresentativeServiceTests
{
    private readonly Mock<IRepresentativeRepository> _representativeRepositoryMock;
    private readonly Mock<ISettingRepository> _settingRepositoryMock;
    private readonly Mock<IMapper> _mapperMock;
    private readonly Mock<ICompanyService> _companyServiceMock;
    private readonly Mock<UserManager<User>> _userManagerMock;
    private readonly RepresentativeService _sut;

    public RepresentativeServiceTests()
    {
        _representativeRepositoryMock = new Mock<IRepresentativeRepository>();
        _settingRepositoryMock = new Mock<ISettingRepository>();
        _mapperMock = new Mock<IMapper>();
        _companyServiceMock = new Mock<ICompanyService>();

        var store = new Mock<IUserStore<User>>();
        _userManagerMock = new Mock<UserManager<User>>(
            store.Object, null!, null!, null!, null!, null!, null!, null!, null!);

        _sut = new RepresentativeService(
            _representativeRepositoryMock.Object,
            _settingRepositoryMock.Object,
            _mapperMock.Object,
            _companyServiceMock.Object,
            _userManagerMock.Object);
    }

    #region RegisterAsync

    [Fact]
    public async Task RegisterAsync_WhenUserCreationSucceeds_CreatesCompanyRepresentativeAndSetting()
    {
        var dto = new RegisterRepresentativeDto
        {
            Email = "rep@company.com",
            Password = "Pass@123",
            FirstName = "Alice",
            LastName = "Martin",
            Position = "HR Manager",
            CompanyName = "Acme Corp",
            CompanyAddress = "123 Main St",
            CompanyPhoneNumber = "514-000-0000",
            Setting = new SettingDto { Language = "fr" }
        };

        _userManagerMock
            .Setup(u => u.CreateAsync(It.IsAny<User>(), dto.Password))
            .ReturnsAsync(IdentityResult.Success);

        var result = await _sut.RegisterAsync(dto);

        Assert.True(result.Succeeded);
        _companyServiceMock.Verify(c => c.CreateAsync(It.Is<Company>(co =>
            co.Name == "Acme Corp" &&
            co.Address == "123 Main St" &&
            co.Phone == "514-000-0000")), Times.Once);
        _representativeRepositoryMock.Verify(r => r.RegisterAsync(It.Is<Core.Entities.Representative>(rep =>
            rep.FirstName == "Alice" &&
            rep.LastName == "Martin" &&
            rep.Position == "HR Manager")), Times.Once);
        _settingRepositoryMock.Verify(s => s.CreateAsync(It.Is<Setting>(st =>
            st.Language == "fr")), Times.Once);
    }

    [Fact]
    public async Task RegisterAsync_WhenUserCreationFails_ReturnsFailedResultAndSkipsAllCreation()
    {
        var dto = new RegisterRepresentativeDto
        {
            Email = "bad@company.com",
            Password = "weak",
            FirstName = "Alice",
            LastName = "Martin",
            CompanyName = "Acme Corp",
            CompanyAddress = "123 Street",
            CompanyPhoneNumber = "123"
        };

        _userManagerMock
            .Setup(u => u.CreateAsync(It.IsAny<User>(), dto.Password))
            .ReturnsAsync(IdentityResult.Failed(new IdentityError { Description = "Password too weak" }));

        var result = await _sut.RegisterAsync(dto);

        Assert.False(result.Succeeded);
        _companyServiceMock.Verify(c => c.CreateAsync(It.IsAny<Company>()), Times.Never);
        _representativeRepositoryMock.Verify(r => r.RegisterAsync(It.IsAny<Core.Entities.Representative>()), Times.Never);
        _settingRepositoryMock.Verify(s => s.CreateAsync(It.IsAny<Setting>()), Times.Never);
    }

    [Fact]
    public async Task RegisterAsync_SetsUserRoleToRepresentative()
    {
        var dto = new RegisterRepresentativeDto
        {
            Email = "rep@company.com",
            Password = "Pass@123",
            FirstName = "Alice",
            LastName = "Martin",
            CompanyName = "Acme Corp",
            CompanyAddress = "123 Street",
            CompanyPhoneNumber = "123"
        };

        _userManagerMock
            .Setup(u => u.CreateAsync(It.IsAny<User>(), dto.Password))
            .ReturnsAsync(IdentityResult.Success);

        await _sut.RegisterAsync(dto);

        _userManagerMock.Verify(u => u.CreateAsync(
            It.Is<User>(user =>
                user.Role == UserRole.Representative &&
                user.Email == "rep@company.com" &&
                user.UserName == "rep@company.com"),
            dto.Password), Times.Once);
    }

    [Fact]
    public async Task RegisterAsync_LinksRepresentativeToCreatedCompany()
    {
        var dto = new RegisterRepresentativeDto
        {
            Email = "rep@company.com",
            Password = "Pass@123",
            FirstName = "Alice",
            LastName = "Martin",
            CompanyName = "Acme Corp",
            CompanyAddress = "123 Street",
            CompanyPhoneNumber = "123"
        };

        _userManagerMock
            .Setup(u => u.CreateAsync(It.IsAny<User>(), dto.Password))
            .ReturnsAsync(IdentityResult.Success);

        await _sut.RegisterAsync(dto);

        _representativeRepositoryMock.Verify(r => r.RegisterAsync(
            It.Is<Core.Entities.Representative>(rep => rep.Company != null)), Times.Once);
    }

    #endregion

    #region GetAsync

    [Fact]
    public async Task GetAsync_WhenRepresentativeExists_ReturnsMappedDto()
    {
        var representative = CreateRepresentative();
        var companyDto = new CompanyDto()
        {
            Name = "Tesla",
            Address = "123 Street",
            Phone = "123"
        };
        var dto = new RepresentativeDto
        {
            FirstName = "Alice",
            LastName = "Martin",
            CompanyId = "company-1",
            CompanyDto = companyDto
        };

        _representativeRepositoryMock.Setup(r => r.GetAsync("user-1")).ReturnsAsync(representative);
        _mapperMock.Setup(m => m.Map<RepresentativeDto>(representative)).Returns(dto);

        var result = await _sut.GetAsync("user-1");

        Assert.NotNull(result);
        Assert.Equal("Alice", result!.FirstName);
    }

    [Fact]
    public async Task GetAsync_WhenRepresentativeNotFound_ReturnsNull()
    {
        _representativeRepositoryMock
            .Setup(r => r.GetAsync("ghost"))
            .ReturnsAsync((Core.Entities.Representative?)null);
        _mapperMock.Setup(m => m.Map<RepresentativeDto>(null)).Returns((RepresentativeDto?)null!);

        var result = await _sut.GetAsync("ghost");

        Assert.Null(result);
    }

    #endregion

    #region SaveAboutYouAsync

    [Fact]
    public async Task SaveAboutYouAsync_WhenRepresentativeExists_UpdatesNamesAndReturnsTrue()
    {
        var representative = CreateRepresentative();
        var dto = new SeekMatch.Application.DTOs.Representative.AboutYouDto { FirstName = "Bob", LastName = "Smith" };

        _representativeRepositoryMock.Setup(r => r.GetAsync("user-1")).ReturnsAsync(representative);
        _representativeRepositoryMock.Setup(r => r.SaveChangesAsync(representative)).ReturnsAsync(true);

        var result = await _sut.SaveAboutYouAsync(dto, "user-1");

        Assert.True(result);
        Assert.Equal("Bob", representative.FirstName);
        Assert.Equal("Smith", representative.LastName);
    }

    [Fact]
    public async Task SaveAboutYouAsync_WhenRepresentativeNotFound_ReturnsFalse()
    {
        _representativeRepositoryMock
            .Setup(r => r.GetAsync("ghost"))
            .ReturnsAsync((Core.Entities.Representative?)null);

        var result = await _sut.SaveAboutYouAsync(new SeekMatch.Application.DTOs.Representative.AboutYouDto { FirstName = "X", LastName = "Y" }, "ghost");

        Assert.False(result);
        _representativeRepositoryMock.Verify(r =>
            r.SaveChangesAsync(It.IsAny<Core.Entities.Representative>()), Times.Never);
    }

    #endregion

    #region UpdateProfilePictureAsync

    [Fact]
    public async Task UpdateProfilePictureAsync_WhenRepresentativeExists_SavesPictureAndReturnsTrue()
    {
        var representative = CreateRepresentative();
        var pictureData = new byte[] { 1, 2, 3 };

        _representativeRepositoryMock.Setup(r => r.GetAsync("user-1")).ReturnsAsync(representative);
        _representativeRepositoryMock.Setup(r => r.SaveChangesAsync(representative)).ReturnsAsync(true);

        var result = await _sut.UpdateProfilePictureAsync(pictureData, "user-1");

        Assert.True(result);
        Assert.Equal(pictureData, representative.ProfilePicture);
    }

    [Fact]
    public async Task UpdateProfilePictureAsync_WhenRepresentativeNotFound_ReturnsFalse()
    {
        _representativeRepositoryMock
            .Setup(r => r.GetAsync("ghost"))
            .ReturnsAsync((Core.Entities.Representative?)null);

        var result = await _sut.UpdateProfilePictureAsync(new byte[] { 1 }, "ghost");

        Assert.False(result);
        _representativeRepositoryMock.Verify(r =>
            r.SaveChangesAsync(It.IsAny<Core.Entities.Representative>()), Times.Never);
    }

    #endregion

    #region DeleteProfilePictureAsync

    [Fact]
    public async Task DeleteProfilePictureAsync_WhenRepresentativeExists_NullsOutPictureAndReturnsTrue()
    {
        var representative = CreateRepresentative();
        representative.ProfilePicture = new byte[] { 1, 2, 3 };

        _representativeRepositoryMock.Setup(r => r.GetAsync("user-1")).ReturnsAsync(representative);
        _representativeRepositoryMock.Setup(r => r.SaveChangesAsync(representative)).ReturnsAsync(true);

        var result = await _sut.DeleteProfilePictureAsync("user-1");

        Assert.True(result);
        Assert.Null(representative.ProfilePicture);
    }

    [Fact]
    public async Task DeleteProfilePictureAsync_WhenRepresentativeNotFound_ReturnsFalse()
    {
        _representativeRepositoryMock
            .Setup(r => r.GetAsync("ghost"))
            .ReturnsAsync((Core.Entities.Representative?)null);

        var result = await _sut.DeleteProfilePictureAsync("ghost");

        Assert.False(result);
        _representativeRepositoryMock.Verify(r =>
            r.SaveChangesAsync(It.IsAny<Core.Entities.Representative>()), Times.Never);
    }

    #endregion

    #region GetAllRecruitersAsync

    [Fact]
    public async Task GetAllRecruitersAsync_WhenRepresentativeExists_ReturnsMappedRecruiters()
    {
        var recruiters = new List<Core.Entities.Recruiter>
        {
            new() { Id = "rec-1", FirstName = "John", LastName = "Doe", User = new User() }
        };
        var company = new Company { Name = "Acme", Recruiters = recruiters, Phone = "123", Address = "123 Street" };
        var representative = CreateRepresentative();
        representative.Company = company;
        var companyDto = new CompanyDto()
        {
            Name = "Tesla",
            Address = "123 Street",
            Phone = "123"
        };
        var dtos = new List<RecruiterDto>
        {
            new() { Email = "john@acme.com", FirstName = "John", LastName = "Doe", CompanyId = "company-1", CompanyDto = companyDto }
        };

        _representativeRepositoryMock.Setup(r => r.GetAsync("user-1")).ReturnsAsync(representative);
        _mapperMock.Setup(m => m.Map<List<RecruiterDto>>(recruiters)).Returns(dtos);

        var result = await _sut.GetAllRecruitersAsync("user-1");

        Assert.NotNull(result);
        Assert.Single(result);
        Assert.Equal("John", result[0].FirstName);
    }

    [Fact]
    public async Task GetAllRecruitersAsync_WhenRepresentativeNotFound_ReturnsEmptyList()
    {
        _representativeRepositoryMock
            .Setup(r => r.GetAsync("ghost"))
            .ReturnsAsync((Core.Entities.Representative?)null);

        var result = await _sut.GetAllRecruitersAsync("ghost");

        Assert.NotNull(result);
        Assert.Empty(result);
    }

    #endregion

    #region Helpers

    private static Core.Entities.Representative CreateRepresentative() => new()
    {
        Id = "user-1",
        FirstName = "Alice",
        LastName = "Martin",
        Position = "HR Manager",
        CompanyId = "company-1",
        Company = new Company { Id = "company-1", Name = "Acme Corp", Phone = "123", Address = "123 Street" },
        User = new User { Id = "user-1", Email = "rep@company.com", Role = UserRole.Representative }
    };

    #endregion
}
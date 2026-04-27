using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Moq;
using SeekMatch.Application.DTOs.Talent;
using SeekMatch.Application.Services;
using SeekMatch.Core.Entities;
using SeekMatch.Core.Enums;
using SeekMatch.Infrastructure.Interfaces;

namespace SeekMatch.Tests.Application.Talent;

public class TalentServiceTests
{
    private readonly Mock<ITalentRepository> _talentRepositoryMock;
    private readonly Mock<ISettingRepository> _settingRepositoryMock;
    private readonly Mock<IMapper> _mapperMock;
    private readonly Mock<UserManager<User>> _userManagerMock;
    private readonly TalentService _sut;

    public TalentServiceTests()
    {
        _talentRepositoryMock = new Mock<ITalentRepository>();
        _settingRepositoryMock = new Mock<ISettingRepository>();
        _mapperMock = new Mock<IMapper>();

        var store = new Mock<IUserStore<User>>();
        _userManagerMock = new Mock<UserManager<User>>(
            store.Object, null!, null!, null!, null!, null!, null!, null!, null!);

        _sut = new TalentService(
            _talentRepositoryMock.Object,
            _settingRepositoryMock.Object,
            _mapperMock.Object,
            _userManagerMock.Object);
    }

    #region RegisterAsync

    [Fact]
    public async Task RegisterAsync_WhenUserCreationSucceeds_CreatesTalentAndSetting()
    {
        var dto = new RegisterTalentDto
        {
            Email = "john@test.com",
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
        _settingRepositoryMock.Verify(s => s.CreateAsync(It.Is<Setting>(st => st.Language == "en")), Times.Once);
        _talentRepositoryMock.Verify(t => t.CreateAsync(It.Is<SeekMatch.Core.Entities.Talent>(ta =>
            ta.FirstName == "John" && ta.LastName == "Doe")), Times.Once);
    }

    [Fact]
    public async Task RegisterAsync_WhenUserCreationFails_ReturnsFailedResultWithoutCreatingTalent()
    {
        var dto = new RegisterTalentDto
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
        _talentRepositoryMock.Verify(t => t.CreateAsync(It.IsAny<SeekMatch.Core.Entities.Talent>()), Times.Never);
        _settingRepositoryMock.Verify(s => s.CreateAsync(It.IsAny<Setting>()), Times.Never);
    }

    [Fact]
    public async Task RegisterAsync_SetsUserRoleToTalent()
    {
        var dto = new RegisterTalentDto
        {
            Email = "john@test.com",
            Password = "Pass@123",
            FirstName = "John",
            LastName = "Doe"
        };

        _userManagerMock
            .Setup(u => u.CreateAsync(It.IsAny<User>(), dto.Password))
            .ReturnsAsync(IdentityResult.Success);

        await _sut.RegisterAsync(dto);

        _userManagerMock.Verify(u => u.CreateAsync(
            It.Is<User>(user => user.Role == UserRole.Talent && user.Email == "john@test.com"),
            dto.Password), Times.Once);
    }

    #endregion

    #region GetAsync

    [Fact]
    public async Task GetAsync_WhenTalentExists_ReturnsMappedDto()
    {
        var talent = CreateTalent();
        var dto = new TalentDto { FirstName = "John", LastName = "Doe" };

        _talentRepositoryMock.Setup(r => r.GetAsync("user-1")).ReturnsAsync(talent);
        _mapperMock.Setup(m => m.Map<TalentDto>(talent)).Returns(dto);

        var result = await _sut.GetAsync("user-1");

        Assert.NotNull(result);
        Assert.Equal("John", result!.FirstName);
    }

    [Fact]
    public async Task GetAsync_WhenTalentNotFound_ReturnsNull()
    {
        _talentRepositoryMock.Setup(r => r.GetAsync("ghost")).ReturnsAsync((SeekMatch.Core.Entities.Talent?)null);
        _mapperMock.Setup(m => m.Map<TalentDto>(null)).Returns((TalentDto?)null!);

        var result = await _sut.GetAsync("ghost");

        Assert.Null(result);
    }

    #endregion

    #region SaveProfileAsync

    [Fact]
    public async Task SaveProfileAsync_WhenTalentExists_UpdatesAllFieldsAndReturnsTrue()
    {
        var talent = CreateTalent();
        var dto = new TalentDto
        {
            FirstName = "Jane",
            LastName = "Smith",
            ProfileTitle = "Senior Dev",
            Summary = "Experienced developer",
            Phone = "514-555-0000",
            Country = "Canada",
            Region = 1,
            City = 2,
            LinkedIn = "https://linkedin.com/in/jane",
            Website = "https://jane.dev"
        };

        _talentRepositoryMock.Setup(r => r.GetAsync("user-1")).ReturnsAsync(talent);
        _talentRepositoryMock.Setup(r => r.SaveChangesAsync(talent)).ReturnsAsync(true);

        var result = await _sut.SaveProfileAsync(dto, "user-1");

        Assert.True(result);
        Assert.Equal("Jane", talent.FirstName);
        Assert.Equal("Smith", talent.LastName);
        Assert.Equal("Senior Dev", talent.ProfileTitle);
        Assert.Equal("Canada", talent.Country);
        Assert.Equal("https://linkedin.com/in/jane", talent.LinkedIn);
        Assert.Equal("https://jane.dev", talent.Website);
    }

    [Fact]
    public async Task SaveProfileAsync_WhenTalentNotFound_ReturnsFalse()
    {
        _talentRepositoryMock.Setup(r => r.GetAsync("ghost")).ReturnsAsync((SeekMatch.Core.Entities.Talent?)null);

        var result = await _sut.SaveProfileAsync(new TalentDto(), "ghost");

        Assert.False(result);
        _talentRepositoryMock.Verify(r => r.SaveChangesAsync(It.IsAny<SeekMatch.Core.Entities.Talent>()), Times.Never);
    }

    #endregion

    #region UpdateProfilePictureAsync

    [Fact]
    public async Task UpdateProfilePictureAsync_WhenTalentExists_SavesPictureAndReturnsTrue()
    {
        var talent = CreateTalent();
        var pictureData = new byte[] { 1, 2, 3 };

        _talentRepositoryMock.Setup(r => r.GetAsync("user-1")).ReturnsAsync(talent);
        _talentRepositoryMock.Setup(r => r.SaveChangesAsync(talent)).ReturnsAsync(true);

        var result = await _sut.UpdateProfilePictureAsync(pictureData, "user-1");

        Assert.True(result);
        Assert.Equal(pictureData, talent.ProfilePicture);
    }

    [Fact]
    public async Task UpdateProfilePictureAsync_WhenTalentNotFound_ReturnsFalse()
    {
        _talentRepositoryMock.Setup(r => r.GetAsync("ghost")).ReturnsAsync((SeekMatch.Core.Entities.Talent?)null);

        var result = await _sut.UpdateProfilePictureAsync(new byte[] { 1 }, "ghost");

        Assert.False(result);
        _talentRepositoryMock.Verify(r => r.SaveChangesAsync(It.IsAny<SeekMatch.Core.Entities.Talent>()), Times.Never);
    }

    #endregion

    #region DeleteProfilePictureAsync

    [Fact]
    public async Task DeleteProfilePictureAsync_WhenTalentExists_NullsOutPictureAndReturnsTrue()
    {
        var talent = CreateTalent();
        talent.ProfilePicture = new byte[] { 1, 2, 3 };

        _talentRepositoryMock.Setup(r => r.GetAsync("user-1")).ReturnsAsync(talent);
        _talentRepositoryMock.Setup(r => r.SaveChangesAsync(talent)).ReturnsAsync(true);

        var result = await _sut.DeleteProfilePictureAsync("user-1");

        Assert.True(result);
        Assert.Null(talent.ProfilePicture);
    }

    [Fact]
    public async Task DeleteProfilePictureAsync_WhenTalentNotFound_ReturnsFalse()
    {
        _talentRepositoryMock.Setup(r => r.GetAsync("ghost")).ReturnsAsync((SeekMatch.Core.Entities.Talent?)null);

        var result = await _sut.DeleteProfilePictureAsync("ghost");

        Assert.False(result);
    }

    #endregion

    #region GetAllBookmarksAsync

    [Fact]
    public async Task GetAllBookmarksAsync_WhenBookmarksExist_ReturnsMappedList()
    {
        var bookmarks = new List<Bookmark>
        {
            new() { TalentId = "user-1", JobOfferId = "job-1" }
        };
        var dtos = new List<BookmarkDto>
        {
            new() { TalentId = "user-1", JobOfferId = "job-1" }
        };

        _talentRepositoryMock.Setup(r => r.GetBookmarks("user-1")).ReturnsAsync(bookmarks);
        _mapperMock.Setup(m => m.Map<IList<BookmarkDto>>(bookmarks)).Returns(dtos);

        var result = await _sut.GetAllBookmarksAsync("user-1");

        Assert.NotNull(result);
        Assert.Single(result!);
        Assert.Equal("job-1", result![0].JobOfferId);
    }

    [Fact]
    public async Task GetAllBookmarksAsync_WhenNoBookmarks_ReturnsNull()
    {
        _talentRepositoryMock.Setup(r => r.GetBookmarks("user-1")).ReturnsAsync((IList<Bookmark>)null);

        var result = await _sut.GetAllBookmarksAsync("user-1");

        Assert.Null(result);
    }

    #endregion

    #region Helpers
    private static SeekMatch.Core.Entities.Talent CreateTalent() => new()
    {
        Id = "user-1",
        FirstName = "John",
        LastName = "Doe",
        User = new User { Id = "user-1", Email = "john@test.com", Role = UserRole.Talent }
    };
    #endregion
}
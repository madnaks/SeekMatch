using AutoMapper;
using SeekMatch.Application;
using SeekMatch.Application.DTOs.Recruiter;
using SeekMatch.Core.Entities;

namespace SeekMatch.Tests.Application;

public class SeekMatchProfileTests
{
    [Fact]
    public void JobOfferDtoToJobOffer_IgnoresRecruiterNavigation()
    {
        var mapper = new MapperConfiguration(cfg => cfg.AddProfile<SeekMatchProfile>()).CreateMapper();
        var dto = new JobOfferDto
        {
            Title = "Developer",
            Description = "Build products",
            Location = "Montreal",
            Recruiter = new RecruiterDto
            {
                Id = "recruiter-from-body",
                Email = "recruiter@test.com",
                FirstName = "Jane",
                LastName = "Doe"
            }
        };

        var entity = mapper.Map<JobOffer>(dto);

        Assert.Null(entity.Recruiter);
    }
}

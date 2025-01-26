using AutoMapper;
using SeekMatch.Application.DTOs.Recruiter;
using SeekMatch.Application.DTOs.Representative;
using SeekMatch.Application.DTOs.Talent;
using SeekMatch.Core.Entities;

namespace SeekMatch.Application
{
    public class SeekMatchProfile : Profile
    {
        public SeekMatchProfile()
        {
            #region Talent
            CreateMap<Talent, TalentDto>()
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.User.Email));
            CreateMap<Education, EducationDto>().ReverseMap();
            CreateMap<Experience, ExperienceDto>().ReverseMap();
            #endregion

            #region Recruiter
            CreateMap<Recruiter, RecruiterDto>()
                    .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.User.Email));
            CreateMap<JobOffer, JobOfferDto>().ReverseMap();
            CreateMap<JobApplication, JobApplicationDto>()
                .ForMember(dest => dest.JobOfferDto, opt => opt.MapFrom(src => src.JobOffer))
                .ReverseMap();
            #endregion 

            #region Representative
            CreateMap<Representative, RepresentativeDto>()
                    .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.User.Email))
                    .ForMember(dest => dest.CompanyDto, opt => opt.MapFrom(src => src.Company));
            CreateMap<Company, CompanyDto>().ReverseMap();
            #endregion 

        }
    }
}

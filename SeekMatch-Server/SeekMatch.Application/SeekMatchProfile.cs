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
            CreateMap<Resume, ResumeDto>().ReverseMap();
            CreateMap<ResumeDto, Resume>().ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));
            CreateMap<BookmarkDto, Bookmark>().ReverseMap();
            #endregion

            #region Recruiter
            CreateMap<Recruiter, RecruiterDto>()
                    .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.User.Email));
            CreateMap<JobOffer, JobOfferDto>().ReverseMap();
            CreateMap<JobOfferFilter, JobOfferFilterDto>().ReverseMap();
            CreateMap<JobApplication, JobApplicationDto>()
                .ForMember(dest => dest.TalentFullName, opt => opt.MapFrom(src => src.Talent != null ? $"{src.Talent.FirstName} {src.Talent.LastName}" : string.Empty))
                .ForMember(dest => dest.JobOfferTitle, opt => opt.MapFrom(src => src.JobOffer != null ? src.JobOffer.Title : string.Empty))
                .ReverseMap();
            CreateMap<ExpressApplication, ExpressApplicationDto>().ReverseMap();
            #endregion 

            #region Representative
            CreateMap<Representative, RepresentativeDto>()
                    .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.User.Email))
                    .ForMember(dest => dest.CompanyDto, opt => opt.MapFrom(src => src.Company));
            CreateMap<Company, CompanyDto>().ReverseMap();
            #endregion

            #region Commun
            CreateMap<Setting, SettingDto>().ReverseMap();
            #endregion


        }
    }
}

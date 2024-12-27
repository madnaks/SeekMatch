using AutoMapper;
using SeekMatch.Application.DTOs.Talent;
using SeekMatch.Core.Entities;

namespace SeekMatch.Application
{
    public class SeekMatchProfile : Profile
    {
        public SeekMatchProfile()
        {
            CreateMap<Talent, TalentDto>()
                            .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.User.Email));
            CreateMap<Education, CreateEducationDto>().ReverseMap();
            CreateMap<Education, EducationDto>().ReverseMap();          
            CreateMap<Experience, CreateExperienceDto>().ReverseMap();
            CreateMap<Experience, ExperienceDto>().ReverseMap();
        }
    }
}

using AutoMapper;
using SeekMatch.Application.DTOs;
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
        }
    }
}

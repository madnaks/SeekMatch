using AutoMapper;
using SeekMatch.Application.Interfaces;
using SeekMatch.Core.Entities;
using SeekMatch.Infrastructure.Interfaces;

namespace SeekMatch.Application.Services
{
    public class RecruiterService : IRecruiterService
    {
        private readonly IRecruiterRepository _recruiterRepository;
        private readonly IMapper _mapper;
        public RecruiterService(IRecruiterRepository recruiterRepository, IMapper mapper)
        {
            _recruiterRepository = recruiterRepository;
            _mapper = mapper;
        }
        public async Task CreateAsync(Recruiter recruiter)
        {
            await _recruiterRepository.CreateAsync(recruiter);
        }
    }
}

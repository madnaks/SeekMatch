using AutoMapper;
using SeekMatch.Application.DTOs.Recruiter;
using SeekMatch.Application.Interfaces;
using SeekMatch.Core.Entities;
using SeekMatch.Infrastructure.Interfaces;

namespace SeekMatch.Application.Services
{
    public class JobOfferService : IJobOfferService
    {
        private readonly IJobOfferRepository _jobOfferRepository;
        private readonly IMapper _mapper;

        public JobOfferService(IJobOfferRepository jobOfferRepository, IMapper mapper)
        {
            _jobOfferRepository = jobOfferRepository;
            _mapper = mapper;
        }

        public async Task<IList<JobOfferDto>?> GetAllAsync(string recruiterId)
        {
            return _mapper.Map<IList<JobOfferDto>>(await _jobOfferRepository.GetAllAsync(recruiterId));
        }

        public async Task<bool> CreateAsync(CreateJobOfferDto createJobOfferDto, string recruiterId)
        {
            var jobOffer = _mapper.Map<JobOffer>(createJobOfferDto);
            jobOffer.RecruiterId = recruiterId;
            return await _jobOfferRepository.CreateAsync(jobOffer);
        }

        public async Task<bool> UpdateAsync(JobOfferDto jobOfferDto)
        {
            if (jobOfferDto != null && !string.IsNullOrEmpty(jobOfferDto.Id))
            {
                var existingJobOffer = await _jobOfferRepository.GetByIdAsync(jobOfferDto.Id);
                if (existingJobOffer == null)
                {
                    throw new Exception("Job offer not found");
                }

                _mapper.Map(jobOfferDto, existingJobOffer);

                return await _jobOfferRepository.UpdateAsync(existingJobOffer);
            }

            return false;
        }

        public async Task<bool> DeleteAsync(string jobOfferId)
        {
            return await _jobOfferRepository.DeleteAsync(jobOfferId);
        }

    }
}

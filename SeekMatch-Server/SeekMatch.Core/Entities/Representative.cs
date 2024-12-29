﻿namespace SeekMatch.Core.Entities
{
    public class Representative : BaseEntity
    {
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public string? Position { get; set; }
        public required User User { get; set; }
        public required Company Company { get; set; }
        public string? CompanyId { get; set; }

    }
}

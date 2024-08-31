export class Job {
    id: number;
    title: string;
    description: string;
    company: string;
    location: string;
  
    constructor(id: number, title: string, description: string, company: string, location: string) {
      this.id = id;
      this.title = title;
      this.description = description;
      this.company = company;
      this.location = location;
    }
  }
  
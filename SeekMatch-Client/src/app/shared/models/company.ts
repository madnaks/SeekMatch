export class Company {
  id: number;
  name: string;
  location: string;
  numberOfEmployees: number;
  numberOfOffers: number;


  constructor(id: number, name: string, location: string, numberOfEmployees: number, numberOfOffers: number) {
    this.id = id;
    this.name = name;
    this.location = location;
    this.numberOfEmployees = numberOfEmployees;
    this.numberOfOffers = numberOfOffers;
  }
}

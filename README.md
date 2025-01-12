# SeekMatch

**SeekMatch** is a job offer website designed to connect recruiters with job seekers, providing an efficient and user-friendly platform for managing profiles and job applications.

---

## Project Overview

- **Frontend**: Angular 17 with Bootstrap 5 for a responsive and modern UI.
- **Backend**: .NET Core API using Clean Architecture principles, Entity Framework for data access, and PostgreSQL as the database.
- **Key Features**:
  - User Authentication (powered by ASP.NET Identity).
  - Role-based functionality (Job Seeker and Recruiter).
  - Profile management and job application system.
  - Modular and maintainable codebase.

---

## Frontend

### Technologies Used
- **Angular**: Version 17.0
- **Key Dependencies**:
  - `@angular/core` (17.0): Core Angular framework.
  - `@auth0/angular-jwt` (5.2.0): JWT integration for user authentication.
  - `@ng-bootstrap/ng-bootstrap` (16.0.0): Bootstrap components for Angular.
  - `ngx-bootstrap` (12.0.0): UI components such as date pickers.
  - `@ngx-translate/core` (15.0.0): Internationalization support.
  - `bootstrap` (5.3.3): Frontend framework for responsive design.
  - `rxjs` (7.8.0): Reactive programming.
  - `zone.js` (0.14.2): Angular's execution context.
    
---

## Backend

### Technologies Used
- **.NET Core API**: Backend API built using .NET Core.
- **Clean Architecture**: The backend follows Clean Architecture principles, ensuring separation of concerns and making the codebase modular, maintainable, and scalable.
- **Entity Framework Core**: Used for data access, managing the database with migrations and maintaining the integrity of entities.
- **PostgreSQL**: The chosen database for data storage.

### Structure

- **SeekMatch** (Entry point, API layer)
- **SeekMatch-Application** (Contains services, business logic)
- **SeekMatch-Core** (Defines models, entities, DTOs)
- **SeekMatch-Infrastructure** (Contains database access, Entity Framework Core implementation)

### Additional Notes

- **Namespaces**: In this project, namespaces are primarily used for organizing **Application.Dtos** to keep the code well-structured.
- **ASP.NET Identity**: Used for user authentication and role management. Roles include "JobSeeker" and "Recruiter," with specific permissions for each.

# WEBB24 Application Lifecycle Management: Group task

## Description

This is a group task for the course Application Lifecycle Management at Nackademin.
**Group size:** 2 - 4 people
**Date:** 2025-05-23
**Time:** 09:00 - 17:00

## Instructions

The group is tasked with forking this repository setting up the project with the necessary tools and technologies.

### Technologies

- Git - for version control
- GitHub - for version control and Actions
- Docker - for containerization

### Code

- Express - for the API
- SQLite - for the database
- Sequelize - for the database ORM
- Jest - for testing the models

### Tasks

Of the ones below the group has to complete the following tasks. Evryone in the group has to contribute to the code. This will be done by having a single repo with multiple contributors. And creating prs for each new feature.

**Required tasks**

- [ ] **The code will have its tests run with GitHub Actions**
- [ ] **The code will be dockerized using a Dockerfile**
- [ ] **Accomodation model will have a address, city, country, zipCode, rent, rooms and possibly userId (needs tests)**
- [ ] **User model will enforce unique email and username and validate email format (needs tests)**
- [ ] **User model will have a profilePicture field that is a url to an image (needs tests)**
- [ ] **Accomodation model will be CASCADE deleted when the user is deleted (needs tests)**

### Individual tasks for VG

If you are not the repo owner fork the repo to your own GitHub account and make the following changes. If you are just continue with the tasks below:

- [ ] **Update the database to use PostgreSQL**
- [ ] **Update the code to use PostgreSQL**
- [ ] **Create a docker-compose.yml file to start the application with PostgreSQL**
- [ ] **deploy locally with docker compose**

_docker/docker-compose.yml_

```
version: '3.8'
services:
  db:
    image: postgres:15
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: postgres
    ports:
      - "5432:5432"

    volumes:
      - pgdata:/var/lib/postgresql/data
app:
    ...
    build:
        context: .
        dockerfile: dockerfile
    environment:
      DB_HOST: db
      DB_USER: postgres
      DB_PASSWORD: postgres
      DB_NAME: postgres
    ports:
        ...
    depends_on:
      - db
volumes:
  pgdata:
```

_Deploy locally with docker compose_

```
docker compose up ./docker/docker-compose.yml
```

_Tear down the application_

```
docker compose down ./docker/docker-compose.yml
```

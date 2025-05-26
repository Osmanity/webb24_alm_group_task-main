# WEBB24 ALM: Gruppuppgift

## Beskrivning

Detta är en gruppuppgift för kursen Applikationslivscykelhantering på Nackademin.
**Gruppstorlek:** 2 - 4 personer
**Datum:** 2025-05-23
**Tid:** 09:00 - 17:00

## Instruktioner

Gruppen ska forka detta repository och sätta upp projektet med nödvändiga verktyg och teknologier.

### Teknologier

- Git - för versionshantering
- GitHub - för versionshantering och Actions
- Docker - för containerisering

### Kod

- Express - för API:et
- SQLite - för databasen
- Sequelize - för databas ORM
- Jest - för testning av modeller

### Uppgifter

Av de nedanstående uppgifterna måste gruppen slutföra följande. Alla i gruppen måste bidra till koden. Detta kommer att göras genom att ha ett enda repo med flera bidragsgivare. Och skapa pull requests för varje ny funktion.

**Obligatoriska uppgifter**

- [ ] **Koden kommer att ha sina tester köra med GitHub Actions**
- [ ] **Koden kommer att containeriseras med en Dockerfile**
- [ ] **Accomodation model ska ha en adress, stad, land, postnummer, hyra, rum och eventuellt userId (behöver tester)**
- [ ] **User model ska tvinga unik e-post och användarnamn samt validera e-postformat (behöver tester)**
- [ ] **User model ska ha ett profilbildsfält som är en url till en bild (behöver tester)**
- [ ] **Accomodation model ska CASCADE-raderas när användaren raderas (behöver tester)**

### Individuella uppgifter för VG

Om du inte är repo-ägaren, forka repot till ditt eget GitHub-konto och gör följande ändringar. Om du är det, fortsätt bara med uppgifterna nedan:

- [ ] **Uppdatera databasen för att använda PostgreSQL**
- [ ] **Uppdatera koden för att använda PostgreSQL**
- [ ] **Skapa en docker-compose.yml-fil för att starta applikationen med PostgreSQL**
- [ ] **distribuera lokalt med docker compose**

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

_Distribuera lokalt med docker compose_

```
docker compose up ./docker/docker-compose.yml
```

_Stäng ner applikationen_

```
docker compose down ./docker/docker-compose.yml
```

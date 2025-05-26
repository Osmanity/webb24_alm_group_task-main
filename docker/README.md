# Docker Instructions

## Build the Docker image

```bash
docker build -f docker/dockerfile -t webb24-alm-app .
```

## Run the container

```bash
docker run -p 3000:3000 webb24-alm-app
```

## Run with custom environment variables

```bash
docker run -p 3000:3000 -e NODE_ENV=production -e PORT=3000 webb24-alm-app
```

## Run with volume for persistent database

```bash
docker run -p 3000:3000 -v $(pwd)/data:/app/data webb24-alm-app
```
Open Docker desktop for more info 

The application will be available at http://localhost:3000 
full-up: docker-down docker-pull docker-up
down: docker-down
release: docker-build docker-push

docker-up:
	docker-compose  -f docker-compose.staging.yml up --build -d

docker-down:
	docker-compose -f docker-compose.staging.yml down --remove-orphans --volumes

docker-pull:
	docker-compose -f docker-compose.staging.yml pull

docker-build:
	docker build -f .docker/staging/nodejs/Dockerfile -t kopnikorg/kopnik-client-staging:latest .

docker-push:
	docker push kopnikorg/kopnik-client-staging:latest

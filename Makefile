up: docker-pull docker-up
down: docker-down

docker-up:
	docker-compose  -f docker-compose.staging.yml up --build -d

docker-down:
	docker-compose -f docker-compose.staging.yml down --remove-orphans --volumes

docker-pull:
	docker-compose -f docker-compose.staging.yml pull

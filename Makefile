.PHONY: up down build logs seed migrate reset clean status

up:
	docker compose up -d

build:
	docker compose up -d --build

down:
	docker compose down

logs:
	docker compose logs -f

seed:
	docker compose exec backend npx prisma db seed

migrate:
	docker compose exec backend npx prisma migrate deploy

reset:
	docker compose down -v
	docker compose up -d --build
	sleep 5
	docker compose exec backend npx prisma migrate deploy
	docker compose exec backend npx prisma db seed

clean:
	docker compose down -v --rmi all --remove-orphans

status:
	docker compose ps

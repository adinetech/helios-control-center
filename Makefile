.PHONY: up down logs migrate generate

up:
	docker compose up -d --build

down:
	docker compose down

logs:
	docker compose logs -f

migrate:
	docker compose exec backend npx prisma migrate dev --name init

generate:
	docker compose exec backend npx prisma generate

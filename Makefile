include .env

.PHONY: up
up:
  ifeq ($(NODE_ENV), "development")
	  docker-compose -f docker/docker-compose.yml -f docker/docker-compose.dev.yml up
  else
	  docker-compose -f docker/docker-compose.yml -f docker/docker-compose.prod.yml up
  endif


.PHONY: down
down:
  ifeq ($(NODE_ENV), "development")
	  docker-compose -f docker/docker-compose.yml -f docker/docker-compose.dev.yml down
  else
	  docker-compose -f docker/docker-compose.yml -f docker/docker-compose.prod.yml down
  endif


.PHONY: logs
logs:
  ifeq ($(NODE_ENV), "development")
	  docker-compose -f docker/docker-compose.yml -f docker/docker-compose.dev.yml logs
  else
	  docker-compose -f docker/docker-compose.yml -f docker/docker-compose.prod.yml logs
  endif

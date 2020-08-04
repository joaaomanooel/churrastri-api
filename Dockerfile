FROM node:13-slim

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY ["package.json", "yarn.lock", "/usr/src/app/"]


RUN if [ "$NODE_ENV" = "development" ]; \
	then yarn;  \
	else yarn install --frozen-lockfile  --production=true; \
	fi

COPY . /usr/src/app/

RUN ["chmod", "+x", "wait-for"]

EXPOSE ${PORT}

FROM oven/bun:latest

WORKDIR /usr/src/app

RUN apt-get update -y && \
    apt-get install -y curl openssl ca-certificates

# Install curl using apt | Instalar o curl usando o apt
RUN apt-get install -y curl

# Add NodeSource repository and install Node.js | Adicionar repositório NodeSource e instalar Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
  apt-get install -y nodejs


COPY package*.json ./
COPY bun*.lockb ./

RUN bun install 

COPY . .

EXPOSE 4000


RUN bunx prisma generate

RUN ls node_modules/ && sh

CMD ["bun", "index.ts"]

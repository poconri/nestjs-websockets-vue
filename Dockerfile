# Etapa de construcción del cliente
FROM node:16-alpine as build-client

WORKDIR /app/client

# Copiar los archivos de configuración del cliente y instalar las dependencias
COPY client/package*.json ./
RUN npm install

# Copiar el código fuente del cliente y construir el proyecto
COPY client/ ./
RUN npm run build

# Etapa de construcción del servidor
FROM node:16-alpine as build-server

WORKDIR /app/server

# Copiar los archivos de configuración del servidor y instalar las dependencias
COPY package*.json ./
RUN npm install

# Copiar el código fuente del servidor y construir el proyecto
COPY . .
RUN rm -rf client
RUN npm run build

# Etapa final
FROM node:16-alpine

WORKDIR /app

# Copiar los artefactos construidos desde las etapas anteriores
COPY --from=build-client /app/client/dist ./client/dist
COPY --from=build-server /app/server/dist ./server/dist
COPY --from=build-server /app/server/node_modules ./server/node_modules

EXPOSE 3000

CMD ["node", "server/dist/main.js"]



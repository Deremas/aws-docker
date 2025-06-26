# Stage 1: Build React frontend
FROM node:18 as build

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Serve with Express
FROM node:18

WORKDIR /app
COPY --from=build /app/build ./build
COPY server ./server
COPY package*.json ./
RUN npm install --omit=dev

EXPOSE 3002
CMD ["node", "server/index.js"]
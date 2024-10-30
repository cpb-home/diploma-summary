FROM node:20.10-alpine AS production
WORKDIR /app

COPY package*.json .

RUN npm install -g @nestjs/cli
RUN npm install

COPY . .

# COPY --from=build /app/dist ./dist

CMD ["npm", "run", "start:dev"]
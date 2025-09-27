FROM node:22-alpine

RUN mkdir /app

COPY . /app
WORKDIR /app

RUN rm -rf node_modules
RUN npm ci
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start"]

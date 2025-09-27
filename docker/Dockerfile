FROM node:22-alpine

ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG SUPABASE_SERVICE_ROLE_KEY

RUN mkdir /app

COPY . /app
WORKDIR /app

RUN rm -rf node_modules
RUN npm ci
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start"]

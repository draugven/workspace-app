FROM node:22-alpine

ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG SUPABASE_SERVICE_ROLE_KEY

# Convert to environment variables (if needed at runtime)
ENV DATABASE_URL=$DATABASE_URL
ENV API_KEY=$API_KEY
ENV SECRET_TOKEN=$SECRET_TOKEN

RUN mkdir /app

COPY . /app
WORKDIR /app

RUN rm -rf node_modules
RUN npm ci
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start"]

FROM node:22-alpine

ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG SUPABASE_SERVICE_ROLE_KEY

RUN mkdir /app

COPY . /app
WORKDIR /app

# Create .env file with the build arguments
RUN echo "NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}" > .env && \
    echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}" >> .env && \
    echo "SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}" >> .env

RUN cat .env


RUN rm -rf node_modules
RUN npm ci
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start"]

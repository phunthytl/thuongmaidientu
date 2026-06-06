# syntax=docker/dockerfile:1.7

# ---------- Stage 1: Build ----------
FROM node:20-alpine AS builder

WORKDIR /build

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG REACT_APP_API_URL=/api
ENV REACT_APP_API_URL=${REACT_APP_API_URL}
ENV CI=true
ENV GENERATE_SOURCEMAP=false

RUN npm run build

# ---------- Stage 2: Runtime (Nginx) ----------
FROM nginx:alpine AS runtime

RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /build/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost/ >/dev/null || exit 1

CMD ["nginx", "-g", "daemon off;"]

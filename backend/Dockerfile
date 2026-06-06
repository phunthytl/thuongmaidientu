# syntax=docker/dockerfile:1.7

# ---------- Stage 1: Build ----------
FROM maven:3.9-eclipse-temurin-21 AS builder

WORKDIR /build

COPY pom.xml ./
COPY .mvn ./.mvn
COPY mvnw mvnw.cmd ./
RUN mvn -B dependency:go-offline

COPY src ./src
RUN mvn -B clean package -DskipTests \
    && mv target/*.jar target/app.jar

# ---------- Stage 2: Runtime ----------
FROM eclipse-temurin:21-jre-alpine AS runtime

RUN addgroup -S spring && adduser -S spring -G spring

WORKDIR /app

COPY --from=builder --chown=spring:spring /build/target/app.jar app.jar

USER spring

EXPOSE 8080

ENV JAVA_OPTS="-XX:+UseG1GC -XX:MaxRAMPercentage=75.0 -Djava.security.egd=file:/dev/./urandom"

HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD wget -qO- http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -jar app.jar"]

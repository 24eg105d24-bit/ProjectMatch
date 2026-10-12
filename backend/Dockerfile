# ==============================================================================
# Multi-Stage Dockerfile for ProjectMatch Backend (Spring Boot 3.3.4 / Java 17)
# ==============================================================================

# Stage 1: Build executable JAR using Maven
FROM maven:3.9.9-eclipse-temurin-17-alpine AS builder

WORKDIR /build

# Copy Maven POM and download dependencies for efficient layer caching
COPY pom.xml .
RUN mvn dependency:go-offline -B || true

# Copy source code and build the executable fat JAR
COPY src ./src
RUN mvn clean package -DskipTests -B

# Stage 2: Minimal runtime image
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Run container as a dedicated non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy executable fat JAR from builder stage
COPY --from=builder /build/target/projectmatch-backend-0.0.1-SNAPSHOT.jar app.jar

# Set ownership
RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 8080

# Health check using the /api/health endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:8080/api/health || exit 1

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]

FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy pre-built JAR instead of building inside Docker
COPY build/libs/*.jar app.jar

# Create themes directory
RUN mkdir -p /app/themes

EXPOSE 8090

CMD ["java", "-jar", "app.jar"]
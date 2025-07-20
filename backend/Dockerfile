FROM openjdk:17-jdk-slim

WORKDIR /app

COPY gradlew .
COPY gradle gradle
COPY build.gradle.kts .
COPY src src

RUN chmod +x ./gradlew && ./gradlew build -x test

EXPOSE 8090

CMD ["java", "-jar", "build/libs/nova-iam-backend-0.0.1-SNAPSHOT.jar"]
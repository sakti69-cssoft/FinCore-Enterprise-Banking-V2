FROM eclipse-temurin:21-jre-alpine AS builder

WORKDIR /builder

ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} application.jar

RUN java -Djarmode=tools -jar application.jar extract --layers --destination extracted

# Split the large dependencies layer into 6 smaller groups
RUN mkdir -p split/1 split/2 split/3 split/4 split/5 split/6 && \
    i=0; \
    for f in $(du -k extracted/dependencies/lib/*.jar | sort -nr | cut -f2); do \
        i=$((i % 6 + 1)); \
        mv "$f" "split/$i/"; \
    done


FROM eclipse-temurin:21-jre-alpine

WORKDIR /application

RUN addgroup -S -g 10001 fincore && \
    adduser -S -D -H -u 10001 -G fincore fincore && \
    mkdir -p /application/lib
COPY --from=builder /builder/split/1/ ./lib/
COPY --from=builder /builder/split/2/ ./lib/
COPY --from=builder /builder/split/3/ ./lib/
COPY --from=builder /builder/split/4/ ./lib/
COPY --from=builder /builder/split/5/ ./lib/
COPY --from=builder /builder/split/6/ ./lib/

COPY --from=builder /builder/extracted/spring-boot-loader/ ./
COPY --from=builder /builder/extracted/snapshot-dependencies/ ./
COPY --from=builder /builder/extracted/application/ ./

EXPOSE 8080

USER 10001:10001

ENTRYPOINT ["java","-jar","application.jar"]
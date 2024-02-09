import { Kafka, logLevel } from "kafkajs";

export const kafka = new Kafka({
  logLevel: logLevel.DEBUG,
  brokers: ["192.168.29.216:9092"],
  clientId: "my-chatApp",
});

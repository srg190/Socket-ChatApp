import { Kafka, logLevel } from "kafkajs";

export default class KafkaClient {
  protected Kafka: Kafka;

  constructor() {
    this.Kafka = this.createKafkaClient();
  }

  private createKafkaClient(): Kafka {
    const kafka = new Kafka({
      // logLevel: logLevel.DEBUG,
      clientId: "my-chatApp",
      brokers: ["192.168.29.216:9092"],
    });
    return kafka;
  }

}

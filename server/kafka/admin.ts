import { Kafka, Producer } from "kafkajs";

export default class Admin {
  private producer: Producer;

  constructor() {
    this.producer = this.createProducer();
  }

  private createProducer(): Producer {
    const kafka = new Kafka({
      clientId: "producer-client",
      brokers: ["localhost:9092"],
    });

    return kafka.producer();
  }
}

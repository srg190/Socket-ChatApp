import { Message, Producer, ProducerBatch, TopicMessages } from "kafkajs";
import { SendMessage } from "../interface";

import KafkaClient from "./client";

interface CustomMessageFormat {
  wish: string;
}

export default class ProducerFactory extends KafkaClient {
  private producer: Producer;
  // private flag: Boolean = false;

  constructor() {
    super();
    this.producer = this.createProducer();
  }

  public async start(): Promise<void> {
    try {
      console.log("Producer is connecting...");
      await this.producer.connect();
      console.log("Producer is connected");
    } catch (error) {
      console.log("Error connecting the producer: ", error);
    }
  }

  public async shutdown(): Promise<void> {
    await this.producer.disconnect();
  }

  public async sendMessage(message: SendMessage): Promise<void> {
    const kafkaMessage: Message = {
      value: JSON.stringify(message),
      // partition: this.flag ? 0 : 1,
    };
    // this.flag = !this.flag;
    try {
      await this.producer.send({
        topic: "chat-messages",
        messages: [kafkaMessage],
      });
    } catch (error) {
      console.log("Error sending message: ", error);
    }
  }

  public async sendBatch(messages: Array<CustomMessageFormat>): Promise<void> {
    const kafkaMessages: Array<Message> = messages.map((message) => {
      return {
        value: JSON.stringify(message),
      };
    });

    const topicMessages: TopicMessages = {
      topic: "chat-messages",
      messages: kafkaMessages,
    };

    const batch: ProducerBatch = {
      topicMessages: [topicMessages],
    };

    await this.producer.sendBatch(batch);
  }

  private createProducer(): Producer {
    return this.Kafka.producer();
  }
}

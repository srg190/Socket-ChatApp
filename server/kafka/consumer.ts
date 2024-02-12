import {
  Consumer,
  ConsumerSubscribeTopics,
  EachBatchPayload,
  EachMessagePayload,
} from "kafkajs";
import KafkaClient from "./client";

interface ExampleMessageProcessor {
  processMessage(payload: EachMessagePayload): Promise<void>;
}

export default class ConsumerFactory extends KafkaClient {
  private kafkaConsumer: Consumer;
  private consumerGroup: string;
  // private messageProcessor: ExampleMessageProcessor;

  public constructor(consumerGroup: string) {
    super();
    // this.messageProcessor = messageProcessor;
    this.kafkaConsumer = this.createKafkaConsumer();
    this.consumerGroup = consumerGroup;
  }

  public async startConsumer(): Promise<void> {
    const topic: ConsumerSubscribeTopics = {
      topics: [this.consumerGroup],
      fromBeginning: true,
    };

    try {
      await this.kafkaConsumer.connect();
      await this.kafkaConsumer.subscribe(topic);

      await this.kafkaConsumer.run({
        eachMessage: async (messagePayload: EachMessagePayload) => {
          const { topic, partition, message } = messagePayload;
          const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`;
          console.log(`- ${prefix} ${message.key}#${message.value}`);
        },
      });
      console.log(this.kafkaConsumer.logger(), " logs data");
    } catch (error) {
      console.log("Error: ", error);
    }
  }

  public async startBatchConsumer(): Promise<void> {
    const topic: ConsumerSubscribeTopics = {
      topics: [this.consumerGroup],
      fromBeginning: true,
    };

    try {
      await this.kafkaConsumer.connect();
      await this.kafkaConsumer.subscribe(topic);
      await this.kafkaConsumer.run({
        eachBatch: async (eachBatchPayload: EachBatchPayload) => {
          const { batch } = eachBatchPayload;
          for (const message of batch.messages) {
            const prefix = `${batch.topic}[${batch.partition} | ${message.offset}] / ${message.timestamp}`;
            console.log(`- ${prefix} ${message.key || "key"}#${message.value}`);
          }
        },
      });
    } catch (error) {
      console.log("Error: ", error);
    }
  }

  public async shutdown(): Promise<void> {
    await this.kafkaConsumer.disconnect();
  }

  private createKafkaConsumer(): Consumer {
    const consumer = this.Kafka.consumer({ groupId: "consumer-group" });
    return consumer;
  }
}

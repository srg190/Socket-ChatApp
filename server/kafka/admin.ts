import { Admin, ITopicMetadata, Kafka, Producer } from "kafkajs";
import KafkaClient from "./client";

export default class kafkaAdmin extends KafkaClient {
  private admin: Admin;

  constructor() {
    super();
    this.admin = this.createAdmin();
  }

  public async getTopicsMetadata(): Promise<any> {
    try {
      const data = await this.admin.fetchTopicMetadata();
      console.log(data.topics, "Topics");
      return data.topics;
    } catch (error) {
      console.log("Error in getting topics", error);
    }
  }

  public async getTopicOffset() {
    try {
      return await this.admin.fetchTopicOffsets("chat-messages");
    } catch (error) {
      console.log("Error in getting topics offset", error);
    }
  }

  public async deleteTopicRecord({ offset = "-1" }: { offset: string }) {
    try {
      await this.admin.deleteTopicRecords({
        topic: "chat-messages",
        partitions: [
          {
            partition: 0,
            offset: offset,
          },
        ],
      });
    } catch (error) {
      console.log("Error in deleting Topic Records", error);
    }
  }

  public async deleteGroup({ groupId }: { groupId: string }) {
    try {
      await this.admin.deleteGroups([groupId]);
      console.log("group deleted successfully", groupId);
    } catch (error) {
      console.log("Error in deleting the group ", groupId);
    }
  }
  
  public createAdmin(): Admin {
    return this.Kafka.admin();
  }
}

import ProducerFactory from "./producer";
import ConsumerFactory from "./consumer";
import kafkaAdmin from "./admin";
import { SendMessage } from "../interface";

const producer = new ProducerFactory();
const consumer = new ConsumerFactory("chat-messages");
const admin = new kafkaAdmin();

(async () => {
  try {
    await producer.start();
    await consumer.startConsumer();
    // await consumer.startBatchConsumer();
  } catch (error) {
    console.log("error...", error);
    return new Error("Something went wrong");
  }
})();

export const kafkaController = async () => {
  try {
    // await producer.sendMessage({ wish: "Hello bhaiya" });
    // await producer.sendBatch([
    //   { wish: "Hello bhaiya" },
    //   { wish: "toh fir" },
    //   { wish: "haana" },
    //   { wish: "theek" },
    // ]);
    // await admin.getTopicsMetadata();
  } catch (error) {
    console.log("error...", error);
    return new Error("Something went wrong");
  }
};

export const sendToKafka = async (data: SendMessage) => {
  try {
    // getAllDataFromTopic();
    await producer.sendMessage({ ...data });
    const offSet = await admin.getTopicOffset();
    await admin.deleteTopicRecord({ offset: "-1" });
    console.log(offSet, " ---offSet");
  } catch (error) {
    return new Error("Something went wrong");
  }
};

export const getAllDataFromTopic = async () => {
  try {
    const newConsumer = new ConsumerFactory("temp-messages-handler");
    await newConsumer.startConsumer();
    await newConsumer.shutdown();
    await admin.deleteGroup({ groupId: "temp-messages-handler" });
  } catch (error) {
    console.log("Cant get whole data", error);
  }
};

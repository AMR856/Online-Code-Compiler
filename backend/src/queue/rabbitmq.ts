import amqp, { Channel, ChannelModel } from "amqplib";
import CustomError from "../types/customError";
import { HttpStatusText } from "../types/HTTPStatusText";

let channel: Channel | null = null;
let connection: ChannelModel | null = null;

// This module manages the RabbitMQ connection and channel. It provides functions to connect, get the channel for producing/consuming messages, and close the connection gracefully when the application shuts down.
export async function connectRabbitMQ() {
  connection = await amqp.connect("amqp://localhost");
  // Create a channel for sending/receiving messages. We keep this channel open for the lifetime of the application to reuse it for all queue operations.
  channel = await connection.createChannel();

  console.log("RabbitMQ connected");
}

// Getter for the channel
export function getChannel(): Channel {
  if (!channel) {
    throw new CustomError("RabbitMQ not connected", 500, HttpStatusText.ERROR);
  }
  return channel;
}

export async function closeRabbitMQ() {
  try {
    console.log(" Closing RabbitMQ...");

    // Closing the channel and connection gracefully
    if (channel) {
      await channel.close();
      channel = null;
    }

    // Closing the connection
    if (connection) {
      await connection.close();
      connection = null;
    }

    console.log("RabbitMQ closed");
  } catch (err) {
    console.error("Error closing RabbitMQ:", err);
  }
}

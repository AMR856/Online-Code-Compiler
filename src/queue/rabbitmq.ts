import amqp, { Channel, ChannelModel } from "amqplib";

let channel: Channel | null = null;
let connection: ChannelModel | null = null;

export async function connectRabbitMQ() {
  connection = await amqp.connect("amqp://localhost");
  channel = await connection.createChannel();

  console.log("✅ RabbitMQ connected");
}

export function getChannel(): Channel {
  if (!channel) {
    throw new Error("RabbitMQ not connected");
  }
  return channel;
}


export async function closeRabbitMQ() {
  try {
    console.log("🔌 Closing RabbitMQ...");

    if (channel) {
      await channel.close();
      channel = null;
    }

    if (connection) {
      await connection.close();
      connection = null;
    }

    console.log("RabbitMQ closed");
  } catch (err) {
    console.error("Error closing RabbitMQ:", err);
  }
}
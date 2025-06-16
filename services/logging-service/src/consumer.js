const amqp = require('amqplib');
const { saveLogActivity } = require('./services/logActivityService');

const exchangeName = 'hibiki_events';
const queueName = 'logging_queue';
let channel = null;
let connection = null;

async function startConsumer() {
    try {
        const RABBITMQ_URL =
            process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';

        connection = await amqp.connect(RABBITMQ_URL);
        channel = await connection.createChannel();

        // Add error handling for connection and channel
        connection.on('error', (err) => {
            console.error(
                '[Logging Service] RabbitMQ Connection error:',
                err.message
            );
            // Attempt to clean up and set flags for potential re-connection
            channel = null;
            connection = null;
            // You might want to implement a reconnection strategy here
        });
        connection.on('close', () => {
            console.warn('[Logging Service] RabbitMQ Connection closed.');
            channel = null;
            connection = null;
            // You might want to implement a reconnection strategy here
        });
        channel.on('error', (err) => {
            console.error(
                '[Logging Service] RabbitMQ Channel error:',
                err.message
            );
            channel = null;
        });

        await channel.assertExchange(exchangeName, 'topic', { durable: true });

        await channel.assertQueue(queueName, {
            durable: true,
        });

        console.log(
            `[Logging Service] Waiting for messages in queue: ${queueName}`
        );

        // IMPORTANT: Bind the logging_queue to the exchange
        // What binding key? If you want ALL events for logging, use '#'.
        // If you only want 'user' related events, use 'user.*'.
        // Let's use '#' for now to catch all events for logging.
        await channel.bindQueue(queueName, exchangeName, '#'); // Bind to all events from the exchange
        console.log(
            `[Logging Service] Bound queue '${queueName}' to exchange '${exchangeName}' with binding key '#'.`
        );

        channel.consume(
            queueName,
            async (msg) => {
                if (msg) {
                    const eventPayload = JSON.parse(msg.content.toString());
                    const routingKey = msg.fields.routingKey;

                    console.log(
                        `[Logging Service] Received event '${routingKey}'`
                    );

                    try {
                        // Membuat log menjadi lebih generik dan terstruktur
                        const logData = {
                            // Coba ambil user_id, jika tidak ada, set ke null.
                            user_id:
                                eventPayload.user_id ||
                                eventPayload.userId ||
                                null,
                            // Jadikan routingKey sebagai tipe aktivitas. Sangat informatif!
                            activity_type: routingKey,
                            // Simpan seluruh payload event sebagai deskripsi. Ini memberi konteks penuh.
                            activity_description: JSON.stringify(eventPayload),
                        };

                        await saveLogActivity(logData);

                        channel.ack(msg);
                    } catch (e) {
                        console.error(
                            '[Logging Service] Error processing message:',
                            e
                        );
                        channel.nack(msg, false, false);
                    }
                }
            },
            {
                noAck: false, // Ensure we manually acknowledge messages
            }
        );
    } catch (error) {
        console.error('[Logging Service] Error starting consumer:', error);
    }
}

module.exports = { startConsumer };

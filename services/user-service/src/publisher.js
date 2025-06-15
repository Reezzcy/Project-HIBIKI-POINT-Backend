const amqp = require('amqplib');

const exchangeName = 'hibiki_events';
let channel = null;
let connection = null;

async function connectPublisher() {
    try {
        const RABBITMQ_URL =
            process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';

        connection = await amqp.connect(RABBITMQ_URL);
        channel = await connection.createChannel();

        await channel.assertExchange(exchangeName, 'topic', { durable: true });
        console.log('[User Service] Publisher connected to Exchange');

        // Add error handling for the connection and channel
        connection.on('error', (err) => {
            console.error(
                '[User Service] RabbitMQ Connection error:',
                err.message
            );
            channel = null; // Invalidate channel on error
            connection = null;
            // Optionally implement a reconnect strategy here
        });
        connection.on('close', () => {
            console.warn('[User Service] RabbitMQ Connection closed.');
            channel = null; // Invalidate channel on close
            connection = null;
            // Optionally implement a reconnect strategy here
        });
        channel.on('error', (err) => {
            console.error(
                '[User Service] RabbitMQ Channel error:',
                err.message
            );
            channel = null; // Invalidate channel on error
        });
    } catch (error) {
        console.error('Error connecting publisher:', error);
    }
}

function publishEvent(routingKey, data) {
    if (channel) {
        try {
            const message = JSON.stringify(data);

            channel.publish(exchangeName, routingKey, Buffer.from(message));
            console.log(
                `[User Service] Published event '${routingKey}' to exchange '${exchangeName}'`
            );
        } catch (error) {
            console.error(
                `[User Service] Failed to publish event '${routingKey}':`,
                error.message
            );
        }
    } else {
        console.error('Cannot publish event, channel is not available.');
    }
}

module.exports = { connectPublisher, publishEvent };

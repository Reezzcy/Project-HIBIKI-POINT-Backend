const amqp = require('amqplib');
const { sendEmail } = require('./services/emailService');
const { Notification } = require('./models/notification');

const exchangeName = 'hibiki_events';
let channel = null;
let connection = null;

async function handleUserRegistered(event) {
    const { user_email, user_name, user_id } = event;
    const subject = 'Selamat Datang di Hibiki Point!';
    const text = `Hai ${user_name}, terima kasih sudah bergabung dengan kami!`;

    await sendEmail(user_email, subject, text);

    await Notification.create({
        user_id: user_id,
        task_id: null,
        title: subject,
        body: text,
        type: 'WELCOME_EMAIL',
        is_read: false,
    });
}

async function handleUserLoggedIn(event) {
    const { user_email, user_name, user_id } = event;
    const subject = 'Aktivitas Login Baru';
    const text = `Hai ${user_name}, kami mendeteksi aktivitas login baru pada akun Anda di ${new Date().toLocaleString(
        'id-ID'
    )}. Jika ini bukan Anda, segera amankan akun Anda.`;

    await sendEmail(user_email, subject, text);

    await Notification.create({
        user_id: user_id,
        task_id: null,
        title: subject,
        body: text,
        type: 'SECURITY_ALERT',
        is_read: false,
    });
}

async function startConsumer() {
    try {
        const RABBITMQ_URL =
            process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';

        connection = await amqp.connect(RABBITMQ_URL);
        channel = await connection.createChannel();

        // Add these global error handlers as discussed in previous answers:
        connection.on('error', (err) => {
            console.error(
                '[Notification Service] RabbitMQ Connection error:',
                err.message
            );
            channel = null;
            connection = null; // Invalidate
            // Reconnection logic
        });
        connection.on('close', () => {
            console.warn('[Notification Service] RabbitMQ Connection closed.');
            channel = null;
            connection = null; // Invalidate
            // Reconnection logic
        });
        channel.on('error', (err) => {
            console.error(
                '[Notification Service] RabbitMQ Channel error:',
                err.message
            );
            channel = null; // Invalidate
        });

        await channel.assertExchange(exchangeName, 'topic', { durable: true });

        // Buat queue eksklusif untuk service ini
        const q = await channel.assertQueue('', { exclusive: true });
        console.log(
            `[Notification Service] Waiting for events in queue: ${q.queue}`
        );

        // Binding ke event yang ingin didengarkan
        // Pola: <entity>.<event>
        channel.bindQueue(q.queue, exchangeName, 'user.registered');
        channel.bindQueue(q.queue, exchangeName, 'user.loggedIn');
        // Nanti kita bisa tambah: channel.bindQueue(q.queue, exchangeName, 'task.reminder_due');

        channel.consume(
            q.queue,
            async (msg) => {
                if (msg) {
                    const event = JSON.parse(msg.content.toString());
                    const routingKey = msg.fields.routingKey;
                    console.log(
                        `[Notification Service] Received event: ${routingKey}`
                    );

                    try {
                        switch (routingKey) {
                            case 'user.registered':
                                await handleUserRegistered(event);
                                break;
                            case 'user.loggedIn':
                                await handleUserLoggedIn(event);
                                break;
                        }
                        channel.ack(msg);
                    } catch (err) {
                        console.error('Error processing event:', err);
                        channel.nack(msg, false, false);
                    }
                }
            },
            { noAck: false }
        ); // Gunakan manual acknowledgement
    } catch (error) {
        console.error('Consumer error:', error);
    }
}

module.exports = { startConsumer };

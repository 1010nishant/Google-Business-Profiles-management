import amqp from "amqplib/callback_api.js";
import batchUpdate from "../models/batchUpdate.js";

class BatchUpdateService {
    constructor() {
        this.channel = null;
        this.queueName = 'listing-updates';
    }

    async initialize() {
        const connection = await amqp.connect(process.env.RABBITMQ_URL);
        this.channel = await connection.createChannel();
        await this.channel.assertQueue(this.queueName);
    }

    async processBatch(organizationId, listings) {
        // Create batch record
        const batch = await batchUpdate.create(organizationId, listings.length);

        // Queue listings for processing
        for (const listing of listings) {
            await this.queueListingUpdate(batch.batch_id, listing);
        }

        return batch;
    }

    async queueListingUpdate(batchId, listing) {
        const message = {
            batchId,
            listing,
            attempts: 0,
            timestamp: Date.now()
        };

        await this.channel.sendToQueue(
            this.queueName,
            Buffer.from(JSON.stringify(message)),
            { persistent: true }
        );
    }
}

export default new BatchUpdateService();
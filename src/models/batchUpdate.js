class BatchUpdate {
    static async create(organizationId, totalListings) {
        const batchId = `batch_${Date.now()}`;

        const result = await pool.query(
            `INSERT INTO batch_updates 
         (organization_id, batch_id, total_listings, status)
         VALUES ($1, $2, $3, 'processing')
         RETURNING *`,
            [organizationId, batchId, totalListings]
        );
        return result.rows[0];
    }

    static async updateStatus(batchId, { success_count, failed_count, status }) {
        const result = await pool.query(
            `UPDATE batch_updates
         SET 
           success_count = success_count + $2,
           failed_count = failed_count + $3,
           status = CASE 
             WHEN (success_count + failed_count + $2 + $3) = total_listings THEN 'completed'
             ELSE $4
           END,
           completed_at = CASE 
             WHEN (success_count + failed_count + $2 + $3) = total_listings THEN CURRENT_TIMESTAMP
             ELSE completed_at
           END
         WHERE batch_id = $1
         RETURNING *`,
            [batchId, success_count || 0, failed_count || 0, status || 'processing']
        );
        return result.rows[0];
    }

    static async getBatchStatus(batchId) {
        const result = await pool.query(
            `SELECT 
          b.*,
          o.name as organization_name,
          (b.success_count + b.failed_count)::float / b.total_listings * 100 as progress_percentage
         FROM batch_updates b
         JOIN organizations o ON b.organization_id = o.id
         WHERE b.batch_id = $1`,
            [batchId]
        );
        return result.rows[0];
    }

    static async getFailedUpdates(batchId) {
        const result = await pool.query(
            'SELECT * FROM batch_update_logs WHERE batch_id = $1 AND status = $2',
            [batchId, 'failed']
        );
        return result.rows;
    }
}

export default new BatchUpdate()
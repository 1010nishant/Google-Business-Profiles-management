import { pool } from "../db/index.js";

class AnalyticsService {
  async getDashboardMetrics(organizationId) {
    const metrics = await pool.query(`
      WITH review_metrics AS (
        SELECT 
          COUNT(*) as total_reviews,
          COUNT(response) as responded_reviews,
          AVG(rating) as avg_rating
        FROM reviews
        WHERE organization_id = $1
      ),
      update_metrics AS (
        SELECT 
          COUNT(*) as total_updates,
          COUNT(CASE WHEN status = 'success' THEN 1 END) as successful_updates
        FROM batch_updates
        WHERE organization_id = $1
      ),
      quota_metrics AS (
        SELECT 
          quota_limit,
          quota_used
        FROM api_quota
        WHERE organization_id = $1
        AND date_trunc('hour', timestamp) = date_trunc('hour', NOW())
      )
      SELECT 
        (SELECT COUNT(*) FROM business_listings WHERE organization_id = $1) as total_listings,
        rm.responded_reviews::float / NULLIF(rm.total_reviews, 0) as response_rate,
        rm.avg_rating,
        um.successful_updates::float / NULLIF(um.total_updates, 0) as update_success_rate,
        qm.quota_used::float / NULLIF(qm.quota_limit, 0) as quota_utilization
      FROM review_metrics rm
      CROSS JOIN update_metrics um
      CROSS JOIN quota_metrics qm
    `, [organizationId]);

    return metrics.rows[0];
  }
}

export default new AnalyticsService();
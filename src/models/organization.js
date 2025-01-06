import { pool } from "../db/index.js";

class Organization {
    static async findById(id) {
        const result = await pool.query('SELECT * FROM organizations WHERE id = $1', [id]);
        return result.rows[0];
    }

    static async getTierLimits(id) {
        const org = await this.findById(id);
        const limits = {
            free: 100,
            pro: 1000,
            enterprise: Infinity
        };
        return limits[org.subscription_tier];
    }
}

export default Organization
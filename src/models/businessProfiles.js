import { pool } from "../db";

class BusinessProfile {
    static async create(data) {
        const result = await pool.query(
            `INSERT INTO business_profiles 
        (organization_id, google_business_id, name, category, address, phone, website, metadata) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
        RETURNING *`,
            [data.organization_id, data.google_business_id, data.name, data.category,
            data.address, data.phone, data.website, data.metadata]
        );
        return result.rows[0];
    }

    static async findByOrganization(organizationId) {
        const result = await pool.query(
            'SELECT * FROM business_profiles WHERE organization_id = $1',
            [organizationId]
        );
        return result.rows;
    }
}

export default BusinessProfile
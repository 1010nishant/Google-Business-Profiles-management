# 🚀 **Project Overview**
This SaaS platform enables organizations to manage multiple **Google Business Profiles** at scale. Organizations can:
- Manage multiple **business listings**.
- Handle **reviews automatically using AI**.
- Track **performance through analytics**.

---

## 📊 **Database Schema**

### **Organizations**
```sql
CREATE TABLE organizations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    subscription_tier VARCHAR(20) NOT NULL DEFAULT 'free', -- free, pro, enterprise
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **Business Profiles**
```sql
CREATE TABLE business_profiles (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER REFERENCES organizations(id),
    google_business_id VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    address JSONB,
    phone VARCHAR(50),
    website VARCHAR(255),
    status VARCHAR(20) DEFAULT 'active',
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **Reviews**
```sql
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    business_profile_id INTEGER REFERENCES business_profiles(id),
    reviewer_name VARCHAR(255),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    review_date TIMESTAMP,
    sentiment VARCHAR(20), -- positive, negative, neutral
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **Review Responses**
```sql
CREATE TABLE review_responses (
    id SERIAL PRIMARY KEY,
    review_id INTEGER REFERENCES reviews(id),
    response_text TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- pending, posted, failed
    generated_by VARCHAR(20) DEFAULT 'ai', -- ai, manual
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    posted_at TIMESTAMP
);
```

### **Batch Updates**
```sql
CREATE TABLE batch_updates (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER REFERENCES organizations(id),
    batch_id VARCHAR(255) UNIQUE NOT NULL,
    total_listings INTEGER NOT NULL,
    success_count INTEGER DEFAULT 0,
    failed_count INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'processing', -- processing, completed, failed
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);
```

## Rate Limiter with Redis
### Overview
- **Free Tier:** 100 requests/hour
- **Pro Tier:** 1000 requests/hour
- **Enterprise Tier:** Unlimited requests

---

## API Documentation

### **1. POST /api/review**
- **Description:** Generate AI-powered review responses.
- **Request Body:**
```json
{
    "text": "I got average service",
    "rating": 3,
    "business_category": "FOOD"
}
```
- **Response:**
```json
{
    "response": "Thank you for your feedback! We're working to improve our services."
}
```

---

### **2. POST /api/batch-update**
- **Description:** Submit a batch update for business listings.
- **Process:**
  - Message queued with RabbitMQ.
  - Automatic retries (up to 3 attempts).
  - Real-time progress tracking.
  - Rollback on failure.
- **Response:**
```json
{
    "batch_id": "12345",
    "status": "processing"
}
```

---

### **3. GET /api/analytics**
- **Description:** Fetch analytics dashboard data.
- **Metrics:**
  - Total listings per organization
  - Review response rate
  - Average rating
  - Listing update success rate
  - API quota utilization
- **Response:**
```json
{
    "total_listings": 200,
    "review_response_rate": 85,
    "average_rating": 4.5,
    "success_rate": 95,
    "quota_usage": 70
}
```

---
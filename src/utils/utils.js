// Function to convert seconds into HH:MM:SS format
export const formatTTL = (ttl) => {
    if (ttl < 0) return null; // If TTL is negative, return null (key doesn't exist or no expiration set)

    const hours = Math.floor(ttl / 3600);  // Hours
    const minutes = Math.floor((ttl % 3600) / 60);  // Minutes
    const seconds = ttl % 60;  // Seconds

    return `${hours}h ${minutes}m ${seconds}s`;
};
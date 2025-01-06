import OpenAI from "openai";
import configuration from "../config/configuration.js";
const config = configuration()

// Initialize OpenAI Client
const openai = new OpenAI({
    apiKey: config.SECRET_KEY.OPEN_AI
});

class ReviewService {
    /**
    * Generate a professional response for a business review.
    * @param {Object} review - The review details.
    * @returns {Promise<string>} - Generated response.
    */
    async generateResponse(review) {
        try {
            const sentiment = await this.analyzeSentiment(review.text);

            const prompt = `
          Generate a professional response for a ${review.business_category} business review.
          Rating: ${review.rating}/5
          Review: ${review.text}
          Sentiment: ${sentiment}
          Previous responses: ${review?.previous_responses.map(r => r.text).join('\n') || 'None'}

          Please generate a response that:
            1. Acknowledges the customer's feedback
            2. Maintains the business's professional tone
            3. Addresses specific points mentioned in the review
            4. Provides resolution for any issues (if applicable)
            5. Thanks the customer for their feedback
        `;

            const completion = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "You are a professional business representative." },
                    { role: "user", content: prompt }
                ]
            });

            return completion.choices[0].message.content;
        } catch (error) {
            console.error('Error generating review response:', error);
            throw error;
        }
    }

    async analyzeSentiment(text) {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "Analyze the sentiment of the following text and respond with either POSITIVE, NEGATIVE, or NEUTRAL."
                },
                { role: "user", content: text }
            ]
        });

        return completion.choices[0].message.content;
    }
    async saveResponse(reviewId, responseText) {
        // Save response to database
    }
}

export default new ReviewService();

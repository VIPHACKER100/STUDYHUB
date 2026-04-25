import { GoogleGenerativeAI } from '@google/generative-ai';
import pdf from 'pdf-parse';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

/**
 * AI Service for document processing
 */
class AIService {
    /**
     * Extracts text from a PDF file
     * @param {string} filePath 
     * @returns {Promise<string>}
     */
    async extractText(filePath) {
        try {
            const dataBuffer = fs.readFileSync(filePath);
            const data = await pdf(dataBuffer);
            return data.text;
        } catch (error) {
            console.error('Text extraction failed:', error);
            throw new Error('Could not extract text from document');
        }
    }

    /**
     * Generates a summary for the given text
     * @param {string} text 
     * @returns {Promise<string>}
     */
    async summarize(text) {
        try {
            if (!genAI) {
                console.warn('GEMINI_API_KEY not found. Using fallback mock summary.');
                return this.generateMockSummary(text);
            }

            const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
            
            const prompt = `
                Summarize the following educational content in a concise way. 
                Provide key takeaways, main concepts, and a 3-sentence overview.
                Use bullet points for key takeaways.
                
                Content:
                ${text.substring(0, 10000)} // Limiting to 10k chars for basic model
            `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error('AI Summarization failed:', error);
            return this.generateMockSummary(text);
        }
    }

    /**
     * Generates a mock summary if AI is not available
     * @param {string} text 
     * @returns {string}
     */
    generateMockSummary(text) {
        const cleanText = text.replace(/\s+/g, ' ').trim();
        const sentences = cleanText.split(/[.!?]+/).filter(s => s.length > 20);
        
        const overview = sentences.slice(0, 3).join('. ') + '.';
        const takeaways = sentences.slice(4, 9).map(s => `• ${s.trim()}`).join('\n');
        
        return `
### Overview (Preview Mode)
${overview}

### Key Takeaways
${takeaways || '• Detailed content analysis requires a live AI connection.'}

*Note: This is a basic preview. Connect a Gemini API key for advanced AI insights.*
        `.trim();
    }
}

export default new AIService();

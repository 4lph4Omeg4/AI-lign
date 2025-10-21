import { GoogleGenerativeAI } from '@google/genai';
import { UserProfile, Message } from '../types';

// Initialize the Gemini API
// You'll need to set your API key as an environment variable or hardcode it here (not recommended for production)
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY || '';
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

/**
 * Generates a realistic chat response from a matched profile based on their personality
 */
export const generateChatResponse = async (
    profile: UserProfile,
    conversationHistory: Message[],
    userMessage: string
): Promise<string> => {
    try {
        if (!genAI) {
            throw new Error('Gemini API key not configured');
        }
        
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        // Build conversation context
        const recentMessages = conversationHistory.slice(-6); // Last 6 messages for context
        const conversationContext = recentMessages
            .map(msg => `${msg.sender === 'user' ? 'Me' : profile.name}: ${msg.text || '[sent an image]'}`)
            .join('\n');

        // Create a personality-driven prompt
        const prompt = `You are ${profile.name}, a ${profile.age}-year-old person on a dating app. 

Your bio: "${profile.bio}"
Your interests: ${profile.interests.join(', ')}

You're chatting with someone you matched with. Be flirty, engaging, and authentic. Keep responses concise (1-3 sentences) and natural, like real text messages. Show interest, ask questions, and reference your interests or bio when relevant.

Recent conversation:
${conversationContext}
Me: ${userMessage}

Respond as ${profile.name} (just the message, no labels or formatting):`;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        
        return text.trim();
    } catch (error) {
        console.error('Error generating chat response:', error);
        
        // Fallback responses based on profile personality
        const fallbackResponses = [
            "That's interesting! Tell me more 😊",
            "Haha I like your vibe! What else are you into?",
            "You seem cool! What do you do for fun?",
            "Nice! I'm really into " + (profile.interests[0] || "music") + " too",
            "That's awesome! What made you interested in that?",
        ];
        
        return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    }
};

/**
 * Generates an opening message from a matched profile (if they message first)
 */
export const generateOpeningMessage = async (profile: UserProfile, matchedUserProfile: UserProfile): Promise<string> => {
    try {
        if (!genAI) {
            throw new Error('Gemini API key not configured');
        }
        
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const prompt = `You are ${profile.name}, a ${profile.age}-year-old person on a dating app.

Your bio: "${profile.bio}"
Your interests: ${profile.interests.join(', ')}

You just matched with ${matchedUserProfile.name} who is interested in: ${matchedUserProfile.interests.join(', ')}.

Send them a fun, flirty opening message (1-2 sentences). Be creative and reference a shared interest if there is one:`;

        const result = await model.generateContent(prompt);
        const response = result.response;
        return response.text().trim();
    } catch (error) {
        console.error('Error generating opening message:', error);
        return `Hey! I saw we both like ${profile.interests[0] || "similar things"} 😊 What's up?`;
    }
};

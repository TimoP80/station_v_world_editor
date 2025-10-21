
import { GoogleGenAI, Type } from "@google/genai";
import { AIModel, MassAddMethod, VirtualUser, WritingStyle, Fluency, LanguageSkill } from '../types';
import { PERSONALITY_TEMPLATES, LANGUAGES, FLUENCY_LEVELS, FORMALITY_LEVELS, VERBOSITY_LEVELS, HUMOR_LEVELS, EMOJI_LEVELS, PUNCTUATION_LEVELS } from '../constants';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
    console.error("Gemini API key not found. Please set the API_KEY environment variable.");
}
const ai = new GoogleGenAI({ apiKey: API_KEY });

const userSchema = {
    type: Type.OBJECT,
    properties: {
        nickname: { type: Type.STRING, description: 'A creative and unique nickname. Should not contain spaces or special characters other than underscores or hyphens.' },
        personality: { type: Type.STRING, description: 'A detailed description of the user\'s personality, quirks, and interests. Should be 2-3 sentences long.' },
        languageSkills: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    language: { type: Type.STRING, description: 'A language the user speaks.' },
                    fluency: { type: Type.STRING, enum: Object.values(Fluency), description: 'The user\'s fluency level in this language.' },
                    accent: { type: Type.STRING, description: 'An optional accent or dialect. e.g., "British", "Southern American".' }
                },
                required: ['language', 'fluency']
            }
        },
        writingStyle: {
            type: Type.OBJECT,
            properties: {
                formality: { type: Type.STRING, enum: FORMALITY_LEVELS },
                verbosity: { type: Type.STRING, enum: VERBOSITY_LEVELS },
                humor: { type: Type.STRING, enum: HUMOR_LEVELS },
                emojiUsage: { type: Type.STRING, enum: EMOJI_LEVELS },
                punctuation: { type: Type.STRING, enum: PUNCTUATION_LEVELS }
            },
            required: ['formality', 'verbosity', 'humor', 'emojiUsage', 'punctuation']
        }
    },
    required: ['nickname', 'personality', 'languageSkills', 'writingStyle']
};

const generateRandomAttribute = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const generateRandomUser = (existingNicknames: string[]): Omit<VirtualUser, 'id'> => {
    let nickname: string;
    do {
        const adjectives = ["Cool", "Silly", "Clever", "Lazy", "Happy", "Angry"];
        const nouns = ["Cat", "Dog", "Coder", "Ghost", "Ninja", "Rider"];
        nickname = `${generateRandomAttribute(adjectives)}${generateRandomAttribute(nouns)}${Math.floor(Math.random() * 900) + 100}`;
    } while (existingNicknames.includes(nickname));

    const template = generateRandomAttribute(PERSONALITY_TEMPLATES);

    return {
        nickname,
        personality: template.description,
        languageSkills: [{
            language: generateRandomAttribute(LANGUAGES),
            fluency: generateRandomAttribute(FLUENCY_LEVELS),
            accent: ''
        }],
        writingStyle: {
            formality: generateRandomAttribute(FORMALITY_LEVELS),
            verbosity: generateRandomAttribute(VERBOSITY_LEVELS),
            humor: generateRandomAttribute(HUMOR_LEVELS),
            emojiUsage: generateRandomAttribute(EMOJI_LEVELS),
            punctuation: generateRandomAttribute(PUNCTUATION_LEVELS)
        }
    };
};

const withRetry = async <T,>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> => {
    try {
        return await fn();
    } catch (error) {
        if (retries > 0) {
            console.warn(`API call failed, retrying in ${delay}ms...`, error);
            await new Promise(res => setTimeout(res, delay));
            return withRetry(fn, retries - 1, delay * 2);
        }
        throw error;
    }
};

export const generateNickname = async (model: AIModel): Promise<string> => {
    return withRetry(async () => {
        try {
            const response = await ai.models.generateContent({
                model,
                contents: `Generate a single, creative, and unique IRC-style nickname. It should be one word, alphanumeric, and may contain underscores or hyphens. Examples: "CyberNinja", "Glitch_King", "EchoSphere".`,
            });
            return response.text.trim().replace(/\s/g, '_').replace(/[^a-zA-Z0-9_-]/g, '');
        } catch (error) {
            console.error('AI nickname generation failed, falling back to random.', error);
            return generateRandomUser([]).nickname;
        }
    });
};

export const generateUsers = async (
    count: number,
    method: MassAddMethod,
    model: AIModel,
    existingNicknames: string[]
): Promise<Omit<VirtualUser, 'id'>[]> => {

    if (method === MassAddMethod.RANDOM) {
        return Array.from({ length: count }, () => generateRandomUser(existingNicknames));
    }
    
    if (method === MassAddMethod.TEMPLATE) {
        return Array.from({ length: count }, () => {
            const randomUser = generateRandomUser(existingNicknames);
            const template = generateRandomAttribute(PERSONALITY_TEMPLATES);
            return {
                ...randomUser,
                personality: template.description
            };
        });
    }

    // AI Generation
    return withRetry(async () => {
        const prompt = `Generate ${count} unique virtual user profiles for an IRC simulation.
        Each user must have a unique nickname that is not in this list: [${existingNicknames.join(', ')}].
        Provide detailed and creative personalities.
        Ensure the output is a valid JSON array where each object matches the provided schema.
        Do not include markdown backticks in the response. Just the raw JSON.`;

        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: userSchema
                }
            }
        });

        const jsonStr = response.text.trim();
        const generatedUsers = JSON.parse(jsonStr) as Omit<VirtualUser, 'id'>[];

        // Sanitize and ensure uniqueness
        const finalUsers = [];
        const usedNicks = new Set(existingNicknames);
        for (const user of generatedUsers) {
            let sanitizedNick = user.nickname.replace(/\s/g, '_').replace(/[^a-zA-Z0-9_-]/g, '');
            if(usedNicks.has(sanitizedNick)) {
                sanitizedNick = `${sanitizedNick}_${Math.floor(Math.random() * 100)}`;
            }
            usedNicks.add(sanitizedNick);
            finalUsers.push({ ...user, nickname: sanitizedNick });
        }
        
        return finalUsers;
    });
};

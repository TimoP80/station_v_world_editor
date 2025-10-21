
export type AIModel = 'gemini-2.5-flash' | 'gemini-flash-latest' | 'gemini-2.5-pro';

export enum Fluency {
    NATIVE = 'Native',
    FLUENT = 'Fluent',
    ADVANCED = 'Advanced',
    INTERMEDIATE = 'Intermediate',
    BEGINNER = 'Beginner'
}

export interface LanguageSkill {
    language: string;
    fluency: Fluency;
    accent: string;
}

export interface WritingStyle {
    formality: 'Very Informal' | 'Informal' | 'Neutral' | 'Formal' | 'Very Formal';
    verbosity: 'Very Terse' | 'Terse' | 'Neutral' | 'Verbose' | 'Very Verbose';
    humor: 'None' | 'Dry' | 'Sarcastic' | 'Witty' | 'Slapstick';
    emojiUsage: 'None' | 'Low' | 'Medium' | 'High' | 'Excessive';
    punctuation: 'Minimal' | 'Standard' | 'Creative' | 'Excessive';
}

export interface VirtualUser {
    id: string;
    nickname: string;
    personality: string;
    languageSkills: LanguageSkill[];
    writingStyle: WritingStyle;
}

export interface Channel {
    id: string;
    name: string;
    topic: string;
    users: string[]; // array of user IDs
}

export enum MassAddMethod {
    TEMPLATE = 'Template',
    AI = 'AI',
    RANDOM = 'Random',
}

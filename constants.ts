
import { VirtualUser, Fluency, WritingStyle, LanguageSkill } from './types';

// FIX: Updated model names to conform to the latest API guidelines.
export const AI_MODELS = {
    'gemini-2.5-flash': { name: 'Gemini 2.5 Flash', cost: 'Low', description: 'Fastest, low cost' },
    'gemini-flash-latest': { name: 'Gemini Flash', cost: 'Low', description: 'Balanced speed & quality' },
    'gemini-2.5-pro': { name: 'Gemini 2.5 Pro', cost: 'High', description: 'Highest quality' }
};

export const PERSONALITY_TEMPLATES: { name: string; description: string }[] = [
    { name: "Chatterbox", description: "Loves to talk, often about trivial things. Very friendly and uses a lot of emojis." },
    { name: "Polite Academic", description: "Speaks formally, uses complex words, and enjoys discussing intellectual topics." },
    { name: "Sarcastic Gamer", description: "Cynical, witty, and fluent in internet slang and gaming memes." },
    { name: "Mysterious Cypher", description: "Posts cryptic messages, rarely reveals personal information, enjoys puzzles and code." },
    { name: "Supportive Friend", description: "Always encouraging, positive, and quick to offer help or a kind word." },
    { name: "Grumpy Old-Timer", description: "Complains about modern technology, reminisces about the 'good old days' of the internet." },
    { name: "Creative Artist", description: "Shares their art, poetry, or music. Expressive and often uses descriptive language." },
    { name: "News Junkie", description: "Constantly posts links to articles and wants to debate current events." },
];

export const LANGUAGES = [
    'Arabic', 'English', 'Finnish', 'French', 'German', 'Hindi', 'Japanese', 'Mandarin', 'Portuguese', 'Russian', 'Spanish'
];

export const FLUENCY_LEVELS = Object.values(Fluency);
export const FORMALITY_LEVELS: WritingStyle['formality'][] = ['Very Informal', 'Informal', 'Neutral', 'Formal', 'Very Formal'];
export const VERBOSITY_LEVELS: WritingStyle['verbosity'][] = ['Very Terse', 'Terse', 'Neutral', 'Verbose', 'Very Verbose'];
export const HUMOR_LEVELS: WritingStyle['humor'][] = ['None', 'Dry', 'Sarcastic', 'Witty', 'Slapstick'];
export const EMOJI_LEVELS: WritingStyle['emojiUsage'][] = ['None', 'Low', 'Medium', 'High', 'Excessive'];
export const PUNCTUATION_LEVELS: WritingStyle['punctuation'][] = ['Minimal', 'Standard', 'Creative', 'Excessive'];

export const DEFAULT_LANGUAGE_SKILL: LanguageSkill = {
  language: 'English',
  fluency: Fluency.NATIVE,
  accent: '',
};

export const DEFAULT_WRITING_STYLE: WritingStyle = {
  formality: 'Neutral',
  verbosity: 'Neutral',
  humor: 'None',
  emojiUsage: 'Medium',
  punctuation: 'Standard',
};

export const DEFAULT_USER: Omit<VirtualUser, 'id' | 'nickname'> = {
  personality: '',
  languageSkills: [DEFAULT_LANGUAGE_SKILL],
  writingStyle: DEFAULT_WRITING_STYLE,
};

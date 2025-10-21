
import React, { useState, useEffect } from 'react';
import { VirtualUser, LanguageSkill, Fluency, WritingStyle } from '../types';
import { DEFAULT_WRITING_STYLE, DEFAULT_LANGUAGE_SKILL, LANGUAGES, FLUENCY_LEVELS, FORMALITY_LEVELS, VERBOSITY_LEVELS, HUMOR_LEVELS, EMOJI_LEVELS, PUNCTUATION_LEVELS } from '../constants';
import Modal from './Modal';
import Icon from './Icon';

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: VirtualUser) => void;
  existingUser: VirtualUser | null;
  existingNicknames: string[];
  generateNickname: () => Promise<string>;
}

const UserFormModal: React.FC<UserFormModalProps> = ({ isOpen, onClose, onSave, existingUser, existingNicknames, generateNickname }) => {
  const [user, setUser] = useState<Omit<VirtualUser, 'id'>>({
    nickname: '',
    personality: '',
    languageSkills: [DEFAULT_LANGUAGE_SKILL],
    writingStyle: DEFAULT_WRITING_STYLE
  });
  const [errors, setErrors] = useState<{ nickname?: string }>({});
  const [isGeneratingNickname, setIsGeneratingNickname] = useState(false);

  useEffect(() => {
    if (isOpen && existingUser) {
      setUser(existingUser);
    } else if (isOpen) {
      setUser({
        nickname: '',
        personality: '',
        languageSkills: [DEFAULT_LANGUAGE_SKILL],
        writingStyle: DEFAULT_WRITING_STYLE
      });
    }
    setErrors({});
  }, [isOpen, existingUser]);
  
  const validate = () => {
    const newErrors: { nickname?: string } = {};
    if (!user.nickname) {
        newErrors.nickname = 'Nickname is required.';
    } else if (user.nickname.length < 3 || user.nickname.length > 20) {
        newErrors.nickname = 'Nickname must be 3-20 characters.';
    } else if (/\s/.test(user.nickname)) {
        newErrors.nickname = 'Nickname cannot contain spaces.';
    } else {
        const isDuplicate = existingNicknames.some(nick => nick.toLowerCase() === user.nickname.toLowerCase() && (!existingUser || existingUser.nickname.toLowerCase() !== user.nickname.toLowerCase()));
        if (isDuplicate) {
            newErrors.nickname = 'Nickname is already taken.';
        }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const finalUser = {
      ...user,
      id: existingUser?.id || new Date().toISOString() + Math.random(),
    };
    onSave(finalUser);
    onClose();
  };
  
  const handleRandomizeNickname = async () => {
      setIsGeneratingNickname(true);
      try {
          const newNick = await generateNickname();
          setUser(prev => ({ ...prev, nickname: newNick }));
          setErrors(prev => ({ ...prev, nickname: undefined }));
      } catch (e) {
          console.error("Failed to generate nickname", e);
      } finally {
          setIsGeneratingNickname(false);
      }
  };

  const handleLanguageChange = (index: number, field: keyof LanguageSkill, value: string) => {
    const newSkills = [...user.languageSkills];
    newSkills[index] = { ...newSkills[index], [field]: value };
    setUser({ ...user, languageSkills: newSkills });
  };

  const addLanguage = () => {
    setUser({ ...user, languageSkills: [...user.languageSkills, DEFAULT_LANGUAGE_SKILL] });
  };

  const removeLanguage = (index: number) => {
    const newSkills = user.languageSkills.filter((_, i) => i !== index);
    setUser({ ...user, languageSkills: newSkills });
  };

  // FIX: Created a typed array for writing style fields to fix type inference issue in the map function.
  const writingStyleFields: { label: string; key: keyof WritingStyle; options: readonly string[] }[] = [
    { label: 'Formality', key: 'formality', options: FORMALITY_LEVELS },
    { label: 'Verbosity', key: 'verbosity', options: VERBOSITY_LEVELS },
    { label: 'Humor', key: 'humor', options: HUMOR_LEVELS },
    { label: 'Emoji Usage', key: 'emojiUsage', options: EMOJI_LEVELS },
    { label: 'Punctuation', key: 'punctuation', options: PUNCTUATION_LEVELS },
  ];

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={existingUser ? 'Edit User' : 'Add New User'}>
      <div className="space-y-6">
        <div>
          <label htmlFor="nickname" className="block text-sm font-medium text-gray-300">Nickname</label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="text"
              id="nickname"
              className={`flex-1 block w-full rounded-none rounded-l-md bg-station-dark border-station-light-blue focus:ring-station-pink focus:border-station-pink sm:text-sm ${errors.nickname ? 'border-red-500' : 'border'}`}
              value={user.nickname}
              onChange={(e) => setUser({ ...user, nickname: e.target.value })}
            />
            <button
                type="button"
                onClick={handleRandomizeNickname}
                disabled={isGeneratingNickname}
                className="relative inline-flex items-center space-x-2 px-4 py-2 border border-l-0 border-station-light-blue text-sm font-medium rounded-r-md text-white bg-station-light-blue hover:bg-station-pink/80 focus:outline-none focus:ring-1 focus:ring-station-pink focus:border-station-pink disabled:opacity-50"
            >
                {isGeneratingNickname ? <Icon name="spinner" className="w-5 h-5 animate-spin"/> : <Icon name="wand" className="w-5 h-5" />}
                <span>{isGeneratingNickname ? 'Generating...' : 'Randomize'}</span>
            </button>
          </div>
          {errors.nickname && <p className="mt-2 text-sm text-red-500">{errors.nickname}</p>}
        </div>

        <div>
            <label htmlFor="personality" className="block text-sm font-medium text-gray-300">Personality</label>
            <textarea
              id="personality"
              rows={3}
              className="mt-1 block w-full rounded-md bg-station-dark border-station-light-blue focus:ring-station-pink focus:border-station-pink sm:text-sm border"
              value={user.personality}
              onChange={(e) => setUser({ ...user, personality: e.target.value })}
            />
        </div>
        
        {/* Language Skills */}
        <div className="space-y-4">
            <h3 className="text-lg font-medium">Language Skills</h3>
            {user.languageSkills.map((skill, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-7 gap-2 items-center p-2 border border-station-light-blue rounded-md">
                    <select value={skill.language} onChange={e => handleLanguageChange(index, 'language', e.target.value)} className="col-span-2 md:col-span-2 bg-station-dark border-station-light-blue rounded-md p-2">
                        {LANGUAGES.map(lang => <option key={lang} value={lang}>{lang}</option>)}
                    </select>
                    <select value={skill.fluency} onChange={e => handleLanguageChange(index, 'fluency', e.target.value as Fluency)} className="col-span-2 md:col-span-2 bg-station-dark border-station-light-blue rounded-md p-2">
                        {FLUENCY_LEVELS.map(level => <option key={level} value={level}>{level}</option>)}
                    </select>
                    <input type="text" placeholder="Accent/Dialect (optional)" value={skill.accent} onChange={e => handleLanguageChange(index, 'accent', e.target.value)} className="col-span-2 md:col-span-2 bg-station-dark border-station-light-blue rounded-md p-2" />
                    <button onClick={() => removeLanguage(index)} disabled={user.languageSkills.length <= 1} className="col-span-1 text-red-500 disabled:opacity-50 flex justify-center">
                        <Icon name="trash" className="w-5 h-5"/>
                    </button>
                </div>
            ))}
            <button onClick={addLanguage} className="text-station-pink flex items-center gap-1"><Icon name="plus" className="w-4 h-4"/> Add Language</button>
        </div>
        
        {/* Writing Style */}
        <div className="space-y-2">
            <h3 className="text-lg font-medium">Writing Style</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {writingStyleFields.map(({ label, key, options }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-300">{label}</label>
                  <select
                    value={user.writingStyle[key]}
                    onChange={(e) => setUser({ ...user, writingStyle: { ...user.writingStyle, [key]: e.target.value as any } })}
                    className="mt-1 block w-full pl-3 pr-10 py-2 bg-station-dark border border-station-light-blue rounded-md focus:outline-none focus:ring-station-pink focus:border-station-pink sm:text-sm"
                  >
                    {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
              ))}
            </div>
        </div>
      </div>
      
      <div className="mt-8 flex justify-end space-x-3">
        <button onClick={onClose} className="px-4 py-2 rounded-md text-white bg-gray-600 hover:bg-gray-700">Cancel</button>
        <button onClick={handleSave} className="px-4 py-2 rounded-md text-white bg-station-pink hover:bg-station-pink/80">{existingUser ? 'Save Changes' : 'Create User'}</button>
      </div>
    </Modal>
  );
};

export default UserFormModal;

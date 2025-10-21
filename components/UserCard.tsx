
import React from 'react';
import { VirtualUser } from '../types';
import Icon from './Icon';

interface UserCardProps {
  user: VirtualUser;
  onEdit: (user: VirtualUser) => void;
  onDelete: (userId: string) => void;
}

const getFluencyColor = (fluency: string) => {
    switch(fluency) {
        case 'Native': return 'bg-green-500';
        case 'Fluent': return 'bg-blue-500';
        case 'Advanced': return 'bg-indigo-500';
        case 'Intermediate': return 'bg-yellow-500';
        case 'Beginner': return 'bg-red-500';
        default: return 'bg-gray-500';
    }
}

const UserCard: React.FC<UserCardProps> = ({ user, onEdit, onDelete }) => {
  return (
    <div className="bg-station-blue rounded-lg shadow-lg p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-station-pink/50 hover:shadow-md font-mono">
      <div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-station-pink">{user.nickname}</h3>
          <div className="flex space-x-2">
            <button onClick={() => onEdit(user)} className="text-gray-400 hover:text-white transition-colors">
              <Icon name="edit" className="w-5 h-5" />
            </button>
            <button onClick={() => onDelete(user.id)} className="text-gray-400 hover:text-station-pink transition-colors">
              <Icon name="trash" className="w-5 h-5" />
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-300 italic mb-3 h-12 overflow-hidden">"{user.personality}"</p>
        
        <div className="mb-3">
            <h4 className="text-xs font-semibold uppercase text-gray-400 mb-1">Languages</h4>
            <div className="flex flex-wrap gap-1">
                {user.languageSkills.map((skill, index) => (
                    <span key={index} className={`text-xs px-2 py-1 rounded-full text-white ${getFluencyColor(skill.fluency)}`}>
                        {skill.language} ({skill.fluency})
                    </span>
                ))}
            </div>
        </div>

        <div>
             <h4 className="text-xs font-semibold uppercase text-gray-400 mb-1">Writing Style</h4>
             <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                <span>Formality: <span className="text-gray-300">{user.writingStyle.formality}</span></span>
                <span>Verbosity: <span className="text-gray-300">{user.writingStyle.verbosity}</span></span>
                <span>Humor: <span className="text-gray-300">{user.writingStyle.humor}</span></span>
                <span>Emoji: <span className="text-gray-300">{user.writingStyle.emojiUsage}</span></span>
             </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;

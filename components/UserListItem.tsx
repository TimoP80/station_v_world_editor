import React from 'react';
import { VirtualUser } from '../types';
import Icon from './Icon';

interface UserListItemProps {
  user: VirtualUser;
  onEdit: (user: VirtualUser) => void;
  onDelete: (userId: string) => void;
}

const getFluencyColor = (fluency: string) => {
    switch(fluency) {
        case 'Native': return 'bg-green-500/80';
        case 'Fluent': return 'bg-blue-500/80';
        case 'Advanced': return 'bg-indigo-500/80';
        case 'Intermediate': return 'bg-yellow-500/80 text-black';
        case 'Beginner': return 'bg-red-500/80';
        default: return 'bg-gray-500/80';
    }
}

const UserListItem: React.FC<UserListItemProps> = ({ user, onEdit, onDelete }) => {
  const primarySkill = user.languageSkills[0] || { language: 'N/A', fluency: 'N/A' };

  return (
    <div className="bg-station-blue rounded-lg p-3 flex items-center justify-between transition-all duration-300 hover:bg-station-light-blue font-mono">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-bold text-station-pink truncate" title={user.nickname}>{user.nickname}</h3>
          <span className={`text-xs px-2 py-0.5 rounded-full text-white ${getFluencyColor(primarySkill.fluency)}`}>
              {primarySkill.language}
          </span>
        </div>
        <p className="text-sm text-gray-400 italic truncate mt-1">"{user.personality}"</p>
      </div>
      <div className="flex space-x-3 ml-4 shrink-0">
        <button onClick={() => onEdit(user)} className="text-gray-400 hover:text-white transition-colors">
          <Icon name="edit" className="w-5 h-5" />
        </button>
        <button onClick={() => onDelete(user.id)} className="text-gray-400 hover:text-station-pink transition-colors">
          <Icon name="trash" className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default UserListItem;

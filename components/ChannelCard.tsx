
import React from 'react';
import { Channel } from '../types';

interface ChannelCardProps {
  channel: Channel;
  userCount: number;
}

const ChannelCard: React.FC<ChannelCardProps> = ({ channel, userCount }) => {
  return (
    <div className="bg-station-blue rounded-lg shadow-lg p-4 transition-all duration-300 hover:shadow-station-pink/50 hover:shadow-md font-mono">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-bold text-station-pink">{channel.name}</h3>
        <span className="text-sm text-gray-400">{userCount} users</span>
      </div>
      <p className="text-sm text-gray-300 italic">Topic: {channel.topic}</p>
    </div>
  );
};

export default ChannelCard;

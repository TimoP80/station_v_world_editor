import React from 'react';
import { AIModel, Channel } from '../types';
import { AI_MODELS } from '../constants';
import Modal from './Modal';
import Icon from './Icon';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  aiModel: AIModel;
  onAiModelChange: (model: AIModel) => void;
  channels: Channel[];
  onAddChannel: () => void;
  onEditChannel: (channel: Channel) => void;
  onDeleteChannel: (channelId: string) => void;
  onClearAllChannels: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
    isOpen, 
    onClose, 
    aiModel, 
    onAiModelChange,
    channels,
    onAddChannel,
    onEditChannel,
    onDeleteChannel,
    onClearAllChannels
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Settings">
      <div className="space-y-6">
        {/* AI Model Settings */}
        <div>
          <label htmlFor="ai-model" className="block text-sm font-medium text-gray-300">
            AI Model for Generation
          </label>
          <p className="text-xs text-gray-400 mb-2">
            Different models have different costs, speeds, and creative capabilities.
          </p>
          <select
            id="ai-model"
            value={aiModel}
            onChange={(e) => onAiModelChange(e.target.value as AIModel)}
            className="mt-1 block w-full pl-3 pr-10 py-2 bg-station-dark border border-station-light-blue rounded-md focus:outline-none focus:ring-station-pink focus:border-station-pink sm:text-sm"
          >
            {Object.entries(AI_MODELS).map(([modelId, modelInfo]) => (
              <option key={modelId} value={modelId}>
                {modelInfo.name} - {modelInfo.description}
              </option>
            ))}
          </select>
        </div>

        <div className="border-t border-station-light-blue"></div>

        {/* Channel Management */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium text-gray-300">Channel Management</h3>
              <p className="text-xs text-gray-400">Define the chat rooms for your world.</p>
            </div>
            <div className="flex items-center space-x-2">
              {channels.length > 0 && (
                <button onClick={onClearAllChannels} className="text-red-500 hover:text-red-400 text-sm flex items-center gap-1">
                  <Icon name="trash" className="w-4 h-4" /> Clear All
                </button>
              )}
              <button onClick={onAddChannel} className="px-3 py-1 rounded-md text-sm font-medium bg-station-pink hover:bg-station-pink/80 flex items-center gap-2">
                <Icon name="plus" className="w-4 h-4" /> Add Channel
              </button>
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto bg-station-dark p-2 rounded-md border border-station-light-blue space-y-2">
            {channels.length === 0 ? (
              <p className="text-center text-gray-400 py-4">No channels configured.</p>
            ) : (
              channels.map(channel => (
                <div key={channel.id} className="flex justify-between items-center bg-station-blue p-2 rounded">
                  <div>
                    <p className="font-semibold text-station-pink">{channel.name}</p>
                    <p className="text-xs text-gray-400 truncate max-w-xs">{channel.topic || 'No topic'}</p>
                  </div>
                  <div className="flex items-center space-x-2 shrink-0">
                    <span className="text-xs text-gray-400 bg-station-dark px-2 py-1 rounded-full">{channel.users.length} users</span>
                    <button onClick={() => onEditChannel(channel)} className="text-gray-400 hover:text-white"><Icon name="edit" className="w-4 h-4" /></button>
                    <button onClick={() => onDeleteChannel(channel.id)} className="text-gray-400 hover:text-station-pink"><Icon name="trash" className="w-4 h-4" /></button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <div className="mt-8 flex justify-end">
        <button onClick={onClose} className="px-4 py-2 rounded-md text-white bg-station-pink hover:bg-station-pink/80">
          Close
        </button>
      </div>
    </Modal>
  );
};

export default SettingsModal;

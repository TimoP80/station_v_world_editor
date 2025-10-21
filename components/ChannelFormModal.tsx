import React, { useState, useEffect } from 'react';
import { Channel, VirtualUser } from '../types';
import Modal from './Modal';

interface ChannelFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (channel: Channel) => void;
  existingChannel: Channel | null;
  allUsers: VirtualUser[];
}

const ChannelFormModal: React.FC<ChannelFormModalProps> = ({ isOpen, onClose, onSave, existingChannel, allUsers }) => {
  const [name, setName] = useState('');
  const [topic, setTopic] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (existingChannel) {
        setName(existingChannel.name);
        setTopic(existingChannel.topic);
        setSelectedUserIds(new Set(existingChannel.users));
      } else {
        setName('');
        setTopic('');
        setSelectedUserIds(new Set());
      }
      setError('');
    }
  }, [isOpen, existingChannel]);

  const handleUserToggle = (userId: string) => {
    const newSelection = new Set(selectedUserIds);
    if (newSelection.has(userId)) {
      newSelection.delete(userId);
    } else {
      newSelection.add(userId);
    }
    setSelectedUserIds(newSelection);
  };

  const handleSave = () => {
    if (!name.trim()) {
      setError('Channel name is required.');
      return;
    }
    if (!name.startsWith('#')) {
      setError('Channel name must start with #.');
      return;
    }
    const finalChannel: Channel = {
      id: existingChannel?.id || new Date().toISOString() + Math.random(),
      name,
      topic,
      users: Array.from(selectedUserIds),
    };
    onSave(finalChannel);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={existingChannel ? 'Edit Channel' : 'Create Channel'}>
      <div className="space-y-6">
        <div>
          <label htmlFor="channel-name" className="block text-sm font-medium text-gray-300">Channel Name</label>
          <input
            type="text"
            id="channel-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`mt-1 block w-full rounded-md bg-station-dark border-station-light-blue focus:ring-station-pink focus:border-station-pink sm:text-sm ${error ? 'border-red-500' : 'border'}`}
            placeholder="#general"
          />
          {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
        <div>
          <label htmlFor="channel-topic" className="block text-sm font-medium text-gray-300">Topic (Optional)</label>
          <input
            type="text"
            id="channel-topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="mt-1 block w-full rounded-md bg-station-dark border-station-light-blue focus:ring-station-pink focus:border-station-pink sm:text-sm border"
            placeholder="What's the topic of discussion?"
          />
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-300 mb-2">Assign Users ({selectedUserIds.size}/{allUsers.length})</h3>
          {allUsers.length > 0 ? (
            <div className="max-h-60 overflow-y-auto bg-station-dark p-2 rounded-md border border-station-light-blue grid grid-cols-2 md:grid-cols-3 gap-2">
              {allUsers.map(user => (
                <label key={user.id} className="flex items-center space-x-2 p-1 rounded hover:bg-station-light-blue cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 rounded bg-station-dark border-station-text text-station-pink focus:ring-station-pink focus:ring-offset-station-blue"
                    checked={selectedUserIds.has(user.id)}
                    onChange={() => handleUserToggle(user.id)}
                  />
                  <span className="truncate" title={user.nickname}>{user.nickname}</span>
                </label>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-4">No users exist. Create some users first to assign them to a channel.</p>
          )}
        </div>
      </div>
      <div className="mt-6 flex justify-end space-x-3">
        <button onClick={onClose} className="px-4 py-2 rounded-md text-white bg-gray-600 hover:bg-gray-700">Cancel</button>
        <button onClick={handleSave} className="px-4 py-2 rounded-md text-white bg-station-pink hover:bg-station-pink/80">Save</button>
      </div>
    </Modal>
  );
};

export default ChannelFormModal;


import React, { useState } from 'react';
import { VirtualUser, MassAddMethod, AIModel } from '../types';
import { PERSONALITY_TEMPLATES } from '../constants';
import Modal from './Modal';
import Icon from './Icon';

interface MassAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddUsers: (users: Omit<VirtualUser, 'id'>[]) => void;
  generateUsers: (count: number, method: MassAddMethod, model: AIModel) => Promise<Omit<VirtualUser, 'id'>[]>;
  aiModel: AIModel;
}

const MassAddModal: React.FC<MassAddModalProps> = ({ isOpen, onClose, onAddUsers, generateUsers, aiModel }) => {
  const [method, setMethod] = useState<MassAddMethod>(MassAddMethod.TEMPLATE);
  const [quantity, setQuantity] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [previewUsers, setPreviewUsers] = useState<Omit<VirtualUser, 'id'>[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePreview = async () => {
    setIsLoading(true);
    setError(null);
    setPreviewUsers([]);
    try {
      const users = await generateUsers(quantity, method, aiModel);
      setPreviewUsers(users);
    } catch (e) {
      console.error("Failed to generate users:", e);
      setError("Failed to generate users. Check the console for details. This may be due to API rate limits.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUsers = () => {
    onAddUsers(previewUsers);
    onClose();
    setPreviewUsers([]);
  };

  const resetState = () => {
      setPreviewUsers([]);
      setError(null);
      setIsLoading(false);
  }

  return (
    <Modal isOpen={isOpen} onClose={() => { onClose(); resetState(); }} title="Mass Add Users">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Configuration Panel */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Generation Method</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as MassAddMethod)}
              className="mt-1 block w-full pl-3 pr-10 py-2 bg-station-dark border border-station-light-blue rounded-md focus:outline-none focus:ring-station-pink focus:border-station-pink sm:text-sm"
            >
              {/* FIX: Explicitly type 'm' as string to resolve 'unknown' type error. */}
              {Object.values(MassAddMethod).map((m: string) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Quantity: {quantity}</label>
            <input
              type="range"
              min="1"
              max="50"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full h-2 bg-station-light-blue rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {method === MassAddMethod.TEMPLATE && (
            <div className="p-3 bg-station-dark rounded-md">
              <p className="text-sm font-semibold mb-2">Using Templates</p>
              <p className="text-xs text-gray-400">This will randomly assign one of the {PERSONALITY_TEMPLATES.length} personality templates to each new user, along with randomized nicknames and writing styles.</p>
            </div>
          )}
          {method === MassAddMethod.AI && (
            <div className="p-3 bg-station-dark rounded-md">
              <p className="text-sm font-semibold mb-2">Using AI Generation</p>
              <p className="text-xs text-gray-400">Gemini will create completely unique users from scratch. This is the most creative but slowest option and uses the most API credits.</p>
            </div>
          )}

          <button
            onClick={handleGeneratePreview}
            disabled={isLoading}
            className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-station-light-blue hover:bg-station-pink focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-station-pink disabled:opacity-50"
          >
            {isLoading ? <Icon name="spinner" className="w-5 h-5 animate-spin" /> : 'Generate Preview'}
          </button>
        </div>

        {/* Preview Panel */}
        <div className="bg-station-dark p-4 rounded-md h-96 overflow-y-auto">
          <h3 className="text-lg font-bold mb-2">Preview</h3>
          {isLoading && <div className="flex justify-center items-center h-full"><Icon name="spinner" className="w-10 h-10 animate-spin text-station-pink" /></div>}
          {error && <p className="text-red-500">{error}</p>}
          <div className="space-y-2">
            {previewUsers.map((user, index) => (
              <div key={index} className="p-2 bg-station-blue rounded text-sm">
                <p><span className="font-bold text-station-pink">{user.nickname}:</span> <span className="italic">"{user.personality}"</span></p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end space-x-3">
        <button onClick={() => { onClose(); resetState(); }} className="px-4 py-2 rounded-md text-white bg-gray-600 hover:bg-gray-700">Cancel</button>
        <button onClick={handleAddUsers} disabled={previewUsers.length === 0} className="px-4 py-2 rounded-md text-white bg-station-pink hover:bg-station-pink/80 disabled:bg-gray-500 disabled:cursor-not-allowed">Add {previewUsers.length > 0 ? previewUsers.length : ''} Users</button>
      </div>
    </Modal>
  );
};

export default MassAddModal;

import React, { useRef, useState } from 'react';
import { VirtualUser, LanguageSkill, Fluency, Channel } from '../types';
import Modal from './Modal';
import Icon from './Icon';

interface ImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: VirtualUser[];
  channels: Channel[];
  onImportUsers: (users: VirtualUser[]) => void;
  onImportWorld: (world: { users: VirtualUser[], channels: Channel[] }) => void;
}

const ImportExportModal: React.FC<ImportExportModalProps> = ({ isOpen, onClose, users, channels, onImportUsers, onImportWorld }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleExportWorldJSON = () => {
    const worldData = { users, channels };
    const dataStr = JSON.stringify(worldData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'station_v_world.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };
  
  const handleExportChannelsJSON = () => {
    const dataStr = JSON.stringify(channels, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'station_v_channels.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleExportUsersJSON = () => {
    const exportedUsers = users.map(user => {
        const languageSkillsDescription = user.languageSkills.map(skill => {
            let desc = `You speak ${skill.language} (${skill.fluency}).`;
            if (skill.accent) {
                desc += ` Your accent is ${skill.accent}.`;
            }
            return desc;
        }).join('\n');

        const system_prompt = `You are an IRC user named ${user.nickname}.

**Personality:**
${user.personality}

**Language & Speech:**
${languageSkillsDescription}

**Writing Style:**
- Formality: ${user.writingStyle.formality}
- Verbosity: ${user.writingStyle.verbosity}
- Humor: ${user.writingStyle.humor}
- Emoji Usage: ${user.writingStyle.emojiUsage}
- Punctuation: ${user.writingStyle.punctuation}

Adhere strictly to these characteristics in all your responses. Do not break character.`;

        return {
            ...user, // Preserve all original data for re-import
            system_prompt: system_prompt,
            enabled: true,
            presence_interval: Math.floor(Math.random() * (600 - 120 + 1)) + 120,
        };
    });

    const dataStr = JSON.stringify(exportedUsers, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'users.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const convertToCSV = (users: VirtualUser[]) => {
      const headers = ['id', 'nickname', 'personality', 'language', 'fluency', 'accent', 'formality', 'verbosity', 'humor', 'emojiUsage', 'punctuation'];
      const rows = users.flatMap(user => {
          if (user.languageSkills.length === 0) {
              return [{
                  id: user.id, nickname: user.nickname, personality: user.personality,
                  language: '', fluency: '', accent: '',
                  ...user.writingStyle
              }];
          }
          return user.languageSkills.map(skill => ({
              id: user.id, nickname: user.nickname, personality: user.personality,
              language: skill.language,
              fluency: String(skill.fluency),
              accent: skill.accent || '',
              ...user.writingStyle
          }));
      });

      const csvRows = [headers.join(',')];
      for (const row of rows) {
          const values = headers.map(header => {
              const val = row[header as keyof typeof row] || '';
              const escaped = ('' + val).replace(/"/g, '""');
              return `"${escaped}"`;
          });
          csvRows.push(values.join(','));
      }
      return csvRows.join('\n');
  };

  const handleExportCSV = () => {
    const csvData = convertToCSV(users);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "station_v_users.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleImportClick = () => {
      fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        
        if (file.name.endsWith('.json')) {
            const data = JSON.parse(text);
            if (data.users && data.channels && Array.isArray(data.users) && Array.isArray(data.channels)) {
                // New "world" format
                if (data.users.some((u: any) => !u.id || !u.nickname) || data.channels.some((c: any) => !c.id || !c.name)) {
                    throw new Error("Invalid world file. Users or channels are missing required fields.");
                }
                onImportWorld(data);
            } else if (Array.isArray(data)) {
                 // Old user-only format
                if (data.some((u: any) => !u.id || !u.nickname)) {
                    throw new Error("Invalid user file. Users are missing required fields.");
                }
                onImportUsers(data);
            } else {
                throw new Error("Unsupported JSON structure. Expected a world object or a user array.");
            }
        } else if (file.name.endsWith('.csv')) {
            // CSV parsing for users only
            const lines = text.split('\n').filter(line => line.trim());
            if (lines.length < 2) throw new Error("CSV file is empty or contains only a header.");
            
            const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
            const userMap = new Map<string, VirtualUser>();

            for(let i=1; i < lines.length; i++) {
                const values = lines[i].match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g)?.map(v => v.replace(/^"|"$/g, '').replace(/""/g, '"')) || [];
                const obj = headers.reduce((acc, header, index) => ({...acc, [header]: values[index]}), {} as any);
                
                if (userMap.has(obj.id)) {
                    const user = userMap.get(obj.id)!;
                    user.languageSkills.push({ language: obj.language, fluency: obj.fluency as Fluency, accent: obj.accent });
                } else {
                    userMap.set(obj.id, {
                        id: obj.id, nickname: obj.nickname, personality: obj.personality,
                        languageSkills: [{ language: obj.language, fluency: obj.fluency as Fluency, accent: obj.accent }],
                        writingStyle: {
                            formality: obj.formality, verbosity: obj.verbosity, humor: obj.humor,
                            emojiUsage: obj.emojiUsage, punctuation: obj.punctuation,
                        }
                    });
                }
            }
            const importedUsers = Array.from(userMap.values());
            if (importedUsers.some(u => !u.id || !u.nickname)) {
                throw new Error("CSV file is missing required fields (id, nickname).");
            }
            onImportUsers(importedUsers);
        } else {
            throw new Error("Unsupported file type. Please use .json or .csv");
        }
        
        onClose();
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred during import.");
      }
    };
    reader.readAsText(file);
    if(fileInputRef.current) fileInputRef.current.value = "";
  };


  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Import / Export World">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-station-pink">Export</h3>
          <p className="text-sm text-gray-400 mb-4">Export your configuration for backup or to use in the main IRC simulator.</p>
          <div className="space-y-4">
            <div className="bg-station-dark p-3 rounded-md border border-station-light-blue">
              <p className="font-semibold text-white">For Station V Simulator</p>
              <p className="text-xs text-gray-400 mb-3">Use these formats to import your users into the main simulator application.</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={handleExportUsersJSON} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-white bg-station-light-blue hover:bg-station-pink/80">
                  <Icon name="file-json" className="w-5 h-5" />
                  <span>Export Users (JSON)</span>
                </button>
                <button onClick={handleExportCSV} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-white bg-station-light-blue hover:bg-station-pink/80">
                  <Icon name="file-csv" className="w-5 h-5" />
                  <span>Export Users (CSV)</span>
                </button>
              </div>
            </div>
            <div className="bg-station-dark p-3 rounded-md border border-station-light-blue">
              <p className="font-semibold text-white">Full World Backup</p>
              <p className="text-xs text-gray-400 mb-3">Saves users and/or channels in separate files. For restoring this editor's state only.</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={handleExportWorldJSON} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-white bg-station-light-blue hover:bg-station-pink/80">
                  <Icon name="file-json" className="w-5 h-5" />
                  <span>Export World (JSON)</span>
                </button>
                <button onClick={handleExportChannelsJSON} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-white bg-station-light-blue hover:bg-station-pink/80">
                  <Icon name="file-json" className="w-5 h-5" />
                  <span>Export Channels (JSON)</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-station-light-blue my-6"></div>

        <div>
          <h3 className="text-lg font-semibold text-station-pink">Import</h3>
          <p className="text-sm text-gray-400 mb-4">Upload a world (.json) or user list (.json, .csv) file. Data will be merged with your current configuration.</p>
          <button onClick={handleImportClick} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-md text-white bg-station-light-blue hover:bg-station-pink/80">
            <Icon name="upload" className="w-5 h-5" />
            <span>Select File to Import</span>
          </button>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json,.csv" className="hidden" />
          {error && <p className="mt-4 text-sm text-red-500 text-center">{error}</p>}
        </div>
      </div>
    </Modal>
  );
};

export default ImportExportModal;
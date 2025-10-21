import React, { useState, useEffect, useCallback } from 'react';
import { VirtualUser, Channel, MassAddMethod, AIModel } from './types';
import { loadUsers, saveUsers, loadChannels, saveChannels } from './services/storageService';
import { generateUsers, generateNickname } from './services/geminiService';
import UserCard from './components/UserCard';
import UserListItem from './components/UserListItem';
import UserFormModal from './components/UserFormModal';
import MassAddModal from './components/MassAddModal';
import ConfirmationModal from './components/ConfirmationModal';
import ImportExportModal from './components/ImportExportModal';
import SettingsModal from './components/SettingsModal';
import Icon from './components/Icon';
import ChannelCard from './components/ChannelCard';
import ChannelFormModal from './components/ChannelFormModal';

const App: React.FC = () => {
    const [users, setUsers] = useState<VirtualUser[]>([]);
    const [channels, setChannels] = useState<Channel[]>([]);
    const [aiModel, setAiModel] = useState<AIModel>('gemini-2.5-flash');
    const [userView, setUserView] = useState<'list' | 'grid'>('list');

    // Modal states
    const [isUserFormOpen, setUserFormOpen] = useState(false);
    const [isMassAddOpen, setMassAddOpen] = useState(false);
    const [isImportExportOpen, setImportExportOpen] = useState(false);
    const [isSettingsOpen, setSettingsOpen] = useState(false);
    const [isChannelFormOpen, setChannelFormOpen] = useState(false);
    
    const [editingUser, setEditingUser] = useState<VirtualUser | null>(null);
    const [editingChannel, setEditingChannel] = useState<Channel | null>(null);

    // Generic confirmation state
    const [confirmAction, setConfirmAction] = useState<{ title: string; message: string; onConfirm: () => void; } | null>(null);

    useEffect(() => {
        setUsers(loadUsers());
        setChannels(loadChannels());
    }, []);

    useEffect(() => {
        saveUsers(users);
    }, [users]);

    useEffect(() => {
        saveChannels(channels);
    }, [channels]);
    
    const existingNicknames = users.map(u => u.nickname);

    // User Handlers
    const handleOpenUserForm = (user: VirtualUser | null) => {
        setEditingUser(user);
        setUserFormOpen(true);
    };

    const handleSaveUser = (user: VirtualUser) => {
        setUsers(prevUsers => {
            const index = prevUsers.findIndex(u => u.id === user.id);
            if (index > -1) {
                const newUsers = [...prevUsers];
                newUsers[index] = user;
                return newUsers;
            } else {
                return [...prevUsers, user];
            }
        });
    };

    const handleDeleteUser = (userId: string) => {
        const user = users.find(u => u.id === userId);
        if (!user) return;
        setConfirmAction({
            title: 'Delete User',
            message: `Are you sure you want to delete user ${user.nickname}? They will be removed from all channels. This action cannot be undone.`,
            onConfirm: () => {
                setUsers(prevUsers => prevUsers.filter(u => u.id !== userId));
                // Also remove user from any channels they were in
                setChannels(prevChannels => prevChannels.map(c => ({
                    ...c,
                    users: c.users.filter(uid => uid !== userId)
                })));
            }
        });
    };

    const handleAddMultipleUsers = (newUsers: Omit<VirtualUser, 'id'>[]) => {
        const usersWithIds = newUsers.map(u => ({
            ...u,
            id: new Date().toISOString() + Math.random(),
        }));
        setUsers(prev => [...prev, ...usersWithIds]);
    };

    const handleImportUsersOnly = (importedUsers: VirtualUser[]) => {
        const userMap = new Map(users.map(u => [u.nickname, u]));
        for (const importedUser of importedUsers) {
            userMap.set(importedUser.nickname, importedUser);
        }
        setUsers(Array.from(userMap.values()));
    };
    
    const handleImportWorld = (world: { users: VirtualUser[], channels: Channel[] }) => {
        // Merge users
        const userMap = new Map(users.map(u => [u.nickname, u]));
        for (const importedUser of world.users) {
            userMap.set(importedUser.nickname, importedUser);
        }
        setUsers(Array.from(userMap.values()));

        // Merge channels
        const channelMap = new Map(channels.map(c => [c.name, c]));
        for (const importedChannel of world.channels) {
            channelMap.set(importedChannel.name, importedChannel);
        }
        setChannels(Array.from(channelMap.values()));
    };

    // Channel Handlers
    const handleOpenChannelForm = (channel: Channel | null) => {
        setEditingChannel(channel);
        setChannelFormOpen(true);
    };

    const handleSaveChannel = (channel: Channel) => {
        setChannels(prev => {
            const index = prev.findIndex(c => c.id === channel.id);
            if (index > -1) {
                const newChannels = [...prev];
                newChannels[index] = channel;
                return newChannels;
            }
            return [...prev, channel];
        });
    };

    const handleDeleteChannel = (channelId: string) => {
        const channel = channels.find(c => c.id === channelId);
        if (!channel) return;
        setConfirmAction({
            title: 'Delete Channel',
            message: `Are you sure you want to delete channel ${channel.name}? This action cannot be undone.`,
            onConfirm: () => {
                setChannels(prev => prev.filter(c => c.id !== channelId));
            }
        });
    };

    const handleClearAllChannels = () => {
        setConfirmAction({
            title: 'Clear All Channels',
            message: `Are you sure you want to delete all ${channels.length} channels? This action cannot be undone.`,
            onConfirm: () => setChannels([])
        });
    };

    // AI Service Callbacks
    const handleGenerateNickname = useCallback(() => {
        return generateNickname(aiModel);
    }, [aiModel]);

    const handleGenerateUsers = useCallback((count: number, method: MassAddMethod, model: AIModel) => {
        return generateUsers(count, method, model, existingNicknames);
    }, [aiModel, existingNicknames]);

    return (
        <div className="bg-station-dark text-white min-h-screen">
            <header className="bg-station-blue p-4 shadow-lg flex justify-between items-center">
                <h1 className="text-3xl font-bold text-station-pink font-mono">Station V</h1>
                <button onClick={() => setSettingsOpen(true)} className="text-gray-400 hover:text-white transition-colors">
                    <Icon name="cog" className="w-6 h-6" />
                </button>
            </header>
            
            <main className="p-4 md:p-8 space-y-8">
                <section>
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-4">
                             <h2 className="text-2xl font-semibold">Virtual Users ({users.length})</h2>
                             <div className="bg-station-blue rounded-md p-1 flex items-center">
                                <button onClick={() => setUserView('list')} className={`p-1 rounded ${userView === 'list' ? 'bg-station-pink' : 'text-gray-400 hover:bg-station-light-blue'}`}>
                                    <Icon name="view-list" className="w-5 h-5"/>
                                </button>
                                <button onClick={() => setUserView('grid')} className={`p-1 rounded ${userView === 'grid' ? 'bg-station-pink' : 'text-gray-400 hover:bg-station-light-blue'}`}>
                                    <Icon name="view-grid" className="w-5 h-5"/>
                                </button>
                             </div>
                        </div>
                        <div className="flex space-x-2">
                            <button onClick={() => setMassAddOpen(true)} className="px-3 py-2 rounded-md text-sm font-medium bg-station-light-blue hover:bg-station-pink/80 flex items-center gap-2">
                                <Icon name="plus" className="w-4 h-4" /> Mass Add
                            </button>
                            <button onClick={() => setImportExportOpen(true)} className="px-3 py-2 rounded-md text-sm font-medium bg-station-light-blue hover:bg-station-pink/80 flex items-center gap-2">
                                <Icon name="upload" className="w-4 h-4" /> Import/Export
                            </button>
                             <button onClick={() => handleOpenUserForm(null)} className="px-4 py-2 rounded-md text-sm font-medium bg-station-pink hover:bg-station-pink/80 flex items-center gap-2">
                                <Icon name="plus" className="w-4 h-4" /> Add User
                            </button>
                        </div>
                    </div>
                    {users.length === 0 ? (
                        <div className="text-center py-10 border-2 border-dashed border-station-light-blue rounded-lg">
                            <p>No users yet. Add one to get started!</p>
                        </div>
                    ) : (
                        userView === 'grid' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {users.map(user => (
                                    <UserCard key={user.id} user={user} onEdit={handleOpenUserForm} onDelete={handleDeleteUser} />
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {users.map(user => (
                                    <UserListItem key={user.id} user={user} onEdit={handleOpenUserForm} onDelete={handleDeleteUser} />
                                ))}
                            </div>
                        )
                    )}
                </section>
                
                <section>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold">Channels ({channels.length})</h2>
                    </div>
                    {channels.length === 0 ? (
                        <div className="text-center py-10 border-2 border-dashed border-station-light-blue rounded-lg">
                            <p>No channels yet. Create one in Settings!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {channels.map(channel => (
                                <ChannelCard key={channel.id} channel={channel} userCount={channel.users.length} />
                            ))}
                        </div>
                    )}
                </section>
            </main>

            {/* Modals */}
            <UserFormModal 
                isOpen={isUserFormOpen}
                onClose={() => setUserFormOpen(false)}
                onSave={handleSaveUser}
                existingUser={editingUser}
                existingNicknames={existingNicknames}
                generateNickname={handleGenerateNickname}
            />
            <MassAddModal
                isOpen={isMassAddOpen}
                onClose={() => setMassAddOpen(false)}
                onAddUsers={handleAddMultipleUsers}
                generateUsers={handleGenerateUsers}
                aiModel={aiModel}
            />
            <ImportExportModal
                isOpen={isImportExportOpen}
                onClose={() => setImportExportOpen(false)}
                users={users}
                channels={channels}
                onImportUsers={handleImportUsersOnly}
                onImportWorld={handleImportWorld}
            />
            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setSettingsOpen(false)}
                aiModel={aiModel}
                onAiModelChange={setAiModel}
                channels={channels}
                onAddChannel={() => handleOpenChannelForm(null)}
                onEditChannel={handleOpenChannelForm}
                onDeleteChannel={handleDeleteChannel}
                onClearAllChannels={handleClearAllChannels}
            />
            <ChannelFormModal
                isOpen={isChannelFormOpen}
                onClose={() => setChannelFormOpen(false)}
                onSave={handleSaveChannel}
                existingChannel={editingChannel}
                allUsers={users}
            />
            {confirmAction && (
                <ConfirmationModal
                    isOpen={true}
                    onClose={() => setConfirmAction(null)}
                    onConfirm={confirmAction.onConfirm}
                    title={confirmAction.title}
                    message={confirmAction.message}
                />
            )}
        </div>
    );
};

export default App;
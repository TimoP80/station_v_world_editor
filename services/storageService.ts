
import { VirtualUser, Channel } from '../types';

const USERS_KEY = 'station_v_users';
const CHANNELS_KEY = 'station_v_channels';

export const saveUsers = (users: VirtualUser[]): void => {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Error saving users to localStorage:', error);
  }
};

export const loadUsers = (): VirtualUser[] => {
  try {
    const usersJson = localStorage.getItem(USERS_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
  } catch (error) {
    console.error('Error loading users from localStorage:', error);
    return [];
  }
};

export const saveChannels = (channels: Channel[]): void => {
  try {
    localStorage.setItem(CHANNELS_KEY, JSON.stringify(channels));
  } catch (error) {
    console.error('Error saving channels to localStorage:', error);
  }
};

export const loadChannels = (): Channel[] => {
  try {
    const channelsJson = localStorage.getItem(CHANNELS_KEY);
    return channelsJson ? JSON.parse(channelsJson) : [];
  } catch (error) {
    console.error('Error loading channels from localStorage:', error);
    return [];
  }
};

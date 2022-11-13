import { atom } from 'jotai';

// Types
import { type User } from './client.typing';

export const userInfo = atom<User>({
    id: '',
    username: ''
});


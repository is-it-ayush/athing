import { atom } from 'jotai';

// Types
import { User } from './client.typing';

export const userInfo = atom<User>({
    id: '',
    username: ''
});


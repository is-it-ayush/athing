import { atom } from 'jotai';

// Types
import { Note, NoteModalProps, ShortNote, ToastIntent, type User } from './client.typing';

export const userInfo = atom<User>({
    id: '',
    username: ''
});

export const noteModal = atom<string | null>('edit');
export const showModal = atom<boolean>(false);
export const selectedNoteAtom = atom<Note | ShortNote | null>(null);

export const toastIntentAtom = atom<ToastIntent>('info');
export const toastMessageAtom = atom<string | null>(null);
export const showToastAtom = atom<boolean>(false);
import { Entry, Journal } from '@prisma/client';
import { atom } from 'jotai';

// Types
import { type Note, NoteModalProps, type ShortNote, type ToastIntent, type User, type JournalEntryOnlyTitle } from './client.typing';

export const userInfo = atom<User>({
    id: '',
    username: ''
});

// These is for the notes modal.
export const noteModal = atom<string | null>('edit');
export const showModal = atom<boolean>(false);
export const selectedNoteAtom = atom<Note | ShortNote | null>(null);

// These are for the toast.
export const toastIntentAtom = atom<ToastIntent>('info');
export const toastMessageAtom = atom<string | null>(null);
export const showToastAtom = atom<boolean>(false);

// These are for the action button.
export const showActionWheelAtom = atom<boolean>(false);

// This is for the Journal Modal.
export const showJournalModalAtom = atom<boolean>(false);
export const showJournalIndexModalAtom = atom<boolean>(false);
export const selectedJournalAtom = atom<Journal | null>(null);

// This is for the Entry Modal
export const showEntryModalAtom = atom<boolean>(false);
export const selectedEntryAtom = atom<Entry | null>(null);
export const selectedEntryTypeAtom = atom<'edit' | 'view' | null>(null);
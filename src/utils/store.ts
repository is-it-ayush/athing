import { type Journal } from '@prisma/client';
import { atom } from 'jotai';

// Types
import { type Note, type ShortNote, type ToastIntent, type User } from './client.typing';

export const userInfo = atom<User>({
    id: '',
    username: ''
});

// Current Page
export const allowPagesDisplayAtom = atom<boolean>(true);
export const currentPageAtom = atom<number>(0);

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
export const selectedEntryIdAtom = atom<string>('');
export const selectedEntryTypeAtom = atom<'edit' | 'view' | null>(null);

// This is for the Journal Picker Modal
export const showJournalPickerAtom = atom<boolean>(false);

// This is for the FeedbackModal
export const showFeedbackModalAtom = atom<boolean>(false);
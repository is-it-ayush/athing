export type Note = {
    text: string;
    id: string;
    at: Date | null;
    isPublished: boolean;
    updatedAt: Date | null;
    userId: string | null;
    User: {
        username: string;
        avatarId: number | null;
    } | null;
};

export type NoteModalProps = {
    type: 'add' | 'edit' | 'parse'; // Add, Edit, Parse
    controller: React.Dispatch<React.SetStateAction<boolean>>;
    selectedNote?: Note;
};

export type TypeMutationResponseData = {
    data: JSON,
    message: string,
    statusCode: number
}

export type User = {
    id: string;
    username: string;
}

export interface ToastProps {
    message: string;
    intent: 'success' | 'error' | 'warning' | 'info';
    onClose?: () => void;
}

export type ToastIntent = 'success' | 'error' | 'warning' | 'info';
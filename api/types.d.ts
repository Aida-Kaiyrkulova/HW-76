export interface IMessage {
    id: string;
    author: string;
    message: string;
    datetime: string;
}

export type MessageWithoutId = Omit<IMessage, 'id' | 'datetime'>;
import fs from 'fs/promises';
import crypto from 'crypto';
import { IMessage, MessageWithoutId } from "./types";

const fileName = './db.json';
let data: IMessage[] = [];

const fileDb = {
    async init() {
        try {
            const fileContent = await fs.readFile(fileName);
            data = JSON.parse(fileContent.toString()) as IMessage[];
        } catch (e) {
            console.error('Error reading the database file:', e);
            data = [];
            await this.save();
        }
    },

    async getItems(): Promise<IMessage[]> {
        return data;
    },

    async addItem(item: MessageWithoutId): Promise<IMessage> {
        const id = crypto.randomUUID();
        const datetime = new Date().toISOString();
        const message: IMessage = { id, datetime, ...item };
        data.push(message);
        await this.save();
        return message;
    },

    async save() {
        try {
            await fs.writeFile(fileName, JSON.stringify(data, null, 2));
        } catch (e) {
            console.error('Error saving the database file:', e);
        }
    }
};

export default fileDb;
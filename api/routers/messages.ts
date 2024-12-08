import express from "express";
import { IMessage, MessageWithoutId } from "../types";
import fileDb from "../fileDb";

const messagesRouter = express.Router();

// @ts-ignore
messagesRouter.get('/', async (req, res) => {
    try {
        const messages: IMessage[] = await fileDb.getItems();
        const datetimeQuery = req.query.datetime as string;

        if (datetimeQuery) {
            const datetime = new Date(datetimeQuery);
            if (isNaN(datetime.getTime())) {
                return res.status(400).send({ error: 'Invalid datetime format' });
            }
            const filteredMessages = messages.filter(message => new Date(message.datetime) > datetime);
            return res.send(filteredMessages);
        }

        const sortedMessages = messages.sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());
        const last30Messages = sortedMessages.slice(-30);
        res.send(last30Messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

// @ts-ignore
messagesRouter.post('/', async (req, res) => {
    const message: MessageWithoutId = {
        author: req.body.author,
        message: req.body.message,
    };

    if (!message.author || !message.message) {
        return res.status(400).send({ error: 'Author and message must be present in the request' });
    }

    try {
        const savedMessage = await fileDb.addItem(message);
        res.status(201).send(savedMessage);
    } catch (error) {
        console.error('Error adding message:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

export default messagesRouter;
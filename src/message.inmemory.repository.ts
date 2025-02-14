import { Message } from "./message";
import { MessageRepository } from "./message.repository";

export class InMemoryMessageRepository implements MessageRepository {
  messages = new Map<string, Message>();

  save(msg: Message): Promise<void> {
    this.messages.set(msg.id, msg);
    return Promise.resolve();
  }

  getMessageById(messageId: string) {
    return this.messages.get(messageId);
  }

  givenExistingMessages(messages: Message[]) {
    messages.forEach((msg) => this.messages.set(msg.id, msg));
  }

  getAllUserMessages(user: string): Promise<Message[]> {
    return Promise.resolve(
      [...this.messages.values()].filter((msg) => msg.author === user)
    );
  }
}

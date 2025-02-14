import { Message } from "./message";

export interface MessageRepository {
  save(message: Message): Promise<void>;
  getAllUserMessages(user: string): Promise<Message[]>;
}

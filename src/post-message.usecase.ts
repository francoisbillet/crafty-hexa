import { DateProvider } from "./tests/posting-message.spec";

export type Message = {
  id: string;
  text: string;
  author: string;
  publishedAt: Date;
};

export type PostMessageCommand = {
  id: string;
  text: string;
  author: string;
};

export class MessageTooLongError extends Error {}
export class EmptyMessageError extends Error {}

export interface MessageRepository {
  save(message: Message): void;
}

export class PostMessageUseCase {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly dateProvider: DateProvider
  ) {}

  handle(postMessageCommand: PostMessageCommand) {
    if (postMessageCommand.text.length > 280) {
      throw new MessageTooLongError();
    }

    this.messageRepository.save({
      id: postMessageCommand.id,
      text: postMessageCommand.text,
      author: postMessageCommand.author,
      publishedAt: this.dateProvider.getNow(),
    });
  }
}

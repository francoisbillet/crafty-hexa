import { MessageRepository } from "./message.repository";
import { DateProvider } from "./tests/posting-message.spec";

export class ViewTimeLineUseCase {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly dateProvider: DateProvider
  ) {}
  async handle({
    user,
  }: {
    user: string;
  }): Promise<{ author: string; text: string; publicationTime: string }[]> {
    const userMessages = await this.messageRepository.getAllUserMessages(user);

    userMessages.sort(
      (a, b) => b.publishedAt.getTime() - a.publishedAt.getTime()
    );

    return userMessages.map((message) => ({
      author: message.author,
      text: message.text,
      publicationTime: this.publicationTime(message.publishedAt),
    }));
  }

  private publicationTime(publishedAt: Date) {
    const now = this.dateProvider.getNow();

    const timeElapsed = now.getTime() - publishedAt.getTime();
    const minutes = timeElapsed / 1000 / 60;

    if (minutes < 1) return "less than a minute ago";
    if (minutes < 2) return "1 minute ago";
    return `${minutes} minutes ago`;
  }
}

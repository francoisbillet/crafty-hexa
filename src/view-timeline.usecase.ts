import { MessageRepository } from "./message.repository";

export class ViewTimeLineUseCase {
  constructor(private readonly messageRepository: MessageRepository) {}
  async handle({
    user,
  }: {
    user: string;
  }): Promise<{ author: string; text: string; publicationTime: string }[]> {
    const userMessages = await this.messageRepository.getAllUserMessages(user);

    userMessages.sort(
      (a, b) => b.publishedAt.getTime() - a.publishedAt.getTime()
    );

    return [
      {
        author: userMessages[0].author,
        text: userMessages[0].text,
        publicationTime: "1 minute ago",
      },
      {
        author: userMessages[1].author,
        text: userMessages[1].text,
        publicationTime: "2 minutes ago",
      },
    ];
  }
}

import { InMemoryMessageRepository } from "../message.inmemory.repository";
import { Message } from "../post-message.usecase";

export const createFixture = () => {
  let timeline: {
    author: string;
    text: string;
    publicationTime: string;
  }[] = [];

  const messageRepository = new InMemoryMessageRepository();
  const viewTimeLineUseCase = new ViewTimeLineUseCase(messageRepository);

  return {
    givenTheFollowingMessagesExist(messages: Message[]) {},
    givenNowIs(date: Date) {},
    async whenUserSeesTimelineOf(user: String) {
      timeline = await viewTimeLineUseCase.handle({ user });
    },
    thenUserShouldSee(
      expectedTimeline: {
        author: string;
        text: string;
        publicationTime: string;
      }[]
    ) {
      expect(timeline).toEqual(expectedTimeline);
    },
  };
};

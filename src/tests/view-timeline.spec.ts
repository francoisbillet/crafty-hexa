import { Message } from "../message";
import { InMemoryMessageRepository } from "../message.inmemory.repository";
import { ViewTimeLineUseCase } from "../view-timeline.usecase";

describe("Feature: Viewing a personal timeline", () => {
  let fixture: Fixture;

  beforeEach(() => {
    fixture = createFixture();
  });

  describe("Rule: Messages are shown in reverse chronological order", () => {
    test("Alice can view the 2 messages she published in her timeline", async () => {
      fixture.givenTheFollowingMessagesExist([
        {
          author: "Alice",
          text: "1st message",
          id: "1",
          publishedAt: new Date("2023-02-07T16:29:00.000Z"),
        },
        {
          author: "Bob",
          text: "1st message Bob",
          id: "2",
          publishedAt: new Date("2023-02-07T16:31:00.000Z"),
        },
        {
          author: "Alice",
          text: "2nd message",
          id: "3",
          publishedAt: new Date("2023-02-07T16:31:00.000Z"),
        },
      ]);

      fixture.givenNowIs(new Date("2023-02-07T16:31:00.000Z"));

      await fixture.whenUserSeesTimelineOf("Alice");

      fixture.thenUserShouldSee([
        {
          author: "Alice",
          text: "2nd message",
          publicationTime: "1 minute ago",
        },
        {
          author: "Alice",
          text: "1st message",
          publicationTime: "2 minutes ago",
        },
      ]);
    });
  });
});

const createFixture = () => {
  let timeline: {
    author: string;
    text: string;
    publicationTime: string;
  }[] = [];

  const messageRepository = new InMemoryMessageRepository();
  const viewTimeLineUseCase = new ViewTimeLineUseCase(messageRepository);

  return {
    givenTheFollowingMessagesExist(messages: Message[]) {
      messageRepository.givenExistingMessages(messages);
    },
    givenNowIs(date: Date) {},
    async whenUserSeesTimelineOf(user: string) {
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

type Fixture = ReturnType<typeof createFixture>;

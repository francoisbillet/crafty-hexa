import { InMemoryMessageRepository } from "../message.inmemory.repository";
import {
  EmptyMessageError,
  Message,
  MessageRepository,
  MessageTooLongError,
  PostMessageCommand,
  PostMessageUseCase,
} from "../post-message.usecase";

describe("Feature: Posting a message", () => {
  let fixture: Fixture;

  beforeEach(() => {
    fixture = createFixture();
  });

  describe("Rule: A message can contain a maximum of 280 characters", () => {
    test("Alice can post a new message on her timeline", async () => {
      fixture.givenNowIs(new Date("2023-01-19T19:00:00.000Z"));

      fixture.whenUserPostsMessage({
        id: "message-id",
        text: "Hello, world!",
        author: "Alice",
      });

      fixture.thenPostedMessageShouldBe({
        id: "message-id",
        text: "Hello, world!",
        author: "Alice",
        publishedAt: new Date("2023-01-19T19:00:00.000Z"),
      });
    });

    test("Alice can not post a message with more than 280 characters", async () => {
      const textWith280Characters = "a".repeat(281);
      fixture.givenNowIs(new Date("2023-01-19T19:00:00.000Z"));

      fixture.whenUserPostsMessage({
        id: "message-id",
        text: textWith280Characters,
        author: "Alice",
      });

      fixture.thenErrorShouldBe(MessageTooLongError);
    });
  });

  describe("Rule: A message can not be empty", () => {
    test("Alice cannot post an empty message", async () => {
      fixture.givenNowIs(new Date("2023-01-19T19:00:00.000Z"));

      fixture.whenUserPostsMessage({
        id: "message-id",
        text: "",
        author: "Alice",
      });

      // Here we receive MessageTooLongError because of the previous test. Not good !
      fixture.thenErrorShouldBe(EmptyMessageError);
    });

    test("Alice cannot post a message with only whitespaces", async () => {
      fixture.givenNowIs(new Date("2023-01-19T19:00:00.000Z"));

      fixture.whenUserPostsMessage({
        id: "message-id",
        text: "        ",
        author: "Alice",
      });

      fixture.thenErrorShouldBe(EmptyMessageError);
    });
  });
});

export interface DateProvider {
  getNow(): Date;
}

export class StubDateProvider implements DateProvider {
  now: Date;

  getNow(): Date {
    return this.now;
  }
}

function createFixture() {
  const messageRepository = new InMemoryMessageRepository();
  const dateProvider = new StubDateProvider();
  const postMessageUseCase = new PostMessageUseCase(
    messageRepository,
    dateProvider
  );
  let thrownError: Error;

  return {
    givenNowIs(now: Date) {
      dateProvider.now = now;
    },
    whenUserPostsMessage(postMessage: PostMessageCommand) {
      try {
        postMessageUseCase.handle(postMessage);
      } catch (err) {
        thrownError = err;
      }
    },
    thenPostedMessageShouldBe(expectedMessage: Message) {
      expect(expectedMessage).toEqual(messageRepository.message);
    },
    thenErrorShouldBe(expectedErrorClass: new () => Error) {
      expect(thrownError).toBeInstanceOf(expectedErrorClass);
    },
  };
}

type Fixture = ReturnType<typeof createFixture>;

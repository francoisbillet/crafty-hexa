import {
  EmptyMessageError,
  Message,
  MessageRepository,
  MessageTooLongError,
  PostMessageCommand,
  PostMessageUseCase,
} from "../post-message.usecase";

describe("Feature: Posting a message", () => {
  describe("Rule: A message can contain a maximum of 280 characters", () => {
    test("Alice can post a new message on her timeline", async () => {
      givenNowIs(new Date("2023-01-19T19:00:00.000Z"));

      whenUserPostsMessage({
        id: "message-id",
        text: "Hello, world!",
        author: "Alice",
      });

      thenPostedMessageShouldBe({
        id: "message-id",
        text: "Hello, world!",
        author: "Alice",
        publishedAt: new Date("2023-01-19T19:00:00.000Z"),
      });
    });

    test("Alice can not post a message with more than 280 characters", async () => {
      const textWith280Characters = "a".repeat(281);
      givenNowIs(new Date("2023-01-19T19:00:00.000Z"));

      whenUserPostsMessage({
        id: "message-id",
        text: textWith280Characters,
        author: "Alice",
      });

      thenErrorShouldBe(MessageTooLongError);
    });
  });

  describe("Rule: A message can not be empty", () => {
    test("Alice cannot post an empty message", async () => {
      givenNowIs(new Date("2023-01-19T19:00:00.000Z"));

      whenUserPostsMessage({
        id: "message-id",
        text: "",
        author: "Alice",
      });

      // Here we receive MessageTooLongError because of the previous test. Not good !
      thenErrorShouldBe(EmptyMessageError);
    });
  });
});

let message: Message;
let thrownError: Error;

class InMemoryMessageRepository implements MessageRepository {
  save(msg: Message): void {
    message = msg;
  }
}

const messageRepository = new InMemoryMessageRepository();

export interface DateProvider {
  getNow(): Date;
}

class StubDateProvider implements DateProvider {
  now: Date;

  getNow(): Date {
    return this.now;
  }
}

const stubDateProvider = new StubDateProvider();

const postMessageUseCase = new PostMessageUseCase(
  messageRepository,
  stubDateProvider
);

function givenNowIs(_now: Date) {
  stubDateProvider.now = _now;
}

function whenUserPostsMessage(postMessage: PostMessageCommand) {
  try {
    postMessageUseCase.handle(postMessage);
  } catch (err) {
    thrownError = err;
  }
}

function thenPostedMessageShouldBe(expectedMessage: Message) {
  expect(expectedMessage).toEqual(message);
}

function thenErrorShouldBe(expectedErrorClass: new () => Error) {
  expect(thrownError).toBeInstanceOf(expectedErrorClass);
}

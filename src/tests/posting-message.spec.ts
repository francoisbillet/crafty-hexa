import {
  Message,
  MessageRepository,
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
  });
});

let message: Message;

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
  postMessageUseCase.handle(postMessage);
}

function thenPostedMessageShouldBe(expectedMessage: Message) {
  expect(expectedMessage).toEqual(message);
}

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

function givenNowIs(date: Date) {
  // ...
}

function whenUserPostsMessage(message: {
  id: string;
  text: string;
  author: string;
}) {
  // ...
}

function thenPostedMessageShouldBe(message: {
  id: string;
  text: string;
  author: string;
  publishedAt: Date;
}) {}

#!/usr/bin/env node
import { Command } from "commander";
import {
  PostMessageCommand,
  PostMessageUseCase,
} from "./src/post-message.usecase";
import { InMemoryMessageRepository } from "./src/message.inmemory.repository";
import { DateProvider } from "./src/tests/posting-message.spec";

class RealDateProvider implements DateProvider {
  getNow(): Date {
    return new Date();
  }
}

const messageRepository = new InMemoryMessageRepository();
const dateProvider = new RealDateProvider();
const postMessageUseCase = new PostMessageUseCase(
  messageRepository,
  dateProvider
);
const program = new Command();

program
  .version("1.0.0")
  .description("Crafty social network")
  .addCommand(
    new Command("post-message")
      .argument("<user>", "the current user")
      .argument("<message>", "the message to post")
      .action((user, message) => {
        const postMessageCommand: PostMessageCommand = {
          id: "some-message-id",
          author: user,
          text: message,
        };
        try {
          postMessageUseCase.handle(postMessageCommand);
          console.log("✅ Message posted");
          console.table([messageRepository.message]);
        } catch (err) {
          console.error("❌", err);
        }
      })
  );

async function main() {
  await program.parseAsync();
}

main();

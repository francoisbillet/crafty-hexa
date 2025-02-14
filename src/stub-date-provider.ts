import { DateProvider } from "./tests/posting-message.spec";

export class StubDateProvider implements DateProvider {
  now: Date;

  getNow(): Date {
    return this.now;
  }
}

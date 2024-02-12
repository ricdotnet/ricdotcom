export class Commands extends Map {
  private static _instance: Commands;

  constructor() {
    super();
    if (Commands._instance !== undefined) {
      console.warn("The commands collection is already instantiated.");
      return;
    }

    Commands._instance = this;
  }

  static instance() {
    return Commands._instance;
  }
}

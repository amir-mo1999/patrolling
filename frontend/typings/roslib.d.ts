declare module "roslib" {
  class Ros {
    constructor(options: { url: string });

    on(event: string, callback: () => void): void;
    close(): void;
    // Add other methods or properties used in your application
  }

  class Message {
    constructor(options: { [key: string]: any });
  }

  class Topic {
    constructor(options: { ros: Ros; name: string; messageType: string });

    subscribe(callback: (message: any) => void): void;
    publish(message: Message): void;
    // Add other methods or properties used in your application
  }

  // Add other classes or modules from roslib that you use

  export { Ros, Message, Topic };
}

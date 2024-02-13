import { Client, Events } from "discord.js";
import { RuntimeData } from "../runtime-data";
import { AudioManager } from "../lavacord/manager";

export class ClientReady {
  constructor(client: Client) {
    client.once(Events.ClientReady, this.onClientReady);
  }
  
  onClientReady(readyClient: Client<true>) {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
  
    new RuntimeData();
    new AudioManager(readyClient.user.id, readyClient);
  }
}
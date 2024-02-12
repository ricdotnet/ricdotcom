import { EmbedBuilder } from 'discord.js';

export function nowPlayingEmbed(title: string, image?: string): EmbedBuilder {
  const builder = new EmbedBuilder();

  builder.setColor(0x0099ff).setTitle('Now playing:').setDescription(title);

  if (image) {
    builder.setThumbnail(image);
  }

  return builder;
}

export function audioStartedEmbed(): EmbedBuilder {
  return new EmbedBuilder().setColor(0x08a61b).setTitle('Audio player started');
}

export function audioStoppedEmbed(): EmbedBuilder {
  return new EmbedBuilder().setColor(0xd41111).setTitle('Audio player stopped.');
}

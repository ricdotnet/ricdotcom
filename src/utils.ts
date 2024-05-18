import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  Interaction,
} from 'discord.js';

export function paginationButtons(currentPage: number, totalPages: number) {
  const prevPage = new ButtonBuilder()
    .setCustomId('prev-page')
    .setLabel('Previous')
    .setStyle(ButtonStyle.Primary);

  const nextPage = new ButtonBuilder()
    .setCustomId('next-page')
    .setLabel('Next')
    .setStyle(ButtonStyle.Primary);

  if (currentPage === 1) {
    prevPage.setDisabled(true);
  }

  if (currentPage === totalPages) {
    nextPage.setDisabled(true);
  }

  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    prevPage,
    nextPage,
  );
}

export function collectorFilter(_i: CommandInteraction) {
  return (i: Interaction) => {
    return i.user.id === _i.user.id;
  };
}
import { Client, GatewayIntentBits } from 'discord.js';

type Params = {
  discord_token: string;
  guild_id: string;
  channel_name: string;
};

export default async function (params: Params) {
  const { discord_token, guild_id, channel_name } = params;

  const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
  });

  client.on('ready', async () => {
    const guild = client.guilds.cache.get(guild_id);

    if (!guild) {
      throw new Error(`Guild with id ${guild_id} not found`);
    }

    const channel = guild.channels.cache.find((channel) => channel.name === channel_name);

    if (!channel) {
      throw new Error(`Channel with name ${channel_name} not found`);
    }

    console.log(`Channel "${channel_name}" with id "${channel.id}" found`);

    if (channel.isThread()) {
      throw new Error(`Channel ${channel_name} is a thread. Threads cant be cloned`);
    }

    if (!channel.deletable) {
      throw new Error(`Channel ${channel_name} is not deletable`);
    }

    await channel.clone();
    console.log(`New Channel "${channel_name}" cloned`);

    await channel.delete();
    console.log(`Old Channel "${channel_name}" deleted`);

    console.log('Task completed.');
    client.destroy();
  });

  client.login(discord_token);
}

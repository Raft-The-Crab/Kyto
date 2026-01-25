import { Block } from '@/types'

const generateActionCode = (action: Block, language: 'js' | 'py'): string => {
  const props = action.data.properties || {}

  if (language === 'js') {
    switch (action.type) {
      case 'send_message':
        return `    await interaction.channel.send({ content: \`${props.content || ''}\`, ephemeral: ${props.ephemeral || false} });\n`
      case 'action_reply':
        return `    await interaction.reply({ content: \`${props.content || ''}\`, ephemeral: ${props.ephemeral || false} });\n`
      case 'send_embed':
        return `    const embed = new EmbedBuilder()\n      .setTitle(\`${props.title || ''}\`)\n      .setDescription(\`${props.description || ''}\`)\n      .setColor('${props.color || '#3b82f6'}');\n    await interaction.reply({ embeds: [embed] });\n`
      case 'wait':
        return `    await new Promise(r => setTimeout(r, ${(props.duration || 1) * 1000}));\n`
      case 'set_variable':
        return `    const ${props.name || 'v'} = \`${props.value}\`;\n`
      case 'http_request':
        return `    const response = await fetch('${props.url}');\n    const ${props.saveTo || 'apiResult'} = await response.json();\n`
      case 'action_kick':
        return `    await interaction.guild.members.kick('${props.userId}', '${props.reason || 'No reason provided'}');\n`
      case 'action_ban':
        return `    await interaction.guild.members.ban('${props.userId}', { reason: '${props.reason || 'No reason provided'}' });\n`
      case 'member_timeout':
        return `    const member = await interaction.guild.members.fetch('${props.userId}');\n    await member.timeout(${(props.minutes || 10) * 60000}, '${props.reason || 'Auto timeout'}');\n`
      case 'voice_join':
        return `    const { joinVoiceChannel } = require('@discordjs/voice');\n    joinVoiceChannel({ channelId: '${props.channelId}', guildId: interaction.guildId, adapterCreator: interaction.guild.voiceAdapterCreator });\n`
      case 'voice_leave':
        return `    const { getVoiceConnection } = require('@discordjs/voice');\n    const connection = getVoiceConnection(interaction.guildId);\n    if (connection) connection.destroy();\n`
      case 'thread_create':
        return `    await interaction.channel.threads.create({ name: '${props.name || 'new-thread'}', autoArchiveDuration: 60, reason: 'Generated ID' });\n`
      case 'automod_alert':
        return `    console.log('[AutoMod Alert]: ${props.message || 'Suspicious activity'}');\n`
      case 'event_schedule':
        return `    await interaction.guild.scheduledEvents.create({ name: '${props.name}', startTime: '${props.startTime}', privacyLevel: 2, entityType: 3 });\n`
      case 'role_create':
        return `    await interaction.guild.roles.create({ name: '${props.name || 'new-role'}', reason: 'System action' });\n`
      case 'channel_create':
        return `    await interaction.guild.channels.create({ name: '${props.name || 'new-channel'}' });\n`
      default:
        return `    // Block Logic: ${action.type}\n`
    }
  } else {
    // Python (discord.py)
    switch (action.type) {
      case 'send_message':
        return `    await interaction.channel.send(content="${props.content || ''}")\n`
      case 'action_reply':
        return `    await interaction.response.send_message("${props.content || ''}", ephemeral=${props.ephemeral ? 'True' : 'False'})\n`
      case 'wait':
        return `    await asyncio.sleep(${props.duration || 1})\n`
      case 'http_request':
        return `    async with aiohttp.ClientSession() as session:\n        async with session.get("${props.url}") as resp:\n            ${props.saveTo || 'apiResult'} = await resp.json()\n`
      case 'action_kick':
        return `    user = await interaction.guild.fetch_member(${props.userId})\n    await user.kick(reason="${props.reason || 'None'}")\n`
      case 'action_ban':
        return `    user = await interaction.guild.fetch_member(${props.userId})\n    await user.ban(reason="${props.reason || 'None'}")\n`
      case 'member_timeout':
        return `    user = await interaction.guild.fetch_member(${props.userId})\n    await user.timeout(asyncio.timedelta(minutes=${props.minutes || 10}))\n`
      case 'voice_join':
        return `    channel = interaction.guild.get_channel(${props.channelId})\n    await channel.connect()\n`
      case 'voice_leave':
        return `    if interaction.guild.voice_client:\n        await interaction.guild.voice_client.disconnect()\n`
      case 'thread_create':
        return `    await interaction.channel.create_thread(name="${props.name || 'new-thread'}")\n`
      case 'automod_alert':
        return `    print(f"[AutoMod Alert]: ${props.message || 'Suspicious activity'}")\n`
      case 'event_schedule':
        return `    await interaction.guild.create_scheduled_event(name="${props.name}", start_time="${props.startTime}", entity_type=discord.EntityType.external)\n`
      case 'role_create':
        return `    await interaction.guild.create_role(name="${props.name || 'new-role'}")\n`
      case 'channel_create':
        return `    await interaction.guild.create_text_channel("${props.name || 'new-channel'}")\n`
      default:
        return `    # Block Logic: ${action.type}\n`
    }
  }
}

export const generateCode = (
  blocks: Block[],
  language: 'discord.js' | 'discord.py' = 'discord.js'
): string => {
  if (blocks.length === 0) return '// No logic components detected in current workspace.'

  const isJs = language === 'discord.js'
  let code = ''

  if (isJs) {
    code += `// Generated by Industrial Bot Engine\n`
    code += `const { Client, GatewayIntentBits, EmbedBuilder, ModalBuilder } = require('discord.js');\n`
    code += `const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates] });\n\n`
  } else {
    code += `# Generated by Industrial Bot Engine\n`
    code += `import discord\nimport asyncio\nimport aiohttp\nfrom discord.ext import commands\n\nbot = commands.Bot(command_prefix='!', intents=discord.Intents.all())\n\n`
  }

  const slashTriggers = blocks.filter(b => b.type === 'command_slash')
  const eventTriggers = blocks.filter(b => b.type === 'event_listener')
  const componentTriggers = blocks.filter(b =>
    ['on_button_click', 'on_select_menu', 'on_modal_submit'].includes(b.type)
  )

  slashTriggers.forEach(trigger => {
    const props = trigger.data.properties
    if (isJs) {
      code += `client.on('interactionCreate', async (interaction) => {\n`
      code += `  if (interaction.isChatInputCommand() && interaction.commandName === '${props.name || 'ping'}') {\n`
      code += generateFlow(blocks, 'js')
      code += `  }\n`
      code += `  if (interaction.isUserContextMenuCommand() && interaction.commandName === '${props.name || 'User Logic'}') {\n`
      code += generateFlow(blocks, 'js')
      code += `  }\n`
      code += `  if (interaction.isMessageContextMenuCommand() && interaction.commandName === '${props.name || 'Msg Logic'}') {\n`
      code += generateFlow(blocks, 'js')
      code += `  }\n`
      code += `});\n\n`
    } else {
      code += `@bot.tree.command(name="${props.name || 'ping'}", description="${props.description || 'Command'}")\n`
      code += `async def ${props.name || 'cmd'}(interaction: discord.Interaction):\n`
      code += generateFlow(blocks, 'py')
      code += `\n`
    }
  })

  componentTriggers.forEach(trigger => {
    const props = trigger.data.properties
    if (isJs) {
      code += `client.on('interactionCreate', async (interaction) => {\n`
      code += `  if (interaction.customId === '${props.customId}') {\n`
      code += generateFlow(blocks, 'js')
      code += `  }\n`
      code += `});\n\n`
    } else {
      code += `@bot.event\nasync def on_interaction(interaction: discord.Interaction):\n`
      code += `    if interaction.data.get('custom_id') == "${props.customId}":\n`
      code += `    ` + generateFlow(blocks, 'py').split('\n').join('\n    ')
      code += `\n`
    }
  })

  eventTriggers.forEach(trigger => {
    const props = trigger.data.properties
    if (isJs) {
      code += `client.on('${props.event || 'ready'}', async (ctx) => {\n`
      code += generateFlow(blocks, 'js')
      code += `});\n\n`
    } else {
      code += `@bot.event\nasync def on_${props.event || 'ready'}():\n`
      code += generateFlow(blocks, 'py')
      code += `\n`
    }
  })

  if (isJs) code += `client.login(process.env.TOKEN);`
  else code += `bot.run('TOKEN')`

  return code
}

function generateFlow(allBlocks: Block[], lang: 'js' | 'py'): string {
  let flowCode = ''
  // Sort by Y position for simple linear interpretation
  const actions = allBlocks
    .filter(b => b.data.category !== 'triggers')
    .sort((a, b) => a.position.y - b.position.y)

  if (actions.length === 0)
    return lang === 'js'
      ? `    // Define logic components to generate implementation.\n`
      : `    pass\n`

  actions.forEach(action => {
    flowCode += generateActionCode(action, lang)
  })
  return flowCode
}

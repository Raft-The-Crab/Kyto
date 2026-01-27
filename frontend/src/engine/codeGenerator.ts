import { Block } from '@/types'

const generateActionCode = (
  action: Block,
  allBlocks: Block[],
  connections: Connection[],
  language: 'js' | 'py'
): string => {
  const props = action.data.properties || {}

  // Helper for branching
  const getBranch = (sourceHandle: string) => {
    const conn = connections.find(c => c.source === action.id && c.sourceHandle === sourceHandle)
    if (!conn) return language === 'js' ? '' : 'pass'
    return generateFlow(action.id, allBlocks, connections, language, conn.target)
  }

  if (language === 'js') {
    switch (action.type) {
      case 'if_condition':
        return `    if (${props.condition}) {\n${getBranch('true')}\n    } else {\n${getBranch('false')}\n    }\n`
      case 'condition_has_role':
        return `    if (interaction.member.roles.cache.has('${props.roleId}')) {\n${getBranch('true')}\n    } else {\n${getBranch('false')}\n    }\n`
      case 'condition_has_permission':
        return `    if (interaction.member.permissions.has(PermissionFlagsBits.${props.permission})) {\n${getBranch('true')}\n    } else {\n${getBranch('false')}\n    }\n`
      case 'send_message':
        return `    await interaction.channel.send({ content: \`${props.content || ''}\`, ephemeral: ${props.ephemeral || false} });\n`
      case 'action_reply':
        return `    await interaction.reply({ content: \`${props.content || ''}\`, ephemeral: ${props.ephemeral || false} });\n`
      case 'send_embed':
        return `    const embed = new EmbedBuilder()\n      .setTitle(\`${props.title || ''}\`)\n      .setDescription(\`${props.description || ''}\`)\n      .setColor('${props.color || '#3b82f6'}');\n    await interaction.reply({ embeds: [embed] });\n`
      case 'wait':
        return `    await new Promise(r => setTimeout(r, ${(props.duration || 1) * 1000}));\n`
      case 'call_module': {
        const moduleName = props.moduleId || 'unknown_module'
        const awaitKeyword = props.await !== false ? 'await ' : ''

        if (language === 'js') {
          return `    // Call Module: ${moduleName}\n    ${awaitKeyword}modules['${props.moduleId}'].execute(interaction);\n`
        } else {
          return `    # Call Module: ${moduleName}\n    ${awaitKeyword}await modules['${props.moduleId}'].execute(interaction)\n`
        }
      }

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
      case 'string_manipulation':
        const strOp = props.operation
        const strInput = props.input
        if (strOp === 'split')
          return `    const ${props.saveTo || 'strResult'} = "${strInput}".split(' ');\n`
        if (strOp === 'join')
          return `    const ${props.saveTo || 'strResult'} = "${strInput}".join(' ');\n`
        if (strOp === 'replace')
          return `    const ${props.saveTo || 'strResult'} = "${strInput}".replace('a', 'b');\n`
        if (strOp === 'upper')
          return `    const ${props.saveTo || 'strResult'} = "${strInput}".toUpperCase();\n`
        if (strOp === 'lower')
          return `    const ${props.saveTo || 'strResult'} = "${strInput}".toLowerCase();\n`
        return `    // String Op: ${strOp}\n`
      case 'math_advanced':
        const mathOp = props.operation
        if (mathOp === 'pow') return `    const ${props.saveTo || 'mathResult'} = Math.pow(2, 3);\n`
        if (mathOp === 'sqrt') return `    const ${props.saveTo || 'mathResult'} = Math.sqrt(16);\n`
        if (mathOp === 'round')
          return `    const ${props.saveTo || 'mathResult'} = Math.round(10.5);\n`
        if (mathOp === 'random_range')
          return `    const ${props.saveTo || 'mathResult'} = Math.floor(Math.random() * 100);\n`
        return `    // Math Op: ${mathOp}\n`
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
      case 'string_manipulation':
        const strOp = props.operation
        const strInput = props.input
        if (strOp === 'split')
          return `    ${props.saveTo || 'strResult'} = "${strInput}".split(' ')\n`
        if (strOp === 'join')
          return `    ${props.saveTo || 'strResult'} = " ".join("${strInput}")\n`
        if (strOp === 'replace')
          return `    ${props.saveTo || 'strResult'} = "${strInput}".replace('a', 'b')\n`
        if (strOp === 'upper') return `    ${props.saveTo || 'strResult'} = "${strInput}".upper()\n`
        if (strOp === 'lower') return `    ${props.saveTo || 'strResult'} = "${strInput}".lower()\n`
        return `    # String Op: ${strOp}\n`
      case 'math_advanced':
        const mathOp = props.operation
        if (mathOp === 'pow') return `    ${props.saveTo || 'mathResult'} = pow(2, 3)\n`
        if (mathOp === 'sqrt')
          return `    import math\n    ${props.saveTo || 'mathResult'} = math.sqrt(16)\n`
        if (mathOp === 'round') return `    ${props.saveTo || 'mathResult'} = round(10.5)\n`
        if (mathOp === 'random_range')
          return `    import random\n    ${props.saveTo || 'mathResult'} = random.randint(0, 100)\n`
        return `    # Math Op: ${mathOp}\n`
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

interface Connection {
  source: string
  target: string
  sourceHandle?: string | null
  targetHandle?: string | null
}

const findNextBlock = (
  currentId: string,
  blocks: Block[],
  connections: Connection[],
  overrideTargetId?: string
): Block | null => {
  if (overrideTargetId) return blocks.find(b => b.id === overrideTargetId) || null
  // If this is a branching block, we DO NOT automatically follow edges in the main loop
  const currentBlock = blocks.find(b => b.id === currentId)
  if (
    currentBlock &&
    ['if_condition', 'condition_has_role', 'condition_has_permission', 'loop'].includes(
      currentBlock.type
    )
  ) {
    return null
  }

  const connection = connections.find(c => c.source === currentId)
  if (!connection) return null
  return blocks.find(b => b.id === connection.target) || null
}

// Recursive flow generator
function generateFlow(
  entryBlockId: string,
  allBlocks: Block[],
  connections: Connection[],
  lang: 'js' | 'py',
  startTargetId?: string
): string {
  let code = ''
  let currentBlock = findNextBlock(entryBlockId, allBlocks, connections, startTargetId)
  const visited = new Set<string>()

  while (currentBlock) {
    if (visited.has(currentBlock.id)) break // Prevent loops
    visited.add(currentBlock.id)

    code += generateActionCode(currentBlock, allBlocks, connections, lang)
    currentBlock = findNextBlock(currentBlock.id, allBlocks, connections)
  }

  if (code === '') return lang === 'js' ? '    // No actions connected\n' : '    pass\n'
  return code
}

export const generateCode = (
  blocks: Block[],
  connections: Connection[],
  language: 'discord.js' | 'discord.py' = 'discord.js'
): string => {
  if (blocks.length === 0) return '// No logic components detected in current workspace.'

  const isJs = language === 'discord.js'
  let code = ''

  if (isJs) {
    code += `// Generated by Cortex Engine V2\n`
    code += `const { Client, GatewayIntentBits, EmbedBuilder, ModalBuilder } = require('discord.js');\n`
    code += `const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates] });\n\n`
  } else {
    code += `# Generated by Cortex Engine V2\n`
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
      code += generateFlow(trigger.id, blocks, connections, 'js')
      code += `  }\n`
      code += `});\n\n`
    } else {
      code += `@bot.tree.command(name="${props.name || 'ping'}", description="${props.description || 'Command'}")\n`
      code += `async def ${props.name || 'cmd'}(interaction: discord.Interaction):\n`
      code += generateFlow(trigger.id, blocks, connections, 'py')
      code += `\n`
    }
  })

  eventTriggers.forEach(trigger => {
    const props = trigger.data.properties
    if (isJs) {
      code += `client.on('${props.event || 'ready'}', async (ctx) => {\n`
      code += generateFlow(trigger.id, blocks, connections, 'js')
      code += `});\n\n`
    } else {
      code += `@bot.event\nasync def on_${props.event || 'ready'}():\n`
      code += generateFlow(trigger.id, blocks, connections, 'py')
      code += `\n`
    }
  })

  componentTriggers.forEach(trigger => {
    const props = trigger.data.properties
    if (isJs) {
      code += `client.on('interactionCreate', async (interaction) => {\n`
      code += `  if (interaction.customId === '${props.customId}') {\n`
      code += generateFlow(trigger.id, blocks, connections, 'js')
      code += `  }\n`
      code += `});\n\n`
    } else {
      code += `@bot.event\nasync def on_interaction(interaction: discord.Interaction):\n`
      code += `    if interaction.data.get('custom_id') == "${props.customId}":\n`
      code +=
        `    ` + generateFlow(trigger.id, blocks, connections, 'py').split('\n').join('\n    ')
      code += `\n`
    }
  })

  // Add more trigger types as needed...

  if (isJs) code += `client.login(process.env.TOKEN);`
  else code += `bot.run('TOKEN')`

  return code
}

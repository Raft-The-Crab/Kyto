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
        if (props.useEmbed) {
          return `    const embed = new EmbedBuilder()\n      .setTitle(\`${props.embed_title || ''}\`)\n      .setDescription(\`${props.embed_description || ''}\`)\n      .setColor('${props.embed_color || '#3b82f6'}');\n    await interaction.channel.send({ embeds: [embed] });\n`
        }
        return `    await interaction.channel.send({ content: \`${props.content || ''}\` });\n`
      case 'action_reply':
        if (props.useEmbed) {
          return `    const embed = new EmbedBuilder()\n      .setTitle(\`${props.embed_title || ''}\`)\n      .setDescription(\`${props.embed_description || ''}\`)\n      .setColor('${props.embed_color || '#3b82f6'}');\n    await interaction.reply({ embeds: [embed], ephemeral: ${props.ephemeral || false} });\n`
        }
        return `    await interaction.reply({ content: \`${props.content || ''}\`, ephemeral: ${props.ephemeral || false} });\n`
      case 'action_defer_reply':
        return `    await interaction.deferReply({ ephemeral: ${props.ephemeral || false} });\n`
      case 'edit_reply':
        return `    await interaction.editReply({ content: \`${props.content || ''}\` });\n`
      case 'follow_up':
        return `    await interaction.followUp({ content: \`${props.content || ''}\`, ephemeral: ${props.ephemeral || false} });\n`
      case 'send_embed': {
        const title = props.title || props.embed_title || ''
        const desc = props.description || props.embed_description || ''
        const color = props.color || props.embed_color || '#3b82f6'
        return `    const embed = new EmbedBuilder()\n      .setTitle(\`${title}\`)\n      .setDescription(\`${desc}\`)\n      .setColor('${color}');\n    await interaction.reply({ embeds: [embed] });\n`
      }
      case 'error_handler':
        // Error handler doesn't generate code directly, it's used as a boundary marker
        // The actual try-catch wrapping is handled in the flow generation logic
        return `    // Error boundary\n`
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
      case 'string_manipulation': {
        const strOpJs = props.operation
        const strInputJs = props.input
        if (strOpJs === 'split')
          return `    const ${props.saveTo || 'strResult'} = "${strInputJs}".split(' ');\n`
        if (strOpJs === 'join')
          return `    const ${props.saveTo || 'strResult'} = ["${strInputJs}"].join(' ');\n`
        if (strOpJs === 'replace')
          return `    const ${props.saveTo || 'strResult'} = "${strInputJs}".replace('a', 'b');\n`
        if (strOpJs === 'upper')
          return `    const ${props.saveTo || 'strResult'} = "${strInputJs}".toUpperCase();\n`
        if (strOpJs === 'lower')
          return `    const ${props.saveTo || 'strResult'} = "${strInputJs}".toLowerCase();\n`
        return `    // String Op: ${strOpJs}\n`
      }
      case 'math_advanced': {
        const mathOpJs = props.operation
        if (mathOpJs === 'pow')
          return `    const ${props.saveTo || 'mathResult'} = Math.pow(2, 3);\n`
        if (mathOpJs === 'sqrt')
          return `    const ${props.saveTo || 'mathResult'} = Math.sqrt(16);\n`
        if (mathOpJs === 'round')
          return `    const ${props.saveTo || 'mathResult'} = Math.round(10.5);\n`
        if (mathOpJs === 'random_range')
          return `    const ${props.saveTo || 'mathResult'} = Math.floor(Math.random() * 100);\n`
        return `    // Math Op: ${mathOpJs}\n`
      }
      case 'add_button':
        return `    const button = new ButtonBuilder()\n      .setCustomId('${props.customId || 'btn_click_1'}')\n      .setLabel('${props.label || 'Click me'}')\n      .setStyle(ButtonStyle.${props.style || 'Primary'});\n    const row = new ActionRowBuilder().addComponents(button);\n    await interaction.reply({ content: \`${props.content || ''}\`, components: [row] });\n`
      case 'add_select_menu':
        return `    const select = new StringSelectMenuBuilder()\n      .setCustomId('${props.customId || 'menu_select_1'}')\n      .setPlaceholder('${props.placeholder || 'Select an option...'}');\n    const rowMenu = new ActionRowBuilder().addComponents(select);\n    await interaction.reply({ content: \`${props.content || ''}\`, components: [rowMenu] });\n`
      case 'show_modal':
        return `    const modal = new ModalBuilder()\n      .setCustomId('${props.customId || 'modal_submit_1'}')\n      .setTitle('${props.title || 'My Form'}');\n    const input = new TextInputBuilder()\n      .setCustomId('${props.text_input_id || 'name_input'}')\n      .setLabel('${props.text_input_label || 'Your answer'}')\n      .setStyle(TextInputStyle.${props.text_input_style || 'Short'});\n    const modalRow = new ActionRowBuilder().addComponents(input);\n    modal.addComponents(modalRow);\n    await interaction.showModal(modal);\n`
      case 'edit_message':
        return `    await interaction.message.edit({ content: \`${props.content || ''}\` });\n`
      case 'delete_message':
        return `    await interaction.message.delete();\n`
      case 'webhook_send':
        return `    const webhookRes = await fetch('${props.url}', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content: \`${props.content || ''}\` }) });\n    if (!webhookRes.ok) console.error('Webhook failed', webhookRes.status);\n`
      case 'console_log':
        return `    console.log(${props.message ? `\`${props.message}\`` : "'[Log Block]'"});\n`
      default:
        return `    // Block Logic: ${action.type}\n`
    }
  } else {
    // Python (discord.py)
    switch (action.type) {
      case 'send_message':
        if (props.useEmbed) {
          return `    embed = discord.Embed(title="${props.embed_title || ''}", description="${props.embed_description || ''}", color=${props.embed_color?.replace('#', '0x') || '0x3b82f6'})\n    await interaction.channel.send(embed=embed)\n`
        }
        return `    await interaction.channel.send(content="${props.content || ''}")\n`
      case 'action_reply':
        if (props.useEmbed) {
          return `    embed = discord.Embed(title="${props.embed_title || ''}", description="${props.embed_description || ''}", color=${props.embed_color?.replace('#', '0x') || '0x3b82f6'})\n    await interaction.response.send_message(embed=embed, ephemeral=${props.ephemeral ? 'True' : 'False'})\n`
        }
        return `    await interaction.response.send_message("${props.content || ''}", ephemeral=${props.ephemeral ? 'True' : 'False'})\n`
      case 'action_defer_reply':
        return `    await interaction.response.defer(ephemeral=${props.ephemeral ? 'True' : 'False'})\n`
      case 'edit_reply':
        return `    await interaction.edit_original_response(content="${props.content || ''}")\n`
      case 'follow_up':
        return `    await interaction.followup.send("${props.content || ''}", ephemeral=${props.ephemeral ? 'True' : 'False'})\n`
      case 'wait':
        return `    await asyncio.sleep(${props.duration || 1})\n`
      case 'http_request':
        return `    async with aiohttp.ClientSession() as session:\n        async with session.get("${props.url}") as resp:\n            ${props.saveTo || 'apiResult'} = await resp.json()\n`
      case 'string_manipulation': {
        const strOpPy = props.operation
        const strInputPy = props.input
        if (strOpPy === 'split')
          return `    ${props.saveTo || 'strResult'} = "${strInputPy}".split(' ')\n`
        if (strOpPy === 'join')
          return `    ${props.saveTo || 'strResult'} = " ".join("${strInputPy}")\n`
        if (strOpPy === 'replace')
          return `    ${props.saveTo || 'strResult'} = "${strInputPy}".replace('a', 'b')\n`
        if (strOpPy === 'upper')
          return `    ${props.saveTo || 'strResult'} = "${strInputPy}".upper()\n`
        if (strOpPy === 'lower')
          return `    ${props.saveTo || 'strResult'} = "${strInputPy}".lower()\n`
        return `    # String Op: ${strOpPy}\n`
      }
      case 'math_advanced': {
        const mathOpPy = props.operation
        if (mathOpPy === 'pow') return `    ${props.saveTo || 'mathResult'} = pow(2, 3)\n`
        if (mathOpPy === 'sqrt')
          return `    import math\n    ${props.saveTo || 'mathResult'} = math.sqrt(16)\n`
        if (mathOpPy === 'round') return `    ${props.saveTo || 'mathResult'} = round(10.5)\n`
        if (mathOpPy === 'random_range')
          return `    import random\n    ${props.saveTo || 'mathResult'} = random.randint(0, 100)\n`
        return `    # Math Op: ${mathOpPy}\n`
      }
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
      case 'console_log':
        return `    print(${props.message ? `"${props.message}"` : "'[Log Block]'"})\n`
      case 'error_handler':
        return `    try:\n        ${getBranch('output_0').split('\n').join('\n        ')}\n    except Exception as e:\n        ${props.logToConsole ? "print(f'[Kyto Error]: {e}')" : 'pass'}\n`
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
    code += `// Generated by Kyto Engine V2\n`
    code += `const { Client, GatewayIntentBits, EmbedBuilder, ModalBuilder } = require('discord.js');\n`
    code += `const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates] });\n\n`
  } else {
    code += `# Generated by Kyto Engine V2\n`
    code += `import discord\nimport asyncio\nimport aiohttp\nfrom discord.ext import commands\n\nbot = commands.Bot(command_prefix='!', intents=discord.Intents.all())\n\n`
  }

  const slashTriggers = blocks.filter(b => b.type === 'command_slash')
  const eventTriggers = blocks.filter(b => b.type === 'event_listener')
  const componentTriggers = blocks.filter(b =>
    ['on_button_click', 'on_select_menu', 'on_modal_submit'].includes(b.type)
  )

  slashTriggers.forEach(trigger => {
    const props = trigger.data.properties
    const name = props.name || 'ping'

    // Check for connected subcommands
    const subcommandConns = connections.filter(c => c.source === trigger.id)
    const connectedSubcommands = subcommandConns
      .map(c => blocks.find(b => b.id === c.target))
      .filter(b => b?.type === 'command_subcommand') as Block[]

    if (isJs) {
      code += `client.on('interactionCreate', async (interaction) => {\n`
      code += `  if (interaction.isChatInputCommand() && interaction.commandName === '${name}') {\n`

      if (connectedSubcommands.length > 0) {
        code += `    const subcommand = interaction.options.getSubcommand(false);\n`
        connectedSubcommands.forEach((sub, i) => {
          const subName = sub.data.properties.name || `sub${i}`
          code += `    if (subcommand === '${subName}') {\n`
          code += generateFlow(sub.id, blocks, connections, 'js')
          code += `    }\n`
        })
      } else {
        code += generateFlow(trigger.id, blocks, connections, 'js')
      }

      code += `  }\n`
      code += `});\n\n`
    } else {
      // Python (discord.py)
      if (connectedSubcommands.length > 0) {
        code += `@bot.tree.group(name="${name}", description="${props.description || 'Group'}")\n`
        code += `async def ${name}_group(interaction: discord.Interaction):\n`
        code += `    pass\n\n`

        connectedSubcommands.forEach((sub, i) => {
          const subName = sub.data.properties.name || `sub${i}`
          code += `@${name}_group.command(name="${subName}", description="${sub.data.properties.description || 'Sub'}")\n`
          code += `async def ${name}_${subName}(interaction: discord.Interaction):\n`
          code += generateFlow(sub.id, blocks, connections, 'py')
          code += `\n`
        })
      } else {
        code += `@bot.tree.command(name="${name}", description="${props.description || 'Command'}")\n`
        code += `async def ${name}_cmd(interaction: discord.Interaction):\n`
        code += generateFlow(trigger.id, blocks, connections, 'py')
        code += `\n`
      }
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

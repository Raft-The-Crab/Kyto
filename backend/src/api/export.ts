import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import type { ExportRequest, ExportResponse, Block, Connection } from "../types";

export const exportRoutes = new Hono();


const exportSchema = z.object({
  canvas: z.object({
    blocks: z.array(z.any()),
    connections: z.array(z.any()),
  }),
  language: z.enum(["discord.js", "discord.py"]),
  settings: z.object({
    prefix: z.string().optional(),
    botToken: z.string(),
    clientId: z.string(),
    intents: z.array(z.number()).optional(),
  }),
});

// POST /api/export - Generate bot code
exportRoutes.post("/", zValidator("json", exportSchema), async (c) => {
  try {
    const data = c.req.valid("json") as ExportRequest;
    console.log("[Export] Export request", {
      language: data.language,
      blocks: data.canvas.blocks.length,
      user: c.req.header("X-User-ID"),
      preview: Boolean(c.req.query("preview")),
      format: c.req.query("format") || 'files',
    });

    const isJs = data.language === "discord.js";
    const exporter = new BotExporter(data, isJs);

    // Preview mode: return file list & optional content (no zip)
    if (c.req.query("preview") === 'true') {
      const files = exporter.export().files;

      // Run lightweight validation and attach warnings/errors
      const validated = files.map((f) => ({
        path: f.path,
        size: f.content.length,
        preview: f.content.substring(0, 200),
        issues: exporter.validateFile(f),
      }));

      return c.json({ files: validated });
    }

    // If requesting ZIP, return a generated zip
    if (c.req.query("format") === 'zip') {
      const zipBuffer = await exporter.exportZip();
      // Ensure we pass a compatible ArrayBuffer/Uint8Array to Hono
      // Convert to Node Buffer explicitly so types align across envs
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const buf = Buffer.from(zipBuffer as any)
      return c.body(buf, 200, {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="kyto-export.zip"',
      });
    }

    // Default: return files + dependencies + instructions (old behavior)
    const result = exporter.export();
    return c.json(result);
  } catch (error) {
    console.error("[Export] Export error", error);
    return c.json(
      { error: "Export failed. Please check your input and try again." },
      500,
    );
  }
});

// POST /api/export/github - Commit files to GitHub using a provided token
const githubSchema = z.object({
  token: z.string().min(10),
  owner: z.string().min(1),
  repo: z.string().min(1),
  branch: z.string().optional(),
  message: z.string().optional(),
  files: z.array(z.object({ path: z.string(), content: z.string() })),
});

exportRoutes.post('/github', zValidator('json', githubSchema), async (c) => {
  try {
    const body = c.req.valid('json') as any
    const { token, owner, repo, branch = 'main', message } = body
    const files: Array<{ path: string; content: string }> = body.files || []

    if (!token || !owner || !repo || files.length === 0) {
      return c.json({ error: 'Missing parameters or no files to commit' }, 400)
    }

    const headers = {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
    }

    // Verify token by fetching user
    const userResp = await fetch('https://api.github.com/user', { headers })
    if (!userResp.ok) {
      const text = await userResp.text()
      return c.json({ error: `Invalid token: ${text}` }, 401)
    }

    // Ensure repo exists (and is accessible)
    const repoUrl = `https://api.github.com/repos/${owner}/${repo}`
    let repoResp = await fetch(repoUrl, { headers })

    if (repoResp.status === 404) {
      // Try to create repository under authenticated user (owner must match)
      const createResp = await fetch('https://api.github.com/user/repos', {
        method: 'POST',
        headers,
        body: JSON.stringify({ name: repo, private: false }),
      })

      if (!createResp.ok) {
        const text = await createResp.text()
        return c.json({ error: `Failed to create repo: ${text}` }, 400)
      }
    } else if (!repoResp.ok) {
      const text = await repoResp.text()
      return c.json({ error: `Failed to access repo: ${text}` }, 400)
    }

    // For each file, create or update via the GitHub contents API
    const results: Array<{ path: string; status: string; detail?: string }> = []

    for (const f of files) {
      try {
        const url = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(f.path)}`
        const getResp = await fetch(url, { headers })
        let sha: string | undefined
        if (getResp.ok) {
          const json = await getResp.json()
          sha = json.sha
        }

        const payload: any = {
          message: message || `Add ${f.path} via Kyto export`,
          content: Buffer.from(f.content, 'utf-8').toString('base64'),
          branch,
        }

        if (sha) payload.sha = sha

        const putResp = await fetch(url, {
          method: 'PUT',
          headers,
          body: JSON.stringify(payload),
        })

        if (!putResp.ok) {
          const text = await putResp.text()
          results.push({ path: f.path, status: 'error', detail: text })
        } else {
          results.push({ path: f.path, status: 'ok' })
        }
      } catch (err: any) {
        results.push({ path: f.path, status: 'error', detail: String(err) })
      }
    }

    return c.json({ success: true, results })
  } catch (err: any) {
    console.error('[Export:GitHub] error', err)
    return c.json({ error: String(err) }, 500)
  }
})

export class BotExporter {
  private data: ExportRequest;
  private isJs: boolean;
  private blocks: Block[];
  private connections: Connection[];

  constructor(data: ExportRequest, isJs: boolean) {
    this.data = data;
    this.isJs = isJs;
    this.blocks = data.canvas.blocks;
    this.connections = data.canvas.connections;
  }

  export(): ExportResponse {
    const files = [];
    const dependencies: Record<string, string> = {};

    // Generate main file
    const mainCode = this.generateMainFile();
    files.push({
      path: this.isJs ? "index.js" : "main.py",
      content: mainCode,
    });

    // Generate command files
    const commandFiles = this.generateCommandFiles();
    files.push(...commandFiles);

    // Generate event files
    const eventFiles = this.generateEventFiles();
    files.push(...eventFiles);

    // Generate .env file
    files.push({
      path: ".env",
      content: this.generateEnvFile(),
    });

    // Generate package.json or requirements.txt
    if (this.isJs) {
      dependencies["discord.js"] = "^14.14.1";
      dependencies["dotenv"] = "^16.4.5";

      files.push({
        path: "package.json",
        content: JSON.stringify(
          {
            name: "discord-bot",
            version: "1.0.0",
            main: "index.js",
            type: "commonjs",
            dependencies,
            scripts: {
              start: "node index.js",
              dev: "node index.js",
            },
          },
          null,
          2,
        ),
      });
    } else {
      files.push({
        path: "requirements.txt",
        content: "discord.py==2.3.2\npython-dotenv==1.0.0",
      });
    }

    // Generate README
    files.push({
      path: "README.md",
      content: this.generateReadme(),
    });

    return {
      files,
      dependencies,
      instructions: this.generateInstructions(),
    };
  }

  /**
   * Validate generated file for basic syntactic issues.
   * Returns an array of issue strings (may be empty).
   */
  validateFile(file: { path: string; content: string }): string[] {
    const issues: string[] = [];

    // Quick JS syntax check using acorn
    if (this.isJs && file.path.endsWith('.js')) {
      try {
        // Use dynamic import to avoid adding a top-level import if not present in environment
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const acorn = require('acorn');
        acorn.parse(file.content, { ecmaVersion: 'latest' });
      } catch (err: any) {
        issues.push(`JavaScript parse error: ${err.message}`);
      }
    }

    // Simple Python heuristic check: unbalanced parentheses/brackets
    if (!this.isJs && file.path.endsWith('.py')) {
      const open = (s: string, ch: string) => (s.match(new RegExp(`\\${ch}`, 'g')) || []).length
      const opens = open(file.content, '(') - open(file.content, ')')
      const opensB = open(file.content, '[') - open(file.content, ']')
      const opensC = open(file.content, '{') - open(file.content, '}')
      if (opens !== 0 || opensB !== 0 || opensC !== 0) {
        issues.push('Potential unbalanced brackets or parentheses in Python file');
      }
    }

    return issues;
  }

  /**
   * Export files as a ZIP buffer (Node environment)
   */
  async exportZip(): Promise<Uint8Array> {
    // Use JSZip to create a zip archive in memory
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const JSZip = require('jszip');
    const zip = new JSZip();
    const result = this.export();

    for (const f of result.files) {
      zip.file(f.path, f.content);
    }

    const content = await zip.generateAsync({ type: 'uint8array' });
    return content;
  }

  private generateMainFile(): string {
    const commands = this.getBlocksByType("command_slash");
    const events = this.getBlocksByType("event_");

    if (this.isJs) {
      return this.generateJsMain(commands, events);
    } else {
      return this.generatePyMain(commands, events);
    }
  }

  private generateJsMain(commands: Block[], events: Block[]): string {
    const hasCommands = commands.length > 0;
    const hasEvents = events.length > 0;

    return `const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ]
});

${hasCommands ? `// Load commands
client.commands = new Collection();
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(f => f.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(\`./commands/\${file}\`);
  client.commands.set(command.data.name, command);
  console.log(\`[Commands] Loaded \${command.data.name}\`);
}` : ''}

${hasEvents ? `// Load events
const eventFiles = fs.readdirSync(path.join(__dirname, 'events')).filter(f => f.endsWith('.js'));

for (const file of eventFiles) {
  const event = require(\`./events/\${file}\`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
  console.log(\`[Events] Loaded \${event.name}\`);
}` : ''}

// Ready event
client.once('ready', () => {
  console.log(\`✅ Logged in as \${client.user.tag}\`);
  console.log(\`📊 Serving \${client.guilds.cache.size} servers\`);
});

${hasCommands ? `// Handle slash commands
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction, client);
  } catch (error) {
    console.error('[Error]', error);
    const reply = { content: 'There was an error executing this command!', ephemeral: true };
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(reply);
    } else {
      await interaction.reply(reply);
    }
  }
});` : ''}

// Login
client.login(process.env.BOT_TOKEN);
`;
  }

  private generatePyMain(commands: Block[], events: Block[]): string {
    const hasCommands = commands.length > 0;
    const hasEvents = events.length > 0;

    return `import discord
from discord.ext import commands
from discord import app_commands
import os
from dotenv import load_dotenv

load_dotenv()

class Bot(commands.Bot):
    def __init__(self):
        intents = discord.Intents.default()
        intents.message_content = True
        intents.members = True
        
        super().__init__(
            command_prefix='!',
            intents=intents,
            help_command=None
        )
    
    async def setup_hook(self):
        """Load commands and sync slash commands"""
        ${hasCommands ? `# Load command cogs
        for filename in os.listdir('./commands'):
            if filename.endswith('.py'):
                await self.load_extension(f'commands.{filename[:-3]}')
                print(f'[Commands] Loaded {filename}')
        
        # Sync slash commands
        await self.tree.sync()
        print('[Commands] Synced slash commands')` : '# No commands to load'}
    
    async def on_ready(self):
        print(f'✅ Logged in as {self.user}')
        print(f'📊 Serving {len(self.guilds)} servers')

bot = Bot()

${hasEvents ? this.generatePyEvents(events) : ''}

# Run bot
bot.run(os.getenv('BOT_TOKEN'))
`;
  }

  private generateCommandFiles(): { path: string; content: string }[] {
    const commands = this.getBlocksByType("command_slash");
    if (commands.length === 0) return [];

    const files = [];
    
    // Create commands directory structure
    if (this.isJs) {
      for (const cmd of commands) {
        files.push({
          path: `commands/${this.getCommandName(cmd)}.js`,
          content: this.generateJsCommand(cmd),
        });
      }
    } else {
      for (const cmd of commands) {
        files.push({
          path: `commands/${this.getCommandName(cmd)}.py`,
          content: this.generatePyCommand(cmd),
        });
      }
    }

    return files;
  }

  private generateEventFiles(): { path: string; content: string }[] {
    const events = this.getBlocksByType("event_");
    if (events.length === 0) return [];

    const files = [];

    if (this.isJs) {
      for (const evt of events) {
        files.push({
          path: `events/${this.getEventName(evt)}.js`,
          content: this.generateJsEvent(evt),
        });
      }
    }
    // Python events are handled in main file

    return files;
  }

  private generateJsCommand(cmdBlock: Block): string {
    const name = this.getCommandName(cmdBlock);
    const description = cmdBlock.data.properties.description || "A bot command";
    const actions = this.getConnectedBlocks(cmdBlock.id);

    return `const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('${name}')
    .setDescription('${description}'),
  
  async execute(interaction, client) {
    try {
${this.generateActionCode(actions, true, 6)}
    } catch (error) {
      console.error('[${name}] Error:', error);
      await interaction.reply({ content: 'An error occurred!', ephemeral: true });
    }
  }
};
`;
  }

  private generatePyCommand(cmdBlock: Block): string {
    const name = this.getCommandName(cmdBlock);
    const description = cmdBlock.data.properties.description || "A bot command";
    const actions = this.getConnectedBlocks(cmdBlock.id);

    return `import discord
from discord.ext import commands
from discord import app_commands

class ${this.toPascalCase(name)}(commands.Cog):
    def __init__(self, bot):
        self.bot = bot
    
    @app_commands.command(name="${name}", description="${description}")
    async def ${name}_command(self, interaction: discord.Interaction):
        try:
${this.generateActionCode(actions, false, 12)}
        except Exception as error:
            print(f'[${name}] Error: {error}')
            await interaction.response.send_message('An error occurred!', ephemeral=True)

async def setup(bot):
    await bot.add_cog(${this.toPascalCase(name)}(bot))
`;
  }

  private generateJsEvent(evtBlock: Block): string {
    const eventType = this.getEventType(evtBlock);
    const actions = this.getConnectedBlocks(evtBlock.id);

    return `module.exports = {
  name: '${eventType}',
  once: false,
  
  async execute(...args) {
    const client = args[args.length - 1];
    
    try {
${this.generateActionCode(actions, true, 6)}
    } catch (error) {
      console.error('[${eventType}] Error:', error);
    }
  }
};
`;
  }

  private generatePyEvents(events: Block[]): string {
    let code = "";
    
    for (const evt of events) {
      const eventType = this.getEventType(evt);
      const actions = this.getConnectedBlocks(evt.id);
      
      code += `
@bot.event
async def ${eventType}(...args):
    try:
${this.generateActionCode(actions, false, 8)}
    except Exception as error:
        print(f'[${eventType}] Error: {error}')
`;
    }
    
    return code;
  }

  private generateActionCode(blocks: Block[], isJs: boolean, indent: number): string {
    if (blocks.length === 0) {
      return " ".repeat(indent) + (isJs ? "await interaction.reply('Hello!');" : "await interaction.response.send_message('Hello!')");
    }

    let code = "";
    const indentStr = " ".repeat(indent);

    for (const block of blocks) {
      switch (block.data.category) {
        case "actions":
          code += this.generateActionBlock(block, isJs, indent);
          break;
        case "moderation":
          code += this.generateModerationBlock(block, isJs, indent);
          break;
        case "logic":
          code += this.generateLogicBlock(block, isJs, indent);
          break;
      }
    }

    return code || indentStr + (isJs ? "// No actions defined" : "# No actions defined");
  }

  private generateActionBlock(block: Block, isJs: boolean, indent: number): string {
    const indentStr = " ".repeat(indent);
    const props = block.data.properties;

    if (block.type === "action_reply") {
      const message = props.message || "Hello!";
      const ephemeral = props.ephemeral ? "true" : "false";
      
      if (isJs) {
        return `${indentStr}await interaction.reply({ content: '${this.escapeString(message)}', ephemeral: ${ephemeral} });\n`;
      } else {
        return `${indentStr}await interaction.response.send_message('${this.escapeString(message)}', ephemeral=${ephemeral === "true" ? "True" : "False"})\n`;
      }
    }

    if (block.type === "send_message") {
      const message = props.message || "Message";
      const channelId = props.channel_id;
      
      if (isJs) {
        return `${indentStr}const channel = client.channels.cache.get('${channelId}');\n${indentStr}if (channel) await channel.send('${this.escapeString(message)}');\n`;
      } else {
        return `${indentStr}channel = bot.get_channel(${channelId})\n${indentStr}if channel:\n${indentStr}    await channel.send('${this.escapeString(message)}')\n`;
      }
    }

    return "";
  }

  private generateModerationBlock(block: Block, isJs: boolean, indent: number): string {
    const indentStr = " ".repeat(indent);
    const props = block.data.properties;

    if (block.type === "mod_kick") {
      if (isJs) {
        return `${indentStr}const member = interaction.options.getMember('user');\n${indentStr}if (member) await member.kick('${props.reason || "No reason"}');\n`;
      } else {
        return `${indentStr}member = interaction.namespace.user\n${indentStr}if member:\n${indentStr}    await member.kick(reason='${props.reason || "No reason"}')\n`;
      }
    }

    if (block.type === "mod_ban") {
      if (isJs) {
        return `${indentStr}const member = interaction.options.getMember('user');\n${indentStr}if (member) await member.ban({ reason: '${props.reason || "No reason"}' });\n`;
      } else {
        return `${indentStr}member = interaction.namespace.user\n${indentStr}if member:\n${indentStr}    await member.ban(reason='${props.reason || "No reason"}')\n`;
      }
    }

    return "";
  }

  private generateLogicBlock(block: Block, isJs: boolean, indent: number): string {
    const indentStr = " ".repeat(indent);
    
    if (block.type === "if_condition") {
      const condition = block.data.properties.condition || "true";
      const thenBlocks = this.getConnectedBlocks(block.id, "then");
      const elseBlocks = this.getConnectedBlocks(block.id, "else");

      if (isJs) {
        return `${indentStr}if (${condition}) {\n${this.generateActionCode(thenBlocks, true, indent + 2)}${indentStr}} else {\n${this.generateActionCode(elseBlocks, true, indent + 2)}${indentStr}}\n`;
      } else {
        return `${indentStr}if ${condition}:\n${this.generateActionCode(thenBlocks, false, indent + 4)}${indentStr}else:\n${this.generateActionCode(elseBlocks, false, indent + 4)}\n`;
      }
    }

    return "";
  }

  private generateEnvFile(): string {
    const { botToken, clientId, prefix } = this.data.settings;
    return `# Discord Bot Configuration
BOT_TOKEN=${botToken}
CLIENT_ID=${clientId}
${prefix ? `PREFIX=${prefix}` : ''}

# Generated by Kyto
# DO NOT COMMIT THIS FILE TO VERSION CONTROL
`;
  }

  private generateReadme(): string {
    return `# Discord Bot - Generated by Kyto

This bot was automatically generated from a visual canvas using [Kyto](https://kyto.app).

## Features

${this.getBlocksByType("command_slash").length > 0 ? `- ✅ Slash Commands (${this.getBlocksByType("command_slash").length})` : ''}
${this.getBlocksByType("event_").length > 0 ? `- ✅ Event Listeners (${this.getBlocksByType("event_").length})` : ''}
- ✅ Error Handling
- ✅ Environment Configuration

## Setup

### 1. Install Dependencies

${this.isJs ? `\`\`\`bash
npm install
\`\`\`` : `\`\`\`bash
pip install -r requirements.txt
\`\`\``}

### 2. Configure Environment

Create a \`.env\` file with your bot credentials (already generated):

\`\`\`env
BOT_TOKEN=your_bot_token_here
CLIENT_ID=your_client_id_here
\`\`\`

### 3. Run the Bot

${this.isJs ? `\`\`\`bash
npm start
\`\`\`` : `\`\`\`bash
python main.py
\`\`\``}

## Project Structure

\`\`\`
${this.isJs ? `├── index.js           # Main bot file
├── commands/          # Slash command handlers
├── events/            # Event listeners
├── package.json       # Dependencies
└── .env              # Configuration` : `├── main.py            # Main bot file
├── commands/          # Command cogs
├── requirements.txt   # Dependencies
└── .env              # Configuration`}
\`\`\`

## Deployment

Deploy to your favorite platform:
- **Heroku**: Use the Heroku CLI
- **Railway**: Connect your GitHub repo
- **Cloudflare Workers**: Use Wrangler CLI
- **VPS**: Use PM2 or systemd

## Need Help?

- [Discord.${this.isJs ? "js" : "py"} Documentation](https://${this.isJs ? "discord.js.org" : "discordpy.readthedocs.io"})
- [Kyto Documentation](https://docs.kyto.app)

---

**Made with ❤️ using Kyto**
`;
  }

  private generateInstructions(): string {
    return `## Quick Start Guide

1. **Install Dependencies**
   ${this.isJs ? "Run: npm install" : "Run: pip install -r requirements.txt"}

2. **Configure Bot Token**
   Add your bot token to the .env file

3. **Register Slash Commands** (Discord.js only)
   ${this.isJs ? "Run: node deploy-commands.js (if provided)" : "Commands auto-sync on startup"}

4. **Start the Bot**
   ${this.isJs ? "Run: npm start" : "Run: python main.py"}

5. **Test in Discord**
   Invite your bot and test the commands!

## Generated Components
- ${this.getBlocksByType("command_slash").length} Slash Commands
- ${this.getBlocksByType("event_").length} Event Handlers
- Full error handling included

Generated by Kyto - Visual Automation Studio
`;
  }

  // ============== HELPER METHODS ==============

  private getBlocksByType(typePrefix: string): Block[] {
    return this.blocks.filter(b => b.type.startsWith(typePrefix));
  }

  private getConnectedBlocks(blockId: string, handle?: string): Block[] {
    const connections = this.connections.filter(c => 
      c.source === blockId && (!handle || c.sourceHandle === handle)
    );
    
    return connections
      .map(c => this.blocks.find(b => b.id === c.target))
      .filter(b => b !== undefined) as Block[];
  }

  private getCommandName(block: Block): string {
    return (block.data.properties.name || "command").toLowerCase().replace(/\s+/g, "-");
  }

  private getEventType(block: Block): string {
    const type = block.type.replace("event_", "");
    const mappings: Record<string, string> = {
      "member_join": "guildMemberAdd",
      "member_leave": "guildMemberRemove",
      "message": "messageCreate",
      "ready": "ready",
    };
    return mappings[type] || type;
  }

  // Use event type to create a safe filename for event files
  private getEventName(block: Block): string {
    const type = this.getEventType(block)
    return String(type).toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-_]/gi, '')
  }

  private toPascalCase(str: string): string {
    return str.replace(/(^\w|-\w)/g, match => match.replace("-", "").toUpperCase());
  }

  private escapeString(str: string): string {
    return str.replace(/'/g, "\\'").replace(/"/g, '\\"');
  }
}

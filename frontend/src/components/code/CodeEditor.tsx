import { Editor } from '@monaco-editor/react'
import { useEditorStore } from '@/store/editorStore'
import { useRef, useEffect } from 'react'

interface CodeEditorProps {
  initialValue?: string
  readOnly?: boolean
}

export function CodeEditor({ initialValue = '', readOnly = false }: CodeEditorProps) {
  // In a real app, this would use a generator to build code from blocks
  // For now, we'll use a mocked generator result or the initial value
  const code = `const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.on('ready', () => {
  console.log(\`Logged in as \${client.user.tag}!\`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong!');
  }
});

client.login(process.env.DISCORD_TOKEN);`

  return (
    <div className="h-full w-full bg-[#1e1e1e] border-l border-slate-800">
      <Editor
        height="100%"
        defaultLanguage="javascript"
        defaultValue={code}
        theme="vs-dark"
        options={{
          minimap: { enabled: true },
          fontSize: 14,
          fontFamily: "'Fira Code', monospace",
          readOnly: readOnly,
          scrollBeyondLastLine: false,
          padding: { top: 20, bottom: 20 },
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
        }}
      />
    </div>
  )
}

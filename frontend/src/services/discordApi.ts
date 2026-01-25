export interface DiscordGuild {
  id: string
  name: string
  icon: string | null
  owner: boolean
  permissions: string
}

export interface DiscordChannel {
  id: string
  name: string
  type: number
}

class DiscordApiService {
  private token: string | null = null

  setToken(token: string) {
    this.token = token
  }

  async validateToken(token: string): Promise<boolean> {
    // In a real app: fetch('https://discord.com/api/v10/users/@me', { headers: { Authorization: `Bot ${token}` } })
    return new Promise(resolve => {
      setTimeout(() => resolve(token.startsWith('MTA')), 800)
    })
  }

  async getGuilds(): Promise<DiscordGuild[]> {
    if (!this.token) return []
    // Mock guilds
    return [
      { id: '1', name: 'Developer Hub', icon: null, owner: true, permissions: '8' },
      { id: '2', name: 'Botify Official', icon: null, owner: false, permissions: '0' },
    ]
  }

  async getChannels(guildId: string): Promise<DiscordChannel[]> {
    console.log('Fetching channels for', guildId)
    return [
      { id: '101', name: 'general', type: 0 },
      { id: '102', name: 'announcements', type: 0 },
      { id: '103', name: 'voice-chat', type: 2 },
    ]
  }
}

export const discordApi = new DiscordApiService()

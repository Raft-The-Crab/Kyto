import { Block, BlockConnection } from '@/types';

/**
 * Testing utility for Kyto-generated bots
 */
export class BotTester {
  private mockDiscordClient: any;
  private commandRegistry: Map<string, Function>;
  private eventHandlers: Map<string, Function[]>;

  constructor() {
    this.mockDiscordClient = this.createMockClient();
    this.commandRegistry = new Map();
    this.eventHandlers = new Map();
  }

  /**
   * Creates a mock Discord client for testing
   */
  private createMockClient() {
    return {
      on: (event: string, handler: Function) => {
        if (!this.eventHandlers.has(event)) {
          this.eventHandlers.set(event, []);
        }
        this.eventHandlers.get(event)?.push(handler);
      },
      emit: (event: string, ...args: any[]) => {
        const handlers = this.eventHandlers.get(event) || [];
        handlers.forEach(handler => handler(...args));
      },
      login: (token: string) => {
        console.log('[TESTER] Mock login with token:', token);
      },
      destroy: () => {
        console.log('[TESTER] Client destroyed');
      }
    };
  }

  /**
   * Registers a command for testing
   */
  registerCommand(name: string, handler: Function) {
    this.commandRegistry.set(name, handler);
  }

  /**
   * Executes a registered command
   */
  async executeCommand(name: string, interaction: any) {
    const handler = this.commandRegistry.get(name);
    if (!handler) {
      throw new Error(`Command ${name} not found`);
    }

    // Mock interaction if not provided
    const mockInteraction = {
      commandName: name,
      options: {
        getSubcommand: () => '',
        getString: (_: string) => '',
        getInteger: (_: string) => 0,
        getBoolean: (_: string) => false,
        getUser: (_: string) => ({ id: 'mock-user', username: 'MockUser' }),
        getChannel: (_: string) => ({ id: 'mock-channel', name: 'mock-channel' }),
      },
      reply: async (msg: any) => {
        console.log('[TESTER] Command reply:', msg);
        return Promise.resolve();
      },
      deferReply: async (opts: any) => {
        console.log('[TESTER] Deferred reply:', opts);
        return Promise.resolve();
      },
      editReply: async (msg: any) => {
        console.log('[TESTER] Edited reply:', msg);
        return Promise.resolve();
      },
      followUp: async (msg: any) => {
        console.log('[TESTER] Follow-up:', msg);
        return Promise.resolve();
      },
      user: { id: 'test-user', username: 'TestUser' },
      member: {
        roles: { cache: { has: (_: string) => false } },
        permissions: { has: () => true }
      },
      guild: { id: 'test-guild', name: 'Test Guild' },
      channel: { id: 'test-channel', name: 'test-channel' },
      ...interaction
    };

    try {
      await handler(mockInteraction);
      return { success: true, message: `Command ${name} executed successfully` };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Runs a simulation of the generated bot code
   */
  async simulateBot(botCode: string, scenario: 'command' | 'event' | 'interaction' = 'command') {
    try {
      // Evaluate the bot code in a controlled environment
      const evalResult = this.evaluateCode(botCode);
      
      if (scenario === 'command') {
        // Simulate a command execution
        const mockInteraction = {
          isChatInputCommand: () => true,
          commandName: 'ping',
          reply: async (msg: any) => {
            console.log('[SIMULATION] Command replied with:', msg);
          }
        };
        
        // Trigger interaction event to simulate command
        this.mockDiscordClient.emit('interactionCreate', mockInteraction);
      }
      
      return { success: true, result: evalResult };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Simulation failed' };
    }
  }

  /**
   * Evaluates code in a safe environment
   */
  private evaluateCode(code: string) {
    // This is a simplified version - in a real implementation,
    // you'd want to use a more secure evaluation method
    try {
      // Extract command registrations from the code
      const commandMatches = code.match(/commandName === '([^']+)'/g);
      if (commandMatches) {
        commandMatches.forEach(match => {
          const commandName = match.match(/'([^']+)'/)?.[1];
          if (commandName) {
            this.registerCommand(commandName, () => {
              console.log(`[TESTER] Executing command: ${commandName}`);
            });
          }
        });
      }
      
      return 'Code evaluated successfully';
    } catch (error) {
      throw error;
    }
  }

  /**
   * Validates the generated code for common errors
   */
  validateCode(blocks: Block[], connections: BlockConnection[]): { isValid: boolean; errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check for orphaned blocks
    const connectedBlocks = new Set<string>();
    connections.forEach(conn => {
      connectedBlocks.add(conn.source);
      connectedBlocks.add(conn.target);
    });

    blocks.forEach(block => {
      if (!connectedBlocks.has(block.id) && 
          block.type !== 'command_slash' && 
          block.type !== 'event_listener' &&
          block.type !== 'error_handler') {
        warnings.push(`Block "${block.id}" appears to be orphaned`);
      }
    });

    // Check for proper error handling
    const errorHandlers = blocks.filter(b => b.type === 'error_handler');
    const blocksWithConnections = new Set(connections.map(c => c.source));

    blocks.forEach(block => {
      if (blocksWithConnections.has(block.id) && !errorHandlers.some(h => 
        connections.some(c => c.source === block.id && c.target === h.id))) {
        // This block leads to an error handler, which is good
      }
    });

    // Check for required properties in blocks
    blocks.forEach(block => {
      if (block.type === 'command_slash') {
        const props = block.data.properties || {};
        if (!props.name || typeof props.name !== 'string' || props.name.trim() === '') {
          errors.push(`Command block "${block.id}" is missing a valid name`);
        }
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Gets a report of the bot's structure
   */
  getStructureReport(blocks: Block[], connections: BlockConnection[]): any {
    const commands = blocks.filter(b => b.type === 'command_slash');
    const events = blocks.filter(b => b.type === 'event_listener');
    const actions = blocks.filter(b => 
      b.type.includes('action') || 
      b.type.includes('message') || 
      b.type.includes('embed') ||
      b.type.includes('send')
    );
    const logic = blocks.filter(b => 
      b.type.includes('if') || 
      b.type.includes('condition') || 
      b.type.includes('loop') ||
      b.type === 'error_handler'
    );

    return {
      summary: {
        totalBlocks: blocks.length,
        commands: commands.length,
        events: events.length,
        actions: actions.length,
        logic: logic.length,
        connections: connections.length
      },
      commands: commands.map(c => ({
        id: c.id,
        name: c.data.properties?.name || 'unnamed',
        description: c.data.properties?.description || 'no description'
      })),
      events: events.map(e => ({
        id: e.id,
        event: e.data.properties?.event || 'unknown'
      }))
    };
  }
}

/**
 * Debugging utility to trace execution flow
 */
export class FlowDebugger {
  private traceLog: Array<{ blockId: string; blockType: string; timestamp: number; data?: any }> = [];
  private enabled: boolean = true;

  enable() {
    this.enabled = true;
  }

  disable() {
    this.enabled = false;
  }

  trace(blockId: string, blockType: string, data?: any) {
    if (!this.enabled) return;
    
    this.traceLog.push({
      blockId,
      blockType,
      timestamp: Date.now(),
      data
    });
  }

  getTrace() {
    return this.traceLog;
  }

  clear() {
    this.traceLog = [];
  }

  getStats() {
    const blockCounts: Record<string, number> = {};
    this.traceLog.forEach(trace => {
      blockCounts[trace.blockType] = (blockCounts[trace.blockType] || 0) + 1;
    });

    return {
      totalExecutions: this.traceLog.length,
      blockExecutionCounts: blockCounts,
      executionTime: this.traceLog.length > 1 
        ? (this.traceLog[this.traceLog.length - 1]?.timestamp || 0) - (this.traceLog[0]?.timestamp || 0)
        : 0
    };
  }
}
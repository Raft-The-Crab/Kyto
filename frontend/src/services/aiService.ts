import { pipeline, env } from '@xenova/transformers';

// Configure transformers.js to cache models in browser
env.allowLocalModels = false;
env.useBrowserCache = true;

export type AIModelStatus = 'unloaded' | 'downloading' | 'loading' | 'ready' | 'error';

export interface ModelProgress {
  loaded: number;
  total: number;
  status: AIModelStatus;
  message: string;
}

class AIService {
  private model: unknown = null;
  private modelStatus: AIModelStatus = 'unloaded';
  private progressCallback: ((progress: ModelProgress) => void) | null = null;

  /**
   * Set callback for model loading progress
   */
  onProgress(callback: (progress: ModelProgress) => void) {
    this.progressCallback = callback;
  }

  /**
   * Load the AI model (Qwen 0.5B)
   */
  async loadModel(): Promise<boolean> {
    if (this.model) return true;
    
    try {
      this.modelStatus = 'downloading';
      this.notifyProgress(0, 100, 'Downloading AI model (~500MB)...');

      // Use Qwen2.5-0.5B-Instruct - small enough for browsers
      this.model = await pipeline(
        'text-generation',
        'Xenova/Qwen2.5-0.5B-Instruct',
        {
          progress_callback: (progress: { status: string; loaded?: number; total?: number }) => {
            if (progress.status === 'downloading') {
              const loaded = progress.loaded || 0;
              const total = progress.total || 1;
              this.notifyProgress(loaded, total, 'Downloading AI model...');
            } else if (progress.status === 'loading') {
              this.modelStatus = 'loading';
              this.notifyProgress(90, 100, 'Loading model into memory...');
            }
          },
        }
      );

      this.modelStatus = 'ready';
      this.notifyProgress(100, 100, 'AI model ready!');
      return true;
    } catch (error) {
      console.error('[AI Service] Failed to load model:', error);
      this.modelStatus = 'error';
      this.notifyProgress(0, 100, 'Failed to load AI model');
      return false;
    }
  }

  /**
   * Check if model is ready to use
   */
  isReady(): boolean {
    return this.modelStatus === 'ready' && this.model !== null;
  }

  /**
   * Get current model status
   */
  getStatus(): AIModelStatus {
    return this.modelStatus;
  }

  /**
   * Generate Discord bot command suggestions from natural language
   */
  async generateCommand(prompt: string): Promise<string> {
    if (!this.isReady()) {
      throw new Error('AI model not loaded. Call loadModel() first.');
    }

    try {
      const systemPrompt = `You are a Discord bot code generator. Generate JSON for Discord bot blocks based on user requests. Output only valid JSON.`;
      
      const fullPrompt = `${systemPrompt}\n\nUser: ${prompt}\n\nGenerate:`;

      const result = await (this.model as any)(fullPrompt, {
        max_new_tokens: 256,
        temperature: 0.7,
        top_p: 0.9,
        do_sample: true,
      });

      return (result as any)[0].generated_text.replace(fullPrompt, '').trim();
    } catch (error) {
      console.error('[AI Service] Generation failed:', error);
      throw error;
    }
  }

  /**
   * Analyze user intent for command suggestion
   */
  async analyzeIntent(message: string): Promise<{
    intent: string;
    confidence: number;
    suggestions: string[];
  }> {
    if (!this.isReady()) {
      // Fallback to rule-based
      return this.ruleBasedIntent(message);
    }

    try {
      const prompt = `Analyze this Discord bot request and identify the intent: "${message}"\n\nIntent:`;
      const result = await (this.model as any)(prompt, {
        max_new_tokens: 50,
        temperature: 0.3,
      });

      const intent = (result as any)[0].generated_text.replace(prompt, '').trim().toLowerCase();
      
      return {
        intent,
        confidence: 0.85,
        suggestions: this.getIntentSuggestions(intent),
      };
    } catch (error) {
      console.error('[AI Service] Intent analysis failed:', error);
      return this.ruleBasedIntent(message);
    }
  }

  /**
   * Unload model to free memory
   */
  async unloadModel(): Promise<void> {
    this.model = null;
    this.modelStatus = 'unloaded';
  }

  // ==================== PRIVATE METHODS ====================

  private notifyProgress(loaded: number, total: number, message: string) {
    if (this.progressCallback) {
      this.progressCallback({
        loaded,
        total,
        status: this.modelStatus,
        message,
      });
    }
  }

  private ruleBasedIntent(message: string): {
    intent: string;
    confidence: number;
    suggestions: string[];
  } {
    const msg = message.toLowerCase();
    
    const patterns: Record<string, string[]> = {
      moderation: ['kick', 'ban', 'timeout', 'mute', 'warn', 'moderate'],
      welcome: ['welcome', 'greet', 'join', 'member'],
      utility: ['ping', 'info', 'help', 'stats', 'status'],
      fun: ['meme', 'joke', 'game', 'random', 'roll'],
      music: ['play', 'music', 'song', 'skip', 'queue'],
      economy: ['balance', 'money', 'shop', 'buy', 'sell'],
      ticket: ['ticket', 'support', 'help'],
    };

    for (const [intent, keywords] of Object.entries(patterns)) {
      if (keywords.some(k => msg.includes(k))) {
        return {
          intent,
          confidence: 0.9,
          suggestions: this.getIntentSuggestions(intent),
        };
      }
    }

    return {
      intent: 'unknown',
      confidence: 0.3,
      suggestions: ['Try: "create a ping command" or "make a welcome message"'],
    };
  }

  private getIntentSuggestions(intent: string): string[] {
    const suggestions: Record<string, string[]> = {
      moderation: ['Kick Command', 'Ban Command', 'Timeout Command', 'Auto-Moderation'],
      welcome: ['Welcome Message', 'Auto Role', 'Goodbye Message'],
      utility: ['Ping Command', 'Server Info', 'User Info', 'Help Command'],
      fun: ['8Ball Command', 'Meme Command', 'Random Number'],
      music: ['Play Command', 'Queue System', 'Skip Command'],
      economy: ['Balance Command', 'Shop System', 'Daily Rewards'],
      ticket: ['Ticket System', 'Support Panel', 'Close Ticket'],
    };

    return suggestions[intent] || ['Create new command'];
  }
}

export const aiService = new AIService();

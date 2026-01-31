import { useState, useRef, useEffect } from 'react';
import { useProjectStore } from '@/store/projectStore';
import { AIService, AIRequest, AIResponse, isAIResponse } from '../../../backend/src/services/ai-service';

interface AIChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  suggestions?: string[];
}

interface AIChatProps {
  userId: string;
  sessionId: string;
}

export const AIChat = ({ userId, sessionId }: AIChatProps) => {
  const [messages, setMessages] = useState<AIChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const activeProject = useProjectStore(state => ({
    name: state.name,
    description: state.description,
    language: state.language,
    commands: state.commands,
    events: state.events
  }));

  // Scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    try {
      setIsLoading(true);
      setError(null);

      // Add user message to chat
      const userMessage: AIChatMessage = {
        id: `msg-${Date.now()}`,
        content: inputValue,
        role: 'user',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, userMessage]);
      const newInputValue = inputValue;
      setInputValue('');

      // Prepare context about the current project
      const context = {
        projectName: activeProject.name,
        projectDescription: activeProject.description,
        projectLanguage: activeProject.language,
        commandCount: activeProject.commands.length,
        eventCount: activeProject.events.length,
        commands: activeProject.commands.map(cmd => ({ name: cmd.name, description: cmd.description })),
        events: activeProject.events.map(evt => ({ name: evt.eventType, description: evt.description }))
      };

      // Create AI request
      const aiRequest: AIRequest = {
        userId,
        sessionId,
        input: newInputValue,
        context,
        model: 'local-default', // Use local model by default
        temperature: 0.7
      };

      // In a real implementation, this would call the backend AI service
      // For now, we'll simulate the response
      const response = await simulateAIResponse(aiRequest);

      if (isAIResponse(response)) {
        const assistantMessage: AIChatMessage = {
          id: `msg-${Date.now() + 1}`,
          content: response.output,
          role: 'assistant',
          timestamp: new Date(),
          suggestions: response.suggestions
        };

        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error('Invalid AI response format');
      }
    } catch (err) {
      console.error('AI Chat error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate AI response (in real implementation, this would call the backend)
  const simulateAIResponse = async (request: AIRequest): Promise<AIResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate a response based on the input
    let responseText = '';
    if (request.input.toLowerCase().includes('hello') || request.input.toLowerCase().includes('hi')) {
      responseText = `Hello! I'm your Kyto AI assistant. I can help you with your project "${request.context?.projectName}". How can I assist you today?`;
    } else if (request.input.toLowerCase().includes('command')) {
      responseText = `I see you're interested in commands. Your project currently has ${request.context?.commandCount} command(s). You can create new commands using the command builder. Would you like help with a specific command?`;
    } else if (request.input.toLowerCase().includes('error')) {
      responseText = `For error handling, make sure to connect error handler blocks to your command logic. This will catch exceptions and allow you to send user-friendly error messages. Would you like to see an example?`;
    } else {
      responseText = `I understand you're asking about "${request.input.substring(0, 30)}...". Based on your project "${request.context?.projectName}", I can help guide you. What specific aspect would you like to know more about?`;
    }

    return {
      output: responseText,
      confidence: 0.9,
      suggestions: [
        'Show me how to create a command',
        'How do I handle errors?',
        'What events can I listen to?'
      ],
      metadata: {
        model: request.model || 'local-default',
        tokensUsed: 50,
        processingTime: 100
      }
    };
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setTimeout(() => {
      handleSendMessage(); // Trigger send after setting the value
    }, 0);
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-indigo-600 text-white p-4">
        <h3 className="font-semibold">Kyto AI Assistant</h3>
        <p className="text-sm opacity-80">Ask me anything about your Discord bot project!</p>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
        {messages.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>Hello! I'm your Kyto AI assistant.</p>
            <p className="mt-2">Ask me about your Discord bot project:</p>
            <div className="mt-4 grid grid-cols-1 gap-2 max-w-md mx-auto">
              {[
                'How do I create a command?',
                'Show me error handling examples',
                'What can I do with events?',
                'How to deploy my bot?'
              ].map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="text-left text-sm bg-white dark:bg-gray-800 p-2 rounded border hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-indigo-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                }`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-300 dark:border-gray-600">
                    <p className="text-xs opacity-75 mb-1">Suggestions:</p>
                    <div className="flex flex-wrap gap-1">
                      {message.suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="text-xs bg-white dark:bg-gray-600 bg-opacity-20 hover:bg-opacity-30 px-2 py-1 rounded transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg p-3 max-w-[80%]">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        {error && (
          <div className="mb-2 text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded">
            {error}
          </div>
        )}
        <div className="flex gap-2">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask me about your Discord bot..."
            className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg p-2 min-h-[60px] max-h-[120px] resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};
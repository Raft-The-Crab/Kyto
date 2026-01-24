import { BlockDefinition, BlockType, BlockCategory } from '@/types'

export const BLOCK_DEFINITIONS: Record<BlockType, BlockDefinition> = {
  send_message: {
    type: 'send_message',
    label: 'Send or Edit a Message',
    description: 'Send or edit a message with additional buttons and select menus',
    category: 'actions',
    icon: 'MessageSquare',
    color: '#3b82f6',
    inputs: 1,
    outputs: 1,
    properties: [
      {
        key: 'targetMessage',
        label: 'Target Message',
        type: 'select',
        required: true,
        options: [
          { label: 'Select a message', value: '' },
          { label: 'Send a new message', value: 'new' },
          { label: 'Edit original message', value: 'original' },
        ],
        helperText: 'Select the message action containing the components you want to edit',
      },
      {
        key: 'content',
        label: 'Message Content',
        type: 'textarea',
        required: false,
        placeholder: 'Enter message content...',
      },
      {
        key: 'ephemeral',
        label: 'Ephemeral (Only visible to user)',
        type: 'boolean',
        required: false,
        defaultValue: false,
      },
    ],
  },

  edit_message: {
    type: 'edit_message',
    label: 'Edit Message',
    description: 'Edit an existing message',
    category: 'actions',
    icon: 'Edit',
    color: '#3b82f6',
    inputs: 1,
    outputs: 1,
    properties: [
      {
        key: 'messageId',
        label: 'Message ID',
        type: 'text',
        required: true,
        placeholder: 'Enter message ID or variable',
      },
      {
        key: 'content',
        label: 'New Content',
        type: 'textarea',
        required: false,
        placeholder: 'Enter new message content...',
      },
    ],
  },

  send_embed: {
    type: 'send_embed',
    label: 'Embed Block',
    description: 'Send rich embed messages',
    category: 'actions',
    icon: 'FileText',
    color: '#06b6d4',
    inputs: 1,
    outputs: 1,
    properties: [
      {
        key: 'title',
        label: 'Embed Title',
        type: 'text',
        required: false,
        placeholder: 'Enter embed title...',
      },
      {
        key: 'description',
        label: 'Embed Description',
        type: 'textarea',
        required: false,
        placeholder: 'Enter embed description...',
      },
      {
        key: 'color',
        label: 'Embed Color',
        type: 'color',
        required: false,
        defaultValue: '#3b82f6',
      },
      {
        key: 'footer',
        label: 'Footer Text',
        type: 'text',
        required: false,
        placeholder: 'Enter footer text...',
      },
    ],
  },

  add_button: {
    type: 'add_button',
    label: 'Add Button',
    description: 'Add an interactive button to a message',
    category: 'actions',
    icon: 'Square',
    color: '#8b5cf6',
    inputs: 1,
    outputs: 1,
    properties: [
      {
        key: 'label',
        label: 'Button Label',
        type: 'text',
        required: true,
        placeholder: 'Enter button text...',
      },
      {
        key: 'style',
        label: 'Button Style',
        type: 'select',
        required: true,
        defaultValue: 'primary',
        options: [
          { label: 'Primary (Blue)', value: 'primary' },
          { label: 'Secondary (Gray)', value: 'secondary' },
          { label: 'Success (Green)', value: 'success' },
          { label: 'Danger (Red)', value: 'danger' },
          { label: 'Link', value: 'link' },
        ],
      },
      {
        key: 'customId',
        label: 'Custom ID',
        type: 'text',
        required: true,
        placeholder: 'button_id',
        helperText: 'Unique identifier for this button',
      },
    ],
  },

  add_select_menu: {
    type: 'add_select_menu',
    label: 'Add Select Menu',
    description: 'Add a dropdown select menu',
    category: 'actions',
    icon: 'List',
    color: '#8b5cf6',
    inputs: 1,
    outputs: 1,
    properties: [
      {
        key: 'placeholder',
        label: 'Placeholder',
        type: 'text',
        required: true,
        placeholder: 'Select an option...',
      },
      {
        key: 'customId',
        label: 'Custom ID',
        type: 'text',
        required: true,
        placeholder: 'select_id',
      },
    ],
  },

  edit_component: {
    type: 'edit_component',
    label: 'Edit a Button or Select Menu',
    description: 'Edit a button or select menu in a message',
    category: 'actions',
    icon: 'Edit',
    color: '#3b82f6',
    inputs: 1,
    outputs: 1,
    properties: [
      {
        key: 'targetMessage',
        label: 'Target Message',
        type: 'select',
        required: true,
        options: [{ label: 'Select a message', value: '' }],
        helperText:
          'Tip: You can add aliases to your Advanced Messages to make them easier to identify here.',
      },
      {
        key: 'componentId',
        label: 'Component ID',
        type: 'text',
        required: true,
        placeholder: 'Enter component custom ID...',
      },
    ],
  },

  delete_message: {
    type: 'delete_message',
    label: 'Delete Message',
    description: 'Delete a message',
    category: 'actions',
    icon: 'Trash2',
    color: '#ef4444',
    inputs: 1,
    outputs: 1,
    properties: [
      {
        key: 'messageId',
        label: 'Message ID',
        type: 'text',
        required: true,
        placeholder: 'Enter message ID or variable',
      },
    ],
  },

  if_condition: {
    type: 'if_condition',
    label: 'If Condition',
    description: 'Execute blocks based on a condition',
    category: 'conditions',
    icon: 'GitBranch',
    color: '#f59e0b',
    inputs: 1,
    outputs: 2,
    properties: [
      {
        key: 'variableA',
        label: 'Variable A',
        type: 'text',
        required: true,
        placeholder: 'Enter variable or value...',
      },
      {
        key: 'operator',
        label: 'Operator',
        type: 'select',
        required: true,
        defaultValue: 'equals',
        options: [
          { label: 'Equals', value: 'equals' },
          { label: 'Not Equals', value: 'not_equals' },
          { label: 'Greater Than', value: 'greater' },
          { label: 'Less Than', value: 'less' },
          { label: 'Contains', value: 'contains' },
        ],
      },
      {
        key: 'variableB',
        label: 'Variable B',
        type: 'text',
        required: true,
        placeholder: 'Enter variable or value...',
      },
    ],
  },

  wait: {
    type: 'wait',
    label: 'Wait',
    description: 'Pause execution for a duration',
    category: 'advanced',
    icon: 'Clock',
    color: '#64748b',
    inputs: 1,
    outputs: 1,
    properties: [
      {
        key: 'duration',
        label: 'Duration (seconds)',
        type: 'number',
        required: true,
        defaultValue: 1,
        placeholder: '1',
      },
    ],
  },

  set_variable: {
    type: 'set_variable',
    label: 'Set Variable',
    description: 'Set a variable value',
    category: 'variables',
    icon: 'Variable',
    color: '#10b981',
    inputs: 1,
    outputs: 1,
    properties: [
      {
        key: 'variableName',
        label: 'Variable Name',
        type: 'text',
        required: true,
        placeholder: 'myVariable',
      },
      {
        key: 'value',
        label: 'Value',
        type: 'text',
        required: true,
        placeholder: 'Enter value...',
      },
    ],
  },

  error_handler: {
    type: 'error_handler',
    label: 'Error Handler',
    description: 'Handle errors in command execution',
    category: 'advanced',
    icon: 'AlertTriangle',
    color: '#f97316',
    inputs: 1,
    outputs: 1,
    properties: [
      {
        key: 'errorMessage',
        label: 'Error Message',
        type: 'textarea',
        required: false,
        placeholder: 'An error occurred...',
      },
      {
        key: 'logError',
        label: 'Log Error to Console',
        type: 'boolean',
        required: false,
        defaultValue: true,
      },
    ],
  },
}

export const BLOCK_CATEGORIES: Record<
  BlockCategory,
  { label: string; description: string }
> = {
  actions: {
    label: 'Actions',
    description: 'Send messages, edit content, and perform actions',
  },
  conditions: {
    label: 'Conditions',
    description: 'Control flow with conditional logic',
  },
  variables: {
    label: 'Variables',
    description: 'Store and manipulate data',
  },
  replies: {
    label: 'Replies',
    description: 'Simple reply actions',
  },
  advanced: {
    label: 'Advanced',
    description: 'Advanced functionality and error handling',
  },
}

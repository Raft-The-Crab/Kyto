# Kyto Block Documentation

This document provides comprehensive information about all available blocks in the Kyto visual Discord bot builder.

## Table of Contents

1. [Triggers](#triggers)
2. [Events](#events)
3. [Actions](#actions)
4. [Messages](#messages)
5. [Embeds](#embeds)
6. [Components](#components)
7. [Moderation](#moderation)
8. [Roles](#roles)
9. [Channels](#channels)
10. [Voice](#voice)
11. [Logic](#logic)
12. [Variables](#variables)
13. [Data & API](#data--api)
14. [API](#api)
15. [Database](#database)
16. [Utilities](#utilities)
17. [Debugging](#debugging)
18. [Advanced](#advanced)

## Triggers

### Slash Command

- **Type**: `command_slash`
- **Category**: Triggers
- **Description**: Triggers when a user runs a slash command
- **Inputs**: 0
- **Outputs**: 1
- **Properties**:
  - `name`: Command name (required, lowercase, no spaces)
  - `description`: Command description shown in Discord
  - `options`: Parameters for the command
  - `permissions`: Required permissions to use the command
  - `dmPermission`: Whether command can be used in DMs
  - `nsfw`: Whether command is restricted to NSFW channels
  - `cooldown`: Time between uses per user

### Subcommand

- **Type**: `command_subcommand`
- **Category**: Triggers
- **Description**: A subcommand within a slash command
- **Inputs**: 1
- **Outputs**: 1
- **Properties**:
  - `name`: Subcommand name
  - `description`: Subcommand description
  - `options`: Parameters for the subcommand

### Subcommand Group

- **Type**: `command_subcommand_group`
- **Category**: Triggers
- **Description**: A group of related subcommands
- **Inputs**: 1
- **Outputs**: 1
- **Properties**:
  - `name`: Group name
  - `description`: Group description

### User Context Menu

- **Type**: `context_menu_user`
- **Category**: Triggers
- **Description**: Triggered when right-clicking a user
- **Inputs**: 0
- **Outputs**: 1
- **Properties**:
  - `name`: Menu name
  - `permissions`: Required permissions

### Message Context Menu

- **Type**: `context_menu_message`
- **Category**: Triggers
- **Description**: Triggered when right-clicking a message
- **Inputs**: 0
- **Outputs**: 1
- **Properties**:
  - `name`: Menu name
  - `permissions`: Required permissions

### Event Listener

- **Type**: `event_listener`
- **Category**: Triggers
- **Description**: Listen for specific Discord events
- **Inputs**: 0
- **Outputs**: 1
- **Properties**:
  - `event`: Type of event to listen for (e.g., messageCreate, guildMemberAdd, etc.)

## Events

### Bot Ready

- **Type**: `event_ready`
- **Category**: Events
- **Description**: Triggered when the bot becomes ready
- **Inputs**: 0
- **Outputs**: 1

### Message Created

- **Type**: `event_message_create`
- **Category**: Events
- **Description**: Triggered when a message is created
- **Inputs**: 0
- **Outputs**: 1

### Member Joined

- **Type**: `event_member_join`
- **Category**: Events
- **Description**: Triggered when a member joins a server
- **Inputs**: 0
- **Outputs**: 1

### Member Left

- **Type**: `event_member_leave`
- **Category**: Events
- **Description**: Triggered when a member leaves a server
- **Inputs**: 0
- **Outputs**: 1

### Message Updated

- **Type**: `event_message_update`
- **Category**: Events
- **Description**: Triggered when a message is updated
- **Inputs**: 0
- **Outputs**: 1

### Message Deleted

- **Type**: `event_message_delete`
- **Category**: Events
- **Description**: Triggered when a message is deleted
- **Inputs**: 0
- **Outputs**: 1

## Actions

### Send Message

- **Type**: `action_reply`
- **Category**: Actions
- **Description**: Send a message to the current channel
- **Inputs**: 1
- **Outputs**: 1
- **Properties**:
  - `content`: Message content
  - `ephemeral`: Whether the message should be ephemeral (only visible to the user who triggered the command)
  - `tts`: Whether the message should be sent as text-to-speech

### Send DM

- **Type**: `send_dm`
- **Category**: Actions
- **Description**: Send a direct message to a user
- **Inputs**: 1
- **Outputs**: 1
- **Properties**:
  - `userId`: User ID to send the DM to
  - `content`: Message content

### Defer Reply

- **Type**: `action_defer`
- **Category**: Actions
- **Description**: Tell Discord you'll reply later
- **Inputs**: 1
- **Outputs**: 1
- **Properties**:
  - `ephemeral`: Whether the defer should be ephemeral

### Edit Reply

- **Type**: `action_edit`
- **Category**: Actions
- **Description**: Edit the original reply
- **Inputs**: 1
- **Outputs**: 1
- **Properties**:
  - `content`: New message content

### Follow Up

- **Type**: `action_follow_up`
- **Category**: Actions
- **Description**: Send a follow-up message
- **Inputs**: 1
- **Outputs**: 1
- **Properties**:
  - `content`: Message content
  - `ephemeral`: Whether the message should be ephemeral

### Error Handler

- **Type**: `error_handler`
- **Category**: Actions
- **Description**: Catches and handles errors from previous blocks
- **Inputs**: 1
- **Outputs**: 1
- **Properties**:
  - `logToConsole`: Whether to log the error to console

## Messages

### Send Embed

- **Type**: `send_embed`
- **Category**: Embeds
- **Description**: Send a rich embed message
- **Inputs**: 1
- **Outputs**: 1
- **Properties**:
  - `channelId`: Channel to send the embed to
  - `title`: Embed title
  - `description`: Embed description
  - `color`: Hex color code for the embed
  - `url`: URL for the embed
  - `timestamp`: Whether to include a timestamp
  - `imageUrl`: URL for an image to include in the embed
  - `thumbnailUrl`: URL for a thumbnail to include in the embed
  - `footer`: Footer text for the embed
  - `author`: Author name for the embed

### Edit Message

- **Type**: `edit_message`
- **Category**: Messages
- **Description**: Edit an existing message
- **Inputs**: 1
- **Outputs**: 1
- **Properties**:
  - `channelId`: Channel containing the message
  - `messageId`: ID of the message to edit
  - `content`: New message content

### Delete Message

- **Type**: `delete_message`
- **Category**: Messages
- **Description**: Delete a message from a channel
- **Inputs**: 1
- **Outputs**: 1
- **Properties**:
  - `channelId`: Channel containing the message
  - `messageId`: ID of the message to delete

### Add Reaction

- **Type**: `add_reaction`
- **Category**: Messages
- **Description**: Add a reaction to a message
- **Inputs**: 1
- **Outputs**: 1
- **Properties**:
  - `channelId`: Channel containing the message
  - `messageId`: ID of the message to react to
  - `emoji`: Emoji to add as a reaction

## Components

### Send Message with Buttons

- **Type**: `send_message_buttons`
- **Category**: Components
- **Description**: Send a message with interactive buttons
- **Inputs**: 1
- **Outputs**: 1
- **Properties**:
  - `content`: Message content
  - `buttons`: Array of button configurations

### Send Message with Select Menu

- **Type**: `send_message_select`
- **Category**: Components
- **Description**: Send a message with a select menu
- **Inputs**: 1
- **Outputs**: 1
- **Properties**:
  - `content`: Message content
  - `selectMenu`: Select menu configuration

### Modal

- **Type**: `modal_show`
- **Category**: Components
- **Description**: Show a modal dialog to the user
- **Inputs**: 1
- **Outputs**: 1
- **Properties**:
  - `title`: Modal title
  - `inputs`: Array of text inputs for the modal

## Moderation

### Kick Member

- **Type**: `action_kick`
- **Category**: Moderation
- **Description**: Kick a member from the server
- **Inputs**: 1
- **Outputs**: 1
- **Properties**:
  - `userId`: ID of the user to kick
  - `reason`: Reason for the kick

### Ban Member

- **Type**: `action_ban`
- **Category**: Moderation
- **Description**: Ban a member from the server
- **Inputs**: 1
- **Outputs**: 1
- **Properties**:
  - `userId`: ID of the user to ban
  - `reason`: Reason for the ban

### Timeout Member

- **Type**: `member_timeout`
- **Category**: Moderation
- **Description**: Timeout a member temporarily
- **Inputs**: 1
- **Outputs**: 1
- **Properties**:
  - `userId`: ID of the user to timeout
  - `minutes`: Duration of the timeout in minutes
  - `reason`: Reason for the timeout

### Purge Messages

- **Type**: `action_purge`
- **Category**: Moderation
- **Description**: Delete multiple messages at once
- **Inputs**: 1
- **Outputs**: 1
- **Properties**:
  - `channelId`: Channel to purge messages from
  - `limit`: Number of messages to delete (max 99)
  - `filter`: Criteria for which messages to delete

## Roles

### Add Role

- **Type**: `role_add`
- **Category**: Roles
- **Description**: Add a role to a user
- **Inputs**: 1
- **Outputs**: 1
- **Properties**:
  - `userId`: ID of the user to add the role to
  - `roleId`: ID of the role to add

### Remove Role

- **Type**: `role_remove`
- **Category**: Roles
- **Description**: Remove a role from a user
- **Inputs**: 1
- **Outputs**: 1
- **Properties**:
  - `userId`: ID of the user to remove the role from
  - `roleId`: ID of the role to remove

### Create Role

- **Type**: `role_create`
- **Category**: Roles
- **Description**: Create a new role in the server
- **Inputs**: 1
- **Outputs**: 1
- **Properties**:
  - `name`: Name of the new role
  - `color`: Hex color for the role
  - `permissions`: Permissions for the role
  - `hoist`: Whether the role should be displayed separately
  - `mentionable`: Whether the role can be mentioned

## Channels

### Create Channel

- **Type**: `channel_create`
- **Category**: Channels
- **Description**: Create a new channel in the server
- **Inputs**: 1
- **Outputs**: 1
- **Properties**:
  - `name`: Name of the new channel
  - `type`: Type of channel (text, voice, category, etc.)
  - `topic`: Topic for the channel (text channels only)
  - `bitrate`: Bitrate for voice channels
  - `userLimit`: User limit for voice channels

### Delete Channel

- **Type**: `channel_delete`
- **Category**: Channels
- **Description**: Delete a channel from the server
- **Inputs**: 1
- **Outputs**: 1
- **Properties**:
  - `channelId`: ID of the channel to delete

### Edit Channel

- **Type**: `channel_edit`
- **Category**: Channels
- **Description**: Edit an existing channel
- **Inputs**: 1
- **Outputs**: 1
- **Properties**:
  - `channelId`: ID of the channel to edit
  - `name`: New name for the channel
  - `topic`: New topic for the channel
  - `position`: New position for the channel

## Voice

### Join Voice Channel

- **Type**: `voice_join`
- **Category**: Voice
- **Description**: Join a voice channel
- **Inputs**: 1
- **Outputs**: 1
- **Properties**:
  - `channelId`: ID of the voice channel to join

### Leave Voice Channel

- **Type**: `voice_leave`
- **Category**: Voice
- **Description**: Leave the current voice channel
- **Inputs**: 1
- **Outputs**: 1

### Move Member

- **Type**: `voice_move`
- **Category**: Voice
- **Description**: Move a member to a different voice channel
- **Inputs**: 1
- **Outputs**: 1
- **Properties**:
  - `userId`: ID of the user to move
  - `channelId`: ID of the destination voice channel

## Logic

### If Condition

- **Type**: `if_condition`
- **Category**: Logic
- **Description**: Branch based on a condition
- **Inputs**: 1
- **Outputs**: 2 (True/False)
- **Properties**:
  - `leftValue`: Left operand
  - `operator`: Comparison operator (equals, notEquals, greaterThan, etc.)
  - `rightValue`: Right operand

### Switch Case

- **Type**: `switch_case`
- **Category**: Logic
- **Description**: Branch based on multiple conditions
- **Inputs**: 1
- **Outputs**: Variable
- **Properties**:
  - `value`: Value to compare
  - `cases`: Array of case configurations

### Loop

- **Type**: `loop`
- **Category**: Logic
- **Description**: Execute blocks multiple times
- **Inputs**: 1
- **Outputs**: 1
- **Properties**:
  - `type`: Type of loop (for, while, foreach)
  - `iterations`: Number of iterations (for 'for' loops)

### Wait

- **Type**: `wait`
- **Category**: Logic
- **Description**: Pause execution for a specified time
- **Inputs**: 1
- **Outputs**: 1
- **Properties**:
  - `duration`: Time to wait in seconds

## Variables

### Set Variable

- **Type**: `set_variable`
- **Category**: Variables
- **Description**: Create or update a variable
- **Inputs**: 1
- **Outputs**: 1
- **Properties**:
  - `name`: Variable name
  - `value`: Value to assign to the variable
  - `scope`: Scope of the variable (global, server, channel, user)

### Get Variable

- **Type**: `get_variable`
- **Category**: Variables
- **Description**: Retrieve the value of a variable
- **Inputs**: 1
- **Outputs**: 1
- **Properties**:
  - `name`: Name of the variable to retrieve

### Delete Variable

- **Type**: `delete_variable`
- **Category**: Variables
- **Description**: Delete a variable
- **Inputs**: 1
- **Outputs**: 1
- **Properties**:
  - `name`: Name of the variable to delete

## Data & API

### HTTP Request

- **Type**: `http_request`
- **Category**: Data & API
- **Description**: Make an HTTP request to an external API
- **Inputs**: 1
- **Outputs**: 1
- **Properties**:
  - `method`: HTTP method (GET, POST, PUT, DELETE, etc.)
  - `url`: URL to request
  - `headers`: Request headers
  - `body`: Request body (for POST/PUT requests)
  - `saveTo`: Variable to save the response to

### Database Query

- **Type**: `db_query`
- **Category**: Database
- **Description**: Query the database
- **Inputs**: 1
- **Outputs**: 1
- **Properties**:
  - `operation`: Type of operation (find, insert, update, delete)
  - `collection`: Collection/table name
  - `query`: Query parameters
  - `data`: Data for insert/update operations

## API

### Discord API Call

- **Type**: `discord_api_call`
- **Category**: API
- **Description**: Direct call to Discord's REST API
- **Inputs**: 1
- **Outputs**: 1
- **Properties**:
  - `endpoint`: API endpoint
  - `method`: HTTP method
  - `data`: Request payload

## Utilities

### Console Log

- **Type**: `console_log`
- **Category**: Utilities
- **Description**: Log a message to the console
- **Inputs**: 1
- **Outputs**: 1
- **Properties**:
  - `message`: Message to log
  - `level`: Log level (log, warn, error, debug)

### Generate ID

- **Type**: `generate_id`
- **Category**: Utilities
- **Description**: Generate a unique identifier
- **Inputs**: 1
- **Outputs**: 1
- **Properties**:
  - `prefix`: Optional prefix for the ID
  - `saveTo`: Variable to save the generated ID to

## Debugging

### Debug Block

- **Type**: `debug_block`
- **Category**: Debugging
- **Description**: Print debug information
- **Inputs**: 1
- **Outputs**: 1
- **Properties**:
  - `message`: Debug message to print
  - `data`: Optional data to inspect

## Advanced

### Call Module

- **Type**: `call_module`
- **Category**: Advanced
- **Description**: Execute another module
- **Inputs**: 1
- **Outputs**: 1
- **Properties**:
  - `moduleId`: Module to execute
  - `parameters`: Parameters to pass to the module

### Create Invite

- **Type**: `create_invite`
- **Category**: Channels
- **Description**: Create an invite link for a channel
- **Inputs**: 1
- **Outputs**: 1
- **Properties**:
  - `channelId`: Channel to create an invite for
  - `maxUses`: Maximum number of uses (0 for unlimited)
  - `maxAge`: Maximum age in seconds (0 for permanent)

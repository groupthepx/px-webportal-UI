#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

const fs = require('node:fs');
const path = require('node:path');

const sourcePath = path.resolve(__dirname, '..', 'src/content/VoiceRoom/index.tsx');
const source = fs.readFileSync(sourcePath, 'utf8');
const failures = [];

function extractConstObject(name) {
  const declaration = `const ${name} =`;
  const start = source.indexOf(declaration);
  if (start === -1) return '';

  const open = source.indexOf('{', start);
  if (open === -1) return '';

  let depth = 0;
  for (let index = open; index < source.length; index += 1) {
    const character = source[index];
    if (character === '{') depth += 1;
    if (character === '}') {
      depth -= 1;
      if (depth === 0) return source.slice(open, index + 1);
    }
  }

  return '';
}

function requireConst(name) {
  const block = extractConstObject(name);
  if (!block) failures.push(`${name} must be defined as a shared chat layout sx object.`);
  return block;
}

function requireText(block, text, message) {
  if (!block.includes(text)) failures.push(message);
}

const chatPanel = requireConst('CHAT_PANEL_SX');
const chatTimeline = requireConst('CHAT_TIMELINE_SX');
const emojiRow = requireConst('CHAT_EMOJI_ROW_SX');
const composer = requireConst('CHAT_COMPOSER_SX');
const sendButton = requireConst('CHAT_SEND_BUTTON_SX');
const daySeparator = requireConst('CHAT_DAY_SEPARATOR_SX');
const unreadButton = requireConst('CHAT_UNREAD_BUTTON_SX');

requireText(chatPanel, "display: 'flex'", 'Chat panel must use flex layout.');
requireText(chatPanel, "flexDirection: 'column'", 'Chat panel must stack timeline and composer vertically.');
requireText(chatPanel, 'height:', 'Chat panel must have a fixed height so only the timeline scrolls.');
requireText(chatPanel, 'minHeight:', 'Chat panel must keep a usable minimum height.');
requireText(chatPanel, 'maxHeight:', 'Chat panel must cap height inside the viewport.');

requireText(chatTimeline, "flex: '1 1 auto'", 'Chat timeline must take the remaining panel space.');
requireText(chatTimeline, 'minHeight: 0', 'Chat timeline must allow flex overflow to shrink correctly.');
requireText(chatTimeline, "overflowY: 'auto'", 'Chat timeline must be the vertical scroll container.');
requireText(chatTimeline, "overflowX: 'hidden'", 'Chat timeline must avoid horizontal page scroll.');
requireText(chatTimeline, "overscrollBehavior: 'contain'", 'Chat timeline scroll must stay inside the chat area.');

requireText(emojiRow, 'flexShrink: 0', 'Emoji row must stay fixed below the timeline.');
requireText(composer, 'flexShrink: 0', 'Input composer must stay fixed below the timeline.');
requireText(sendButton, 'flexShrink: 0', 'Send button must keep its fixed width.');
requireText(sendButton, 'minWidth:', 'Send button must have a stable minimum width.');
requireText(sendButton, "borderRadius: '50%'", 'Send button must be a circular chat action.');

requireText(daySeparator, "alignSelf: 'center'", 'Day separator must be centered in the timeline.');
requireText(daySeparator, 'borderRadius: 999', 'Day separator must render as a compact pill.');
requireText(unreadButton, 'position:', 'Unread button must be positioned over the chat panel.');
requireText(unreadButton, 'bottom:', 'Unread button must sit above the composer.');

if (!source.includes('sx={CHAT_PANEL_SX}')) failures.push('Live chat VoicePanel must use CHAT_PANEL_SX.');
if (!source.includes('sx={CHAT_TIMELINE_SX}')) failures.push('Live chat message list must use CHAT_TIMELINE_SX.');
if (!source.includes('sx={CHAT_EMOJI_ROW_SX}')) failures.push('Live chat emoji row must use CHAT_EMOJI_ROW_SX.');
if (!source.includes('sx={CHAT_COMPOSER_SX}')) failures.push('Live chat composer must use CHAT_COMPOSER_SX.');
if (!source.includes('sx={CHAT_SEND_BUTTON_SX}')) failures.push('Live chat send button must use CHAT_SEND_BUTTON_SX.');
if (!source.includes('messageSenderKey(')) failures.push('Message rendering must calculate stable sender keys for grouping and own-message alignment.');
if (!source.includes('messageSenderAvatar(')) failures.push('Message bubbles must support sender avatars for grouped chat rendering.');
if (!source.includes('buildChatTimelineItems(')) failures.push('Messages must be converted into timeline items with day separators and grouping metadata.');
if (!source.includes('formatDayLabel(')) failures.push('Timeline must format day separators.');
if (!source.includes('chatTimelineRef')) failures.push('Chat timeline must keep a scroll container ref.');
if (!source.includes('hasUnreadMessages')) failures.push('Chat timeline must track unread messages when the user is scrolled up.');
if (!source.includes('handleChatScroll')) failures.push('Chat timeline must update autoscroll state from scroll events.');
if (!source.includes('scrollChatToBottom')) failures.push('Chat timeline must expose a new-message scroll action.');
if (!source.includes('prepareOutgoingMessageScroll')) failures.push('Outgoing chat messages must force autoscroll to the latest message.');
if (!/prepareOutgoingMessageScroll\(\);\s*socketRef\.current\.emit\('message:send'/.test(source)) failures.push('Outgoing chat autoscroll must be triggered before emitting message:send.');
if (!source.includes('chatTimelineItems.map')) failures.push('Live chat must render timeline items instead of raw messages.');
if (!source.includes("kind === 'day'") && !source.includes('kind === "day"')) failures.push('Timeline rendering must include day separator items.');
if (!source.includes('isOwn={item.isOwn}')) failures.push('Message bubbles must receive own-message alignment state.');
if (!source.includes('showHeader={item.showHeader}')) failures.push('Message bubbles must receive grouped header state.');
if (!source.includes('groupedWithPrevious={item.groupedWithPrevious}')) failures.push('Message bubbles must receive grouped spacing state.');
if (!source.includes('sx={CHAT_DAY_SEPARATOR_SX}')) failures.push('Day separator must use CHAT_DAY_SEPARATOR_SX.');
if (!source.includes('sx={CHAT_UNREAD_BUTTON_SX}')) failures.push('Unread message button must use CHAT_UNREAD_BUTTON_SX.');
if (!source.includes('aria-label="เลื่อนไปข้อความใหม่"')) failures.push('Unread message button must be accessible.');
if (!source.includes('moderationMessageBody')) failures.push('Moderation messages must be formatted from metadata instead of raw backend body only.');
if (!source.includes('shortIdentifier')) failures.push('Moderation message fallback must shorten raw member identifiers.');
if (!source.includes('memberNameById')) failures.push('Moderation messages must resolve member_id to readable online member names when available.');
if (!source.includes('target_member_display_name')) failures.push('Moderation message metadata must support target display names from the backend.');
if (source.includes("access.is_muted !== true && access.mic_blocked !== true")) failures.push('Text mute must not remove mic request/speak capability in the portal.');
if (source.includes("access?.is_muted === true || access?.mic_blocked === true")) failures.push('Portal mic button must only be disabled by mic_blocked, not text mute.');
if (source.includes("if (access?.is_muted === true)")) failures.push('Portal mic action must not reject users only because text chat is muted.');
if (!source.includes('canUseMicControls')) failures.push('Portal must use a dedicated mic-control availability flag.');

if (failures.length) {
  console.error('Voice room chat layout regression failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Voice room chat layout regression passed.');

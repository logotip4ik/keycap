import type { Editor, Range } from '@tiptap/core';
import type { ValueOf } from 'type-fest';

const replacement = {
  Heading: 'heading',
  Heading2: 'heading2',
  Heading3: 'heading3',
  List: 'list',
  OrderedList: 'ordered-list',
  TaskList: 'task-list',
  Quote: 'quote',
  Paragraph: 'Paragraph',
  Today: 'today',
  Now: 'now',
  Time: 'time',
  Tomorrow: 'tomorrow',
  Yesterday: 'yesterday',
} as const;

export type Replacement = ValueOf<typeof replacement>;

type ReplacemntEntry = {
  name: string
  replacement: () => string
} | {
  name: string
  action: (editor: Editor, range: Range) => void
};

const DateFormatter = Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
});

const DateTimeFormatter = Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short',
});

const TimeFormatter = Intl.DateTimeFormat(undefined, {
  timeStyle: 'short',
});

export const replacements: Record<Replacement, ReplacemntEntry> = {
  [replacement.Today]: {
    name: 'Today',
    replacement: () => {
      return DateFormatter.format(new Date());
    },
  },
  [replacement.Now]: {
    name: 'Now',
    replacement: () => {
      return DateTimeFormatter.format(new Date());
    },
  },
  [replacement.Time]: {
    name: 'Time',
    replacement: () => {
      return TimeFormatter.format(new Date());
    },
  },
  [replacement.Tomorrow]: {
    name: 'Tomorrow',
    replacement: () => {
      const today = new Date();
      today.setDate(today.getDate() + 1);
      return DateFormatter.format(today);
    },
  },
  [replacement.Yesterday]: {
    name: 'Yesterday',
    replacement: () => {
      const today = new Date();
      today.setDate(today.getDate() - 1);
      return DateFormatter.format(today);
    },
  },
  [replacement.Heading]: {
    name: 'Heading',
    action: (editor, range) => {
      return editor.chain().toggleHeading({ level: 1 }).deleteRange(range).focus().run();
    },
  },
  [replacement.Heading2]: {
    name: 'Heading2',
    action: (editor, range) => {
      return editor.chain().toggleHeading({ level: 2 }).deleteRange(range).focus().run();
    },
  },
  [replacement.Heading3]: {
    name: 'Heading3',
    action: (editor, range) => {
      return editor.chain().toggleHeading({ level: 3 }).deleteRange(range).focus().run();
    },
  },
  [replacement.List]: {
    name: 'List',
    action: (editor, range) => {
      editor.commands.deleteRange(range);
      return editor.chain().focus().toggleBulletList().run();
    },
  },
  [replacement.OrderedList]: {
    name: 'Ordered list',
    action: (editor, range) => {
      editor.commands.deleteRange(range);
      return editor.chain().focus().toggleOrderedList().run();
    },
  },
  [replacement.TaskList]: {
    name: 'Task list',
    action: (editor, range) => {
      editor.commands.deleteRange(range);
      return editor.chain().focus().toggleTaskList().run();
    },
  },
  [replacement.Quote]: {
    name: 'Quote',
    action: (editor, range) => {
      return editor.chain().deleteRange(range).toggleBlockquote().focus().run();
    },
  },
  [replacement.Paragraph]: {
    name: 'Paragraph',
    action: (editor, range) => {
      return editor.chain().deleteRange(range).setParagraph().focus().run();
    },
  },
};

export const replacementsMin: Array<{ id: Replacement, name: string }> = [
  { id: replacement.Heading, name: 'Heading' },
  { id: replacement.List, name: 'List' },
  { id: replacement.Quote, name: 'Quote' },
  { id: replacement.Today, name: 'Today' },
  { id: replacement.Tomorrow, name: 'Tomorrow' },

  { id: replacement.Now, name: 'Now' },
  { id: replacement.Heading2, name: 'Heading2' },
  { id: replacement.Heading3, name: 'Heading3' },
  { id: replacement.OrderedList, name: 'OrderedList' },
  { id: replacement.TaskList, name: 'TaskList' },
  { id: replacement.Time, name: 'Time' },
  { id: replacement.Yesterday, name: 'Yesterday' },
  { id: replacement.Paragraph, name: 'Paragraph' },
];

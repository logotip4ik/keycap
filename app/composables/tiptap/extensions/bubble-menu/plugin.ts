import type { ComputePositionConfig } from '@floating-ui/dom';
import type { Editor, EditorEvents } from '@tiptap/core';

import type { EditorState } from '@tiptap/pm/state';
import type { EditorView } from '@tiptap/pm/view';

import { isNodeSelection, isTextSelection, posToDOMRect } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';

export interface BubbleMenuPluginProps {
  pluginKey: string
  editor: Editor
  element: HTMLElement
  placement?: 'top' | 'bottom'
}

export type BubbleMenuViewProps = BubbleMenuPluginProps & {
  view: EditorView
};

function editorOn<T extends keyof EditorEvents>(
  editor: Editor,
  event: T,
  cb: (...props: EditorEvents[T] extends Array<any> ? EditorEvents[T] : [EditorEvents[T]]) => void,
): () => void {
  editor.on(event, cb);
  return () => editor.off(event, cb);
}

export class BubbleMenuView {
  private editor: Editor;

  private element: HTMLElement;

  private view: EditorView;

  private preventHide = false;

  private computeFloatingPosition: typeof import('@floating-ui/dom').computePosition | undefined;
  private floatingReferenceEl: { getBoundingClientRect: () => DOMRect };
  private floatingOptions?: Partial<ComputePositionConfig>;

  private updateDelay: number;

  private updateDebounceTimer: number | undefined;

  private offs: Array<() => void>;

  constructor({
    editor,
    element,
    view,
    placement = 'top',
  }: BubbleMenuViewProps) {
    this.editor = editor;
    this.element = element;
    this.view = view;
    this.updateDelay = 75;

    this.offs = [
      on(this.element, 'mousedown', () => this.mousedownHandler(), { capture: true }),
      on(this.view.dom, 'dragstart', () => this.dragstartHandler()),
      editorOn(this.editor, 'focus', () => this.focusHandler()),
      editorOn(this.editor, 'blur', (payload) => this.blurHandler(payload)),
    ];

    this.hide();

    this.floatingReferenceEl = {
      getBoundingClientRect: this.getSelectionDOMRect.bind(this),
    };

    loadFloatingUi().then(({ computePosition, offset, shift, flip }) => {
      this.computeFloatingPosition = computePosition;

      this.floatingOptions = {
        placement,
        middleware: [
          offset(8),
          shift({ padding: 8 }),
          flip(),
        ],
      };
    });
  }

  mousedownHandler() {
    this.preventHide = true;
  }

  dragstartHandler() {
    this.hide();
  }

  focusHandler() {
    // we use `setTimeout` to make sure `selection` is already updated
    setTimeout(() => this.update(this.editor.view));
  }

  blurHandler({ event }: { event: FocusEvent }) {
    if (this.preventHide) {
      this.preventHide = false;

      return;
    }

    if (
      (event?.relatedTarget && this.element.parentNode?.contains(event.relatedTarget as Node))
      || (event?.relatedTarget === this.editor.view.dom)
    ) {
      return;
    }

    this.hide();
  };

  update(view: EditorView, oldState?: EditorState) {
    const { state } = view;
    const hasValidSelection = state.selection.$from.pos !== state.selection.$to.pos;

    if (this.updateDelay > 0 && hasValidSelection) {
      this.handleDebouncedUpdate(view, oldState);
      return;
    }

    const selectionChanged = !oldState?.selection.eq(view.state.selection);
    const docChanged = !oldState?.doc.eq(view.state.doc);

    this.updateHandler(view, selectionChanged, docChanged, oldState);
  }

  handleDebouncedUpdate(view: EditorView, oldState?: EditorState) {
    const selectionChanged = !oldState?.selection.eq(view.state.selection);
    const docChanged = !oldState?.doc.eq(view.state.doc);

    if (!selectionChanged && !docChanged) {
      return;
    }

    if (this.updateDebounceTimer) {
      clearTimeout(this.updateDebounceTimer);
    }

    this.updateDebounceTimer = window.setTimeout(() => {
      this.updateHandler(view, selectionChanged, docChanged, oldState);
    }, this.updateDelay);
  };

  updateHandler(view: EditorView, selectionChanged: boolean, docChanged: boolean, oldState?: EditorState) {
    const { state, composing } = view;
    const { selection } = state;

    const isSame = !selectionChanged && !docChanged;

    if (composing || isSame) {
      return;
    }

    // support for CellSelections
    const { ranges } = selection;
    const from = Math.min(...ranges.map((range) => range.$from.pos));
    const to = Math.max(...ranges.map((range) => range.$to.pos));

    const shouldShow = this.shouldShow({
      editor: this.editor,
      view,
      state,
      oldState,
      from,
      to,
    });

    if (!shouldShow) {
      this.hide();

      return;
    }

    const shouldAnimate = this.element.style.visibility === 'visible';
    this.element.style.transitionDuration = shouldAnimate ? '.3s' : '0s';

    this.computeFloatingPosition?.(
      this.floatingReferenceEl,
      this.element,
      this.floatingOptions,
    ).then(({ x, y }) => {
      this.element.style.top = `${y}px`;
      this.element.style.left = `${x}px`;
    });

    this.show();
  };

  show() {
    const shouldAnimate = this.element.style.visibility === 'hidden';
    this.element.style.visibility = 'visible';

    if (shouldAnimate) {
      stopAnimations(this.element);

      this.element.animate([
        { opacity: 0 },
        { opacity: 1 },
      ], { duration: 100 });
    }
  }

  hide() {
    this.element.style.visibility = 'hidden';
  }

  getSelectionDOMRect() {
    const { ranges } = this.editor.state.selection;
    const from = Math.min(...ranges.map((range) => range.$from.pos));
    const to = Math.max(...ranges.map((range) => range.$to.pos));

    if (isNodeSelection(this.editor.state.selection)) {
      let node = this.editor.view.nodeDOM(from) as HTMLElement | undefined;

      if (node) {
        const nodeViewWrapper = node.dataset.nodeViewWrapper ? node : node.querySelector('[data-node-view-wrapper]');

        if (nodeViewWrapper) {
          node = nodeViewWrapper.firstChild as HTMLElement;
        }

        return node.getBoundingClientRect();
      }
    }

    return posToDOMRect(this.editor.view, from, to);
  }

  shouldShow({
    view,
    state,
    from,
    to,
  }: {
    editor: Editor
    view: EditorView
    state: EditorState
    oldState?: EditorState
    from: number
    to: number
  }) {
    const { doc, selection } = state;
    const { empty } = selection;

    // Sometime check for `empty` is not enough.
    // Doubleclick an empty paragraph returns a node size of 2.
    // So we check also for an empty text size.
    const isEmptyTextBlock = doc.textBetween(from, to).length === 0 && isTextSelection(state.selection);

    // When clicking on a element inside the bubble menu the editor "blur" event
    // is called and the bubble menu item is focussed. In this case we should
    // consider the menu as part of the editor and keep showing the menu
    const isChildOfMenu = this.element.contains(document.activeElement);

    const hasEditorFocus = view.hasFocus() || isChildOfMenu;

    if (!hasEditorFocus || empty || isEmptyTextBlock || !this.editor.isEditable) {
      return false;
    }

    return true;
  }

  destroy() {
    invokeArrayFns(this.offs);
    this.offs.length = 0;

    // @ts-expect-error cleaning up memory
    this.editor = undefined;
    // @ts-expect-error cleaning up memory
    this.element = undefined;
    // @ts-expect-error cleaning up memory
    this.view = undefined;
  }
}

export function BubbleMenuPlugin(options: BubbleMenuPluginProps) {
  return new Plugin({
    key: new PluginKey(options.pluginKey),
    view: (view) => new BubbleMenuView({ view, ...options }),
  });
}

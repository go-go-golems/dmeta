import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  ActionPresentation,
  ActionRequest,
  ContextMenuState,
  PresentationRef,
  ActionSpec,
  PbuiInteractionState,
} from './types';

export interface PbuiSessionState {
  interaction: PbuiInteractionState;
  selectedRef?: PresentationRef;
  commandBuffer: string;
  commandHistory: string[];
  historyCursor?: number;
  resultLine?: string;
  commandHint?: string;
  contextMenu: ContextMenuState;
}

export const initialPbuiSessionState: PbuiSessionState = {
  interaction: { kind: 'normal' },
  commandBuffer: 'LIST',
  commandHistory: [],
  contextMenu: { visible: false, x: 0, y: 0, ref: null, actions: [] },
};

export const pbuiSessionSlice = createSlice({
  name: 'pbuiSession',
  initialState: initialPbuiSessionState,
  reducers: {
    resetSession: (_state, action: PayloadAction<Partial<PbuiSessionState> | undefined>) => ({
      ...initialPbuiSessionState,
      ...action.payload,
      commandHistory: action.payload?.commandHistory ?? [],
    }),
    selectRef: (state, action: PayloadAction<{ presentation: PresentationRef; resultLine?: string; commandHint?: string }>) => {
      state.selectedRef = action.payload.presentation;
      if (action.payload.resultLine !== undefined) {
        state.resultLine = action.payload.resultLine;
      }
      if (action.payload.commandHint !== undefined) {
        state.commandHint = action.payload.commandHint;
      }
    },
    deselect: (state) => {
      state.selectedRef = undefined;
    },
    setCommandBuffer: (state, action: PayloadAction<string>) => {
      state.commandBuffer = action.payload;
      state.historyCursor = undefined;
    },
    pushCommandHistory: (state, action: PayloadAction<string>) => {
      const command = action.payload.trim();
      if (!command) {
        return;
      }
      if (state.commandHistory[0] !== command) {
        state.commandHistory.unshift(command);
      }
      if (state.commandHistory.length > 100) {
        state.commandHistory.pop();
      }
      state.historyCursor = undefined;
    },
    recallPreviousCommand: (state) => {
      if (state.commandHistory.length === 0) {
        return;
      }
      const nextCursor = state.historyCursor === undefined
        ? 0
        : Math.min(state.historyCursor + 1, state.commandHistory.length - 1);
      state.historyCursor = nextCursor;
      state.commandBuffer = state.commandHistory[nextCursor];
    },
    recallNextCommand: (state) => {
      if (state.historyCursor === undefined) {
        return;
      }
      const nextCursor = state.historyCursor - 1;
      if (nextCursor < 0) {
        state.historyCursor = undefined;
        state.commandBuffer = '';
        return;
      }
      state.historyCursor = nextCursor;
      state.commandBuffer = state.commandHistory[nextCursor];
    },
    clearCommandBuffer: (state) => {
      state.commandBuffer = '';
      state.historyCursor = undefined;
    },
    setResult: (state, action: PayloadAction<string | undefined>) => {
      state.resultLine = action.payload;
    },
    setCommandHint: (state, action: PayloadAction<string | undefined>) => {
      state.commandHint = action.payload;
    },
    routeChanged: (state, action: PayloadAction<{ commandBuffer?: string; selectedRef?: PresentationRef }>) => {
      state.interaction = { kind: 'normal' };
      if (action.payload.selectedRef !== undefined) {
        state.selectedRef = action.payload.selectedRef;
      }
      if (action.payload.commandBuffer !== undefined) {
        state.commandBuffer = action.payload.commandBuffer;
      }
    },
    enterSelect: (state, action: PayloadAction<{ action: ActionSpec; filledArgs?: Record<string, unknown>; resultLine?: string; commandHint?: string }>) => {
      state.interaction = {
        kind: 'select',
        action: action.payload.action,
        filledArgs: action.payload.filledArgs ?? {},
      };
      state.commandBuffer = action.payload.action.id;
      if (action.payload.resultLine !== undefined) {
        state.resultLine = action.payload.resultLine;
      }
      if (action.payload.commandHint !== undefined) {
        state.commandHint = action.payload.commandHint;
      }
    },
    selectCompleted: (state, action: PayloadAction<{ selectedRef: PresentationRef; filledArgs?: Record<string, unknown>; commandBuffer?: string; resultLine?: string; commandHint?: string }>) => {
      state.interaction = { kind: 'normal' };
      state.selectedRef = action.payload.selectedRef;
      if (action.payload.commandBuffer !== undefined) {
        state.commandBuffer = action.payload.commandBuffer;
      }
      if (action.payload.resultLine !== undefined) {
        state.resultLine = action.payload.resultLine;
      }
      if (action.payload.commandHint !== undefined) {
        state.commandHint = action.payload.commandHint;
      }
    },
    selectCancelled: (state, action: PayloadAction<{ resultLine?: string; commandHint?: string } | undefined>) => {
      state.interaction = { kind: 'normal' };
      if (action.payload?.resultLine !== undefined) {
        state.resultLine = action.payload.resultLine;
      }
      if (action.payload?.commandHint !== undefined) {
        state.commandHint = action.payload.commandHint;
      }
    },
    enterConfirm: (state, action: PayloadAction<{ action: ActionSpec; request: ActionRequest; filledArgs?: Record<string, unknown>; resultLine?: string; commandHint?: string }>) => {
      state.interaction = {
        kind: 'confirm',
        action: action.payload.action,
        request: action.payload.request,
        filledArgs: action.payload.filledArgs ?? action.payload.request.args,
      };
      state.commandBuffer = action.payload.action.id;
      if (action.payload.resultLine !== undefined) {
        state.resultLine = action.payload.resultLine;
      }
      if (action.payload.commandHint !== undefined) {
        state.commandHint = action.payload.commandHint;
      }
    },
    confirmCompleted: (state, action: PayloadAction<{ commandBuffer?: string; resultLine?: string; commandHint?: string }>) => {
      state.interaction = { kind: 'normal' };
      if (action.payload.commandBuffer !== undefined) {
        state.commandBuffer = action.payload.commandBuffer;
      }
      if (action.payload.resultLine !== undefined) {
        state.resultLine = action.payload.resultLine;
      }
      if (action.payload.commandHint !== undefined) {
        state.commandHint = action.payload.commandHint;
      }
    },
    confirmCancelled: (state, action: PayloadAction<{ resultLine?: string; commandHint?: string } | undefined>) => {
      state.interaction = { kind: 'normal' };
      if (action.payload?.resultLine !== undefined) {
        state.resultLine = action.payload.resultLine;
      }
      if (action.payload?.commandHint !== undefined) {
        state.commandHint = action.payload.commandHint;
      }
    },
    showContextMenu: (state, action: PayloadAction<{ x: number; y: number; ref: PresentationRef; actions: ActionPresentation[] }>) => {
      state.contextMenu = {
        visible: true,
        x: action.payload.x,
        y: action.payload.y,
        ref: action.payload.ref,
        actions: action.payload.actions,
      };
    },
    hideContextMenu: (state) => {
      state.contextMenu.visible = false;
      state.contextMenu.ref = null;
      state.contextMenu.actions = [];
    },
  },
});

export const pbuiSessionActions = pbuiSessionSlice.actions;
export const pbuiSessionReducer = pbuiSessionSlice.reducer;

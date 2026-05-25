import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ActionRequest, InteractionMode, PresentationRef } from './types';

export interface PbuiSessionState {
  mode: InteractionMode;
  selectedRef?: PresentationRef;
  pendingActionId?: string;
  pendingRequest?: ActionRequest;
  filledArgs: Record<string, unknown>;
  commandBuffer: string;
  commandHistory: string[];
  historyCursor?: number;
  resultLine?: string;
}

export const initialPbuiSessionState: PbuiSessionState = {
  mode: 'normal',
  filledArgs: {},
  commandBuffer: 'LIST',
  commandHistory: [],
};

export const pbuiSessionSlice = createSlice({
  name: 'pbuiSession',
  initialState: initialPbuiSessionState,
  reducers: {
    resetSession: (_state, action: PayloadAction<Partial<PbuiSessionState> | undefined>) => ({
      ...initialPbuiSessionState,
      ...action.payload,
      filledArgs: action.payload?.filledArgs ?? {},
      commandHistory: action.payload?.commandHistory ?? [],
    }),
    selectRef: (state, action: PayloadAction<{ presentation?: PresentationRef; resultLine?: string }>) => {
      state.selectedRef = action.payload.presentation;
      if (action.payload.resultLine !== undefined) {
        state.resultLine = action.payload.resultLine;
      }
    },
    clearSelection: (state) => {
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
    routeChanged: (state, action: PayloadAction<{ commandBuffer?: string; selectedRef?: PresentationRef }>) => {
      state.mode = 'normal';
      state.pendingActionId = undefined;
      state.pendingRequest = undefined;
      state.filledArgs = {};
      if (action.payload.selectedRef !== undefined) {
        state.selectedRef = action.payload.selectedRef;
      }
      if (action.payload.commandBuffer !== undefined) {
        state.commandBuffer = action.payload.commandBuffer;
      }
    },
    enterSelect: (state, action: PayloadAction<{ actionId: string; filledArgs?: Record<string, unknown>; resultLine?: string }>) => {
      state.mode = 'select';
      state.pendingActionId = action.payload.actionId;
      state.pendingRequest = undefined;
      state.filledArgs = action.payload.filledArgs ?? {};
      state.commandBuffer = action.payload.actionId;
      if (action.payload.resultLine !== undefined) {
        state.resultLine = action.payload.resultLine;
      }
    },
    selectCompleted: (state, action: PayloadAction<{ selectedRef: PresentationRef; filledArgs?: Record<string, unknown>; commandBuffer?: string; resultLine?: string }>) => {
      state.mode = 'normal';
      state.selectedRef = action.payload.selectedRef;
      state.pendingActionId = undefined;
      state.pendingRequest = undefined;
      state.filledArgs = action.payload.filledArgs ?? {};
      if (action.payload.commandBuffer !== undefined) {
        state.commandBuffer = action.payload.commandBuffer;
      }
      if (action.payload.resultLine !== undefined) {
        state.resultLine = action.payload.resultLine;
      }
    },
    selectCancelled: (state, action: PayloadAction<{ resultLine?: string } | undefined>) => {
      state.mode = 'normal';
      state.pendingActionId = undefined;
      state.pendingRequest = undefined;
      state.filledArgs = {};
      if (action.payload?.resultLine !== undefined) {
        state.resultLine = action.payload.resultLine;
      }
    },
    enterConfirm: (state, action: PayloadAction<{ actionId: string; request: ActionRequest; filledArgs?: Record<string, unknown>; resultLine?: string }>) => {
      state.mode = 'confirm';
      state.pendingActionId = action.payload.actionId;
      state.pendingRequest = action.payload.request;
      state.filledArgs = action.payload.filledArgs ?? action.payload.request.args;
      state.commandBuffer = action.payload.actionId;
      if (action.payload.resultLine !== undefined) {
        state.resultLine = action.payload.resultLine;
      }
    },
    confirmCompleted: (state, action: PayloadAction<{ commandBuffer?: string; resultLine?: string }>) => {
      state.mode = 'normal';
      state.pendingActionId = undefined;
      state.pendingRequest = undefined;
      state.filledArgs = {};
      if (action.payload.commandBuffer !== undefined) {
        state.commandBuffer = action.payload.commandBuffer;
      }
      if (action.payload.resultLine !== undefined) {
        state.resultLine = action.payload.resultLine;
      }
    },
    confirmCancelled: (state, action: PayloadAction<{ resultLine?: string } | undefined>) => {
      state.mode = 'normal';
      state.pendingActionId = undefined;
      state.pendingRequest = undefined;
      state.filledArgs = {};
      if (action.payload?.resultLine !== undefined) {
        state.resultLine = action.payload.resultLine;
      }
    },
  },
});

export const pbuiSessionActions = pbuiSessionSlice.actions;
export const pbuiSessionReducer = pbuiSessionSlice.reducer;

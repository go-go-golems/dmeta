import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ActionRequest, CommandBinding, InteractionMode, PresentationRef } from './types';

export interface PbuiSessionState {
  mode: InteractionMode;
  selectedRef?: PresentationRef;
  pendingCommand?: CommandBinding;
  pendingRequest?: ActionRequest;
  commandBuffer: string;
  resultLine?: string;
}

export const initialPbuiSessionState: PbuiSessionState = {
  mode: 'normal',
  commandBuffer: 'LIST',
};

export const pbuiSessionSlice = createSlice({
  name: 'pbuiSession',
  initialState: initialPbuiSessionState,
  reducers: {
    resetSession: (_state, action: PayloadAction<Partial<PbuiSessionState> | undefined>) => ({
      ...initialPbuiSessionState,
      ...action.payload,
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
    },
    setResult: (state, action: PayloadAction<string | undefined>) => {
      state.resultLine = action.payload;
    },
    routeChanged: (state, action: PayloadAction<{ commandBuffer?: string; selectedRef?: PresentationRef }>) => {
      state.mode = 'normal';
      state.pendingCommand = undefined;
      state.pendingRequest = undefined;
      if (action.payload.selectedRef !== undefined) {
        state.selectedRef = action.payload.selectedRef;
      }
      if (action.payload.commandBuffer !== undefined) {
        state.commandBuffer = action.payload.commandBuffer;
      }
    },
    enterSelect: (state, action: PayloadAction<{ command: CommandBinding; resultLine?: string }>) => {
      state.mode = 'select';
      state.pendingCommand = action.payload.command;
      state.pendingRequest = undefined;
      state.commandBuffer = action.payload.command.id;
      if (action.payload.resultLine !== undefined) {
        state.resultLine = action.payload.resultLine;
      }
    },
    selectCompleted: (state, action: PayloadAction<{ selectedRef: PresentationRef; commandBuffer?: string; resultLine?: string }>) => {
      state.mode = 'normal';
      state.selectedRef = action.payload.selectedRef;
      state.pendingCommand = undefined;
      state.pendingRequest = undefined;
      if (action.payload.commandBuffer !== undefined) {
        state.commandBuffer = action.payload.commandBuffer;
      }
      if (action.payload.resultLine !== undefined) {
        state.resultLine = action.payload.resultLine;
      }
    },
    selectCancelled: (state, action: PayloadAction<{ resultLine?: string } | undefined>) => {
      state.mode = 'normal';
      state.pendingCommand = undefined;
      state.pendingRequest = undefined;
      if (action.payload?.resultLine !== undefined) {
        state.resultLine = action.payload.resultLine;
      }
    },
    enterConfirm: (state, action: PayloadAction<{ command: CommandBinding; request: ActionRequest; resultLine?: string }>) => {
      state.mode = 'confirm';
      state.pendingCommand = action.payload.command;
      state.pendingRequest = action.payload.request;
      state.commandBuffer = action.payload.command.id;
      if (action.payload.resultLine !== undefined) {
        state.resultLine = action.payload.resultLine;
      }
    },
    confirmCompleted: (state, action: PayloadAction<{ commandBuffer?: string; resultLine?: string }>) => {
      state.mode = 'normal';
      state.pendingCommand = undefined;
      state.pendingRequest = undefined;
      if (action.payload.commandBuffer !== undefined) {
        state.commandBuffer = action.payload.commandBuffer;
      }
      if (action.payload.resultLine !== undefined) {
        state.resultLine = action.payload.resultLine;
      }
    },
    confirmCancelled: (state, action: PayloadAction<{ resultLine?: string } | undefined>) => {
      state.mode = 'normal';
      state.pendingCommand = undefined;
      state.pendingRequest = undefined;
      if (action.payload?.resultLine !== undefined) {
        state.resultLine = action.payload.resultLine;
      }
    },
  },
});

export const pbuiSessionActions = pbuiSessionSlice.actions;
export const pbuiSessionReducer = pbuiSessionSlice.reducer;

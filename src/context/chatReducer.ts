import { Message, InteractionMode, Mood } from '@/types/chat';

export interface ChatState {
  messages: Message[];
  moods: Mood[];
  mode: InteractionMode;
  isTyping: boolean;
}

export type ChatAction =
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'SET_MESSAGES'; payload: Message[] }
  | { type: 'UPDATE_MESSAGE'; payload: { messageId: string; updates: Partial<Message> } }
  | { type: 'SET_MODE'; payload: InteractionMode }
  | { type: 'ADD_MOOD'; payload: Mood }
  | { type: 'DELETE_MESSAGE'; payload: string }
  | { type: 'CLEAR_CHAT' }
  | { type: 'SET_TYPING'; payload: boolean }
  | { type: 'CLEAR_MESSAGES' };

export const initialState: ChatState = {
  messages: [],
  moods: [],
  mode: 'conversational',
  isTyping: false,
};

export function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
        isTyping: false,
      };

    case 'SET_MESSAGES':
      return {
        ...state,
        messages: action.payload,
      };

    case 'UPDATE_MESSAGE':
      return {
        ...state,
        messages: state.messages.map(message =>
          message.id === action.payload.messageId
            ? { ...message, ...action.payload.updates }
            : message
        ),
      };

    case 'SET_MODE':
      return {
        ...state,
        mode: action.payload,
      };

    case 'ADD_MOOD':
      return {
        ...state,
        moods: [...state.moods, action.payload],
      };

    case 'DELETE_MESSAGE':
      return {
        ...state,
        messages: state.messages.filter(message => message.id !== action.payload),
      };

    case 'CLEAR_CHAT':
      return {
        ...state,
        messages: [],
        moods: [],
      };

    case 'SET_TYPING':
      return {
        ...state,
        isTyping: action.payload,
      };

    case 'CLEAR_MESSAGES':
      return {
        ...state,
        messages: [],
      };

    default:
      return state;
  }
}

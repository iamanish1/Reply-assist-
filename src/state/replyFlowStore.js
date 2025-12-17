import React, { createContext, useContext, useMemo, useReducer } from 'react';

const ReplyFlowContext = createContext(null);

const initialState = {
  pastedText: '',
  context: {
    relationship: 'Personal',
    mood: 'Upset',
    situation: 'Complaint',
  },
  replies: [],
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_PASTED_TEXT':
      return { ...state, pastedText: action.payload };
    case 'SET_CONTEXT':
      return { ...state, context: { ...state.context, ...action.payload } };
    case 'SET_REPLIES':
      return { ...state, replies: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export function ReplyFlowProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <ReplyFlowContext.Provider value={value}>{children}</ReplyFlowContext.Provider>;
}

export function useReplyFlow() {
  const ctx = useContext(ReplyFlowContext);
  if (!ctx) throw new Error('useReplyFlow must be used within ReplyFlowProvider');
  return ctx;
}



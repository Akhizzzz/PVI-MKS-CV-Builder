import { createContext, useContext, useReducer, type ReactNode, type Dispatch } from 'react';
import type { CV } from '../data/cvModel';

export type CVAction =
  | { type: 'load'; cv: CV }
  | { type: 'update'; patch: Partial<CV> }
  | { type: 'updatePersonalDetails'; patch: Partial<CV['personalDetails']> };

function cvReducer(state: CV | null, action: CVAction): CV | null {
  switch (action.type) {
    case 'load':
      return action.cv;
    case 'update':
      if (!state) return state;
      return { ...state, ...action.patch, updatedAt: Date.now() };
    case 'updatePersonalDetails':
      if (!state) return state;
      return {
        ...state,
        personalDetails: { ...state.personalDetails, ...action.patch },
        updatedAt: Date.now(),
      };
    default:
      return state;
  }
}

interface ActiveCVContextValue {
  cv: CV | null;
  dispatch: Dispatch<CVAction>;
}

const ActiveCVContext = createContext<ActiveCVContextValue | undefined>(undefined);

export function ActiveCVProvider({ children }: { children: ReactNode }) {
  const [cv, dispatch] = useReducer(cvReducer, null);
  return <ActiveCVContext.Provider value={{ cv, dispatch }}>{children}</ActiveCVContext.Provider>;
}

export function useActiveCVContext(): ActiveCVContextValue {
  const ctx = useContext(ActiveCVContext);
  if (!ctx) throw new Error('useActiveCVContext must be used within ActiveCVProvider');
  return ctx;
}

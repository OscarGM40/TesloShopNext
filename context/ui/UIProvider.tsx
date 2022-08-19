import { FC, useReducer } from 'react';
import { UIContext, UIReducer } from '.';

export interface UIState {
  isMenuOpen: boolean;
}

const UI_INITIAL_STATE: UIState = {
  isMenuOpen: false,
};

interface UIProviderProps {
  children: React.ReactNode;
}

export const UIProvider: FC<UIProviderProps> = ({ children }) => {
  
  const [state, dispatch] = useReducer(UIReducer, UI_INITIAL_STATE);

  const toggleSideMenu = () => {
    dispatch({
      type:"[UI] - ToggleMenu"
    })
  }
  
  return (
    <UIContext.Provider
      value={{
        ...state,
        // methods
        toggleSideMenu
      }}
    >
      {children}
    </UIContext.Provider>
  );
};
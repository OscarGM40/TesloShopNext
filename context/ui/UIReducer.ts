import { UIState} from '.';


type UIAction =
  | { type: '[UI] - ToggleMenu' }

export const UIReducer = (state: UIState, action: UIAction) => {
  switch (action.type) {
    case '[UI] - ToggleMenu':
      return {
        ...state,
        isMenuOpen: !state.isMenuOpen,
      };
    default:
      return state;
  }
};
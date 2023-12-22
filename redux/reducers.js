// redux/reducers.js
const initialState = {
  advertisements: [],
};
const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_ADVERTISEMENT':
      return {
        ...state,
        advertisements: [...state.advertisements, action.payload],
      };
case 'EDIT_ADVERTISEMENT':
  return {
    ...state,
    advertisements: action.payload,
  };
    case 'DELETE_ADVERTISEMENT':
      const updatedAdvertisements = state.advertisements.filter(ad => ad.id !== action.payload.id);
      return {
        ...state,
        advertisements: updatedAdvertisements,
      };

    default:
      return state;
  }
};

export default rootReducer;

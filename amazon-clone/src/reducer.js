// reducer is the action, which shots the data into the data layer,
// like button is pushed, music playing has stopped and so on.
export const initialState = {
    basket: [],
    user: null
};

const reducer = (state, action) => {

    console.log(action);

    switch (action.type) {
        case "ADD_TO_BASKET":
          return {
            ...state,
            basket: [...state.basket, action.item],
          };
        
        case 'EMPTY_BASKET':
          return {
            ...state,
            basket: []
          }
        
        default:
            return state;
    }
}

export default reducer;


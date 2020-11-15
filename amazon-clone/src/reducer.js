// reducer is the action, which shots the data into the data layer,
// like button is pushed, music playing has stopped and so on.
export const initialState = {
    basket: [],
    user: null
};
// Selector, reduce does sum the element and returns the total amount
// amount is the init value, item is the list,
// add the item.price to the amout, and 0 is the init value of the amount.
export const getBasketTotal = (basket) => basket?.reduce(
    ((amount, item) => item.price + amount), 0);

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
        };

      case 'REMOVE_FROM_BASKET':
        const index = state.basket.findIndex(
          (basketItem) => basketItem.id === action.id
        );
        let newBasket = [...state.basket];

        if (index >= 0) {
          newBasket.splice(index, 1);
  
        } else {
          console.warn(
            `Cant remove product (id: ${action.id}) as its not in basket!`
          )
        }
        return {
          ...state,
          basket: newBasket
        };

      //login
      case 'SET_USER':
        return {
          ...state,
          user: action.user
        };

      default:
          return state;
    }
}

export default reducer;


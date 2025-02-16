import { createContext, useState } from "react";
import { Tour_list } from "../assets/assets";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [CartItems, setCartItems] = useState({});

  const addToCart = (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => {
      if (prev[itemId] > 1) {
        return { ...prev, [itemId]: prev[itemId] - 1 };
      } else {
        const { [itemId]: _, ...rest } = prev; // Remove item if quantity is 1 or less
        return rest;
      }
    });
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in CartItems) {
      if (CartItems[item] > 0) {
        let itemInfo = Tour_list.find((product) => product._id === item);
        totalAmount += itemInfo.price * CartItems[item];
      }
    }
    return totalAmount;
  };

  const contextValue = {
    Tour_list,
    CartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;

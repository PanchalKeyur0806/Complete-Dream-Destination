import React, { useContext } from 'react'
import './Cart.css'
import { useNavigate } from 'react-router-dom';
import { Tour_list } from '../../assets/assets';
const Cart = () => {
  const { CartItems, Tour_list, removeFromCart, getTotalCartAmount} = useContext();
  const navigate = useNavigate();
  return (
    <div className='cart container'>
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {Tour_list.map((name,price) => {
            return (
              <div>
                <div className='cart-items-title cart-items-item'>
                  <img src={image} alt=" " />
                  <p>{name}</p>
                  <p>{price}</p>
                  {/* <p>{Tour_list[item._id]}</p>
                  <p>${price * CartItems[item._id]}</p> */}
                  <p onClick={() => removeFromCart(item._id)} className='cross'>x</p>
                </div>
                <hr />
              </div>
            )
        }
        )
        }
          
        
        

      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>SubTotal</p>
              <p>${price}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Total</p>
              <p>${}</p>
            </div>
          </div>
          <button onClick={()=>navigate('/order')}>PROCEED TO CHECKOUT</button>
        </div>
        <div className="cart-promocode">
          <div>
            <p>If you have a promo code, Enter it here</p>
            <div className="cart-promocode-input">
              <input type="text" placeholder="promo code" id="" />
              <button>SUBMIT</button>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
  
}

export default Cart
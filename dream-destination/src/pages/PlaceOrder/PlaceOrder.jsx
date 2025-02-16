import React, { useContext } from 'react'
import './PlaceOrder.css'
function PlaceOrder() {
  
  const {getTotalCartAmount} = useContext()

  return (
    <form className='place-order container'>
      <div className="place-order-left">
        <p className="title">
          Delivery Information
        </p>
        <div className="multi-fields">
          <input type="text" placeholder="First name" id="" />
          <input type="text" placeholder="Last name" id="" />
        </div>
        <input type="email" placeholder="Email address" id="" />
        <input type="text" placeholder="Street" id="" />
        <div className="multi-fields">
          <input type="text" placeholder="City" id="" />
          <input type="text" placeholder="State" id="" />
        </div>
        <div className="multi-fields">
          <input type="text" placeholder="Zip code" id="" />
          <input type="text" placeholder="Country" id="" />
        </div>
        <input type="text" placeholder="phone" id="" />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
          <div className="cart-total-details">
              <p>SubTotal</p>
              <p>${0}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${0}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Total</p>
              <p>${0}</p>
            </div>
          </div>
          <button onClick={()=>navigate('/order')}>PROCEED TO CHECKOUT</button>
          </div>
        </div>
      </form>
  
  )
}

export default PlaceOrder
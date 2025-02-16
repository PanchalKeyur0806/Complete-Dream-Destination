import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'
function Footer() {
  return (
    <div className='footer' id='footer'>
        <div className="footer-content">
            <div className="footer-content-left">
                <img src={assets.logo} id='footerImg' alt=''/>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat in asperiores, ut natus tempora error minus quo saepe beatae quibusdam? Alias inventore, aperiam eaque quam nesciunt maxime sint quis blanditiis.</p>
                <div className="footer-social-icon">
                    <img src={assets.facebook_icon} al='' />
                    <img src={assets.twitter_icon} al='' />
                    <img src={assets.linkedin_icon} al='' />
                </div>
            </div>
          
            <div className="footer-content-center">
                <h2>Company</h2>
                <li>Home</li>
                <li>About Us</li>
                <li>Delivery</li>
                <li>Privacy policy</li>
            </div>
            <div className="footer-content-right">
                <h2>GET IN TOUCH</h2>
                <ul>
                    <li>+1 -212-456-7890</li>
                    <li>contact@tomato.com</li>
                  
                </ul>
            </div>
        </div>
        <hr/>
        <p className="footer-copy-right">
            copyright 2024 Tomato.com - All right Reserved  
        </p>
    </div>
  )
}

export default Footer
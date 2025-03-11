import React from 'react'
import { Link, useNavigate } from "react-router-dom";
import './Footer.css'
import { assets } from '../../assets/assets'
function Footer() {
    return (
        <div className='footer' id='footer'>
            <div className="footer-content">
                <div className="footer-content-left">
                    <img src={assets.logo} id='footerImg' alt='' />
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat in asperiores, ut natus tempora error minus quo saepe beatae quibusdam? Alias inventore, aperiam eaque quam nesciunt maxime sint quis blanditiis.</p>
                    <div className="footer-social-icon">
                        <img src={assets.facebook_icon} al='' />
                        <img src={assets.twitter_icon} al='' />
                        <img src={assets.linkedin_icon} al='' />
                    </div>
                </div>

                <div className="footer-content-center">
                    <h2>Company</h2>
                    <li>
                        <Link to="/">
                            <i>Home</i>
                        </Link>
                    </li>
                    <li>
                        <Link to="/tour">
                            <i>tours</i>
                        </Link>
                    </li>
                    <li>
                        <Link to="/aboutus">
                            <i>About us</i>
                        </Link>
                    </li>
                    <li>
                        <Link to="/contact">
                            <i>Contact us</i>
                        </Link>
                    </li>
                </div>
                <div className="footer-content-right">
                    <h2>GET IN TOUCH</h2>
                    <ul>
                        <li>+1 -212-456-7890</li>
                        <li>contact@tomato.com</li>

                    </ul>
                </div>
            </div>
            <hr />
            <p className="footer-copy-right">
                copyright 2025 Tomato.com - All right Reserved
            </p>
        </div>
    )
}

export default Footer
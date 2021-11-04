import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

import './customfooter.css';


const CustomFooter = () => {
    return (
        <div className="footer">
            <h3>Contact Me:</h3>
            <div className="footer-links">
                <div className="contact">
                    <a href="https://adoring-jepsen-9085c1.netlify.app/">Check out my Portfolio</a>
                </div>
                <div>
                    <ul className="social-media">
                        <li><a href="https://www.linkedin.com/in/joelle-lindsey/"><FontAwesomeIcon
                            icon={faLinkedin} /></a>
                        </li>
                        <li>
                            <a href="https://github.com/j-lindsey"><FontAwesomeIcon icon={faGithub} /></a>
                        </li>
                        <li>
                            <a href="mailto:joellelindsey28@gmail.com"><FontAwesomeIcon icon={faEnvelope} aria-hidden="true" /></a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default CustomFooter;
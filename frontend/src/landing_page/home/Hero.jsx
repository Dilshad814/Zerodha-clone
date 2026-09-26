import React from 'react';
import { Link } from 'react-router-dom';

function Hero() {
    return (
        <div className='container p-5 mb-5'>
            <div className='row text-center'>
                <img src='media/images/homeHero.png' alt='Hero Image' className='mb-5' />
                <h1 className='mt-5'>Invest in Everything</h1>
                <p>Online platform to invest in stocks, derivatives,mutual funds and more</p>
                <Link to="/signup" className='p-3 btn btn-primary fs-5 mb-5' style={{width:"20%",margin: "0 auto"}}>Signup Now</Link>
                <Link to="/dashboard" className='btn btn-outline-primary' style={{width:"20%",margin: "0 auto"}}>Open demo dashboard</Link>
            </div>
        </div>
      );
}

export default Hero;

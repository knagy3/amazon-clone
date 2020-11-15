import React,{useState} from 'react';
import { Link, useHistory } from 'react-router-dom';
import CheckoutProduct from './CheckoutProduct';
import "./Payment.css";
import { useStateValue } from './StateProvider';
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import CurrencyFormat from "react-currency-format";

function Payment() {
    // data layer
    const [{ basket, user }, dispatch] = useStateValue();

    // state functions
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');

    // stripe payment
    const [error, setError] = useState(null);
    const [disabled, setDisabled] = useState(true);
    const stripe = useStripe();
    const elements = useElements();
    const handleSubmit = (e) => {
        // do stripe stuff
        e.preventDefault();
        setProcessing(true);
    }
    const handleChange = (e) => {
        // Listen for changes in the CardElement
        // and display any errors as the customer types their card details
        setDisabled(e.empty);
        setError(e.error ? e.error.message : "");
    }
    

    // dynamic redirect
    const history = useHistory();

    return (
        <div className="payment">
            <div className='payment__container'>
                <h1>
                    Checkout (
                        <Link to="/checkout">{basket?.length} items</Link>
                        )
                </h1>

                {/* Payment section - delivery address */}
                <div className='payment__section'>
                    <div className='payment__title'>
                        <h3>Delivery Address</h3>
                    </div>
                    <div className='payment__address'>
                        <p>{user?.email}</p>
                        <label>Street: </label>
                        <input type='text' placeholder="123 React Lane" value={street} onChange={e => setStreet(e.target.value)}></input>
                        <label>City: </label>
                        <input type='text' placeholder="Los Angeles, CA" value={city} onChange={e => setCity(e.target.value)}></input>
                    </div>
                </div>

                {/* Payment section - Review Items */}
                <div className='payment__section'>
                    <div className='payment__title'>
                        <h3>Review items and delivery</h3>
                    </div>
                    <div className='payment__items'>
                        {basket.map(item => (
                            <CheckoutProduct
                                id={item.id}
                                title={item.title}
                                image={item.image}
                                price={item.price}
                                rating={item.rating}
                            />
                        ))}
                    </div>
                </div>

                 {/* Payment section - Payment method */}
                 <div className='payment__section'>
                    <div className="payment__title">
                        <h3>Payment Method</h3>
                    </div>
                    <div className="payment__details">
                        {/* Stripe magic will go here */}
                        <form onSubmit={handleSubmit}>
                            <CardElement onChange={handleChange}/>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Payment;

import React,{useState, useEffect} from 'react';
import { Link, useHistory } from 'react-router-dom';
import CheckoutProduct from './CheckoutProduct';
import "./Payment.css";
import { useStateValue } from './StateProvider';
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import CurrencyFormat from "react-currency-format";
import { getBasketTotal } from './reducer';
import axios from './axios';
import {database} from "./firebase"


function Payment() {
    // data layer
    const [{ basket, user }, dispatch] = useStateValue();

    // state functions
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');

    // stripe payment - state functions
    const [succeeded, setSucceeded] = useState(false);
    const [processing, setProcessing] = useState("");
    const [error, setError] = useState(null);
    const [disabled, setDisabled] = useState(true);
    const [clientSecret, setClientSecret] = useState(true);
    // stripe payment - inits
    const stripe = useStripe();
    const elements = useElements();
    // stripe payment - listener
    useEffect(() => {
        // generate the special stripe secret which allows us to charge a customer
        const getClientSecret = async () => {
            // needs axios before runs this code
            // axios: making requests like (POST, GET,..)
            const response = await axios({
                method: 'post',
                // Stripe expects the total in a currencies subunits (*100)
                url: `/payments/create?total=${getBasketTotal(basket) * 100}`
            });
            // Update the stripe secret
            setClientSecret(response.data.clientSecret)
        }

        getClientSecret();
    }, [basket]/*needs to create new secret key when the bakset changed*/)
    console.log('Secret is:', clientSecret);
    // stripe payment - handle functions
    const handleSubmit = async (e) => {
        // do stripe stuff
        e.preventDefault();
        setProcessing(true);

        const payload = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement)
            }
        }).then(({ paymentIntent }) => {
            // paymentIntent = payment confirmation

            database
              .collection('users')
              .doc(user?.uid)
              .collection('orders')
              .doc(paymentIntent.id)
              .set({
                  basket: basket,
                  amount: paymentIntent.amount,
                  created: paymentIntent.created
              });

            setSucceeded(true);
            setError(null);
            setProcessing(false);

            dispatch({
                type: 'EMPTY_BASKET'
            });

            history.replace('/orders');
        })
        
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

                            <div className='payment__priceContainer'>
                                    <CurrencyFormat
                                        renderText={(value) => (
                                            <h3>Order Total: {value}</h3>
                                        )}
                                        decimalScale={2}
                                        value={getBasketTotal(basket)}
                                        displayType={"text"}
                                        thousandSeparator={true}
                                        prefix={"$"}
                                    />
                                    <button disabled={processing || disabled || succeeded}>
                                        <span>{processing ? <p>Processing</p> : "Buy Now"}</span>
                                    </button>
                                </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Payment;

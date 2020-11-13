import React from 'react';
import { useState } from 'react';
import "./Product.css";
import { useStateValue } from './StateProvider';


function Product({ id, title, image, price, rating }) {
    // context API - data layer:
    const [state, dispatch] = useStateValue();
    const addToBasket = () => {
        //dispatch the item into the data layer, 
        // like a gun shoots the data into the d layer
        dispatch({
            type: "ADD_TO_BASKET",
            item: {
                title: title,
                image: image,
                price: price,
                rating: rating,
            },
            
        })
    }

    return (
        <div className="product">
            <div className="product__info">
                <p>{title}</p>
                <p className="product__price">
                    <small>$</small>
                    <strong>{price}</strong>
                </p>
                <div className="product__rating">
                    {Array(rating)
                        .fill()
                        .map((_, i) => (
                        <p>🌟</p>
                        ))}
                </div>
            </div>

            <img src={image} alt="" />

            <button onClick={addToBasket} >Add to Basket</button>
        </div>
    )
}

export default Product;

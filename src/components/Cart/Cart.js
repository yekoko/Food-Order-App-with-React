import React, { useContext, useState } from 'react';
import Modal from '../UI/Modal';
import CartContext from '../../store/cart-context';
import CartItem from './CartItem';
import classes from './Cart.module.css';
import Checkout from './Checkout';

const Cart = props => {
    const [isCheckout, setIsCheckout] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [didSumit, setDidSubmit] = useState(false);
    const cartCtx = useContext(CartContext);

    const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;
    const hasItem = cartCtx.items.length;

    const cartItemRemoveHandler = id => {
        cartCtx.removeItem(id);
    };
    const cartItemAddHandler = item => {
        cartCtx.addItem({ ...item, amount: 1})
    };

    const orderHandler = () => {
        setIsCheckout(true);
    };

    const checkoutOrderHandler = async (userData) => {
        setIsSubmitting(true);

        await fetch('https://react-http-8bbed-default-rtdb.asia-southeast1.firebasedatabase.app/orders.json', {
            method: 'POST',
            body: JSON.stringify({
                user: userData,
                orderItems: cartCtx.items
            })
        });

        setIsSubmitting(false);
        setDidSubmit(true);
        cartCtx.clearCart();
    };

    const cartItems = (
        <ul className={classes['cart-items']}>
            {cartCtx.items.map(item => 
                <CartItem 
                    key={item.id} 
                    name={item.name} 
                    amount={item.amount} 
                    price={item.price} 
                    onRemove={cartItemRemoveHandler.bind(null, item.id)}
                    onAdd={cartItemAddHandler.bind(null, item)}
                />
            )}
        </ul>
    );

    const modalActions = (
        <div className={classes.actions}>
            <button className={classes['button--alt']} onClick={props.onClose} >Close</button>
            {hasItem > 0 && <button className={classes.button} onClick={orderHandler}>Order</button>}
        </div>
    );
    
    const cartModalContent = (
        <React.Fragment>
            {cartItems}
            <div className={classes.total}>
                <span>Total Amount</span>
                <span>{totalAmount}</span>
            </div>
            {isCheckout && <Checkout onCancel={props.onClose} onCheckout={checkoutOrderHandler}></Checkout>}
            {!isCheckout && modalActions}
        </React.Fragment>
    );

    const isSubmittingModalContent = (
        <p>Sending order data....</p>
    );

    const didSubmitModalContent = (
        <React.Fragment>
            <p>Successfully checkout the order!</p>
            <div className={classes.actions}>
                <button className={classes.button} onClick={props.onClose} >Close</button>
            </div>
        </React.Fragment>
    );

    return (
        <Modal onClose={props.onClose}>
            {!isSubmitting && !didSumit && cartModalContent}
            {isSubmitting && isSubmittingModalContent}
            {!isSubmitting && didSumit && didSubmitModalContent}
        </Modal>
    );
};

export default Cart;
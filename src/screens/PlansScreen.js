import React, { useEffect, useState } from 'react';
import './PlansScreen.css';
import db from '../firebase';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/userSlice';
import { loadStripe } from '@stripe/stripe-js';

function PlansScreen() {
  const [products, setProducts] = useState([]);
  const user = useSelector(selectUser);
  const [subscription, setSubscription] = useState(null);

  // Fetch user subscription
  useEffect(() => {
    if (user?.uid) {
      db.collection('customers')
        .doc(user.uid)
        .collection('payments')
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(subscriptionDoc => {
            const data = subscriptionDoc.data();
            setSubscription({
              role: data.role,
              current_period_end: data.current_period_end?.seconds || null,
              current_period_start: data.current_period_start?.seconds || null,
            });
          });
        })
        .catch(error => console.error('Error fetching subscription:', error));
    }
  }, [user?.uid]);

  // Fetch products
  useEffect(() => {
    db.collection('products')
      .where('active', '==', true)
      .get()
      .then(querySnapshot => {
        const products = {};
        querySnapshot.forEach(async productDoc => {
          products[productDoc.id] = productDoc.data();

          const priceSnap = await productDoc.ref.collection('prices').get();
          priceSnap.docs.forEach(price => {
            products[productDoc.id].prices = {
              priceId: price.id,
              priceData: price.data(),
            };
          });
        });
        setProducts(products);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, []);  // Removed unnecessary dependency

  console.log(products);
  console.log(subscription);

  const loadCheckout = async (priceId) => {
    try {
      const docRef = await db
        .collection('customers')
        .doc(user.uid)
        .collection('checkout_sessions')
        .add({
          price: priceId,
          success_url: window.location.origin,
          cancel_url: window.location.origin,
        });

      docRef.onSnapshot(async (snap) => {
        const { error, sessionId } = snap.data();

        if (error) {
          alert(`An error occurred: ${error.message}`);
        }

        if (sessionId) {
          const stripe = await loadStripe('pk_test_51PsO8XP0MivcStrRqqNT4CzPG8QOnGNR9v6dCjA9k1MxN15Kamb7dkAQRDb4hqRQCN25jvQVJMnhApcCJFeOM4Zk00XRNsJwLU');
          stripe.redirectToCheckout({ sessionId });
        }
      });
    } catch (error) {
      console.error('Error loading checkout:', error);
    }
  };

  return (
    <div className='plansScreen'>
      <br/>
      {subscription && <p>Renewal date: {new Date(subscription?.current_period_end * 1000).toLocaleDateString()}</p>}
      {Object.entries(products).map(([productId, productData]) => {
        const isCurrentPackage = productData.name?.toLowerCase().includes(subscription?.role);

        return (
          <div className={`${isCurrentPackage && 'plansScreen__plan--disabled'} plansScreen__plan`} key={productId}>
            <div className='plansScreen__info'>
              <h5>{productData.name}</h5>
              <h6>{productData.description}</h6>
            </div>
            <button onClick={() => !isCurrentPackage && loadCheckout(productData.prices.priceId)}>
              {isCurrentPackage ? 'Current Package' : 'Subscribe'}
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default PlansScreen;


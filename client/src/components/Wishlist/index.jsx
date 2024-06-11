// client/src/pages/Wishlist.jsx
import React from 'react';
import { useStoreContext } from '../../utils/GlobalState';
import { Link } from 'react-router-dom';
import { REMOVE_FROM_WISHLIST } from '../../utils/actions';
import { idbPromise } from '../../utils/helpers';

const Wishlist = () => {
  const [state, dispatch] = useStoreContext();
  const { wishlist } = state;

  const removeFromWishlist = (id) => {
    dispatch({
      type: REMOVE_FROM_WISHLIST,
      _id: id,
    });
    idbPromise('wishlist', 'delete', { _id: id });
  };

  return (
    <div>
      <h2>My Wishlist</h2>
      {wishlist.length ? (
        <div className="flex-row">
          {wishlist.map((item) => (
            <div key={item._id} className="card px-1 py-1">
              <Link to={`/products/${item._id}`}>
                <img alt={item.name} src={`/images/${item.image}`} />
                <p>{item.name}</p>
              </Link>
              <div>
                <div>{item.quantity} item(s) in stock</div>
                <span>${item.price}</span>
              </div>
              <button onClick={() => removeFromWishlist(item._id)}>
                Remove from Wishlist
              </button>
            </div>
          ))}
        </div>
      ) : (
        <h3>You have no wishlist items</h3>
      )}
    </div>
  );
};

export default Wishlist;


// client/src/pages/Favorites.jsx
import React from 'react';
import { useStoreContext } from '../utils/GlobalState';
import { Link } from 'react-router-dom';
import { REMOVE_FROM_FAVORITES } from '../utils/actions';
import { idbPromise } from '../utils/helpers';

const Favorites = () => {
  const [state, dispatch] = useStoreContext();
  const { favorites } = state;

  const removeFromFavorites = (id) => {
    dispatch({
      type: REMOVE_FROM_FAVORITES,
      _id: id,
    });
    idbPromise('favorites', 'delete', { _id: id });
  };

  return (
    <div>
      <h2>My Favorites</h2>
      {favorites.length ? (
        <div className="flex-row">
          {favorites.map((item) => (
            <div key={item._id} className="card px-1 py-1">
              <Link to={`/products/${item._id}`}>
                <img src={`/images/${item.image}`} alt={item.name} />
                <p>{item.name}</p>
              </Link>
              <div>
                <div>{item.quantity} item(s) in stock</div>
                <span>${item.price}</span>
              </div>
              <button onClick={() => removeFromFavorites(item._id)}>
                Remove from Favorites
              </button>
            </div>
          ))}
        </div>
      ) : (
        <h3>You have no favorite items</h3>
      )}
    </div>
  );
};

export default Favorites;



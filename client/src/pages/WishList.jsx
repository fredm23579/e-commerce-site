import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { QUERY_WISHLIST } from '../../utils/queries';
import { idbPromise } from '../../utils/helpers';
import { useStoreContext } from '../../utils/GlobalState';
import { UPDATE_WISHLIST } from '../../utils/actions';
import ProductItem from '../ProductItem';

const Wishlist = () => {
  const [state, dispatch] = useStoreContext();
  const { loading, data } = useQuery(QUERY_WISHLIST);

  useEffect(() => {
    if (data) {
      dispatch({
        type: UPDATE_WISHLIST,
        wishlist: data.wishlist,
      });
      data.wishlist.forEach((product) => {
        idbPromise('wishlist', 'put', product);
      });
    } else if (!loading) {
      idbPromise('wishlist', 'get').then((wishlist) => {
        dispatch({
          type: UPDATE_WISHLIST,
          wishlist: wishlist,
        });
      });
    }
  }, [data, loading, dispatch]);

  return (
    <div>
      <h2>My Wishlist</h2>
      {state.wishlist.length ? (
        <div className="flex-row">
          {state.wishlist.map((product) => (
            <ProductItem key={product._id} item={product} />
          ))}
        </div>
      ) : (
        <h3>You haven't added any items to your wishlist yet!</h3>
      )}
    </div>
  );
};

export default Wishlist;

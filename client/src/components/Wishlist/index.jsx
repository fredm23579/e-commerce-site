import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_USER } from '../../utils/queries';
import { REMOVE_FROM_WISHLIST } from '../../utils/mutations';

const Wishlist = () => {
  const { loading, data } = useQuery(QUERY_USER);
  const [removeFromWishlist] = useMutation(REMOVE_FROM_WISHLIST);

  const user = data?.user || {};

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await removeFromWishlist({
        variables: { productId },
        refetchQueries: [{ query: QUERY_USER }],
      });
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Wishlist</h2>
      {user.wishlist.map((product) => (
        <div key={product._id}>
          <h3>{product.name}</h3>
          <button onClick={() => handleRemoveFromWishlist(product._id)}>
            Remove from Wishlist
          </button>
        </div>
      ))}
    </div>
  );
};

export default Wishlist;

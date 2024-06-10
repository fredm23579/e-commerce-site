// client/src/pages/Wishlist.jsx
import React, { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { QUERY_WISHLIST } from "../utils/queries";
import { idbPromise } from "../utils/helpers";
import { useStoreContext } from "../utils/GlobalState";

const Wishlist = () => {
  const { loading, data } = useQuery(QUERY_WISHLIST);
  const [state, dispatch] = useStoreContext();

  useEffect(() => {
    if (data) {
      dispatch({ type: "UPDATE_WISHLIST", wishlist: data.wishlist });
      data.wishlist.forEach((item) => {
        idbPromise("wishlist", "put", item);
      });
    } else if (!loading) {
      idbPromise("wishlist", "get").then((wishlist) => {
        dispatch({ type: "UPDATE_WISHLIST", wishlist });
      });
    }
  }, [data, loading, dispatch]);

  return (
    <div>
      <h2>My Wishlist</h2>
      {state.wishlist.length ? (
        <div>
          {state.wishlist.map((item) => (
            <div key={item._id}>
              <p>{item.name}</p>
              <p>{item.price}</p>
            </div>
          ))}
        </div>
      ) : (
        <h3>You have no items in your wishlist!</h3>
      )}
    </div>
  );
};

export default Wishlist;

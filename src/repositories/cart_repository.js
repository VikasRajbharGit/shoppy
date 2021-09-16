const handleCartAdd = (fsContext, cartContextRef, props) => {
  if (fsContext.user != 0) {
    const ref = fsContext.fs
      .collection(`react/ecommerce/users/${fsContext.user.uid}/cart`)
      .doc(`${props.product.id}`);
    ref.get().then((docSnapshot) => {
      var d = new Date();
      if (docSnapshot.exists) {
        let prevQuantity = docSnapshot.data().quantity;
        // console.log("----------q " + `${prevQuantity}`);
        ref.set({
          id: props.product.id,
          timeStamp: Date.now(),
          quantity: prevQuantity + 1,
          price: props.product.price,
        });
      } else {
        ref.set({
          id: props.product.id,
          timeStamp: Date.now(),
          quantity: 1,
          price: props.product.price,
        });
      }
    });

    if (cartContextRef.cart.products.includes(props.product.id)) {
      cartContextRef.setCart((prev) => {
        const temp = prev.products;
        // const index = temp.indexOf(props.product.id);
        // temp.splice(index, 1);
        let tempQuants = prev.productsQuantities;
        tempQuants[props.product.id] = tempQuants[props.product.id] + 1;
        return {
          total: prev.total + props.product.price,
          productCount: prev.productCount + 1,
          products: temp,
          productsQuantities: tempQuants,
        };
      });
    } else {
      cartContextRef.setCart((prev) => {
        const temp = prev.products;

        temp.push(props.product.id);
        let tempQuants = prev.productsQuantities;
        tempQuants[props.product.id] = 0;

        return {
          total: prev.total + props.product.price,
          productCount: prev.productCount + 1,
          products: temp,
          productsQuantities: tempQuants,
        };
      });
    }
  }
};

const handleCartRemove = (fsContext, cartContextRef, props) => {
  if (fsContext.user != 0) {
    const ref = fsContext.fs
      .collection(`react/ecommerce/users/${fsContext.user.uid}/cart`)
      .doc(`${props.product.id}`);
    ref.get().then((docSnapshot) => {
      if (docSnapshot.exists) {
        let prevQuantity = docSnapshot.data().quantity;
        // console.log("----------q " + `${prevQuantity}`);
        if (prevQuantity <= 1) {
          ref.delete();
        } else {
          ref.set({
            id: props.product.id,
            timeStamp: Date.now(),
            quantity: prevQuantity - 1,
            price: props.product.price,
          });
        }
      }
      // else {
      //   var d = new Date();
      //   let prevQuantity = docSnapshot.quantity;
      //   ref.set({ id: props.product.id, timeStamp: Date.now(), quantity: 1 });
      // }
    });

    if (cartContextRef.cart.products.includes(props.product.id)) {
      cartContextRef.setCart((prev) => {
        const temp = prev.products;
        const index = temp.indexOf(props.product.id);
        temp.splice(index, 1);
        let tempQuants = prev.productsQuantities;
        tempQuants[props.product.id] = tempQuants[props.product.id] - 1;
        return {
          total: prev.total - props.product.price,
          productCount: prev.productCount - 1,
          products: temp,
          productsQuantities: tempQuants,
        };
      });
    }
    // else {
    //   cartContextRef.setCart((prev) => {
    //     const temp = prev.products;

    //     if (!temp.includes(props.product.id)) {
    //       temp.push(props.product.id);
    //     }

    //     return {
    //       total: prev.total + props.product.price,
    //       productCount: prev.productCount + 1,
    //       products: temp,
    //     };
    //   });
    // }
  }
};

const handleFavoruite = (fsContext, props, op) => {
  if (fsContext.user != 0) {
    const ref = fsContext.fs
      .collection(`react/ecommerce/users/${fsContext.user.uid}/favourites`)
      .doc(`${props.product.id}`);
    if (op === "add") {
      ref.set({ id: props.product.id, favorite: true });
    } else if (op === "remove") {
      ref.delete();
    }
  }
};

export { handleCartAdd, handleCartRemove, handleFavoruite };

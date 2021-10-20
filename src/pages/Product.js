import { useState, useContext, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  Grid,
  Heading,
  Image,
  ResponsiveContext,
  Text,
  Paragraph,
} from "grommet";
import { ThemeContext } from "../context/ThemeContext";
import { Cart, Favorite } from "grommet-icons";
import axios from "axios";
import { useParams } from "react-router-dom";
import Skeleton from "react-loading-skeleton";

export default function Product({
  updateCart,
  cartProducts,
  showSidebar,
  user,
  openNotif,
}) {
  const { slug } = useParams();
  const size = useContext(ResponsiveContext);
  const { theme } = useContext(ThemeContext);
  const [unsaved, setUnsaved] = useState(true);
  const [data, setData] = useState({});
  useEffect(() => {
    (async () => {
      try {
        const res = await axios
          .get(process.env.REACT_APP_BACKEND + "product/" + slug)
          .catch((err) => {
            throw err;
          });
        if (res) setData(res.data);
        if (res && user) {
          const saved = await axios
            .get(
              process.env.REACT_APP_BACKEND +
                "saved/" +
                user._id +
                "/" +
                res.data._id
            )
            .catch((err) => {
              throw err;
            });
          if (saved) setUnsaved(!saved.data.saved);
        } else setUnsaved(true);
      } catch (err) {
        openNotif(err.message, "error");
      }
    })();
  }, [slug, user, openNotif]);
  const saveProduct = useCallback(
    async (itemid) => {
      try {
        if (user._id) {
          const res = await axios
            .post(process.env.REACT_APP_BACKEND + "save_product", {
              userid: user._id,
              product: itemid,
            })
            .catch((err) => {
              throw err;
            });
          if (res) return res.data;
        }
      } catch (err) {
        console.log(err.message);
      }
    },
    [user]
  );
  const handleSave = useCallback(
    async (itemid) => {
      const token = await saveProduct(itemid);
      if (user._id) {
        if (token) {
          if (token.saved) {
            openNotif("Product Saved", "ok");
            setUnsaved(false);
          } else openNotif("Error", "error");
        } else openNotif("Error", "error");
      } else openNotif("You have to login first", "warning");
    },
    [saveProduct, openNotif, user]
  );
  const deleteSavedProduct = useCallback(
    async (itemid) => {
      if (user._id) {
        const res = await axios.post(
          process.env.REACT_APP_BACKEND + "delete_saved",
          {
            userid: user._id,
            product: itemid,
          }
        );
        return res.data;
      }
    },
    [user]
  );
  const handleDeleteSaved = useCallback(
    async (itemid) => {
      const token = await deleteSavedProduct(itemid);
      if (token.deleted) {
        openNotif("Unsaved Product", "ok");
        setUnsaved(true);
      } else {
        openNotif("Error", "error");
      }
    },
    [deleteSavedProduct, openNotif]
  );
  return (
    <>
      <Grid
        columns={size !== "small" ? ["30%", "70%"] : ["100%"]}
        pad={size !== "small" ? "medium" : "small"}
      >
        <Box border={{ color: "dark-2" }} responsive>
          {data.name ? (
            <Image
              fit="contain"
              fill="horizontal"
              src="/assets/Wilderpeople_Ricky.jpg"
            />
          ) : (
            <Skeleton width={390} height={250} />
          )}
        </Box>
        <Box pad="small">
          <Heading margin={{ vertical: "small" }} level="2" responsive>
            {data.name || <Skeleton />}
          </Heading>
          <Heading margin={{ vertical: "none" }} level="4" responsive>
            {(data.brand && "by " + data.brand) || <Skeleton />}
          </Heading>
          <Text margin={{ bottom: "small" }}>
            {(data.price && `Price: $${data.price.toFixed(2)}`) || <Skeleton />}
          </Text>
          <Paragraph fill>{data.description}</Paragraph>
          <Box direction={size !== "small" ? "row" : "column"} gap="medium">
            {data._id ? (
              <Button
                size="small"
                icon={<Cart color={theme === "dark" ? "accent-1" : "plain"} />}
                label="Add to Cart"
                onClick={() => {
                  let x = cartProducts.findIndex(
                    (prod) => prod._id === data._id
                  );
                  if (x === -1) {
                    let item1 = data;
                    item1.qty = 1;
                    updateCart([...cartProducts, item1]);
                  } else {
                    let item1 = cartProducts[x];
                    item1.qty += 1;
                    let newCart = cartProducts;
                    newCart.splice(x, 1, item1);
                    updateCart(newCart);
                  }
                  showSidebar(true);
                }}
              />
            ) : (
              <Skeleton width={158} height={36} />
            )}
            {!unsaved ? (
              <Button
                size="small"
                color="red"
                icon={<Favorite />}
                primary
                label={
                  <Text color="dark-1" size="small">
                    Saved
                  </Text>
                }
                onClick={() => handleDeleteSaved(data._id)}
              />
            ) : (
              <Button
                color="red"
                size="small"
                icon={<Favorite color="red" />}
                label={
                  <Text color="red" size="small">
                    Save
                  </Text>
                }
                onClick={() => handleSave(data._id)}
              />
            )}
          </Box>
        </Box>
      </Grid>
      <Box
        border={{ color: "light-4" }}
        pad="small"
        margin={size !== "small" ? "medium" : "small"}
        height="small"
      >
        <Text>You may also like...</Text>
      </Box>
    </>
  );
}

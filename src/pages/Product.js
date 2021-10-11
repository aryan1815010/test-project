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
import { Cart, Favorite } from "grommet-icons";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function Product({
  setCart,
  cartProducts,
  showSidebar,
  user,
  openNotif,
}) {
  const { slug } = useParams();
  const size = useContext(ResponsiveContext);
  const [unsaved, setUnsaved] = useState(true);
  const [data, setData] = useState({ price: 0 });
  useEffect(() => {
    (async () => {
      const res = await axios.get("http://localhost:3001/product/" + slug);
      setData(res.data);
      if (user) {
        const saved = await axios.get(
          "http://localhost:3001/saved/" + user._id + "/" + res.data._id
        );
        setUnsaved(!saved.data.saved);
      } else setUnsaved(true);
    })();
  }, [slug, user]);
  const saveProduct = useCallback(
    async (itemid) => {
      if (user._id) {
        const res = await axios.post("http://localhost:3001/save_product", {
          userid: user._id,
          product: itemid,
        });
        return res.data;
      }
    },
    [user]
  );
  const handleSave = useCallback(
    async (itemid) => {
      const token = await saveProduct(itemid);
      if (user._id) {
        if (token.saved) {
          openNotif("Product Saved", "ok");
          setUnsaved(false);
        } else {
          openNotif("Error occured. Try again later.", "error");
        }
      } else openNotif("You have to login first", "warning");
    },
    [saveProduct, openNotif, user]
  );
  const deleteSavedProduct = useCallback(
    async (itemid) => {
      if (user._id) {
        const res = await axios.post("http://localhost:3001/delete_saved", {
          userid: user._id,
          product: itemid,
        });
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
          <Image
            fit="contain"
            fill="horizontal"
            src="/assets/Wilderpeople_Ricky.jpg"
          />
        </Box>
        <Box pad="small">
          <Heading margin={{ vertical: "small" }} level="2" responsive>
            {data.name}
          </Heading>
          <Text margin={{ bottom: "small" }}>
            Price: ${data.price.toFixed(2)}
          </Text>
          <Paragraph fill>{data.description}</Paragraph>
          <Box direction={size !== "small" ? "row" : "column"} gap="medium">
            <Button
              size="small"
              icon={<Cart color="#E5C453" />}
              label="Add to Cart"
              onClick={() => {
                let x = cartProducts.findIndex((prod) => prod._id === data._id);
                if (x === -1) {
                  let item1 = data;
                  item1.qty = 1;
                  setCart([...cartProducts, item1]);
                } else {
                  let item1 = cartProducts[x];
                  item1.qty += 1;
                  let newCart = cartProducts;
                  newCart.splice(x, 1, item1);
                  setCart(newCart);
                }
                showSidebar(true);
              }}
            />
            {!unsaved ? (
              <Button
                size="small"
                color="#E95065"
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
                color="#E95065"
                size="small"
                icon={<Favorite color="#E95065" />}
                label={
                  <Text color="#E95065" size="small">
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

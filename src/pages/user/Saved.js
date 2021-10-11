import { useState, useContext, useEffect } from "react";
import { Box, Grid, ResponsiveContext, Text } from "grommet";
import axios from "axios";
import ProductCard from "../../components/ProductCard";

export default function Saved({
  setCart,
  cartProducts,
  showSidebar,
  user,
  openNotif,
}) {
  const [saved, setSaved] = useState([]);
  const size = useContext(ResponsiveContext);
  useEffect(() => {
    (async () => {
      const products = await axios.get(
        "http://localhost:3001/saved/" + user._id
      );
      setSaved(products.data);
    })();
  }, [user._id]);
  return saved.length > 0 ? (
    <Box pad="large">
      <Grid columns={size !== "small" ? "1/4" : "100%"} gap="medium">
        {saved.map((item) => (
          <ProductCard
            item={item.product}
            setCart={setCart}
            cartProducts={cartProducts}
            showSidebar={showSidebar}
            user={user}
            openNotif={openNotif}
            key={item._id}
          />
        ))}
      </Grid>
      <Box
        border={{ color: "light-4" }}
        pad="small"
        margin={size !== "small" ? "medium" : "small"}
        height="small"
      >
        <Text>You may also like...</Text>
      </Box>
    </Box>
  ) : (
    <>
      <Box align="center" pad="large">
        <Text>No saved products</Text>
      </Box>
      <Box
        height="medium"
        border={{ color: "light-4" }}
        pad="small"
        margin="small"
      >
        <Text>You may like...</Text>
      </Box>
    </>
  );
}

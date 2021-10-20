import { useState, useContext, useEffect } from "react";
import { Box, Grid, ResponsiveContext, Text } from "grommet";
import axios from "axios";
import ProductCard from "../../components/ProductCard";

export default function Saved({
  updateCart,
  cartProducts,
  showSidebar,
  user,
  openNotif,
}) {
  const [saved, setSaved] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const size = useContext(ResponsiveContext);
  useEffect(() => {
    (async () => {
      try {
        const products = await axios
          .get(process.env.REACT_APP_BACKEND + "saved/" + user._id)
          .catch((err) => {
            throw err;
          });
        if (products) {
          setSaved(products.data);
          setIsLoaded(true);
        }
      } catch (error) {
        openNotif(error.message, "error");
      }
    })();
  }, [user._id, openNotif]);
  if (isLoaded)
    return saved.length > 0 ? (
      <Box pad="large">
        <Grid columns={size !== "small" ? "1/4" : "100%"} gap="medium">
          {saved.map((item) => (
            <ProductCard
              item={item.product}
              updateCart={updateCart}
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
  else
    return (
      <Box pad="large">
        <Grid columns={size !== "small" ? "1/4" : "100%"} gap="medium">
          {Array(4)
            .fill({ name: "", price: -1 })
            .map((item, index) => (
              <ProductCard
                item={item}
                updateCart={updateCart}
                cartProducts={cartProducts}
                showSidebar={showSidebar}
                user={user}
                openNotif={openNotif}
                key={index}
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
    );
}

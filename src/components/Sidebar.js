import { useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import {
  Box,
  Anchor,
  Button,
  Heading,
  Image,
  Layer,
  ResponsiveContext,
  Text,
  List,
} from "grommet";
import { FormClose, Trash, AddCircle, SubtractCircle } from "grommet-icons";

export default function Sidebar({ showSidebar, cartProducts, setCart }) {
  const size = useContext(ResponsiveContext);
  const history = useHistory();
  return (
    <Layer
      position="right"
      full="vertical"
      modal
      onClickOutside={() => showSidebar(false)}
      onEsc={() => showSidebar(false)}
      responsive
    >
      <Box width="medium" height="100%" overflow="auto">
        <Box
          background="light-2"
          tag="header"
          justify="end"
          align="center"
          direction="row"
        >
          <Button icon={<FormClose />} onClick={() => showSidebar(false)} />
        </Box>
        {cartProducts.products.length < 1 ? (
          <Box alignSelf="center" align="center" fill background="light-2">
            <Text>Your cart is empty.</Text>
          </Box>
        ) : (
          <Box fill background="light-2">
            <List data={cartProducts.products}>
              {(product) => (
                <Box
                  gap="small"
                  direction={size === "small" ? "column" : "row"}
                >
                  <Box
                    height="xsmall"
                    width={size !== "small" ? "30%" : undefined}
                  >
                    <Image
                      fill
                      fit="cover"
                      src="/assets/Wilderpeople_Ricky.jpg"
                    />
                  </Box>
                  <Box justify="between">
                    <Text truncate>
                      <Anchor
                        as={Link}
                        to={"/product/" + product.slug}
                        onClick={() => showSidebar(false)}
                      >
                        {product.name}{" "}
                      </Anchor>
                    </Text>
                    <Text>${(product.price * product.qty).toFixed(2)}</Text>
                    <Box direction="row">
                      <Button
                        pad={{ vertical: "none" }}
                        icon={<SubtractCircle />}
                        onClick={() => {
                          let x = cartProducts.products.findIndex(
                            (prod) => prod._id === product._id
                          );
                          let item1 = cartProducts.products[x];
                          item1.qty -= 1;
                          let newCart = cartProducts.products;
                          if (item1.qty === 0) newCart.splice(x, 1);
                          else newCart.splice(x, 1, item1);
                          setCart(newCart);
                        }}
                      />
                      <Heading
                        margin={{ vertical: "none" }}
                        level="3"
                        alignSelf="center"
                      >
                        {product.qty}
                      </Heading>
                      <Button
                        pad={{ vertical: "none" }}
                        icon={<AddCircle />}
                        onClick={() => {
                          let x = cartProducts.products.findIndex(
                            (prod) => prod._id === product._id
                          );
                          let item1 = cartProducts.products[x];
                          item1.qty += 1;
                          let newCart = cartProducts.products;
                          newCart.splice(x, 1, item1);
                          setCart(newCart);
                        }}
                      />
                      <Button
                        pad={{ vertical: "none" }}
                        onClick={() => {
                          let newCart = cartProducts.products.filter(
                            (prod) => prod._id !== product._id
                          );
                          setCart(newCart);
                        }}
                        icon={<Trash color="red" />}
                      />
                    </Box>
                  </Box>
                </Box>
              )}
            </List>
            <Text alignSelf="center">Total: ${cartProducts.totalAmt}</Text>
            <Box
              direction={size === "small" ? "column" : "row"}
              justify="between"
              gap="small"
              margin="small"
              responsive
            >
              <Button
                size="small"
                label={
                  <Text color="black" size="small">
                    Continue Shopping
                  </Text>
                }
                onClick={() => showSidebar(false)}
              />
              <Button
                size="small"
                label={
                  <Text color="black" size="small">
                    Proceed to Checkout
                  </Text>
                }
                onClick={() => {
                  showSidebar(false);
                  history.push("/checkout");
                }}
              />
            </Box>
          </Box>
        )}
      </Box>
    </Layer>
  );
}

import { useContext, useCallback } from "react";
import { useHistory, Link } from "react-router-dom";
import {
  Box,
  Button,
  Grid,
  Heading,
  Image,
  ResponsiveContext,
  Text,
  List,
  Form,
  FormField,
  TextArea,
  Anchor,
} from "grommet";
import { Trash, AddCircle, SubtractCircle } from "grommet-icons";
import axios from "axios";
import useForm from "../useForm";

export default function Checkout({
  user,
  cartProducts,
  updateCart,
  totalAmt,
  openNotif,
}) {
  const size = useContext(ResponsiveContext);
  const history = useHistory();
  const createOrder = useCallback(
    async (orderDetails) => {
      const d = new Date();
      if (!user._id) openNotif("You have to login first", "warning");
      else {
        if (user.activated !== 1)
          openNotif("You have to activate your account first", "warning");
        else {
          try {
            const token = await axios
              .post(process.env.REACT_APP_BACKEND + "add_order", {
                user: user._id,
                products: cartProducts,
                address: orderDetails.address.replace(/\n/g, "<br />"),
                orderdate: d.getTime(),
                total: totalAmt,
              })
              .catch((err) => {
                throw err;
              });
            if (token && token.data.ordered) {
              updateCart([]);
              history.push("/ordered/" + token.data.orderid);
            } else {
              openNotif("Error occured. Order not placed.", "error");
            }
          } catch (err) {
            openNotif("Error", "error");
          }
        }
      }
    },
    [cartProducts, history, updateCart, openNotif, totalAmt, user]
  );
  const { handleChange, handleSubmit, values, setValues } =
    useForm(createOrder);
  return (
    <>
      {cartProducts.length < 1 ? (
        <Box alignSelf="center" pad="medium" align="center" fill>
          <Text>Your cart is empty.</Text>
          <Button
            size="small"
            label="Continue Shopping"
            onClick={() => history.push("/products")}
          />
        </Box>
      ) : (
        <Grid columns={size !== "small" ? ["70%", "30%"] : "100%"}>
          <Box fill pad="medium">
            <Heading level={2}>Checkout Page</Heading>
            <Form
              onReset={() => {
                setValues({});
              }}
              onSubmit={handleSubmit}
            >
              <FormField label="Address" name="address" required>
                <TextArea
                  name="address"
                  value={values.address || ""}
                  onChange={handleChange}
                />
              </FormField>
              {cartProducts.length > 0 && (
                <Box
                  direction="row"
                  justify="between"
                  margin={{ top: "medium" }}
                >
                  <Button type="submit" label="Place Order" size="small" />
                  <Button
                    type="reset"
                    label={
                      <Text color="red" size="small">
                        Reset
                      </Text>
                    }
                    size="small"
                    color="red"
                  />
                </Box>
              )}
            </Form>
          </Box>
          <Box fill pad="small">
            <List data={cartProducts}>
              {(product) => (
                <Box
                  gap="small"
                  direction={size === "small" ? "column" : "row"}
                >
                  <Box height="xsmall">
                    <Image
                      fill="vertical"
                      fit="cover"
                      src="/assets/Wilderpeople_Ricky.jpg"
                    />
                  </Box>
                  <Box justify="between">
                    <Text truncate>
                      <Anchor as={Link} to={"/product/" + product.slug}>
                        {product.name}{" "}
                      </Anchor>
                    </Text>
                    <Text>${(product.price * product.qty).toFixed(2)}</Text>
                    <Box direction="row" width="xsmall">
                      <Button
                        pad={{ vertical: "none" }}
                        icon={<SubtractCircle />}
                        onClick={() => {
                          let x = cartProducts.findIndex(
                            (prod) => prod._id === product._id
                          );
                          let item1 = cartProducts[x];
                          item1.qty -= 1;
                          let newCart = cartProducts;
                          if (item1.qty === 0) newCart.splice(x, 1);
                          else newCart.splice(x, 1, item1);
                          updateCart(newCart);
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
                          let x = cartProducts.findIndex(
                            (prod) => prod._id === product._id
                          );
                          let item1 = cartProducts[x];
                          item1.qty += 1;
                          let newCart = cartProducts;
                          newCart.splice(x, 1, item1);
                          updateCart(newCart);
                        }}
                      />
                      <Button
                        pad={{ vertical: "none" }}
                        onClick={() => {
                          let newCart = cartProducts.filter(
                            (prod) => prod._id !== product._id
                          );
                          updateCart(newCart);
                        }}
                        icon={<Trash color="#E95065" />}
                      />
                    </Box>
                  </Box>
                </Box>
              )}
            </List>
            <Text alignSelf="center">
              Total: ${Number(totalAmt).toFixed(2)}
            </Text>
          </Box>
        </Grid>
      )}
      <Grid
        rows={["small", "small"]}
        columns={["50%", "50%"]}
        pad="small"
        areas={[
          { name: "header", start: [0, 0], end: [1, 0] },
          { name: "nav", start: [0, 1], end: [0, 1] },
          { name: "main", start: [1, 1], end: [1, 1] },
        ]}
      >
        <Box gridArea="header" pad="medium">
          <Text>You may also like</Text>
        </Box>
        <Box gridArea="nav" border="right" pad="medium">
          <Text>Others who bought this also bought</Text>
        </Box>
        <Box gridArea="main" border="left" pad="medium">
          <Text>Trending</Text>
        </Box>
      </Grid>
    </>
  );
}

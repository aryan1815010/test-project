import { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Box,
  Grid,
  Heading,
  Image,
  ResponsiveContext,
  Text,
  List,
  Anchor,
} from "grommet";
import axios from "axios";

export default function Thanks({ openNotif }) {
  const size = useContext(ResponsiveContext);
  const { orderId } = useParams();
  const [order, setOrder] = useState({});
  useEffect(
    () =>
      (async () => {
        try {
          const res = await axios
            .get(process.env.REACT_APP_BACKEND + "order/" + orderId)
            .catch((err) => {
              throw err;
            });
          if (res) setOrder(res.data);
        } catch (err) {
          openNotif(err.message, "error");
        }
      })(),
    [orderId, openNotif]
  );
  return (
    <>
      <Heading level="1" alignSelf="center">
        Order Placed.
      </Heading>
      <Box fill pad="small" align="center">
        <List data={order.products}>
          {(product) => (
            <Box gap="small" direction={size === "small" ? "column" : "row"}>
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
                  <Heading
                    margin={{ vertical: "none" }}
                    level="3"
                    alignSelf="center"
                  >
                    x{product.qty}
                  </Heading>
                </Box>
              </Box>
            </Box>
          )}
        </List>
        <Text alignSelf="center">Total: ${Number(order.total).toFixed(2)}</Text>
      </Box>
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

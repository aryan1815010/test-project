import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Heading,
  Text,
  List,
  Pagination,
  Image,
  Grid,
  ResponsiveContext,
  Anchor,
} from "grommet";
import axios from "axios";
import Skeleton from "react-loading-skeleton";

export default function Orders({ userid, openNotif }) {
  const [orders, setOrders] = useState([]);
  const [currentData, setCurrentData] = useState([]);
  const [indices, setIndices] = useState([0, 5]);
  const [isLoaded, setIsLoaded] = useState(false);
  const size = useContext(ResponsiveContext);
  const handleChange = ({ startIndex, endIndex }) => {
    const nextData = orders.slice(startIndex, endIndex);
    setCurrentData(nextData);
    setIndices([startIndex, Math.min(endIndex, orders.length)]);
  };
  useEffect(() => {
    (async () => {
      try {
        const res = await axios
          .get(process.env.REACT_APP_BACKEND + "orders/" + userid)
          .catch((error) => {
            throw error;
          });
        if (res) {
          setOrders(res.data);
          setCurrentData(res.data.slice(0, 5));
          setIndices([0, Math.min(5, res.data.length)]);
          setIsLoaded(true);
        }
      } catch (error) {
        openNotif(error.message, "error");
      }
    })();
  }, [userid, openNotif]);
  if (isLoaded)
    return orders.length > 0 ? (
      <>
        <Grid columns={size !== "small" ? ["50%", "50%"] : "100%"} pad="small">
          <Box pad="small">
            <Heading level={2}>Orders</Heading>
            <List data={currentData}>
              {(datum) => {
                const odate = new Date(datum.orderdate);
                return (
                  <Box
                    direction={size !== "small" ? "row" : "column"}
                    gap="small"
                    pad="small"
                    key={datum._id}
                  >
                    <Box justify="between">
                      <Text>
                        {odate.getFullYear()}-
                        {("0" + odate.getMonth()).slice(-2)}-
                        {("0" + odate.getDate()).slice(-2)}
                      </Text>
                      <Text>Total: ${datum.total.toFixed(2)}</Text>
                    </Box>
                    <Box gap="small">
                      {datum.products.map((product) => (
                        <Box
                          key={product._id}
                          direction={size !== "small" ? "row" : "column"}
                          gap="small"
                        >
                          <Box height="xsmall">
                            <Image
                              fill="vertical"
                              fit="cover"
                              src="/assets/Wilderpeople_Ricky.jpg"
                            />
                          </Box>
                          <Box pad={{ vertical: "small" }}>
                            <Anchor as={Link} to={"/product/" + product.slug}>
                              <Heading level={4} margin={{ top: "none" }}>
                                {product.name}
                              </Heading>
                            </Anchor>
                            <Text>
                              {product.qty}x ${product.price.toFixed(2)}
                            </Text>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                );
              }}
            </List>
            <Box align="center" gap="small" direction="row">
              <Text>
                Showing {indices[0] + 1} - {indices[1]} of {orders.length}
              </Text>
              <Pagination
                size="small"
                numberItems={orders.length}
                onChange={handleChange}
                step={5}
              />
            </Box>
          </Box>
          <Box pad="medium" margin="medium" border={{ color: "light-1" }}>
            <Heading level={3}>Have an issue?</Heading>
            <Text>Contact us</Text>
          </Box>
        </Grid>
        <Box pad="medium" margin="medium" border={{ color: "light-1" }}>
          <Heading level={3}>Shop More</Heading>
          <Text>Check this out</Text>
        </Box>
      </>
    ) : (
      <>
        <Box align="center" pad="large">
          <Heading level={3}>Orders</Heading>
          <Text>No orders found.</Text>
        </Box>
        <Box
          height="medium"
          border={{ color: "light-4" }}
          pad="small"
          margin="small"
        >
          <Text>Start Ordering</Text>
        </Box>
      </>
    );
  else
    return (
      <>
        <Grid columns={size !== "small" ? ["50%", "50%"] : "100%"} pad="small">
          <Box pad="small">
            <Heading level={2}>Orders</Heading>
            <List
              data={Array(4).fill({
                _id: 0,
                total: 0,
                products: Array(1).fill({
                  _id: 123,
                  name: "",
                  qty: 0,
                  price: 0,
                }),
              })}
            >
              {(datum) => {
                return (
                  <Box
                    direction={size !== "small" ? "row" : "column"}
                    gap="small"
                    pad="small"
                    key={datum._id}
                  >
                    <Box justify="between">
                      <Text>
                        <Skeleton height={24} width={110} />
                      </Text>
                      <Text>
                        <Skeleton height={24} width={110} />
                      </Text>
                    </Box>
                    <Box gap="small">
                      {datum.products.map((product) => (
                        <Box
                          key={product._id}
                          direction={size !== "small" ? "row" : "column"}
                          gap="small"
                        >
                          <Box height="xsmall">
                            <Skeleton height={96} width={144} />
                          </Box>
                          <Box pad={{ vertical: "small" }}>
                            <Heading level={4} margin={{ top: "none" }}>
                              <Skeleton height={24} width={250} />
                            </Heading>
                            <Text>
                              <Skeleton height={24} width={250} />
                            </Text>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                );
              }}
            </List>
            {orders.length > 5 && (
              <Box align="center" gap="small" direction="row">
                <Text>
                  Showing {indices[0] + 1} - {indices[1]} of {orders.length}
                </Text>
                <Pagination
                  size="small"
                  numberItems={orders.length}
                  onChange={handleChange}
                  step={5}
                />
              </Box>
            )}
          </Box>
          <Box pad="medium" margin="medium" border={{ color: "light-1" }}>
            <Heading level={3}>Have an issue?</Heading>
            <Text>Contact us</Text>
          </Box>
        </Grid>
        <Box pad="medium" margin="medium" border={{ color: "light-1" }}>
          <Heading level={3}>Shop More</Heading>
          <Text>Check this out</Text>
        </Box>
      </>
    );
}

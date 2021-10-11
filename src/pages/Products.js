import { useState, useContext, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  Collapsible,
  Grid,
  Heading,
  Pagination,
  ResponsiveContext,
  Text,
  CheckBoxGroup,
  Stack,
  RangeSelector,
  TextInput,
} from "grommet";
import axios from "axios";
import ProductCard from "../components/ProductCard";

export default function Products({
  setCart,
  cartProducts,
  showSidebar,
  user,
  openNotif,
}) {
  const [range, setRange] = useState([100, 800]);
  const size = useContext(ResponsiveContext);
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentData, setCurrentData] = useState([]);
  const [indices, setIndices] = useState([0, 6]);
  const [openFilters, setOpenFilters] = useState(false);
  useEffect(() => {
    (async () => {
      const res = await axios.get("http://localhost:3001/products");
      setData(res.data);
      setFilteredData(res.data);
      setIsLoaded(true);
      setCurrentData(res.data.slice(0, 6));
      setIndices([0, Math.min(6, res.data.length)]);
    })();
  }, []);

  const handlePagination = useCallback(
    ({ startIndex, endIndex }) => {
      const nextData = filteredData.slice(startIndex, endIndex);
      setCurrentData(nextData);
      setIndices([startIndex, Math.min(endIndex, filteredData.length)]);
    },
    [filteredData]
  );

  const onFilter = useCallback(
    ({ range }) => {
      setRange(range);
      let newData = data.filter(
        (item) => item.price > range[0] && item.price < range[1]
      );
      setFilteredData(newData);
      handlePagination({
        startIndex: 0,
        endIndex: Math.min(6, newData.length),
      });
    },
    [data, handlePagination]
  );
  return (
    <>
      <Grid
        columns={size !== "small" ? ["20%", "80%"] : ["100%"]}
        pad={size !== "small" ? "medium" : "small"}
      >
        {size !== "small" ? (
          <Box border={{ color: "dark-2" }} pad="small" fill={false}>
            <Text>Showing {filteredData.length} results.</Text>
            <Heading level={3}>Price</Heading>
            <Box gap="small">
              <Stack>
                <Box background="light-4" height="6px" direction="row" />
                <RangeSelector
                  direction="horizontal"
                  min={100}
                  max={900}
                  step={50}
                  values={range}
                  onChange={(nextRange) => {
                    onFilter({ range: nextRange });
                  }}
                />
              </Stack>
              <Box align="center" direction="row">
                <TextInput
                  value={range[0]}
                  onChange={(e) =>
                    onFilter({ range: [Number(e.target.value), range[1]] })
                  }
                  icon={<Text>$</Text>}
                />
                <Text> - </Text>
                <TextInput
                  value={range[1]}
                  onChange={(e) =>
                    onFilter({ range: [range[0], Number(e.target.value)] })
                  }
                  icon={<Text>$</Text>}
                />
              </Box>
            </Box>
            <Heading level={3}>Placeholder</Heading>
            <CheckBoxGroup options={["A", "B", "C"]} />
          </Box>
        ) : (
          <Box>
            <Text>Showing {filteredData.length} results.</Text>
            <Button
              onClick={() => setOpenFilters(!openFilters)}
              label="Filters"
              fill="horizontal"
              margin={{ vertical: "small" }}
            />
            <Collapsible open={openFilters}>
              <Box border={{ color: "dark-2" }} margin="small" pad="small">
                <Heading level={3}>Price</Heading>
                <Box gap="small">
                  <Stack>
                    <Box background="light-4" height="6px" direction="row" />
                    <RangeSelector
                      size="small"
                      direction="horizontal"
                      min={100}
                      max={900}
                      step={50}
                      values={range}
                      onChange={(nextRange) => {
                        onFilter({ range: nextRange });
                      }}
                    />
                  </Stack>
                  <Box align="center" direction="row">
                    <TextInput
                      value={range[0]}
                      onChange={(e) =>
                        onFilter({ range: [Number(e.target.value), range[1]] })
                      }
                      icon={<Text>$</Text>}
                    />
                    <Text> - </Text>
                    <TextInput
                      value={range[1]}
                      onChange={(e) =>
                        onFilter({ range: [range[0], Number(e.target.value)] })
                      }
                      icon={<Text>$</Text>}
                    />
                  </Box>
                </Box>
                <Heading level={3}>Placeholder</Heading>
                <CheckBoxGroup options={["A", "B", "C"]} />
              </Box>
            </Collapsible>
          </Box>
        )}
        <Box pad={size !== "small" ? { horizontal: "medium" } : 0}>
          <Grid columns={size !== "small" ? "1/3" : "50%"} gap="small">
            {isLoaded
              ? currentData.map((item) => (
                  <ProductCard
                    item={item}
                    setCart={setCart}
                    cartProducts={cartProducts}
                    showSidebar={showSidebar}
                    user={user}
                    openNotif={openNotif}
                    key={item._id}
                  />
                ))
              : Array(6)
                  .fill({ name: "Loading...", price: 0 })
                  .map((item, index) => (
                    <ProductCard
                      item={item}
                      setCart={setCart}
                      cartProducts={cartProducts}
                      showSidebar={showSidebar}
                      user={user}
                      openNotif={openNotif}
                      key={index}
                    />
                  ))}
          </Grid>
          <Box
            align="center"
            alignSelf="center"
            gap="small"
            direction="row"
            pad="medium"
          >
            <Text>
              Showing {indices[0] + 1} - {indices[1]} of {filteredData.length}
            </Text>
            <Pagination
              size="small"
              numberItems={filteredData.length}
              onChange={handlePagination}
              step={6}
            />
          </Box>
        </Box>
      </Grid>
    </>
  );
}

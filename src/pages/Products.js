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
import useDebounce from "../useDebounce";

export default function Products({
  updateCart,
  cartProducts,
  showSidebar,
  user,
  openNotif,
}) {
  const [filters, setFilters] = useState({ range: [100, 900], brand: [] });
  const size = useContext(ResponsiveContext);
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState({
    products: [],
    totalItems: 0,
    currentPage: 0,
  });
  const [openFilters, setOpenFilters] = useState(false);
  const debouncedSearch = useDebounce(filters, 500);
  useEffect(() => {
    if (debouncedSearch) handlePagination({ page: 1 });
  }, [debouncedSearch]);

  const handlePagination = useCallback(
    async ({ page }) => {
      try {
        const res = await axios
          .get(
            process.env.REACT_APP_BACKEND +
              "products?size=6&page=" +
              (page - 1) +
              "&price=" +
              filters.range.toString() +
              "&brand=" +
              filters.brand.toString()
          )
          .catch((err) => {
            throw err;
          });
        if (res) {
          setData(res.data);
          setIsLoaded(true);
        }
      } catch (err) {
        openNotif(err.message, "error");
      }
    },
    [openNotif, filters]
  );

  return (
    <>
      <Grid
        columns={size !== "small" ? ["20%", "80%"] : ["100%"]}
        pad={size !== "small" ? "medium" : "small"}
      >
        {size !== "small" ? (
          <Box border={{ color: "dark-2" }} pad="small" fill={false}>
            <Text>Showing {data.totalItems} results.</Text>
            <Heading level={3}>Price</Heading>
            <Box gap="small">
              <Stack>
                <Box background="light-4" height="6px" direction="row" />
                <RangeSelector
                  direction="horizontal"
                  min={100}
                  max={900}
                  step={50}
                  values={filters.range}
                  onChange={(nextRange) => {
                    setFilters({ ...filters, range: nextRange });
                  }}
                />
              </Stack>
              <Box align="center" direction="row">
                <TextInput
                  value={filters.range[0]}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      range: [Number(e.target.value), filters.range[1]],
                    })
                  }
                  icon={<Text>$</Text>}
                />
                <Text> - </Text>
                <TextInput
                  value={filters.range[1]}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      range: [filters.range[0], Number(e.target.value)],
                    })
                  }
                  icon={<Text>$</Text>}
                />
              </Box>
            </Box>
            <Heading level={3}>Brand</Heading>
            <CheckBoxGroup
              options={["A", "B", "C"]}
              value={filters.brand}
              onChange={({ value: nextValue }) =>
                setFilters({ ...filters, brand: nextValue })
              }
            />
          </Box>
        ) : (
          <Box>
            <Text>Showing {data.totalItems} results.</Text>
            <Button
              onClick={() => setOpenFilters(!openFilters)}
              label="Filters"
              fill="horizontal"
              margin={{ vertical: "small" }}
            />
            <Collapsible open={openFilters}>
              <Box border={{ color: "dark-2" }} margin="small" pad="small">
                <Heading level={3} responsive>
                  Price
                </Heading>
                <Box gap="small">
                  <Stack>
                    <Box background="light-4" height="6px" direction="row" />
                    <RangeSelector
                      size="small"
                      direction="horizontal"
                      min={100}
                      max={900}
                      step={50}
                      values={filters.range}
                      onChange={(nextRange) => {
                        setFilters({ ...filters, range: nextRange });
                      }}
                    />
                  </Stack>
                  <Box align="center" direction="row">
                    <TextInput
                      value={filters.range[0]}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          range: [Number(e.target.value), filters.range[1]],
                        })
                      }
                      icon={<Text>$</Text>}
                    />
                    <Text> to </Text>
                    <TextInput
                      value={filters.range[1]}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          range: [filters.range[0], Number(e.target.value)],
                        })
                      }
                      icon={<Text>$</Text>}
                    />
                  </Box>
                </Box>
                <Heading level={3} responsive>
                  Brand
                </Heading>
                <CheckBoxGroup
                  options={["A", "B", "C"]}
                  value={filters.brand}
                  onChange={({ value: nextValue }) =>
                    setFilters({ ...filters, brand: nextValue })
                  }
                />
              </Box>
            </Collapsible>
          </Box>
        )}
        <Box pad={size !== "small" ? { horizontal: "medium" } : 0}>
          <Grid columns={size !== "small" ? "1/3" : "50%"} gap="small">
            {isLoaded
              ? data.products.map((item) => (
                  <ProductCard
                    item={item}
                    updateCart={updateCart}
                    cartProducts={cartProducts}
                    showSidebar={showSidebar}
                    user={user}
                    openNotif={openNotif}
                    key={item._id}
                  />
                ))
              : Array(3)
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
            align="center"
            alignSelf="center"
            gap="small"
            direction="row"
            pad="medium"
          >
            <Text size="small">
              Showing{" "}
              {data.currentPage * 6 +
                1 +
                " - " +
                (data.currentPage * 6 + data.products.length)}{" "}
              of {data.totalItems}
            </Text>
            <Pagination
              size="small"
              numberItems={data.totalItems}
              step={6}
              onChange={handlePagination}
              page={data.currentPage}
            />
          </Box>
        </Box>
      </Grid>
    </>
  );
}

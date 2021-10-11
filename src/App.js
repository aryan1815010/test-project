import { useState, useCallback } from "react";
import { BrowserRouter, Switch, Route, Redirect, Link } from "react-router-dom";
import {
  Grommet,
  Box,
  Anchor,
  Button,
  Collapsible,
  Footer,
  Heading,
  Layer,
  Nav,
  ResponsiveContext,
  Text,
  DropButton,
  Avatar,
} from "grommet";
import {
  FormClose,
  Cart,
  FacebookOption,
  Instagram,
  Twitter,
  User,
} from "grommet-icons";

import Login from "./components/Login";
import Logout from "./components/Logout";
import NavSearch from "./components/NavSearch";
import Sidebar from "./components/Sidebar";

import Home from "./pages/Home";
import Products from "./pages/Products";
import Product from "./pages/Product";
import Checkout from "./pages/Checkout";
import Thanks from "./pages/Thanks";
import Activated from "./pages/Activated";
import About from "./pages/About";
import Contact from "./pages/Contact";

import Orders from "./pages/user/Orders";
import Saved from "./pages/user/Saved";
import Profile from "./pages/user/Profile";

const theme = {
  global: {
    colors: {
      brand: "#222222",
      "accent-1": "#E5C453",
      focus: "#E5C453",
      //text: '#B3B8BC',
    },
    focus: {
      outline: {
        size: "0",
      },
    },
    font: {
      family: "Arial",
      size: "14px",
    },
  },
  button: {
    color: "#E5C453",
  },
};

export default function App() {
  //const [darkMode, setDarkMode] = useState(true);
  const [sidebar, showSidebar] = useState(false);
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState({
    login: false,
    token: "",
    userobj: { name: "" },
  });
  const [notif, setNotif] = useState({ open: false, message: "", status: "" });
  const [cartProducts, setCartProducts] = useState({
    products: [],
    totalQty: 0,
    totalAmt: 0,
  });
  const setCart = useCallback((arr) => {
    localStorage.setItem("cartProducts", JSON.stringify(arr));
    let qty = 0,
      amt = 0;
    arr.forEach((item) => {
      qty += item.qty;
      amt += item.qty * item.price;
    });
    setCartProducts({ products: arr, totalQty: qty, totalAmt: amt.toFixed(2) });
  }, []);
  const logoutUser = useCallback(() => {
    localStorage.removeItem("token");
    setCart([]);
    setToken({
      login: false,
      token: "",
      userobj: { name: "" },
    });
  }, [setCart]);
  if (
    cartProducts.products.length === 0 &&
    localStorage.getItem("cartProducts") &&
    localStorage.getItem("cartProducts") !== "[]"
  ) {
    setCart(JSON.parse(localStorage.getItem("cartProducts")));
  }
  if (!token.login && localStorage.getItem("token")) {
    const token1 = JSON.parse(localStorage.getItem("token"));
    setToken(token1);
  }
  const openNotif = useCallback((message, status) => {
    setNotif({ open: true, message: message, status: status });
    setTimeout(() => setNotif({ open: false, message: "", status: "" }), 3000);
  }, []);
  return (
    <BrowserRouter>
      <Grommet theme={theme} full themeMode="dark">
        <ResponsiveContext.Consumer>
          {(size) => (
            <>
              <Box
                tag="header"
                direction="row"
                align="center"
                justify="between"
                background="brand"
                pad={{ left: "small", right: "small", vertical: "xxsmall" }}
                elevation="medium"
                style={{ zIndex: "1" }}
                responsive
              >
                <Heading level="3" margin="none">
                  Eg. Title
                </Heading>
                {size !== "small" && (
                  <Nav direction="row" pad="medium">
                    <Anchor as={Link} label="Home" to="/" hoverIndicator />
                    <Anchor
                      as={Link}
                      label="Products"
                      to="/products"
                      hoverIndicator
                    />
                  </Nav>
                )}
                {size !== "small" && <NavSearch />}

                <Box gap="small" direction="row">
                  {size !== "small" ? (
                    <DropButton
                      dropProps={{
                        align: { top: "bottom", right: "right" },
                        background: "brand",
                        elevation: "none",
                        border: { color: "light-2" },
                      }}
                      open={open}
                      onOpen={() => setOpen(true)}
                      onClose={() => setOpen(false)}
                      dropContent={
                        !token.login ? (
                          <Login setToken={setToken} openNotif={openNotif} />
                        ) : (
                          <Logout
                            logoutUser={logoutUser}
                            uname={token.userobj.name}
                          />
                        )
                      }
                    >
                      {!token.login ? (
                        <Avatar background="light-1">
                          <User color="dark-1" />
                        </Avatar>
                      ) : (
                        <Avatar background="light-1">
                          <Text>{token.userobj.name[0]}</Text>
                        </Avatar>
                      )}
                    </DropButton>
                  ) : (
                    <Button onClick={() => setOpen(!open)}>
                      {!token.login ? (
                        <Avatar background="light-1">
                          <User color="dark-1" />
                        </Avatar>
                      ) : (
                        <Avatar background="light-1">
                          <Text>{token.userobj.name[0]}</Text>
                        </Avatar>
                      )}
                    </Button>
                  )}
                  <Button
                    icon={<Cart />}
                    onClick={() => showSidebar(!sidebar)}
                    badge={
                      cartProducts.products.length > 0
                        ? cartProducts.totalQty
                        : false
                    }
                  />
                </Box>
              </Box>
              {size === "small" && (
                <>
                  <Box background="brand">
                    <Collapsible open={open}>
                      {!token.login ? (
                        <Login setToken={setToken} openNotif={openNotif} />
                      ) : (
                        <Logout
                          logoutUser={logoutUser}
                          uname={token.userobj.name}
                        />
                      )}
                    </Collapsible>
                  </Box>
                  <Box
                    tag="header"
                    direction="row"
                    align="center"
                    background="brand"
                    margin={{ left: "auto" }}
                    elevation="medium"
                    style={{ zIndex: "1" }}
                  >
                    <Nav direction="row" fill="horizontal" pad="medium">
                      <Anchor as={Link} label="Home" to="/" hoverIndicator />
                      <Anchor
                        as={Link}
                        label="Products"
                        to="/products"
                        hoverIndicator
                      />
                    </Nav>
                  </Box>
                  <NavSearch />
                </>
              )}
              <Box flex direction="row">
                <Box fill background={"dark-1"}>
                  <Switch>
                    <Route path="/products">
                      <Products
                        setCart={setCart}
                        cartProducts={cartProducts.products}
                        showSidebar={showSidebar}
                        user={token.userobj}
                        openNotif={openNotif}
                      />
                    </Route>
                    <Route path="/product/:slug">
                      <Product
                        setCart={setCart}
                        cartProducts={cartProducts.products}
                        showSidebar={showSidebar}
                        user={token.userobj}
                        openNotif={openNotif}
                      />
                    </Route>
                    <Route path="/checkout">
                      <Checkout
                        setCart={setCart}
                        cartProducts={cartProducts.products}
                        totalAmt={cartProducts.totalAmt}
                        user={token.userobj}
                        openNotif={openNotif}
                      />
                    </Route>
                    <Route path="/ordered/:orderId">
                      <Thanks />
                    </Route>
                    <Route path="/about">
                      <About />
                    </Route>
                    <Route path="/contact">
                      <Contact />
                    </Route>
                    <Route path="/activated/:token">
                      <Activated />
                    </Route>
                    <Route path="/user/orders">
                      {token.login ? (
                        <Orders userid={token.userobj._id} />
                      ) : (
                        <Redirect to="/" />
                      )}
                    </Route>
                    <Route path="/user/saved">
                      {token.login ? (
                        <Saved
                          setCart={setCart}
                          cartProducts={cartProducts.products}
                          showSidebar={showSidebar}
                          user={token.userobj}
                          openNotif={openNotif}
                        />
                      ) : (
                        <Redirect to="/" />
                      )}
                    </Route>
                    <Route path="/user/profile">
                      {token.login ? (
                        <Profile openNotif={openNotif} setToken={setToken} />
                      ) : (
                        <Redirect to="/" />
                      )}
                    </Route>
                    <Route path="/">
                      <Home />
                    </Route>
                  </Switch>
                </Box>
                {sidebar && (
                  <Sidebar
                    showSidebar={showSidebar}
                    cartProducts={cartProducts}
                    setCart={setCart}
                  />
                )}
              </Box>
              <Footer
                background="brand"
                pad="small"
                direction={size === "small" ? "column" : "row"}
              >
                <Box align="center" direction="row" gap="xsmall">
                  <Text alignSelf="center" size="xsmall">
                    © Copyright Eg. Title
                  </Text>
                </Box>
                <Box direction="row" gap="xxsmall" justify="center">
                  <Anchor href="#" icon={<Instagram />} />
                  <Anchor href="#" icon={<FacebookOption />} />
                  <Anchor href="#" icon={<Twitter />} />
                </Box>
                <Box direction="row" gap="small" justify="center">
                  <Anchor
                    as={Link}
                    label="About us"
                    to="/about"
                    hoverIndicator
                  />
                  <Anchor as={Link} to="/contact" label="Contact us" />
                </Box>
              </Footer>
              {notif.open && (
                <Layer
                  position="bottom"
                  modal={false}
                  onEsc={() =>
                    setNotif({ open: false, message: "", status: "" })
                  }
                  plain
                >
                  <Box
                    align="center"
                    direction="row"
                    gap="small"
                    justify="between"
                    round="medium"
                    elevation="medium"
                    pad={{ vertical: "xsmall", horizontal: "small" }}
                    border={{ color: "status-" + notif.status }}
                    background="brand"
                  >
                    <Text color={"status-" + notif.status}>
                      {notif.message} (this will close after 3 seconds)
                    </Text>
                    <Button
                      icon={<FormClose color={"status-" + notif.status} />}
                      onClick={() =>
                        setNotif({ open: false, message: "", status: "" })
                      }
                      plain
                    />
                  </Box>
                </Layer>
              )}
            </>
          )}
        </ResponsiveContext.Consumer>
      </Grommet>
    </BrowserRouter>
  );
}

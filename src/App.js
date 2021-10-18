import { useState, useCallback, useEffect } from "react";
import { BrowserRouter, Switch, Route, Redirect, Link } from "react-router-dom";
import {
  Grommet,
  Box,
  Anchor,
  Button,
  Collapsible,
  Footer,
  Heading,
  Header,
  Layer,
  Nav,
  ResponsiveContext,
  Text,
  DropButton,
  Avatar,
  grommet,
} from "grommet";
import { deepMerge } from "grommet/utils";
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

import { UserContext } from "./context/UserContext";
import { ThemeContext, ThemeSwitcher } from "./context/ThemeContext";

const themes = {
  global: {
    colors: {
      background: { dark: "#222222" },
      pageBackground: { dark: "dark-1", light: "#FFFFFF" },
      brand: { dark: "#222222", light: "#000000" },
      "accent-1": { dark: "#E5C453" },
      focus: { dark: "#E5C453" },
      red: { dark: "#E95065", light: "status-error" },
      //text: { dark: "#9C9C9C" },
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
    color: { dark: "#E5C453" },
  },
};

export default function App() {
  const [theme, setTheme] = useState("dark");
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
  useEffect(() => {
    const handleToken = () => {
      setToken(
        JSON.parse(localStorage.getItem("token")) || {
          login: false,
          token: "",
          userobj: { name: "" },
        }
      );
    };

    window.addEventListener("storage", handleToken);
    return () => window.removeEventListener("storage", handleToken);
  }, []);
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
      <ThemeContext.Provider value={{ theme, setTheme }}>
        <Grommet theme={deepMerge(grommet, themes)} full themeMode={theme}>
          <ResponsiveContext.Consumer>
            {(size) => (
              <>
                <Box elevation="medium">
                  <Header
                    background="background"
                    responsive
                    pad={{ horizontal: "small" }}
                  >
                    <Heading level="3" margin="none">
                      Eg. Title
                    </Heading>
                    <ThemeSwitcher />
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
                            background: "background",
                            elevation: "none",
                            border: { color: "light-2" },
                          }}
                          open={open}
                          onOpen={() => setOpen(true)}
                          onClose={() => setOpen(false)}
                          dropContent={
                            !token.login ? (
                              <Login
                                setToken={setToken}
                                openNotif={openNotif}
                              />
                            ) : (
                              <UserContext.Provider value={token.userobj.name}>
                                <Logout logoutUser={logoutUser} />
                              </UserContext.Provider>
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
                  </Header>
                  {size === "small" && (
                    <>
                      <Box background="background">
                        <Collapsible open={open}>
                          {!token.login ? (
                            <Login setToken={setToken} openNotif={openNotif} />
                          ) : (
                            <UserContext.Provider value={token.userobj.name}>
                              <Logout logoutUser={logoutUser} />
                            </UserContext.Provider>
                          )}
                        </Collapsible>
                      </Box>
                      <Nav direction="row" fill="horizontal" pad="medium">
                        <Anchor as={Link} label="Home" to="/" hoverIndicator />
                        <Anchor
                          as={Link}
                          label="Products"
                          to="/products"
                          hoverIndicator
                        />
                      </Nav>
                      <NavSearch />
                    </>
                  )}
                </Box>
                <Box flex fill="horizontal" background="pageBackground">
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
                    <Route path="/login">
                      {!token.login ? (
                        <Box
                          align="center"
                          pad={size !== "small" ? "xlarge" : "small"}
                        >
                          <Login setToken={setToken} openNotif={openNotif} />
                        </Box>
                      ) : (
                        <Redirect to="/" />
                      )}
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
                <Footer
                  background="background"
                  pad="small"
                  direction={size === "small" ? "column" : "row"}
                  elevation="medium"
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
                      background="background"
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
      </ThemeContext.Provider>
    </BrowserRouter>
  );
}

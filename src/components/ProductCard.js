import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Heading,
  Image,
  Text,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Anchor,
} from "grommet";
import { Cart, Favorite } from "grommet-icons";
import axios from "axios";
import Skeleton from "react-loading-skeleton";

export default function ProductCard({
  item,
  updateCart,
  cartProducts,
  showSidebar,
  user,
  openNotif,
}) {
  const [unsaved, setUnsaved] = useState(true);
  useEffect(() => {
    if (user._id) {
      (async () => {
        try {
          const res = await axios
            .get(
              process.env.REACT_APP_BACKEND +
                "saved/" +
                user._id +
                "/" +
                item._id
            )
            .catch((err) => {
              throw err;
            });
          if (res) setUnsaved(!res.data.saved);
        } catch (err) {
          console.log(err.message);
        }
      })();
    } else setUnsaved(true);
  }, [item._id, user]);
  const saveProduct = useCallback(
    async (itemid) => {
      try {
        if (user._id) {
          const res = await axios
            .post(process.env.REACT_APP_BACKEND + "save_product", {
              userid: user._id,
              product: itemid,
            })
            .catch((err) => {
              throw err;
            });
          if (res) return res.data;
        }
      } catch (err) {
        console.log(err.message);
      }
    },
    [user]
  );
  const handleSave = useCallback(
    async (itemid) => {
      const token = await saveProduct(itemid);
      if (user._id) {
        if (token) {
          if (token.saved) {
            openNotif("Product Saved", "ok");
            setUnsaved(false);
          } else openNotif("Error", "error");
        } else openNotif("Error", "error");
      } else openNotif("You have to login first", "warning");
    },
    [saveProduct, openNotif, user]
  );
  const deleteSavedProduct = useCallback(
    async (itemid) => {
      try {
        const res = await axios
          .post(process.env.REACT_APP_BACKEND + "delete_saved", {
            userid: user._id,
            product: itemid,
          })
          .catch((err) => {
            throw err;
          });
        if (res) return res.data;
      } catch (err) {
        console.log(err.message);
      }
    },
    [user]
  );
  const handleDeleteSaved = useCallback(
    async (itemid) => {
      const token = await deleteSavedProduct(itemid);
      if (token) {
        if (token.deleted) {
          openNotif("Unsaved Product", "ok");
          setUnsaved(true);
        } else {
          openNotif("Error", "error");
        }
      } else openNotif("Error", "error");
    },
    [deleteSavedProduct, openNotif]
  );
  if (item.name !== "")
    return (
      <Card background="background" elevation="none">
        <CardHeader height="small">
          <Image fit="contain" src="/assets/Wilderpeople_Ricky.jpg" />
        </CardHeader>
        <CardBody pad={{ horizontal: "medium" }}>
          <Anchor as={Link} to={"/product/" + item.slug}>
            <Heading
              margin={{ bottom: "small" }}
              level="3"
              truncate
              textAlign="center"
              responsive
            >
              {item.name || <Skeleton height={32} />}
            </Heading>
          </Anchor>
          <Heading
            margin={{ vertical: "none" }}
            level="5"
            truncate
            textAlign="center"
            responsive
          >
            {(item.brand && "by " + item.brand) || <Skeleton height={22} />}
          </Heading>
          <Text size="small" textAlign="center" margin={{ bottom: "small" }}>
            {(item.price && `Price: $${item.price.toFixed(2)}`) || (
              <Skeleton height={20} />
            )}
          </Text>
        </CardBody>
        <CardFooter pad="small" border={{ color: "light-4", side: "top" }}>
          <Button
            icon={<Cart />}
            label="Add to Cart"
            plain
            onClick={() => {
              let x = cartProducts.findIndex((prod) => prod._id === item._id);
              if (x === -1) {
                let item1 = item;
                item1.qty = 1;
                updateCart([...cartProducts, item1]);
              } else {
                let item1 = cartProducts[x];
                item1.qty += 1;
                let newCart = cartProducts;
                newCart.splice(x, 1, item1);
                updateCart(newCart);
              }
              showSidebar(true);
            }}
          />
          {!unsaved ? (
            <Button
              color="red"
              icon={<Favorite color="red" />}
              label="Saved"
              plain
              onClick={() => handleDeleteSaved(item._id)}
            />
          ) : (
            <Button
              icon={<Favorite color="red" />}
              label="Save"
              plain
              onClick={() => handleSave(item._id)}
            />
          )}
        </CardFooter>
      </Card>
    );
  else
    return (
      <Card background="background" elevation="none">
        <Skeleton height={200} />
        <CardBody pad={{ horizontal: "medium" }}>
          <Heading
            margin={{ bottom: "small" }}
            level="3"
            truncate
            textAlign="center"
            responsive
          >
            <Skeleton height={32} />
          </Heading>
          <Heading
            margin={{ vertical: "none" }}
            level="5"
            truncate
            textAlign="center"
            responsive
          >
            <Skeleton height={22} />
          </Heading>
          <Text size="small" textAlign="center" margin={{ bottom: "small" }}>
            <Skeleton height={20} />
          </Text>
        </CardBody>
        <CardFooter border={{ color: "light-4", side: "top" }} />
        <Skeleton />
      </Card>
    );
}

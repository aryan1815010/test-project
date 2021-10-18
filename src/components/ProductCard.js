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

export default function ProductCard({
  item,
  setCart,
  cartProducts,
  showSidebar,
  user,
  openNotif,
}) {
  const [unsaved, setUnsaved] = useState(true);
  useEffect(() => {
    if (user._id) {
      (async () => {
        const res = await axios.get(
          "http://localhost:3001/saved/" + user._id + "/" + item._id
        );
        setUnsaved(!res.data.saved);
      })();
    } else setUnsaved(true);
  }, [item._id, user]);
  const saveProduct = useCallback(
    async (itemid) => {
      if (user._id) {
        const res = await axios.post("http://localhost:3001/save_product", {
          userid: user._id,
          product: itemid,
        });
        return res.data;
      }
    },
    [user]
  );
  const handleSave = useCallback(
    async (itemid) => {
      const token = await saveProduct(itemid);
      if (user._id) {
        if (token.saved) {
          openNotif("Product Saved", "ok");
          setUnsaved(false);
        } else {
          openNotif("Error occured. Try again later.", "error");
        }
      } else openNotif("You have to login first", "warning");
    },
    [saveProduct, openNotif, user]
  );
  const deleteSavedProduct = useCallback(
    async (itemid) => {
      const res = await axios.post("http://localhost:3001/delete_saved", {
        userid: user._id,
        product: itemid,
      });
      return res.data;
    },
    [user]
  );
  const handleDeleteSaved = useCallback(
    async (itemid) => {
      const token = await deleteSavedProduct(itemid);
      if (token.deleted) {
        openNotif("Unsaved Product", "ok");
        setUnsaved(true);
      } else {
        openNotif("Error", "error");
      }
    },
    [deleteSavedProduct, openNotif]
  );
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
            {item.name}
          </Heading>
        </Anchor>
        <Text size="small" textAlign="center" margin={{ bottom: "small" }}>
          Price: ${item && item.price.toFixed(2)}
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
              setCart([...cartProducts, item1]);
            } else {
              let item1 = cartProducts[x];
              item1.qty += 1;
              let newCart = cartProducts;
              newCart.splice(x, 1, item1);
              setCart(newCart);
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
}

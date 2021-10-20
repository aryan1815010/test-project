import { useState, useEffect, useContext } from "react";
import {
  Box,
  Heading,
  Text,
  Grid,
  ResponsiveContext,
  Form,
  FormField,
  TextInput,
  CheckBox,
  Button,
} from "grommet";
import axios from "axios";
import AES from "crypto-js/aes";

export default function Profile({ openNotif, setToken }) {
  const [data, setData] = useState({
    name: "Loading",
    email: "Loading",
    activated: 0,
  });

  const [currentData, setCurrentData] = useState({
    name: "Loading",
    email: "Loading",
    activated: 0,
  });

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [editEmail, setEditEmail] = useState(false);
  const [editPassword, setEditPassword] = useState(false);
  const size = useContext(ResponsiveContext);
  let token = JSON.parse(localStorage.getItem("token"));
  useEffect(() => {
    setData(JSON.parse(localStorage.getItem("token")).userobj);
    setCurrentData(JSON.parse(localStorage.getItem("token")).userobj);
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (JSON.parse(localStorage.getItem("token"))) {
        const res = await axios
          .post(process.env.REACT_APP_BACKEND + "edit_user/", {
            ...currentData,
            oldPassword: AES.encrypt(oldPassword, "edit123").toString(),
            newPassword: AES.encrypt(newPassword, "edit123").toString(),
          })
          .catch((err) => {
            throw err;
          });
        if (res) {
          if (res.data.alert === "ok") {
            localStorage.setItem(
              "token",
              JSON.stringify({ ...token, userobj: currentData })
            );
            setToken({ ...token, userobj: currentData });
            setData(currentData);
          }
          openNotif(res.data.message, res.data.alert);
        }
      } else {
        openNotif("You are not logged in!", "error");
      }
    } catch (err) {
      openNotif(err.message, "error");
    }
  };
  return (
    <>
      <Grid columns={size !== "small" ? ["50%", "50%"] : "100%"} pad="small">
        <Box pad={{ vertical: "small", horizontal: "large" }}>
          <Heading level={3}>Your Profile</Heading>
          <Form
            onReset={() => {
              setEditEmail(false);
              setEditPassword(false);
              setCurrentData(data);
              setOldPassword("");
              setNewPassword("");
            }}
            onSubmit={handleSubmit}
          >
            <FormField label="Name" name="name" required>
              <TextInput
                name="name"
                value={currentData.name}
                onChange={(e) => {
                  setCurrentData({ ...currentData, name: e.target.value });
                }}
              />
            </FormField>
            <FormField
              label="Email Address"
              help={
                editEmail ? (
                  <Text size="small">
                    Account will have to be activated again if email is changed
                  </Text>
                ) : undefined
              }
              name="email"
              required
            >
              <Box direction="row">
                <TextInput
                  name="email"
                  type="email"
                  onChange={(val) => {
                    setCurrentData({
                      ...currentData,
                      email: val.target.value,
                      activated: 0,
                    });
                    if (val.target.value === data.email)
                      setCurrentData({
                        ...currentData,
                        email: val.target.value,
                        activated: 1,
                      });
                  }}
                  value={currentData.email}
                  plain
                  disabled={!editEmail ? true : false}
                />
                {!editEmail && (
                  <Button
                    size="small"
                    label="Edit"
                    onClick={() => setEditEmail(true)}
                    plain
                  />
                )}
              </Box>
            </FormField>
            <FormField
              label={editPassword ? "Old Password" : "Password"}
              name="oldpassword"
            >
              <Box direction="row">
                <TextInput
                  name="oldpassword"
                  type="password"
                  placeholder="*************"
                  value={oldPassword}
                  onChange={(val) => setOldPassword(val.target.value)}
                  plain
                  disabled={editPassword ? false : true}
                />
                {!editPassword && (
                  <Button
                    size="small"
                    label="Edit"
                    onClick={() => setEditPassword(true)}
                    plain
                  />
                )}
              </Box>
            </FormField>
            {editPassword && (
              <FormField label="New Password" name="newpassword" required>
                <TextInput
                  name="newpassword"
                  type="password"
                  placeholder="*************"
                  value={newPassword}
                  onChange={(val) => setNewPassword(val.target.value)}
                  plain
                />
              </FormField>
            )}
            <FormField label="Account Status" name="activated">
              <CheckBox
                toggle
                name="activated"
                checked={currentData.activated === 1 ? true : false}
                label={
                  currentData.activated === 1 ? "Activated" : "Not Activated"
                }
                disabled
              />
            </FormField>
            <Box direction="row" justify="between">
              <Button type="submit" label="Edit" />
              <Button
                type="reset"
                label={<Text color="red">Reset</Text>}
                color="red"
              />
            </Box>
          </Form>
        </Box>
        <Box pad="medium" margin="medium" border={{ color: "light-1" }}>
          <Heading level={3}>Have an issue?</Heading>
          <Text>Contact us</Text>
        </Box>
      </Grid>
      <Box
        height="small"
        pad="medium"
        margin="medium"
        border={{ color: "light-1" }}
      >
        <Heading level={3}>Shop More</Heading>
        <Text>Check these out</Text>
      </Box>
    </>
  );
}

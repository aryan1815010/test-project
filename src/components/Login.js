import { useState, useCallback } from "react";
import {
  Box,
  Button,
  TextInput,
  Form,
  FormField,
  Tabs,
  Tab,
  Text,
} from "grommet";
import { View, Hide } from "grommet-icons";
import axios from "axios";
import AES from "crypto-js/aes";
import useForm from "../useForm";

export default function Login({ setToken, openNotif }) {
  const [reveal, setReveal] = useState(false);
  const signinUser = useCallback(
    async (credentials) => {
      try {
        const res = await axios
          .post(process.env.REACT_APP_BACKEND + "login", {
            ...credentials,
            password: AES.encrypt(credentials.password, "login123").toString(),
          })
          .catch((err) => {
            throw err;
          });
        if (res) {
          if (res.data.login) {
            setToken(res.data);
            localStorage.setItem("token", JSON.stringify(res.data));
          } else {
            openNotif("Invalid login details.", "error");
          }
        }
      } catch (err) {
        openNotif(err.message, "error");
      }
    },
    [openNotif, setToken]
  );
  const signupUser = useCallback(
    async (credentials) => {
      const res = await axios.post(process.env.REACT_APP_BACKEND + "add_user", {
        ...credentials,
        password: AES.encrypt(credentials.password, "login123").toString(),
      });
      if (!res.data.existinguser) {
        setToken(res.data);
        localStorage.setItem("token", JSON.stringify(res.data));
      } else {
        openNotif("User already exists.", "warning");
      }
    },
    [openNotif, setToken]
  );
  const SignInForm = () => {
    const { values, handleChange, handleSubmit, setValues } =
      useForm(signinUser);
    return (
      <Box fill justify="center" width="medium">
        <Form
          onReset={() => {
            setValues({});
          }}
          onSubmit={handleSubmit}
        >
          <FormField label="Email" name="email" required>
            <TextInput
              name="email"
              type="email"
              onChange={handleChange}
              value={values.email || ""}
            />
          </FormField>
          <FormField label="Password" name="password" required>
            <Box direction="row" align="center">
              <TextInput
                plain
                name="password"
                focusIndicator={false}
                type={reveal ? "text" : "password"}
                onChange={handleChange}
                value={values.password || ""}
              />
              <Button
                icon={reveal ? <View size="medium" /> : <Hide size="medium" />}
                onClick={() => setReveal(!reveal)}
              />
            </Box>
          </FormField>
          <Box direction="row" justify="between" margin={{ top: "medium" }}>
            <Button type="submit" label="Sign In" size="small" />
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
        </Form>
      </Box>
    );
  };
  const SignUpForm = () => {
    const { values, handleChange, handleSubmit, setValues } =
      useForm(signupUser);
    return (
      <Box fill justify="center" width="medium">
        <Form
          onReset={() => {
            setValues({});
          }}
          onSubmit={handleSubmit}
          validate="change"
        >
          <FormField
            label="Name"
            name="name"
            validate={[
              {
                regexp: /^[a-z]/i,
                message: "Please enter valid name",
              },
            ]}
            required
          >
            <TextInput
              name="name"
              type="text"
              value={values.name || ""}
              onChange={handleChange}
            />
          </FormField>
          <FormField
            label="Email"
            name="email"
            validate={[
              {
                regexp: /\S+@\S+\.\S+/,
                message: "Please enter valid email",
              },
            ]}
            required
          >
            <TextInput
              name="email"
              type="email"
              onChange={handleChange}
              value={values.email || ""}
            />
          </FormField>
          <FormField
            label="Password"
            name="password"
            validate={[
              (password) => {
                if (password && password.length < 6)
                  return {
                    message: "Password must have atleast 6 characters",
                  };
                return undefined;
              },
            ]}
            required
          >
            <Box direction="row" align="center">
              <TextInput
                plain
                name="password"
                focusIndicator={false}
                type={reveal ? "text" : "password"}
                onChange={handleChange}
                value={values.password || ""}
              />
              <Button
                icon={reveal ? <View size="medium" /> : <Hide size="medium" />}
                onClick={() => setReveal(!reveal)}
              />
            </Box>
          </FormField>
          <Box direction="row" justify="between" margin={{ top: "medium" }}>
            <Button type="submit" label="Sign Up" size="small" />
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
        </Form>
      </Box>
    );
  };
  return (
    <Box width="medium" pad="medium">
      <Tabs>
        <Tab title="Sign In">
          <SignInForm />
        </Tab>
        <Tab title="Sign Up">
          <SignUpForm />
        </Tab>
      </Tabs>
    </Box>
  );
}

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
export default function Login({ setToken, openNotif }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [reveal, setReveal] = useState(false);
  const signinUser = useCallback(async (credentials) => {
    const res = await axios.post("http://localhost:3001/login", credentials);
    return res.data;
  }, []);
  const signupUser = useCallback(async (credentials) => {
    const res = await axios.post("http://localhost:3001/add_user", credentials);
    return res.data;
  }, []);
  const handleSignIn = useCallback(
    async (e) => {
      e.preventDefault();
      const token = await signinUser({ email, password });
      if (token.login) {
        setToken(token);
        localStorage.setItem("token", JSON.stringify(token));
      } else {
        openNotif("Invalid login details.", "error");
      }
    },
    [signinUser, email, password, setToken, openNotif]
  );
  const handleSignUp = useCallback(
    async (e) => {
      e.preventDefault();
      const token = await signupUser({ email, name, password });
      setToken(token);
      localStorage.setItem("token", JSON.stringify(token));
    },
    [signupUser, email, name, password, setToken]
  );
  return (
    <Box width="medium" pad={{ vertical: "medium" }}>
      <Tabs>
        <Tab title="Sign In">
          <Box fill align="center" justify="center" width="medium">
            <Form
              onReset={() => {
                setEmail("");
                setPassword("");
              }}
              onSubmit={handleSignIn}
            >
              <FormField label="Email" name="email" required>
                <TextInput
                  name="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </FormField>
              <FormField label="Password" name="password" required>
                <Box direction="row" align="center">
                  <TextInput
                    plain
                    name="password"
                    focusIndicator={false}
                    type={reveal ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                  <Button
                    icon={
                      reveal ? <View size="medium" /> : <Hide size="medium" />
                    }
                    onClick={() => setReveal(!reveal)}
                  />
                </Box>
              </FormField>
              <Box direction="row" justify="between" margin={{ top: "medium" }}>
                <Button type="submit" label="Sign In" size="small" />
                <Button
                  type="reset"
                  label={
                    <Text color="#E95065" size="small">
                      Reset
                    </Text>
                  }
                  size="small"
                  color="#E95065"
                />
              </Box>
            </Form>
          </Box>
        </Tab>
        <Tab title="Sign Up">
          <Box fill align="center" justify="center" width="medium">
            <Form
              onReset={() => {
                setEmail("");
                setPassword("");
                setName("");
              }}
              onSubmit={handleSignUp}
            >
              <FormField label="Name" name="name" required>
                <TextInput
                  name="name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </FormField>
              <FormField label="Email" name="email" required>
                <TextInput
                  name="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </FormField>
              <FormField label="Password" name="password" required>
                <Box direction="row" align="center">
                  <TextInput
                    plain
                    name="password"
                    focusIndicator={false}
                    type={reveal ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                  <Button
                    icon={
                      reveal ? <View size="medium" /> : <Hide size="medium" />
                    }
                    onClick={() => setReveal(!reveal)}
                  />
                </Box>
              </FormField>
              <Box direction="row" justify="between" margin={{ top: "medium" }}>
                <Button type="submit" label="Sign Up" size="small" />
                <Button
                  type="reset"
                  label={
                    <Text color="#E95065" size="small">
                      Reset
                    </Text>
                  }
                  size="small"
                  color="#E95065"
                />
              </Box>
            </Form>
          </Box>
        </Tab>
      </Tabs>
    </Box>
  );
}

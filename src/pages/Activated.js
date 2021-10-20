import { useState, useEffect } from "react";
import { Box, Heading, Text } from "grommet";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function Activated({ openNotif }) {
  const { token } = useParams();
  const [activated, setActivated] = useState(false);
  const [activationEmail, setActivationEmail] = useState("");

  useEffect(
    () =>
      (async () => {
        try {
          const res = await axios
            .post(process.env.REACT_APP_BACKEND + "activate_user", {
              activation_token: token,
            })
            .catch((err) => {
              throw err;
            });
          if (res) {
            if (res.data.activated) {
              setActivated(true);
              setActivationEmail(res.data.email);
              if (localStorage.getItem("token")) {
                const token = JSON.parse(localStorage.getItem("token"));
                const userobj = token.userobj;
                if (userobj.email === res.data.email) {
                  localStorage.setItem(
                    "token",
                    JSON.stringify({
                      ...token,
                      userobj: { ...userobj, activated: 1 },
                    })
                  );
                }
              }
            }
          } else {
            openNotif("Error", "error");
          }
        } catch (err) {
          openNotif(err.message, "error");
        }
      })(),
    [token, openNotif]
  );
  if (activated)
    return (
      <Box align="center" pad="large">
        <Heading level="1" alignSelf="center">
          Activated.
        </Heading>
        <Text>
          The account {activationEmail} is successfully activated. Enjoy.
        </Text>
        <Box
          pad="medium"
          margin="medium"
          height="large"
          border={{ color: "light-2" }}
        >
          <Heading level="3" alignSelf="center">
            Need help?
          </Heading>
          <Text>Contact us yada yada</Text>
        </Box>
      </Box>
    );
  else
    return (
      <Box align="center" pad="large">
        <Heading level="1" alignSelf="center">
          Not Activated.
        </Heading>
        <Text>Please check the link or contact us.</Text>
        <Box
          pad="medium"
          margin="medium"
          height="large"
          border={{ color: "light-2" }}
        >
          <Heading level="3" alignSelf="center">
            Need help?
          </Heading>
          <Text>Contact us yada yada</Text>
        </Box>
      </Box>
    );
}

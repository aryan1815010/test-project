import { Link } from "react-router-dom";
import { Box, Anchor, Button, Text } from "grommet";
import { FormClose } from "grommet-icons";

export default function Logout({ logoutUser, uname }) {
  return (
    <Box pad="medium" gap="small" width="small">
      <Text>Hi {uname}</Text>
      <Anchor as={Link} to="/user/orders" label="Orders" />
      <Anchor as={Link} to="/user/saved" label="Saved" />
      <Anchor as={Link} to="/user/profile" label="User Profile" />
      <Button
        size="small"
        onClick={logoutUser}
        icon={<FormClose color="#E5C453" />}
        label="Logout"
      />
    </Box>
  );
}

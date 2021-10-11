import { Box, Carousel, Grid, Image, Text } from "grommet";

export default function Home() {
  return (
    <>
      <Box height="medium" width="100%">
        <Carousel play={2000} fill>
          <Image fit="cover" src="/assets/Wilderpeople_Ricky.jpg" />
          <Image fit="cover" src="/assets/Wilderpeople_Ricky.jpg" />
          <Image fit="cover" src="/assets/Wilderpeople_Ricky.jpg" />
        </Carousel>
      </Box>
      <Grid
        rows={["small", "small"]}
        columns={["50%", "50%"]}
        areas={[
          { name: "header", start: [0, 0], end: [1, 0] },
          { name: "nav", start: [0, 1], end: [0, 1] },
          { name: "main", start: [1, 1], end: [1, 1] },
        ]}
      >
        <Box
          gridArea="header"
          border={{ color: "light-4" }}
          pad="small"
          margin="small"
        >
          <Text>GridItem 1</Text>
        </Box>
        <Box
          gridArea="nav"
          border={{ color: "light-4" }}
          pad="small"
          margin="small"
        >
          <Text>GridItem 2</Text>
        </Box>
        <Box
          gridArea="main"
          border={{ color: "light-4" }}
          pad="small"
          margin="small"
        >
          <Text>GridItem 3</Text>
        </Box>
      </Grid>
    </>
  );
}

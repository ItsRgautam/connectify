import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Image,
  Link,
  Heading
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useHistory } from "react-router";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";

function Homepage() {
  const history = useHistory();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) history.push("/chats");
  }, [history]);

  return (
    <Container w="100%" h="100%" display="flex" flexDir="column">
    <Container
     maxW="100%" m="0" p="0" top="0">
        <Box
          id="Nav"
          maxW="100%"
          mt="10px"
          maxH="40px"
          alignItems="center"
          borderRadius="lg"
          
          top="0"
          gap="450"
          display="inline-flex"
        >
          <Box p="0">
            <Heading size="xl" color="magenta" ml="100px" textAlign="center" fontFamily="Times New Roman" fontSize="50px">
              Connectify
            </Heading>
          </Box>
          </Box>
    </Container>
<Container display="flex" flexDir="row">
    <Container  m="50px 10px 50px -500px">
    <Box w="1200px" h="500px" display="inline-flex">
          <Box h="500px" w="60%" overflowY="auto">

            <Image
              src="/Image4.jpeg"
              alt="Signup Screenshot"
              h="100%"
              borderRadius="50px"
              w="100%"
              p="5px 5px 5px 5px"
            />
              <Image
              src="/Image5.png"
              alt="Signup Screenshot"
              borderRadius="50px"
              h="100%"
              w="100%"
              p="5px 5px 5px 5px"
            />
            <Image
              src="/Image3.jpeg"
              alt="Signup Screenshot"
              h="100%"
              borderRadius="50px"
              w="100%"
              p="5px 5px 5px 5px"
            />
          </Box>
          </Box>

    </Container>
  
    <Container maxW="xl" m="70px 10px auto 300px" >
      {/* <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg="white"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text fontSize="4xl" fontFamily="Work sans">
          ConnectiFy
        </Text>
      </Box> */}
      <Box bg="white" w="400px" h="auto" p={4} borderRadius="lg" borderWidth="1px">
        <Tabs isFitted variant="soft-rounded">
          <TabList mb="1em">
            <Tab>Login</Tab>
            <Tab>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
    </Container>
    <Container>
    <Box
          display="block"
          h="120px"
          mt="-60px"
          p="10px"
          textAlign="center"
          color="white"
          fontWeight="bold"
          overflowY="auto"
        >
          <Box
            mt="20px"
            p="20px"
            textAlign="center"
            // backgroundColor="#333"
            color ="magenta"
            fontSize="18px"
            fontWeight="bold"
            letterSpacing="1px"
          >
            <Text>
              &copy; 2024 Connectify. All Rights Reserved.
              <br />
              <Link to="/privacy-policy" style={{  color :"magenta" }}>
                Privacy Policy
              </Link>{" "}
              |
              <Link to="/terms-of-service" style={{  color :"magenta" }}>
                {" "}
                Terms of Service
              </Link>{" "}
              |
              <Link to="/contact-us" style={{ color :"magenta" }}>
                {" "}
                Contact Us
              </Link>
            </Text>
          </Box>
        </Box>
    </Container>
    </Container>
  );
}

export default Homepage;

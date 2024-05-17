import { ViewIcon } from "@chakra-ui/icons";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { useToast } from "@chakra-ui/toast";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  IconButton,
  Text,
  Image,
} from "@chakra-ui/react";


const ProfileModal = ({ user, children }) => {
  var imageurl;
  const [pic, setPic] = useState();
  const [picLoading, setPicLoading] = useState(false);
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();



  const postDetails = async (pics) => {
    setPicLoading(true);
    if (pics === undefined) {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    console.log(pics);
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "eqk94vao");
      data.append("cloud_name", "dysqkrmjt");
      await fetch("https://api.cloudinary.com/v1_1/dysqkrmjt/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then(async (data) => {
          setPic(data.url.toString());
          console.log(data.url.toString());
       const imageurl=data.url.toString();
       setPicLoading(false);
           
          try {
            const config = {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            };
            
            const userid=user.id;
            console.log(userid);
          

            const { data } =  await axios.put(
              `/update-user/picture/`,{
                userid,
                imageurl
              },
              config
            );
            console.log("kjjgigfuyf")
            console.log(data);
            const existingData = JSON.parse(localStorage.getItem("userInfo"));
            console.log(existingData);
            // Make changes to the existing data
            // For example, let's say you want to update the user's name
            existingData.imageurl = data.imageurl;
            
            // Store the updated data back into localStorage
            localStorage.setItem("userInfo", JSON.stringify(existingData));
            setPic(JSON.parse(localStorage.getItem("userInfo")).imageurl);
            }
              catch (error) {
                toast({
                  title: "Error Occured!",
                  description: "Failed to Load the Messages",
                  status: "error",
                  duration: 5000,
                  isClosable: true,
                  position: "bottom",
                });
              }
            
         
         
   
    })
        .catch((err) => {
          console.log(err);
          setPicLoading(false);
        });
    } else {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }
  };

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
      )}
      <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent h="410px">
          <ModalHeader
            fontSize="40px"
            fontFamily="Work sans"
            d="flex"
            justifyContent="center"
          >
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            d="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
          >
              <Text
              fontSize={{ base: "28px", md: "30px" }}
              fontFamily="Work sans"
            >
              Email: {user.username}
            </Text>
            <Image
              borderRadius="full"
              boxSize="150px"
              src={pic}
              alt={user.name}
            />
               
      
            <FormControl id="pic">

            <FormLabel>Update Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>
          </ModalBody>
          <ModalFooter>
           
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;

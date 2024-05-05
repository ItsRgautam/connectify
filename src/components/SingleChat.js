import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import "./styles.css";
import { IconButton, Spinner, useToast } from "@chakra-ui/react";
import { getSender, getSenderFull } from "../config/ChatLogics";
import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowBackIcon } from "@chakra-ui/icons";
import ProfileModal from "./miscellaneous/ProfileModal";
import ScrollableChat from "./ScrollableChat";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";
import {over} from "@stomp/stompjs";
import SockJS from 'sockjs-client';
import {Stomp} from '@stomp/stompjs';


import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { ChatState } from "../Context/ChatProvider";
//const ENDPOINT = "http://localhost:8080"; // "https://talk-a-tive.herokuapp.com"; -> After deployment
var  selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const[stompClient,setCtompClient]=useState();
  // const [socketConnected, setSocketConnected] = useState(false);
  // const [typing, setTyping] = useState(false);
  // const [istyping, setIsTyping] = useState(false);
  const toast = useToast();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const { selectedChat,
     setSelectedChat,
      user,
      userdata,
       notification, 
       setNotification,
       privateStompClient,
      
    } =
    ChatState();

  const fetchMessages = async () => {
    if (!selectedChat) return;

    console.log(selectedChat);
  
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);
    //  setMessages([]);

      const { data } = await axios.get(
        `/chat/messages/${selectedChat.id}`,
        config
      );
     data.forEach(message=> {
      message.chatId = selectedChat.id;
  });
      setMessages(data);
      console.log(data);
      setLoading(false);

     //const socket = new SockJS('http://localhost:8080/ws');
     const headers = {
      Authorization: `Bearer ${user.token}`
  };
   
  const stompClient = Stomp.over(function(){
    return new SockJS('http://localhost:8080/ws')});
    setCtompClient(stompClient);
      stompClient.connect(headers, () => {
        console.log('Connected to WebSocket server');
        // Perform STOMP operations only after successful connection
        stompClient.subscribe(`/specific/private/${selectedChat.id}`, (message) => {
          console.log('Received message:---->>>>', message.body);
          const jsonString=message.body;
          const jsonObject = JSON.parse(jsonString);
          console.log('chatId:---->>>>', jsonObject.chatId);
          const receivedMessageChatId=jsonObject.chatId;
          const msg=jsonObject.message;
          msg.chatId = receivedMessageChatId;
          console.log("msgobject==",msg);

          if (
            selectedChatCompare || // if chat is not selected or doesn't match current chat
            selectedChatCompare.id == msg.chatId
          ) {
            setMessages([...messages, msg]);
          }

          
          
      });
        
    });
      
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };



  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
     
          // Function to send a message

      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const messagedata= await axios.post(
          "/sendmessage",
          {
            content: newMessage,
            chatId: selectedChat.id,
          },
          config
        );
        console.log(messagedata.data)

       stompClient.send(`/app/private/${selectedChat.id}`, {}, JSON.stringify({"message":messagedata.data,"chatId":selectedChat.id}));
        
       //setMessages([...messages, messagedata.data]);      

      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };



  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
   
  }, [selectedChat]);

  // useEffect(() => {
  //   socket.on("message recieved", (newMessageRecieved) => {
  //     if (
  //       !selectedChatCompare || // if chat is not selected or doesn't match current chat
  //       selectedChatCompare._id !== newMessageRecieved.chat._id
  //     ) {
  //       if (!notification.includes(newMessageRecieved)) {
  //         setNotification([newMessageRecieved, ...notification]);
  //         setFetchAgain(!fetchAgain);
  //       }
  //     } else {
  //       setMessages([...messages, newMessageRecieved]);
  //     }
  //   });
  // });

  // const typingHandler = (e) => {
  //   setNewMessage(e.target.value);

  //   if (!socketConnected) return;

  //   if (!typing) {
  //     setTyping(true);
  //     socket.emit("typing", selectedChat._id);
  //   }
  //   let lastTypingTime = new Date().getTime();
  //   var timerLength = 3000;
  //   setTimeout(() => {
  //     var timeNow = new Date().getTime();
  //     var timeDiff = timeNow - lastTypingTime;
  //     if (timeDiff >= timerLength && typing) {
  //       socket.emit("stop typing", selectedChat._id);
  //       setTyping(false);
  //     }
  //   }, timerLength);
  // };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            d="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              d={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {messages &&
              (!selectedChat.isgroup ? (
                <>
                  {getSender(user, selectedChat.users)}
                  <ProfileModal
                    user={getSenderFull(user, selectedChat.users)}
                  />
                </>
              ) : (
                <>
                  {selectedChat.chatname.toUpperCase()}
                  <UpdateGroupChatModal
                    fetchMessages={fetchMessages}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
                </>
              ))}
          </Text>
          <Box
            d="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}

            <FormControl
              onKeyDown={sendMessage}
              id="first-name"
              isRequired
              mt={3}
            >
               <Input
               variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              ></Input> 
           
            </FormControl>
          </Box>
        </>
      ) : (
        // to get socket.io on same page
        <Box d="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;

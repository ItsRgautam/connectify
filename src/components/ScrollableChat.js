import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m.id}>
            {
             (
               isSameSender(messages, m, i, user.id) ||
              isLastMessage(messages, i, user.id)) && (
              <Tooltip label={m.username} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.username}
                 // src={m.pic}
                />
              </Tooltip>
            )}
         
            <span
              style={{
                backgroundColor: `${
                  m.user.id === user.id ? "#BEE3F8" : "#B9F5D0"
                }`,
                marginLeft: isSameSenderMargin(messages, m, i, user.id),
                marginTop: isSameUser(messages, m, i, user.id) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              <span>
                {m.username}</span>
                <br></br>
              
              
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;

import React, { useEffect, useRef, useState } from "react";
import socketIOClient, { Socket } from "socket.io-client";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Stack,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import useAuthentication from "src/hooks/useAuthentication";
import isEmpty from "lodash/isEmpty";
import ChatIcon from "@mui/icons-material/Chat";

interface Message {
  name: string;
  body: string;
}

const CustomerChatBox: React.FC = () => {
  const { userInfo, isAdmin } = useAuthentication();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [messageBody, setMessageBody] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { name: "Admin", body: "Hi! Please input your inquiry." },
  ]);
  const uiMessagesRef = useRef<HTMLUListElement | null>(null);
  const [endpoint, setEndpoint] = useState("")

  useEffect(() => {
    if (typeof window !== "undefined" && window?.location?.host?.indexOf("localhost") >= 0) {
      setEndpoint("http://localhost:5003")
    } else {
      setEndpoint(window.location.hostname)
    }
  }, [])

  useEffect(() => {
    if (uiMessagesRef.current) {
      uiMessagesRef.current.scrollTop = uiMessagesRef.current.scrollHeight;
    }

    if (socket) {
      socket.emit("onLogin", {
        _id: userInfo._id,
        name: userInfo.name,
        isAdmin: userInfo.isAdmin,
      });

      socket.on("message", (data: Message) => {
        setMessages((prevMessages) => [...prevMessages, data]);
      });
    }
  }, [messages, isOpen, socket, userInfo]);

  const supportHandler = () => {
    setIsOpen(true);
    const sk = socketIOClient(endpoint);
    setSocket(sk);
  };

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!messageBody.trim()) {
      alert("Error. Please type a message.");
    } else {
      const newMessage = { body: messageBody, name: userInfo.name };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessageBody("");

      setTimeout(() => {
        socket?.emit("onMessage", {
          body: messageBody,
          name: userInfo.name,
          isAdmin: userInfo.isAdmin,
          _id: userInfo._id,
        });
      }, 500);
    }
  };

  const closeHandler = () => {
    setIsOpen(false);
  };

  return (
    // <Box sx={{ position: "fixed", bottom: 16, right: 16 }}>
    //   {!isEmpty(userInfo) && !isAdmin && !isOpen ? (
    //     <IconButton
    //       onClick={supportHandler}
    //       color="primary"
    //       aria-label="chat"
    //       sx={{
    //         backgroundColor: "primary.main",
    //         color: 'white',
    //         position: "fixed",
    //         bottom: { xs: "16px", md: "32px" },
    //         right: { xs: "16px", md: "32px" },
    //         zIndex: 1000,
    //         "&:hover": { backgroundColor: "primary.dark" },
    //       }}
    //     >
    //       <ChatIcon fontSize="large" />
    //     </IconButton>
    //   ) : (
    //     <Box
    //       sx={{
    //         width: 300,
    //         height: 400,
    //         display: "flex",
    //         flexDirection: "column",
    //         backgroundColor: "background.paper",
    //         boxShadow: 3,
    //         borderRadius: 2,
    //       }}
    //     >
    //       <Stack
    //         direction="row"
    //         justifyContent="space-between"
    //         alignItems="center"
    //         sx={{
    //           p: 1,
    //           backgroundColor: "primary.main",
    //           color: "white",
    //           borderRadius: "8px 8px 0 0",
    //         }}
    //       >
    //         <Typography variant="h6">Customer Support</Typography>
    //         <IconButton
    //           onClick={closeHandler}
    //           sx={{ color: "white" }}
    //           aria-label="close chat"
    //         >
    //           <CloseIcon />
    //         </IconButton>
    //       </Stack>

    //       <List
    //         ref={uiMessagesRef}
    //         sx={{
    //           flexGrow: 1,
    //           overflowY: "auto",
    //           p: 2,
    //           bgcolor: "background.default",
    //         }}
    //       >
    //         {messages.map((msg, index) => (
    //           <ListItem
    //             key={index}
    //             sx={{
    //               display: "flex",
    //               alignItems: "flex-start",
    //               mb: 1,
    //             }}
    //           >
    //             <Avatar
    //               sx={{
    //                 bgcolor: msg.name === "Admin" ? "primary.main" : "secondary.main",
    //               }}
    //             >
    //               {msg.name[0].toUpperCase()}
    //             </Avatar>
    //             <ListItemText
    //               primary={<strong>{msg.name}</strong>}
    //               secondary={msg.body}
    //               sx={{ ml: 2, color: "text.primary" }}
    //             />
    //           </ListItem>
    //         ))}
    //       </List>

    //       <Box
    //         component="form"
    //         onSubmit={submitHandler}
    //         sx={{
    //           p: 2,
    //           borderTop: "1px solid",
    //           borderColor: "divider",
    //           display: "flex",
    //           alignItems: "center",
    //         }}
    //       >
    //         <TextField
    //           fullWidth
    //           variant="outlined"
    //           placeholder="Type a message"
    //           value={messageBody}
    //           onChange={(e) => setMessageBody(e.target.value)}
    //           size="small"
    //           sx={{ flexGrow: 1, mr: 1 }}
    //         />
    //         <IconButton
    //           type="submit"
    //           color="primary"
    //           sx={{
    //             backgroundColor: "primary.main",
    //             color: "white",
    //             "&:hover": { backgroundColor: "primary.dark" },
    //           }}
    //         >
    //           <SendIcon />
    //         </IconButton>
    //       </Box>
    //     </Box>
    //   )}
    // </Box>

    <Box sx={{ position: "fixed", bottom: 16, right: 16 }}>
      {!isEmpty(userInfo) && !isAdmin && !isOpen ? (
        <IconButton
          onClick={supportHandler}
          color="primary"
          aria-label="chat"
          sx={{
            color: "white",
            position: "fixed",
            bottom: { xs: "16px", md: "32px" },
            right: { xs: "16px", md: "32px" },
            zIndex: 1000,
            "&:hover": { backgroundColor: "primary.dark" },
          }}
        >
          <ChatIcon fontSize="large" />
        </IconButton>
      ) : (
        <Box
          sx={{
            width: 320,
            height: 500,
            display: "flex",
            flexDirection: "column",
            backgroundColor: "background.paper",
            boxShadow: 3,
            borderRadius: 2,
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              p: 1,
              backgroundColor: "primary.main",
              color: "white",
              borderRadius: "8px 8px 0 0",
            }}
          >
            <Typography variant="h6" sx={{ fontSize: "16px" }}>
              Customer Support
            </Typography>
            <IconButton
              onClick={closeHandler}
              sx={{ color: "white" }}
              aria-label="close chat"
            >
              <CloseIcon />
            </IconButton>
          </Stack>

          <List
            ref={uiMessagesRef}
            sx={{
              flexGrow: 1,
              overflowY: "auto",
              p: 2,
              bgcolor: "background.default",
            }}
          >
            {messages.map((msg, index) => (
              <ListItem
                key={index}
                sx={{
                  display: "flex",
                  flexDirection: msg.name === "Admin" ? "row" : "row-reverse",
                  alignItems: "flex-start",
                  mb: 1,
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: msg.name === "Admin" ? "primary.main" : "secondary.main",
                    ml: msg.name === "Admin" ? 1 : 0,
                    mr: msg.name === "Admin" ? 0 : 1,
                  }}
                >
                  {msg.name[0].toUpperCase()}
                </Avatar>
                <Paper
                  sx={{
                    p: 1.5,
                    borderRadius: 4,
                    maxWidth: "70%",
                    backgroundColor:
                      msg.name === "Admin" ? "primary.light" : "secondary.light",
                    color: "text.primary",
                    boxShadow: 1,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ fontSize: "14px", fontWeight: "bold" }}
                  >
                    {msg.name}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "13px" }}>
                    {msg.body}
                  </Typography>
                </Paper>
              </ListItem>
            ))}
          </List>

          <Box
            component="form"
            onSubmit={submitHandler}
            sx={{
              p: 2,
              borderTop: "1px solid",
              borderColor: "divider",
              display: "flex",
              alignItems: "center",
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type a message"
              value={messageBody}
              onChange={(e) => setMessageBody(e.target.value)}
              size="small"
              sx={{ flexGrow: 1, mr: 1 }}
            />
            <IconButton
              type="submit"
              color="primary"
              sx={{
                backgroundColor: "primary.main",
                color: "white",
                "&:hover": { backgroundColor: "primary.dark" },
              }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      )}
    </Box>


    // <Box sx={{ position: "fixed", bottom: 16, right: 16 }}>
    //   {!isEmpty(userInfo) && !isAdmin && !isOpen ? (
    //     <IconButton
    //       onClick={supportHandler}
    //       color="primary"
    //       aria-label="chat"
    //       sx={{
    //         backgroundColor: "primary.main",
    //         color: "white",
    //         position: "fixed",
    //         bottom: { xs: "16px", md: "32px" },
    //         right: { xs: "16px", md: "32px" },
    //         zIndex: 1000,
    //         "&:hover": { backgroundColor: "primary.dark" },
    //       }}
    //     >
    //       <ChatIcon fontSize="large" />
    //     </IconButton>
    //   ) : (
    //     <Box
    //       sx={{
    //         width: 320,
    //         height: 500,
    //         display: "flex",
    //         flexDirection: "column",
    //         backgroundColor: "background.paper",
    //         boxShadow: 3,
    //         borderRadius: 2,
    //       }}
    //     >
    //       <Stack
    //         direction="row"
    //         justifyContent="space-between"
    //         alignItems="center"
    //         sx={{
    //           p: 1,
    //           backgroundColor: "primary.main",
    //           color: "white",
    //           borderRadius: "8px 8px 0 0",
    //         }}
    //       >
    //         <Typography variant="h6" sx={{ fontSize: "16px" }}>
    //           Customer Support
    //         </Typography>
    //         <IconButton
    //           onClick={closeHandler}
    //           sx={{ color: "white" }}
    //           aria-label="close chat"
    //         >
    //           <CloseIcon />
    //         </IconButton>
    //       </Stack>

    //       <List
    //         ref={uiMessagesRef}
    //         sx={{
    //           flexGrow: 1,
    //           overflowY: "auto",
    //           p: 2,
    //           bgcolor: "background.default",
    //         }}
    //       >
    //         {messages.map((msg, index) => (
    //           <ListItem
    //             key={index}
    //             sx={{
    //               display: "flex",
    //               justifyContent: msg.isSent ? "flex-end" : "flex-start",
    //               mb: 1,
    //             }}
    //           >
    //             <Paper
    //               sx={{
    //                 p: 1.5,
    //                 borderRadius: 4,
    //                 maxWidth: "70%",
    //                 backgroundColor: msg.isSent ? "grey.200" : "transparent",
    //                 color: "text.primary",
    //                 boxShadow: msg.isSent ? 1 : 0,
    //                 textAlign: "left",
    //               }}
    //             >
    //               <Typography
    //                 variant="body2"
    //                 sx={{
    //                   fontSize: "13px",
    //                   fontWeight: "bold",
    //                   mb: 0.5,
    //                   color: msg.isSent ? "text.secondary" : "text.primary",
    //                 }}
    //               >
    //                 {msg.name}
    //               </Typography>
    //               <Typography variant="body2" sx={{ fontSize: "14px" }}>
    //                 {msg.body}
    //               </Typography>
    //             </Paper>
    //           </ListItem>
    //         ))}
    //       </List>

    //       <Box
    //         component="form"
    //         onSubmit={submitHandler}
    //         sx={{
    //           p: 2,
    //           borderTop: "1px solid",
    //           borderColor: "divider",
    //           display: "flex",
    //           alignItems: "center",
    //         }}
    //       >
    //         <TextField
    //           fullWidth
    //           variant="outlined"
    //           placeholder="Type a message"
    //           value={messageBody}
    //           onChange={(e) => setMessageBody(e.target.value)}
    //           size="small"
    //           sx={{ flexGrow: 1, mr: 1 }}
    //         />
    //         <IconButton
    //           type="submit"
    //           color="primary"
    //           sx={{
    //             backgroundColor: "primary.main",
    //             color: "white",
    //             "&:hover": { backgroundColor: "primary.dark" },
    //           }}
    //         >
    //           <SendIcon />
    //         </IconButton>
    //       </Box>
    //     </Box>
    //   )}
    // </Box>

  );
};

export default CustomerChatBox;

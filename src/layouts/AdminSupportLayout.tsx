import React, { useEffect, useRef, useState } from "react";
import socketIOClient, { Socket } from "socket.io-client";
import { useSelector } from "react-redux";
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
  Avatar,
  Badge,
  Paper,
  Stack,
} from "@mui/material";
import { Send as SendIcon, Person as PersonIcon } from "@mui/icons-material";
import { isEmpty } from "lodash";

let allUsers: any[] = [];
let allMessages: any[] = [];
let allSelectedUser: any = {};

const AdminSupportLayout: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<any>({});
  const [socket, setSocket] = useState<Socket | null>(null);
  const uiMessagesRef = useRef<HTMLUListElement>(null);
  const [messageBody, setMessageBody] = useState<string>("");
  const [messages, setMessages] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const { userInfo } = useSelector(({ user }: any) => user);
  const [endpoint, setEndpoint] = useState<any>("")

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.host.indexOf("localhost") >= 0) {
      setEndpoint("http://localhost:5003")
    } else {
      setEndpoint(window.location.hostname)
    }
  }, [])

  useEffect(() => {
    if (uiMessagesRef.current) {
      uiMessagesRef.current.scrollTo({
        top: uiMessagesRef.current.scrollHeight,
        behavior: "smooth",
      });
    }

    if (!socket && !isEmpty(endpoint)) {
      const sk = socketIOClient(endpoint);
      setSocket(sk);
      sk.emit("onLogin", {
        _id: userInfo._id,
        name: userInfo.name,
        isAdmin: userInfo.isAdmin,
      });

      sk.on("message", (data) => {
        if (allSelectedUser._id === data._id) {
          allMessages = [...allMessages, data];
        } else {
          const existUser = allUsers.find((user) => user._id === data._id);
          if (existUser) {
            allUsers = allUsers.map((user) =>
              user._id === existUser._id ? { ...user, unread: true } : user
            );
            setUsers(allUsers);
          }
        }
        setMessages(allMessages);
      });

      sk.on("updateUser", (updatedUser) => {
        const existUser = allUsers.find((user) => user._id === updatedUser._id);
        if (existUser) {
          allUsers = allUsers.map((user) =>
            user._id === existUser._id ? updatedUser : user
          );
          setUsers(allUsers);
        } else {
          allUsers = [...allUsers, updatedUser];
          setUsers(allUsers);
        }
      });

      sk.on("listUsers", (updatedUsers) => {
        allUsers = updatedUsers;
        setUsers(allUsers);
      });

      sk.on("selectUser", (user) => {
        allMessages = user.messages;
        setMessages(allMessages);
      });
    }
  }, [messages, socket, endpoint, users]);

  // useEffect(() => {
  //   if (!socket && endpoint) {
  //     const sk = socketIOClient(endpoint);

  //     sk.on("connect", () => {
  //       console.log("Socket connected:", sk.id);
  //       sk.emit("onLogin", {
  //         _id: userInfo._id,
  //         name: userInfo.name,
  //         isAdmin: userInfo.isAdmin,
  //       });
  //     });

  //     sk.on("message", (data) => {
  //       console.log("Message received:", data);
  //       if (allSelectedUser._id === data._id) {
  //         allMessages = [...allMessages, data];
  //       } else {
  //         const existUser = allUsers.find((user) => user._id === data._id);
  //         if (existUser) {
  //           allUsers = allUsers.map((user) =>
  //             user._id === existUser._id ? { ...user, unread: true } : user
  //           );
  //           setUsers(allUsers);
  //         }
  //       }
  //       setMessages(allMessages);
  //     });

  //     sk.on("disconnect", () => {
  //       console.log("Socket disconnected");
  //     });

  //     setSocket(sk);
  //     return () => sk.disconnect(); // Clean up
  //   }
  // }, [socket, endpoint]);


  const selectUser = (user: any) => {
    allSelectedUser = user;
    setSelectedUser(allSelectedUser);
    const existUser = allUsers.find((x) => x._id === user._id);
    if (existUser) {
      allUsers = allUsers.map((x) =>
        x._id === existUser._id ? { ...x, unread: false } : x
      );
      setUsers(allUsers);
    }
    socket?.emit("onUserSelected", user);
  };

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageBody.trim()) {
      alert("Error. Please type a message.");
      return;
    }
    allMessages = [...allMessages, { body: messageBody, name: userInfo.name }];
    setMessages(allMessages);
    setMessageBody("");

    setTimeout(() => {
      socket?.emit("onMessage", {
        body: messageBody,
        name: userInfo.name,
        isAdmin: userInfo.isAdmin,
        _id: selectedUser._id,
      });
    }, 1000);
  };

  return (
    <Box display="flex" gap={2} p={2} height="100%">
      {/* User List */}
      <Paper elevation={3} sx={{ width: 300, p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Online Users
        </Typography>
        {users.filter((x) => x._id !== userInfo._id).length === 0 ? (
          <Typography>No Online User Found</Typography>
        ) : (
          <List>
            {users
              .filter((x) => x._id !== userInfo._id)
              .map((user) => (
                <ListItem
                  key={user._id}
                  button
                  selected={user._id === selectedUser._id}
                  onClick={() => selectUser(user)}
                >
                  <Badge
                    color={user.unread ? "error" : user.online ? "success" : "default"}
                    variant="dot"
                  >
                    <Avatar>
                      <PersonIcon />
                    </Avatar>
                  </Badge>
                  <ListItemText primary={user.name} />
                </ListItem>
              ))}
          </List>
        )}
      </Paper>

      {/* Chat Window */}
      <Paper elevation={3} sx={{ flex: 1, p: 2 }}>
        {!selectedUser._id ? (
          <Typography variant="h6" align="center">
            Select a user to start a chat
          </Typography>
        ) : (
          <Stack spacing={2} height="100%">
            <Typography variant="h6">Chat with {selectedUser.name}</Typography>
            <Box
              ref={uiMessagesRef}
              sx={{
                flex: 1,
                overflowY: "auto",
                border: "1px solid #ccc",
                p: 1,
                borderRadius: 1,
              }}
            >
              {messages.length === 0 ? (
                <Typography>No messages.</Typography>
              ) : (
                <List>
                  {messages.map((msg, index) => (
                    <ListItem key={index}>
                      <Typography>
                        <strong>{msg.name}:</strong> {msg.body}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
            <form onSubmit={submitHandler}>
              <Stack direction="row" spacing={1}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  placeholder="Type a message"
                  value={messageBody}
                  onChange={(e) => setMessageBody(e.target.value)}
                />
                <Button
                  type="submit"
                  variant="contained"
                  endIcon={<SendIcon />}
                >
                  Send
                </Button>
              </Stack>
            </form>
          </Stack>
        )}
      </Paper>
    </Box>
  );
};

export default AdminSupportLayout;

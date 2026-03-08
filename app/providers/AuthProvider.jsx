"use client";
import axios from "axios";
import { useRouter, usePathname } from "next/navigation";
import { createContext, useState, useEffect, useContext } from "react";
import { socket } from "../tools/Socket";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  // Auth state
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Chat state
  const [chats, setChats] = useState([]);
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);

  // ------------------------
  // Helper functions
  // ------------------------
const connectSocket = async (currentUser) => {
  if (!currentUser) return;
  if (!socket.connected) {
    const { data } = await axios.get("/api/users/token");
    socket.auth = { token: data.token };
    socket.connect();
  }

  socket.on("connect", () => {});
};

  const fetchMessages = async (chat) => {
    try {
      const res = await axios.get(
        `/api/messages/${chat.chatId}`,
        { withCredentials: true },
      );
      setMessages(res.data);
    } catch (err) {
      setMessages([]);
    }
  };

  const fetchMessagesForChat = async (chat) => {
    setMessagesLoading(true); // start loading
    try {
      const res = await axios.get(
        `/api/messages/${chat.chatId}`,
        { withCredentials: true },
      );
      setMessages(res.data);
    } catch (err) {
      setMessages([]);
    } finally {
      setMessagesLoading(false); // stop loading
    }
  };

  const setInitialChat = (loadedChats) => {
    if (!loadedChats.length) return null;

    const storedChat = localStorage.getItem("lastChat");
    if (storedChat) {
      try {
        const parsed = JSON.parse(storedChat);
        const found = loadedChats.find((c) => c.chatId === parsed.chatId);
        if (found) return found;
      } catch {}
    }
    return loadedChats[0]; // fallback to first chat
  };

  // ------------------------
  // Login API
  // ------------------------
  const loginApi = async (credentials) => {
    try {
      await axios.post(
        `/api/users/login`,
        credentials,
        { withCredentials: true },
      );

      // Fetch user
      const { data: userData } = await axios.get(
        `/api/users/me`,
        { withCredentials: true },
      );
      setUser(userData);
      setIsAuthenticated(true);

      // Fetch chats
      try {
  const { data: chatData } = await axios.get("/api/chat", { withCredentials: true });
  setChats(chatData);
  const initialChat = setInitialChat(chatData);
  setChatId(initialChat);
  if (initialChat) await fetchMessages(initialChat);
} catch (chatErr) {
  if (chatErr.response?.status === 404) {
    setChats([]);
  } else {
    throw chatErr;
  }
}

      // Connect socket
      await connectSocket(userData);

      router.push("/");
    } catch (err) {
      setUser(null);
      setIsAuthenticated(false);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const registerApi = async (credentials) => {
    try {
      await axios.post(
        `/api/users/sign-up`,
        credentials,
        { withCredentials: true },
      );

      // Fetch user
      const { data: userData } = await axios.get(
        `/api/users/me`,
        { withCredentials: true },
      );

      setUser(userData);
      setIsAuthenticated(true);

      try {
        const { data: chatData } = await axios.get(
          `/api/chat`,
          { withCredentials: true },
        );

        setChats(chatData);

        const initialChat = setInitialChat(chatData);
        setChatId(initialChat);

        if (initialChat) await fetchMessages(initialChat);
      } catch (chatErr) {
        if (chatErr.response?.status === 404) {
          // ✅ New user → no chats → ignore
          setChats([]);
        } else {
          throw chatErr; // rethrow other errors
        }
      }

      // Connect socket
      await connectSocket(userData);

      router.push("/");
    } catch (err) {
      setUser(null);
      setIsAuthenticated(false);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ------------------------
  // Auto-login on page reload
  // ------------------------
  useEffect(() => {
    const publicRoutes = ["/auth/login", "/auth/sign-up", "/auth/callback"];
  if (publicRoutes.some((route) => pathname.startsWith(route))) return;

    const authApi = async () => {
      try {
        // 1️⃣ Check auth first
        const { data: userData } = await axios.get(
          `/api/users/me`,
          { withCredentials: true },
        );

        setUser(userData);
        setIsAuthenticated(true);

        // 2️⃣ Get chats (handle 404 separately)
        try {
          const { data: chatData } = await axios.get(
            `/api/chat`,
            { withCredentials: true },
          );

          setChats(chatData);

          const initialChat = setInitialChat(chatData);
          setChatId(initialChat);

          if (initialChat) await fetchMessages(initialChat);
        } catch (chatErr) {
          if (chatErr.response?.status === 404) {
            // ✅ New user → no chats → ignore
            setChats([]);
          } else {
            throw chatErr; // rethrow other errors
          }
        }

        await connectSocket(userData);
      } catch (err) {
        setIsAuthenticated(false);
        localStorage.removeItem("lastChat");
        router.push("/auth/login");
      } finally {
        setLoading(false);
      }
    };

    authApi();
  }, [pathname]);

  // ------------------------
  // Join chat socket and receive messages
  // ------------------------
  useEffect(() => {
  if (!chatId || !user) return;

  socket.emit("join_chat", chatId.chatId);
  fetchMessagesForChat(chatId);

  const handleReceive = (message) => {
    const isSender = String(message.senderId) === String(user._id);
    const formattedMessage = {
      ...message,
      senderId: isSender ? "sender" : message.senderId,
    };
    setMessages((prev) => [...prev, formattedMessage]);

    setChats((prev) => {
      const exists = prev.find(c => c.chatId === message.chatId.toString());
      if (!exists) {
        // New chat — fetch fresh list
        axios.get("/api/chat", { withCredentials: true })
          .then(res => setChats(res.data))
          .catch(() => {});
        return prev;
      }
      return prev.map((chat) =>
        chat.chatId === chatId.chatId
          ? { ...chat, lastMessage: message.lastMessage }
          : chat,
      );
    });
  };

  socket.on("receive_message", handleReceive);

  return () => {
    socket.emit("leave_chat", chatId.chatId);
    socket.off("receive_message", handleReceive);
  };
}, [chatId, user]);
  

  // ------------------------
  // Delete a chat
  // ------------------------
  const deleteChat = async (chatToDelete) => {
    try {
      await axios.delete(
        `/api/chat/${chatToDelete.chatId}`,
        { withCredentials: true },
      );

      // Update chats state
      const remainingChats = chats.filter(
        (chat) => chat.chatId !== chatToDelete.chatId,
      );
      setChats(remainingChats);

      // Update chatId and localStorage
      setChatId((currentChat) => {
        if (currentChat?.chatId === chatToDelete.chatId) {
          const fallback = remainingChats[0] || null;
          if (fallback)
            localStorage.setItem("lastChat", JSON.stringify(fallback));
          else localStorage.removeItem("lastChat");
          if (fallback) fetchMessages(fallback);
          return fallback;
        }
        return currentChat;
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Update localStorage whenever chatId changes
  useEffect(() => {
    if (chatId) localStorage.setItem("lastChat", JSON.stringify(chatId));
  }, [chatId]);

  return (
    <AuthContext.Provider
      value={{
        loading,
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
        loginApi,
        registerApi,
        chats,
        setChats,
        chatId,
        setChatId,
        messages,
        setMessages,
        deleteChat,
        messagesLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw "useAuth can't be used outside AuthProvider";
  return context;
};

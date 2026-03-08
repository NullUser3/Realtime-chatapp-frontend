"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { socket } from "../tools/Socket";
import { useAuth } from "../providers/AuthProvider";

const Logout = () => {
  const router = useRouter();
  const { setUser, setIsAuthenticated, setMessages, setChatId } = useAuth();

  const logoutApi = async () => {
    try {
      const logoutRequest = await axios.post(
        `/api/users/logout`,
        {},
        { withCredentials: true },
      );

      localStorage.removeItem("lastChat");

      if (socket.connected) {
        socket.disconnect();
      }

      setUser(null);
      setIsAuthenticated(false);
      setChatId(null);
      setMessages([]);
      return router.push("auth/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <button
      onClick={logoutApi}
      aria-label="Logout"
      className="
        relative flex items-center justify-center
        w-9 h-9 rounded-full
        bg-subtle2/60 hover:bg-subtle2
        text-foreground/70 hover:text-[#f03e3e]
        dark:bg-foreground dark:text-background
        dark:border-accent dark:hover:bg-accent
        transition-all duration-200 cursor-pointer
        border border-subtle2
      "
    >
      <LogOut size={16} />
    </button>
  );
};

export default Logout;

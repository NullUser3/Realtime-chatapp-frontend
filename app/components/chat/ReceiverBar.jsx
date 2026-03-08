import { useEffect, useState } from "react";
import { socket } from "@/app/tools/Socket";
import { formatLastSeen } from "@/app/tools/FormatLastSeen";
import { avatarColorMap } from "../sidebar/ChatCard";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/app/providers/AuthProvider";
import Image from "next/image";

const ReceiverBar = () => {
  const [isOnline, setIsOnline] = useState(false);
  const [pendingDeleteChat, setPendingDeleteChat] = useState(null);
  const { isAuthenticated, loading, chatId, deleteChat } = useAuth();

  useEffect(() => {
    if (!chatId || !isAuthenticated || loading) return;

    const handleOnlineUsers = (users) => {
      setIsOnline(users.includes(chatId?.receiver?._id));
    };

    const handleOnlineStatus = (data) => {
      if (data.userId === chatId?.receiver?._id) {
        setIsOnline(data.isOnline);
      }
    };

    socket.on("online_users", handleOnlineUsers);
    socket.on("online_status", handleOnlineStatus);
    socket.emit("get_online_users");

    return () => {
      socket.off("online_users", handleOnlineUsers);
      socket.off("online_status", handleOnlineStatus);
    };
  }, [chatId]);

  const handleDeleteConfirm = async () => {
    if (!pendingDeleteChat) return;
    await deleteChat(pendingDeleteChat);
    setPendingDeleteChat(null);
  };

  return (
    <>
      <div className="w-full items-center flex justify-between">
        {/* Avatar and name */}
        <div className="flex gap-3">
          {chatId?.receiver?.avatar ? (
            <div className="w-12 h-12 rounded-full overflow-hidden shrink-0">
              <Image
                src={chatId?.receiver?.avatar}
                width={100}
                height={100}
                alt="avatar"
              />
            </div>
          ) : (
            <div
              className={`shrink-0 flex items-center text-background text-xl justify-center w-12 h-12 rounded-full
                ${avatarColorMap[chatId?.receiver?.avatarColor] || "bg-avatar-green"}`}
            >
              <span>{chatId?.receiver?.username.charAt(0)}</span>
            </div>
          )}

          <div className="flex flex-col">
            <span className="font-semibold text-lg dark:text-background">
              {chatId?.receiver?.username}
            </span>
            {isOnline || chatId?.receiver?.lastSeen ? (
              <span
                className={`text-sm ${
                  isOnline
                    ? "text-green-500"
                    : "text-foreground/60 dark:text-background/50"
                }`}
              >
                {isOnline
                  ? "online"
                  : `last seen: ${formatLastSeen(chatId?.receiver?.lastSeen)}`}
              </span>
            ) : (
              <span className="text-foreground/60 dark:text-background/50 text-sm">
                offline
              </span>
            )}
          </div>
        </div>

        {/* Delete */}
        <div title="Delete chat">
          <Trash2
            size={18}
            className="text-foreground/60 dark:text-background/50 hover:text-red-500 dark:hover:text-red-500 cursor-pointer transition-colors"
            onClick={() => setPendingDeleteChat(chatId)}
          />
        </div>
      </div>

      <AlertDialog
        open={!!pendingDeleteChat}
        onOpenChange={(open) => {
          if (!open) setPendingDeleteChat(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this chat?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the conversation with{" "}
              <span className="font-semibold dark:text-background text-foreground">
                {pendingDeleteChat?.receiver?.username}
              </span>{" "}
              from your chat list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="hover:text-background">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ReceiverBar;
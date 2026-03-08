import { useAuth } from "@/app/providers/AuthProvider";
import { Skeleton } from "@/components/ui/skeleton";
import { formatLastSeen } from "@/app/tools/FormatLastSeen";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";

export const avatarColorMap = {
  blue: "bg-avatar-blue",
  teal: "bg-avatar-teal",
  green: "bg-avatar-green",
  yellow: "bg-avatar-yellow",
  orange: "bg-avatar-orange",
  red: "bg-avatar-red",
  purple: "bg-avatar-purple",
};

const ChatCard = () => {
  const { chats, loading, chatId, setChatId } = useAuth();

  const chooseChat = (chat) => {
    setChatId(chat);
    localStorage.setItem("lastChat", JSON.stringify(chat));
  };

  return (
    <ul className="flex flex-col gap-3 h-full overflow-hidden">
      {loading ? (
        <div className="flex flex-col w-full h-full gap-3 items-center p-3 pr-4.5">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="flex items-center h-1/8">
              <div className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-3">
                  <Skeleton className="h-4 w-[220px]" />
                  <Skeleton className="h-4 w-[170px]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <ScrollArea className="h-full">
          <div className="flex flex-col">
            {chats?.map((chat, key) => (
              <button
                key={key}
                onClick={() => chooseChat(chat)}
                className={`cursor-pointer flex h-16 items-center gap-3
                  pr-6 pl-3 w-full overflow-hidden duration-150 
                  
                  hover:bg-subtle2/50 dark:hover:bg-accent/50
                  ${
                    chat.chatId === chatId?.chatId
                      ? "bg-subtle2/50 dark:bg-accent/50"
                      : "bg-background dark:bg-darkest"
                  }`}
              >
                {/* Avatar */}
                {chat?.receiver?.avatar ? (
                  <div className="w-9 h-9 rounded-full overflow-hidden shrink-0">
                    <Image
                      src={chat?.receiver?.avatar}
                      width={100}
                      height={100}
                      alt="avatar"
                    />
                  </div>
                ) : (
                  <div
                    className={`shrink-0 flex items-center text-background text-xl justify-center w-9 h-9 rounded-full
                      ${avatarColorMap[chat.receiver?.avatarColor] || "bg-avatar-green"}`}
                  >
                    <span className="leading-none">{chat.receiver.username.charAt(0)}</span>
                  </div>
                )}

                <div className="flex flex-col gap-1 justify-center flex-1 w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-sm truncate dark:text-background">
                      {chat.receiver.username}
                    </span>
                    <span className="text-xs text-foreground/70 dark:text-background/50 shrink-0 whitespace-nowrap">
                      {formatLastSeen(chat.lastMessage?.createdAt)}
                    </span>
                  </div>
                  <span className="text-xs text-foreground/60 dark:text-background/50 text-left truncate">
                    {chat.lastMessage?.body || "\u00A0"}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      )}
    </ul>
  );
};

export default ChatCard;
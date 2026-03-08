"use client";
import React, { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReceiverBar from "./ReceiverBar";
import { MessagesSquare, SendHorizonal } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useForm } from "react-hook-form";
import { socket } from "@/app/tools/Socket";
import { useAuth } from "@/app/providers/AuthProvider";

const Chat = () => {
  const { messages, chatId, messagesLoading, loading, chats } = useAuth();
  const { register, handleSubmit, reset } = useForm();
  const containerRef = useRef(null);

  const scrollToBottom = () => {
    containerRef.current?.scrollIntoView(false);
  };

  useEffect(() => {
    if (!messagesLoading) scrollToBottom();
  }, [messagesLoading]);

  useEffect(() => {
    if (messages) scrollToBottom();
  }, [messages]);

  const onSubmit = async (data) => {
    try {
      socket.emit("send_message", {
        chatId: chatId.chatId,
        body: data.message,
      });
      reset();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <>
      {messagesLoading || loading ? (
        <div className="flex w-full h-screen flex-col gap-6">
          <div className="flex items-center bg-background dark:bg-darkest px-6 h-24 border-b-2 border-b-subtle2 dark:border-accent">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          </div>
          <div className="flex flex-col px-6 w-full gap-6">
            <Skeleton className="h-9 w-[60%] ml-auto" />
            <Skeleton className="h-9 w-[40%]" />
            <Skeleton className="h-9 w-[60%] ml-auto" />
            <Skeleton className="h-24 w-[60%]" />
            <Skeleton className="h-9 w-[60%] ml-auto" />
            <Skeleton className="h-9 w-[30%] ml-auto" />
          </div>
        </div>
      ) : chats.length === 0 ? (
        <div className="w-full h-screen flex justify-center items-center">
          <div className="flex flex-col items-center gap-3">
            <MessagesSquare className="w-40 h-40 stroke-subtle4 dark:stroke-accent" />
            <span className="text-accent/60 dark:text-background/80 font-semibold text-lg">
              No chats selected
            </span>
            <span className="dark:text-subtle4/80 text-accent/50">
              Select a chat from the left sidebar or start a new chat
            </span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-screen w-full">
          {/* Header */}
          <div className="flex items-center bg-background dark:bg-darkest px-6 h-24 border-b border-b-subtle2 dark:border-accent">
            <ReceiverBar />
          </div>

          {/* Messages */}
          <div className="relative flex-1 overflow-hidden">
            <ScrollArea className="h-full w-full px-6 md:px-12 2xl:px-42">
              <div
                ref={containerRef}
                className="flex flex-col gap-6 h-full w-full py-6 text-sm md:text-base"
              >
                {messages ? (
                  messages?.map((msg, key) =>
                    msg.senderId === "sender" ? (
                      // Sent message
                      <span
                        key={key}
                        className="
                          bg-accent dark:bg-accent/90 text-background shadow-sm self-end
                          ml-auto break-all overflow-hidden
                          max-w-[80%] md:max-w-[65%] lg:max-w-[55%] xl:max-w-[45%]
                          px-3 py-2 md:px-4 md:py-2.5 lg:px-5 lg:py-3
                          rounded-l-xl rounded-b-xl
                          text-sm md:text-base
                        "
                      >
                        <div className="flex flex-col">
                          <span>{msg.body}</span>
                          <span className="text-[11px] md:text-xs opacity-60 self-end mt-1">
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </span>
                    ) : (
                      // Received message
                      <span
                        key={key}
                        className="
                          bg-background dark:bg-foreground/50 shadow-sm self-start
                          break-all overflow-hidden
                          max-w-[80%] md:max-w-[65%] lg:max-w-[55%] xl:max-w-[45%]
                          px-3 py-2 md:px-4 md:py-2.5 lg:px-5 lg:py-3
                          rounded-r-xl rounded-b-xl
                          text-sm md:text-base
                        "
                      >
                        <div className="flex flex-col">
                          <span className="dark:text-background">{msg.body}</span>
                          <span className="text-[11px] md:text-xs opacity-60 dark:text-background self-end mt-1">
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </span>
                    ),
                  )
                ) : (
                  <div />
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Input */}
          <form
            className="pb-3 px-3 md:px-9 2xl:px-36 flex justify-center w-full"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex w-full bg-background dark:bg-foreground shadow-sm rounded-xl items-center gap-3 px-3 border border-transparent dark:border-accent">
              <input
                {...register("message", { required: true })}
                className="w-full border-0 outline-none py-3 px-3 rounded-xl bg-transparent dark:text-background dark:placeholder:text-background/50"
                type="text"
                placeholder="Write something"
                autoComplete="off"
              />
              <button
                title="Send message"
                className="cursor-pointer rounded-full bg-accent hover:brightness-125 p-1"
              >
                <SendHorizonal className="p-1 stroke-background" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Chat;
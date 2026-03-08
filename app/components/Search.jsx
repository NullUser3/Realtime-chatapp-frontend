"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Search as SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";
import { useAuth } from "../providers/AuthProvider";
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
import { avatarColorMap } from "./sidebar/ChatCard";
import Image from "next/image";

export function Search() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [pendingUser, setPendingUser] = useState(null);
  const containerRef = useRef(null);

  const { setChats, setChatId } = useAuth();

  useEffect(() => {
    const searchUsers = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/users/searchUsers`,
          { withCredentials: true },
        );
        setUsers(res.data);
      } catch (error) {}
    };
    searchUsers();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectUser = (user) => {
    setPendingUser(user);
    setOpen(false);
    setSearch("");
  };

  const handleConfirm = async () => {
    if (!pendingUser) return;

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/chat`,
        { receiverId: pendingUser._id },
        { withCredentials: true },
      );

      const newChat = res.data;

      setChats((prev) => {
        const exists = prev.find((c) => c.chatId === newChat.chatId);
        if (exists) return prev;
        return [...prev, { ...newChat }];
      });

      setChatId(newChat);
      setValue(pendingUser.username);
    } catch (error) {
    } finally {
      setPendingUser(null);
    }
  };

  const queryUsers =
    search.trim().length <= 3
      ? []
      : users.filter((user) =>
          user.username.toLowerCase().includes(search.toLowerCase()),
        );

  return (
    <>
      <div ref={containerRef} className="relative w-full">
        <div
          className="flex items-center w-full bg-subtle2/50 dark:bg-foreground dark:text-background
         rounded-xl  px-4 py-2 gap-2"
        >
          <SearchIcon className="opacity-50 w-4 h-4 shrink-0" />
          <input
            type="text"
            placeholder="Start chat..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            className="bg-transparent outline-none w-full dark:text-background dark:placeholder:text-background/50 text-foreground/80 placeholder:text-foreground/50 text-sm"
          />
        </div>

        {open && (
          <div
            className="absolute z-50 mt-1 w-full rounded-xl border border-subtle2 bg-background dark:bg-foreground 
        dark:border-accent shadow-lg overflow-hidden"
          >
            {search.trim().length <= 3 ? (
              <p className="text-foreground/50 dark:text-background/50 text-sm px-4 py-3">
                Type more than 3 characters to search.
              </p>
            ) : queryUsers.length === 0 ? (
              <p className="text-foreground/50 dark:text-background/50 text-sm px-4 py-3">
                No users found.
              </p>
            ) : (
              <ul>
                {queryUsers.map((user) => (
                  <li
                    key={user._id}
                    onClick={() => handleSelectUser(user)}
                    className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-subtle2 dark:hover:bg-accent transition-colors"
                  >
                    {user?.avatar ? (
                      <div className="w-7 h-7 rounded-full overflow-hidden shrink-0">
                        <Image
                          src={user?.avatar}
                          width={100}
                          height={100}
                          alt="avatar"
                        />
                      </div>
                    ) : (
                      <div
                        className={`${user.avatarColor ? avatarColorMap[user.avatarColor] : "bg-avatar-blue"} flex items-center justify-center text-background w-7 h-7 rounded-full shrink-0`}
                      >
                        <span className="text-sm">
                          {user.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <span className="text-sm">{user.username}</span>
                    <Check
                      className={cn(
                        "ml-auto w-4 h-4",
                        value === user.username ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <AlertDialog
        open={!!pendingUser}
        onOpenChange={(o) => {
          if (!o) setPendingUser(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Start a new chat?</AlertDialogTitle>
            <AlertDialogDescription>
              This will open a conversation with{" "}
              <span className="font-semibold dark:text-background text-foreground">
                {pendingUser?.username}
              </span>
              .
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className={"hover:text-background"}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
              Start chat
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

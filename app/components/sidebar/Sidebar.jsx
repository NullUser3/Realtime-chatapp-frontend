"use client";
import { useEffect, useState } from "react";
import { PanelLeftOpen, Sun, Moon } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import Logout from "../Logout";
import { Search } from "../Search";
import ChatCard from "./ChatCard";
import { useAuth } from "@/app/providers/AuthProvider";
import Image from "next/image";

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Initialize from localStorage or system preference
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const dark = stored === "dark" || (!stored && prefersDark);
    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="
        relative flex items-center justify-center
        w-9 h-9 rounded-full
        bg-subtle2/60 hover:bg-subtle2
        dark:bg-foreground dark:text-background
        dark:border-accent dark:hover:bg-accent
        text-foreground/70 hover:text-foreground
        transition-all duration-200 cursor-pointer
        border border-subtle2
      "
    >
      <span
        className="absolute transition-all duration-300"
        style={{
          opacity: isDark ? 1 : 0,
          transform: isDark
            ? "rotate(0deg) scale(1)"
            : "rotate(90deg) scale(0.5)",
        }}
      >
        <Moon size={15} />
      </span>
      <span
        className="absolute transition-all duration-300"
        style={{
          opacity: isDark ? 0 : 1,
          transform: isDark
            ? "rotate(-90deg) scale(0.5)"
            : "rotate(0deg) scale(1)",
        }}
      >
        <Sun size={15} />
      </span>
    </button>
  );
};

const SidebarHeader = ({ user }) => (
  <header className="flex items-center justify-between -mb-3 lg:pb-[2px] h-24 w-full pl-6 pr-6 lg:pl-[25px] lg:pr-[25px]">
    <div className="flex items-center gap-3">
      {user?.avatar ? (
        <div className="w-11 h-11 rounded-full overflow-hidden">
          <Image src={user?.avatar} width={100} height={100} alt="avatar" />
        </div>
      ) : (
        <div className="flex leading-none items-center text-background text-xl justify-center w-11 h-11 bg-accent rounded-full">
          {user?.username?.charAt(0)}
        </div>
      )}
      <div className="flex flex-col">
        <span>{user?.username}</span>
        <span className="text-green-500">online</span>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <ThemeToggle />
      <Logout />
    </div>
  </header>
);

const MobileSidebarHeader = ({ user }) => (
  <header className="flex items-center justify-between -mb-3 lg:pb-[2px] h-24 w-full pl-6 pr-6 lg:pl-[26px] lg:pr-[26px]">
    {user?.avatar ? (
        <div className="w-11 h-11 rounded-full overflow-hidden">
          <Image src={user?.avatar} width={100} height={100} alt="avatar" />
        </div>
      ) : (
        <div className="flex items-center text-background text-xl justify-center w-11 h-11 bg-accent rounded-full">
      <span>{user?.username?.charAt(0)}</span>
    </div>
      )}
    <div className="flex items-center gap-2">
      <ThemeToggle />
      <Logout />
    </div>
  </header>
);

const Sidebar = () => {
  const { user, chatId } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (chatId) {
      setOpen(false);
    }
  }, [chatId]);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="lg:flex flex-col hidden bg-background dark:bg-darkest dark:border-accent lg:border-r lg:border-r-subtle2  text-foreground dark:text-background gap-3 w-80 h-screen">
        <SidebarHeader user={user} />
        <section className="w-full pl-3 lg:pr-[14px] h-18 pr-3">
          <Search />
        </section>
        <section className="flex-1 min-h-0">
          <ChatCard />
        </section>
      </aside>

      {/* Mobile trigger button */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open sidebar"
        className="
          fixed left-0 top-1/2 -translate-y-1/2 z-50
          flex items-center justify-center
          w-6 h-12
          bg-accent dark:bg-foreground dark:text-subtle   text-background
          rounded-r-xl shadow-lg
          transition-all duration-200
          hover:w-10 active:scale-95
          lg:hidden
        "
      >
        <PanelLeftOpen size={18} />
      </button>

      {/* Mobile Sheet sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTitle className="sr-only">menu</SheetTitle>
        <SheetContent
          side="left"
          className="p-0 w-80 bg-background dark:bg-darkest backdrop-blur-sm border-r-2 border-r-subtle2 dark:border-accent text-foreground flex flex-col gap-3"
        >
          <MobileSidebarHeader user={user} />
          <section className="w-full pl-3 lg:pr-[14px] h-18 pr-3">
            <Search />
          </section>
          <section className="flex-1 min-h-0">
            <ChatCard />
          </section>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Sidebar;

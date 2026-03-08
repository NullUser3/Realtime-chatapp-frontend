import Image from "next/image";
import Chat from "./components/chat/Chat";
import Sidebar from "./components/sidebar/Sidebar";

export default function Home() {
  return (
    <div className="relative w-full h-screen  bg-subtle2 dark:bg-darkest overflow-hidden z-10">
      <div className=" w-full h-full flex mx-auto bg-background z-30 overflow-hidden">
        <Sidebar/>
      <main className="flex-1 min-w-0 text-foreground bg-subtle2/50 dark:bg-darkest overflow-hidden">
        <Chat/>        
      </main>
      </div>
      
    </div>
  );
}

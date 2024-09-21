import Link from "next/link";
import React from "react";
import { ItemContextProvider } from "@/services/ItemAndCategoryContext";
import { SocketProvider } from "@/services/Websockethook";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SocketProvider>
      <div className="h-screen w-screen">
        <nav className="w-screen h-12 p-2  flex items-center bg-zinc-300 border-yellow-500 border-b-2 rounded-md">
          <h1 className="text-2xl m-10">kanteen</h1>
        </nav>
        <div className="flex h-[100%]">
          <div className="h-[100%] w-[20%] bg-zinc-300 rounded-sm border-yellow-500 border-r-2">
            <div className="text-black flex flex-col ml-10 p-10 h-[100%]">
              <Link href="/dashboard/item">Items</Link>
              <Link href="/dashboard/category">Categories</Link>
            </div>
          </div>
          <ItemContextProvider>
            <div className="flex-1 p-10">{children}</div>
          </ItemContextProvider>
        </div>
      </div>
    </SocketProvider>
  );
}

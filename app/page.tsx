import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center gap-32">
      <h1>Welcome To Kanteen Admin Panel</h1>
      <div className="flex w-[50%] justify-evenly items-center">
        <Link href="/signup">
          <button className="bg-sky-300 p-2 ">Sign Up</button>
        </Link>
        <Link href="/login">
          <button className="bg-sky-300 p-2">Login</button>
        </Link>
      </div>
    </div>
  );
}

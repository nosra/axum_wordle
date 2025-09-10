import { useEffect } from "react";
import type { Route } from "./+types/login.ts";
import { WordleAnim } from "app/wordle-anim/wordle-anim.js";
import { gsap } from 'gsap'


export function meta({}: Route.MetaArgs) {
  return [
    { title: "Login Page" },
    { name: "description", content: "Welcome to Wordle!" },
  ];
}

const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("sending user info!")
    // construct a POST request to the user controller
    const username = (document.getElementById('username') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;

    const res = await fetch("/api/user/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({username, password}),
    })
    // TODO: do something with the response from the backend
}

export default function Login() {
    // time for a sexy login page!
    return(
        <>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <div className="container flex flex-col md:flex-row min-w-screen">
                <div className="login-container flex flex-col items-center md:items-start p-8 md:p-20 w-full md:w-1/2 min-h-screen bg-white md:rounded-r-xl">
                    <div className="wordle-splash italic">
                        <label className="">
                            Welcome to Rustle
                        </label>
                    </div>
                    <div className="create-account mb-20">
                        <label className="text-4xl font-bold">
                            Create an Account
                        </label>
                    </div>
                    <form>
                        <div className="login__login-box">
                            {/* username block */}
                            <label className="block text-sm font-medium text-black pb-2">Username</label>
                            <input type="text" id="username" className="bg-white border border-gray-300 text-sm rounded-lg block w-70 p-2.5 dark:placeholder-gray-400 " placeholder="skibidi@toilet.sigma" required />

                            {/* password block */}
                            <label className="block text-sm font-medium text-black pb-2 pt-10">Password</label>
                            <input type="password" id="password" className="bg-white border border-gray-300 text-sm rounded-lg block w-70 p-2.5 dark:placeholder-gray-400" placeholder="Enter Password" required />
                            
                        </div>
                        <div className="flex rounded-2xl transition duration-300 ease-in-out hover:bg-green-700 text-white pt-3 pb-3 mt-5 w-70 justify-center bg-[#3cb53f]">
                            <button type="submit" className="login__continue w-full" onClick={handleLogin}>Continue</button>
                        </div>
                        <div className="flex w-70 justify-start">
                            <a className="text-slate-400 mt-10 underline">Forgot Password?</a>
                        </div>
                    </form>
                </div>
            {/* wordle demo anim */}
            <div className="demo flex flex-col justify-center items-center w-full mb-20">
                <div className="demo__splash-test flex justify-center mb-4">
                    <label className="text-white text-2xl md:text-3xl lg:text-4xl">
                        Play millions of Rustle Boards!
                    </label>
                </div>
                <div className="flex justify-center w-full px-4">
                    <div className="-z-1 w-full aspect-[5/6] max-w-[500px]">
                        <WordleAnim />
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

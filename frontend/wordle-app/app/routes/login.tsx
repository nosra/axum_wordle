import { useEffect } from "react";
import type { Route } from "./+types/login.ts";
import { WordleAnim } from "~/wordle-anim/wordle-anim.js";
import { gsap } from 'gsap'


export function meta({}: Route.MetaArgs) {
  return [
    { title: "Login Page" },
    { name: "description", content: "Welcome to Wordle!" },
  ];
}

const handleLogin = async (e: any) => {
    console.log("sending user info!")
    e.preventDefault();

    // wrap the event in a FormData object
    const formData = new FormData(e.target);
    const username = formData.get("username")?.toString();
    const password = formData.get("password")?.toString();

    console.log(username?.toString());

    // construct a POST request to the user controller
    const res = await fetch("/api/user/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(
            {
                username: username,
                password: password,
            }
        ),
    })
    // TODO: do something with the response from the backend

    // we should send the user to their timeline. for now,
    // we will just send the user to the game page
}

export default function Login() {
    useEffect(() => {
        const pingBackend = () => {
            fetch("/api/")
                .then(response => console.log("Ping successful"))
                .catch(error => console.error("Ping failed:", error))
                ;
        };
        pingBackend();
    }, []);
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
                    <form className="login__form" onSubmit={handleLogin}>
                        <div className="login__login-box">
                            {/* username block */}
                            <label className="block text-sm font-medium text-black pb-2">Username</label>
                            <input type="text" name="username" className="bg-white border border-gray-300 text-sm rounded-lg block w-70 p-2.5 dark:placeholder-gray-400 " placeholder="skibidi@toilet.sigma" required />

                            {/* password block */}
                            <label className="block text-sm font-medium text-black pb-2 pt-10">Password</label>
                            <input type="password" name="password" className="bg-white border border-gray-300 text-sm rounded-lg block w-70 p-2.5 dark:placeholder-gray-400" placeholder="Enter Password" required />
                            
                        </div>
                        <div className="flex rounded-2xl transition duration-300 ease-in-out hover:bg-green-700 text-white pt-3 pb-3 mt-5 w-70 justify-center bg-[#3cb53f]">
                            <button className="login__continue w-full" type="submit">Continue</button>
                        </div>
                    </form>
                    <div className="flex w-70 justify-start">
                        <a className="text-slate-400 mt-10 underline">Forgot Password?</a>
                    </div>
                </div>
            {/* wordle demo anim */}
                <div className="demo flex flex-col justify-center align-baseline h-lvh w-full">
                    <div className="demo__splash-test flex justify-center">
                        <label className="text-white text-4xl relative bottom-5">Play millions of Rustle Boards!</label>
                    </div>
                    <div className="flex justify-center align-center">
                        <WordleAnim/>
                    </div>
                    
                </div>

            </div>
        </>
    )
}

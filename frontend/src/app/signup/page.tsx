"use client"
import React from 'react';
import Signupbar from "@/components/Signupbar";
import ZapierButton from '@/components/buttons/ZapierButton';
import Link from 'next/link';
import axios from 'axios';
import { BACKEND_URL } from '@/config';
import { useRouter } from 'next/navigation';


export default function Signup() {
    const[workEmail, setWorkEmail] = React.useState('');
    const[name, setName] = React.useState('');
    const[password, setPassword] = React.useState('');
    const router = useRouter();
    return (
        <div className="w-screen h-screen flex flex-col">
            <div>
                <Signupbar />
            </div>
            <div className="w-full h-full grid grid-cols-2 pl-4 pr-4">
                <div className="w-full flex flex-col items-center justify-center gap-y-4">
                    <div className="max-w-[303px] w-full flex items-center justify-center text-xl font-semibold">
                        Join millions worldwide who automate their work using Zapier.
                    </div>
                    <div className="max-w-[303px] w-full flex flex-col items-center justify-center">
                        <div className="w-full flex items-center justify-start">
                            <SignupContent content="Easy setup, no coding required"/>
                        </div>
                        <div className="w-full flex items-center justify-start">
                            <SignupContent content="Free forever for core features"/>
                        </div>
                        <div className="w-full flex items-center justify-center">
                            <SignupContent content="14-day trail of premium features & apps"/>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col justify-center items-center mr-4">
                    <div className="max-w-[303px] w-full h-10 bg-blue-500 flex justify-evenly items-center mr-2 ml-2">
                        <div>
                            <GoogleLogo/>
                        </div>
                        <div className="text-md font-medium text-white">
                            Sign up with Google
                        </div>

                    </div>
                    <div className="max-w-[303px] w-full flex  items-center justify-center mr-2 ml-2 gap-x-1">
                        <div className="w-3/7 border-[2px] border-neutral-200">

                        </div>
                        <div className="w-1/7 flex items-center justify-center">
                            OR
                        </div>
                        <div className="w-3/7 border-[2px] border-neutral-200">

                        </div>
                    </div>
                    <div className="w-full flex flex-col  items-center gap-y-4">
                        <div className="w-full flex items-center justify-center">
                            <SignUpInput placeholder='Work Email' onChange={(e)=>{setWorkEmail(e.target.value)}}/>
                        </div>
                        <div className="w-full flex items-center justify-center">
                            <SignUpInput placeholder='Name' onChange={(e)=>{setName(e.target.value)}}/>
                        </div>
                        <div className="w-full flex items-center justify-center">
                            <SignUpInput placeholder='Password' onChange={(e)=>{setPassword(e.target.value)}}/>
                        </div>
                        <div className="w-full flex items-center justify-center">
                            <ZapierButton onClickFunction={() => {
                                axios.post(`${BACKEND_URL}/api/v1/user/signup`, {
                                    email:workEmail,
                                    name,
                                    password
                                })
                                .then((res) => {
                                    console.log(res);
                                    router.push('/login');
                                })
                                .catch((err) => {
                                    console.log(err);
                                })
                            }} children="Get Started free"/>
                        </div>
                        <div className="w-full flex items-center justify-center">
                            By signing up, you agree to our <Link href="/terms" className="text-blue-500"> Terms of Service</Link> and <Link href="/privacy" className="text-blue-500"> Privacy Policy</Link>.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function SignupContent({content}:{content:string}) {
    return (
        <div className="w-full flex items-center justify-start">
            <div className="">
                <svg xmlns="http://www.w3.org/2000/svg" fill="green" viewBox="0 0 24 24" strokeWidth={0.5} stroke="white" className="size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
            </div>
            <div className="text-sm text-neutral-500">
                {content}
            </div>
        </div>
    )
}

export function GoogleLogo(){
    return(
        <div>
            <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="currentColor"  className="icon icon-tabler icons-tabler-filled icon-tabler-brand-google"><path stroke="none" d="M0 0h24v24H0z" fill="white" /><path d="M12 2a9.96 9.96 0 0 1 6.29 2.226a1 1 0 0 1 .04 1.52l-1.51 1.362a1 1 0 0 1 -1.265 .06a6 6 0 1 0 2.103 6.836l.001 -.004h-3.66a1 1 0 0 1 -.992 -.883l-.007 -.117v-2a1 1 0 0 1 1 -1h6.945a1 1 0 0 1 .994 .89c.04 .367 .061 .737 .061 1.11c0 5.523 -4.477 10 -10 10s-10 -4.477 -10 -10s4.477 -10 10 -10z" /></svg>
        </div>
    )
}

export function SignUpInput({placeholder,onChange}:{placeholder:string,onChange:React.ChangeEventHandler<HTMLInputElement>}){
    return(
        <div className="max-w-[303px] w-full flex flex-col items-start gap-y-1">
            <div className="flex items-center justify-start gap-x-1">
                <div className="text-md">
                    *
                </div>
                <div className="font-semibold text-md">
                    {placeholder}
                </div>
                <div>
                    (required)
                </div>
            </div>
            <div className="w-full">
                <input onChange={onChange} type="text" className="w-full h-10  border-[1px] border-black pl-2"></input>
            </div>
        </div>
    )
}
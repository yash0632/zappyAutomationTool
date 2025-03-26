"use client"
import React from 'react';
import Signupbar from "@/components/Signupbar";
import ZapierButton from '@/components/buttons/ZapierButton';
import Link from 'next/link';
import { GoogleLogo, SignupContent, SignUpInput } from '../signup/page';
import axios from 'axios';
import { BACKEND_URL } from '@/config';
import { useRouter } from 'next/navigation';

export default function Login() {
    const[email, setEmail] = React.useState('');
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
                            <SignUpInput placeholder='Email' onChange={(e)=>{setEmail(e.target.value)}}/>
                        </div>
                        <div className="w-full flex items-center justify-center">
                            <SignUpInput placeholder='Password' onChange={(e)=>{setPassword(e.target.value)}}/>
                        </div>
                        <div className="w-full flex items-center justify-center">
                            <ZapierButton onClickFunction={() => {
                                axios.post(`${BACKEND_URL}/api/v1/user/login`, {
                                    email,
                                    password
                                })
                                .then((res) => {
                                    console.log(res);
                                    localStorage.setItem('token', res.data.token);
                                    router.push('/dashboard');
                                })
                                .catch((err) => {
                                    console.log(err);
                                })
                            }} children="LogIn"/>
                        </div>
                        <div className="w-full flex items-center justify-center">
                            By signing up, you agree to our  <Link href="/terms" className="text-blue-500"> Terms of Service </Link> and <Link href="/privacy" className="text-blue-500"> Privacy Policy</Link>.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


"use client"
import Image from "next/image"
import {useRouter} from "next/navigation";
import { ModeToggle } from "./Darkmode"
import LinkButton from "./buttons/LinkButton"
import ZapierButton from "./buttons/ZapierButton";
export default function Appbar(){
    const router = useRouter();
    return (
        <div className="w-full h-16 border-b-2 border-neutral-200 border-solid">
            <div className="w-full h-full grid grid-cols-3">
                <div className="w-full h-full flex items-center gap-x-2 justify-start">
                    <MyanuiLine/>
                    <Image src="/Zapier_logo.jpg" alt="Zapier Logo" width={120} height={32} />
                </div>
                <div className="w-full h-full flex items-center justify-end col-span-2 gap-x-4">
                    <div className="w-[106px]">
                        <LinkButton 
                            onClickFunction={() => {
                                router.push("/login");
                            }}
                        >
                            Log In
                        </LinkButton>
                    </div>
                    <div className="w-[106px]">
                        <ZapierButton 
                            onClickFunction={() => {
                                router.push("/signup");
                            }}
                        >
                            Sign Up
                        </ZapierButton>
                    </div>
                    <ModeToggle/>
                </div>
            </div>
        </div>
    )
}

export function MyanuiLine(){
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="-0.5 -0.5 16 16" strokeLinecap="round" strokeLinejoin="round" stroke="#000000" id="Menu--Streamline-Mynaui" height={36} width={36} ><desc>{"Menu Streamline Icon: https://streamlinehq.com"}</desc><path d="M2.8125 4.0625h9.375M2.8125 7.5h9.375m-9.375 3.4375h9.375" strokeWidth={1} /></svg>
    )
}
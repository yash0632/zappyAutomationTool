"use client"
import { useRouter } from "next/navigation";
import Image from "next/image";
import LinkButton from "./buttons/LinkButton";
import {ModeToggle} from "./Darkmode";
import {MyanuiLine} from "./Appbar";
export default function Signupbar(){
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
                    <ModeToggle/>
                </div>
            </div>
        </div>
    )
}
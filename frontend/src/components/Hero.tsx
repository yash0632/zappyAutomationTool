"use client"
import { useRouter } from "next/navigation";
import { Feather } from "lucide-react";
import SecondaryButton from "./buttons/SecondaryButton";
import ZapierButton from "./buttons/ZapierButton";
import Feature from "./Feature";
export default function Hero(){
    const router = useRouter();
    return (
        <div className="w-full h-96 flex">
            <div className="w-full flex flex-col justify-center items-center gap-y-4">
                <div className="w-[407px] font-bold text-5xl flex items-center text-center">
                    Automate as fast as you can type
                </div>
                <div className="w-[550px] text-md text-center font-medium flex items-center">
                    AI gives you automation superpowers,and zapier puts them to work.
                    <br />
                    Pairing AI and zapier helps you turnideas into workflows and bots that work for you.
                </div>
                <div>
                    <ZapierButton onClickFunction={()=>{
                        router.push("/signup");
                    }}>Get Started free</ZapierButton>
                </div>
                <div>
                    <SecondaryButton onClickFunction={()=>{
                        router.push("/contact");
                    }}>Contact Sales</SecondaryButton>
                </div>
                <div className="w-full flex justify-around items-center">
                    <div>
                        <Feature title="Free forever" description="for core features"/>
                    </div>
                    <div>
                        <Feature title="More apps" description="than any other platform"/>
                    </div>
                    <div>
                        <Feature title="AI features" description="cutting edge"/>
                    </div>
                </div>
            </div>
            
        </div>
    )
}
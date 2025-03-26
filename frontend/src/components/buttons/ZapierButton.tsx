"use client"
export default function ZapierButton({children,onClickFunction}:{children:React.ReactNode,onClickFunction:() => void}){
return (
    <div className="w-full max-w-[303px] h-full flex justify-center items-center">
    <button 
        onClick={onClickFunction} 
        className="text-white font-bold cursor-pointer font-medium bg-orange-700 bg-orange-600  w-full rounded-2xl pt-2 pb-2 pr-4 pl-4 hover:shadow-md hover:shadow-orange-500/50">
        {children}
    </button>
</div>
    )
}

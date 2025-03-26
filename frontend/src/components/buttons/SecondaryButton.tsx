"use client"
export default function SecondaryButton({children,onClickFunction}:{children:React.ReactNode,onClickFunction:() => void}){
return (
    <div className="w-full h-full flex justify-center items-center">
    <button 
        onClick={onClickFunction} 
        className="text-black font-bold cursor-pointer font-medium bg-orange-700 bg-white  w-full rounded-2xl pt-2 pb-2 pr-4 pl-4 hover:bg-neutral-300 -md hover:shadow-neutral-500/50 border-black border-2">
        {children}
    </button>
</div>
    )
}
"use client"
export default function LinkButton({ children, onClickFunction }: { children: React.ReactNode, onClickFunction: () => void }) {
    return (
        <div className="w-full h-full flex justify-center items-center">
            <button
                onClick={onClickFunction}
                className="cursor-pointer font-medium hover:bg-neutral-200 hover:font-semibold w-full rounded-2xl pt-2 pb-2 py-[4px] hover:shadow-md hover:shadow-neutral-500/50">
                {children}
            </button>
        </div>
    )
}
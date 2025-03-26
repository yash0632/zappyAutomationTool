export default function Feature({title,description}: {title: string, description: string}){
     return(
     <div> 
        <div className="w-full h-full flex items-center">
            <CheckMark/>
            <div className="font-bold text-2xl">{title}</div>
            <div className="text-md font-medium">{description}</div>
        </div>
     </div>
    )
}
function CheckMark(){
    return(
        <svg id="Checkmark--Streamline-Carbon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" height="16" width="16"><desc>Checkmark Streamline Icon: https://streamlinehq.com</desc><defs></defs><path d="m6.5 12 -4.5 -4.5 0.707 -0.707L6.5 10.5855 13.293 3.793 14 4.5 6.5 12z" fill="#000000" stroke-width="0.5"></path><path id="_Transparent_Rectangle_" d="M0 0h16v16H0Z" fill="none" stroke-width="0.5"></path></svg>
    )
}
export default function HeroVideo(){
    return (
        <div className="w-full h-full flex justify-center items-center">
            <video
                src="https://res.cloudinary.com/zapier-media/video/upload/q_auto:best/f_auto/v1726860621/Homepage%20%E2%80%94%20Sept%202024/sc01_HP_240917_Connect_v01_edm2pd.mp4"
                height={"280"}
                autoPlay
                loop
                muted
                preload="auto"
                className="w-4/6 rounded-2xl"
            />
        </div>
    )
}
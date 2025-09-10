// get images
import playIcon from './play.svg';
import hourGlassIcon from './hourglass.png';
import checkIcon from './checksquare.png';
import friendsIcon from './friends.svg';


// TODO: add actual functionality
export function UserSideBar() {
    return (
        <>
            <div className="sidebar flex flex-col justify-start gap-y-5 bg-black min-w-60 h-full border-t-gray-500 border-2">
                <div className="sidebar__game flex flex-col gap-5 pl-5 pr-5 border-b-2 border-gray-500">
                    <div className="mt-5 pill pill__ongoing">
                        <div className="pill__items flex flex-row items-center gap-5 align-middle rounded-3xl pt-4 pb-4 border-gray-500 border-[1px]">
                            <img className="ml-5 size-8" src={hourGlassIcon}/>
                            <label className="text-lg text-white">Ongoing</label>
                        </div>
                    </div>
                    <div className="pill pill__completed">
                        <div className="pill__items flex flex-row items-center gap-5 align-middle rounded-3xl pt-4 pb-4 border-gray-500 border-0">
                            <img className="ml-5 size-8" src={checkIcon}/>
                            <label className="text-lg text-gray-300">Completed</label>
                        </div>
                    </div>
                    <div className="pill pill__newgame mb-5 ">
                        <div className="pill__items flex flex-row items-center gap-5 align-middle rounded-3xl pt-4 pb-4 bg-white">
                            <img className="ml-5 size-8" src={playIcon}/>
                            <label className="text-lg text-black">New Game</label>
                        </div>
                    </div>
                </div>
                <div className="sidebar sidebar__friends flex flex-col gap-5 pl-5 pr-5">
                    <div className="mt-5 pill pill__friends">
                        <div className="pill__items flex flex-row items-center gap-5 align-middle rounded-3xl pt-4 pb-4">
                            <img className="ml-5 size-8" src={friendsIcon}/>
                            <label className="text-lg text-gray-300">Friends</label>
                        </div>
                    </div>
                </div>
            </div>    
        </>
    )
}
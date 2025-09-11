import flameIcon from './flame.svg';
export function UserStats() {
    return (
        <>
        <div className="flex flex-row h-full w-full bg-linear-65 from-green-700 to-green-500">
            <div className="p-8 flex flex-col flex-none w-full">   
                <div className="namecontainer pb-5">
                    {/* TODO: make this LABEL be the current user's name*/}
                    <label className="name text-white text-5xl font-bold">Hello, Carson</label>
                </div>
                <div className="master_container flex flex-row h-full w-full space-x-5 mb-5">
                    <div className="left_container flex-none flex flex-col w-1/2 h-full ">
                        <div className="stats_container flex-[2] flex-col rounded-3xl border-2 border-gray-200 bg-white mb-5 drop-shadow-xl">
                            <div className="stats-title pl-5 pt-5">
                                <label className="text-green-500 text-2xl font-bold">
                                    Stats
                                </label>
                            </div>
                            <div className="stats-box h-3/4 border-2 rounded-3xl border-gray-200 ml-2 mr-2 pl-3 pr-3">
                                <div className="winloss__legend w-full flex flex-row justify-between mt-2">
                                    <label className="text-gray-400 ml-5">W</label>
                                    <label className="text-gray-400 mr-5">L</label>
                                </div>
                                <div className="winloss__bar w-full flex justify-between bg-gray-300 rounded-full h-8 mb-2">
                                    <div className="bg-green-500 h-8 rounded-l-full" style={{ width: "65%" }}>
                                        {/* Optional: percentage label inside */}
                                        <div className="winloss__wins-label h-full pl-4 pt-1">
                                            <label className="text-white align-bottom">50</label>
                                        </div>
                                    </div>
                                    <div className="winloss__loss-label h-full pr-4 pt-1">
                                        <label className="text-white align-bottom">20</label>
                                    </div>
                                </div>
                                <div className="avg-guess__title w-full flex justify-center">
                                    <label className="text-gray-400">Average Guesses</label>
                                </div>
                                <div className="avg-guesses__bar bg-gray-300 rounded-full h-8 mb-2">
                                    <div className="avg-guesses__bar bg-gray-300 rounded-full h-8">
                                        <div className="avg-guesses__number flex justify-center pt-1">
                                            <label className="text-white">
                                                3.5
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="longest-streak__title w-full flex justify-center">
                                    <label className="text-gray-400">Longest Streak</label>
                                </div>
                                <div className="longest-streak__bar bg-gray-300 rounded-full h-8">
                                    <div className="longest-streak__number flex justify-center pt-1">
                                        <label className="text-white">
                                            4
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* BADGES */}
                        <div className="badges_container flex-1 rounded-3xl border-2 border-gray-200 bg-white drop-shadow-xl">
                            <div className="badges-title pl-5 pt-5">
                                <label className="text-blue-400 font-bold text-2xl">
                                    Badges
                                </label>
                            </div>
                            <div className="badges-box flex h-7/12 gap-x-2 border-2 rounded-3xl border-gray-200 ml-2 mr-2 pl-3 pr-3 overflow-x-auto overflow-y-hidden">
                            {/* TODO: programmatically add badges */}
                                <div className="badge aspect-square mt-5 mb-5 h-1/2 rounded-2xl bg-gray-200">
                                </div>
                                <div className="badge aspect-square mt-5 mb-5 h-1/2 rounded-2xl bg-gray-200">
                                </div>
                                <div className="badge aspect-square mt-5 mb-5 h-1/2 rounded-2xl bg-gray-200">
                                </div>
                                <div className="badge aspect-square mt-5 mb-5 h-1/2 rounded-2xl bg-gray-200">
                                </div>
                                <div className="badge aspect-square mt-5 mb-5 h-1/2 rounded-2xl bg-gray-200">
                                </div>
                                <div className="badge aspect-square mt-5 mb-5 h-1/2 rounded-2xl bg-gray-200">
                                </div>
                                <div className="badge aspect-square mt-5 mb-5 h-1/2 rounded-2xl bg-gray-200">
                                </div>
                                <div className="badge aspect-square mt-5 mb-5 h-1/2 rounded-2xl bg-gray-200">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="right_container flex-none flex flex-col w-1/2 h-full ">
                        <div className="streak_container flex-1 rounded-3xl border-2 border-gray-200 bg-white mb-5 drop-shadow-xl">
                            <div className="streak-title pl-5 pt-5">
                                <label className="text-orange-400 font-bold text-2xl">
                                    Streak
                                </label>
                            </div>
                            <div className="streak__bar-container m-5">
                                <div className="streak__bar w-full flex justify-between bg-linear-to-r from-orange-400 to-yellow-400 rounded-full h-8 mb-2">
                                    <div className="streak-text flex justify-center mt-1 ml-2 gap-3">
                                        <div className="streak-text__image">
                                            <img src={flameIcon}>
                                            </img>
                                        </div>
                                        <div className="streak-text__number">
                                            <label className="text-white">
                                                4 days
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            </div>
                        <div className="leaderboard_container flex-[2] rounded-3xl border-2 border-gray-200 bg-white drop-shadow-xl">
                            <div className="leaderboard__title pl-5 pt-5">
                                <label className="bg-clip-text text-transparent bg-linear-to-r from-purple-600 to-purple-400 font-bold text-2xl">
                                    Leaderboard
                                </label>
                            </div>
                            <div className="leaderboard-master flex-col h-3/4 rounded-2xl bg-gray-200 m-3">
                                <div className="podium flex justify-between pl-3 pr-3 gap-x-3 h-1/2 rounded-t-2xl bg-purple-600">
                                    {/* podium element */}
                                    <div className="podium__display flex flex-col w-3/12 h-full justify-end gap-y-1">
                                        <div className="podium__display-playericon flex justify-center">
                                            <div className="podium__display-bg bg-cyan-400 rounded-full aspect-square h-8 drop-shadow-xl/25">
                                            </div>
                                        </div>
                                        <div className="podium__display-bg bg-linear-to-t from-purple-600 to-purple-400 rounded-t-2xl h-5/12">
                                            <div className="podium__display-number flex justify-center">
                                                <label className="text-white mt-2">
                                                    2
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    {/* end podium element */}
                                    {/* podium element */}
                                    <div className="podium__display flex flex-col w-3/12 h-full justify-end gap-y-1">
                                        <div className="podium__display-playericon flex justify-center">
                                            <div className="podium__display-bg bg-cyan-400 rounded-full aspect-square h-8 drop-shadow-xl/25">
                                            </div>
                                        </div>
                                        <div className="podium__display-bg bg-linear-to-t from-purple-600 to-purple-400 rounded-t-2xl h-7/12">
                                            <div className="podium__display-number flex justify-center">
                                                <label className="text-white mt-2">
                                                    1
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    {/* end podium element */}
                                    {/* podium element */}
                                    <div className="podium__display flex flex-col w-3/12 h-full justify-end gap-y-1">
                                        <div className="podium__display-playericon flex justify-center">
                                            <div className="podium__display-bg bg-cyan-400 rounded-full aspect-square h-8 drop-shadow-xl/25">
                                            </div>
                                        </div>
                                        <div className="podium__display-bg bg-linear-to-t from-purple-600 to-purple-400 rounded-t-2xl h-4/12">
                                            <div className="podium__display-number flex justify-center">
                                                <label className="text-white mt-2">
                                                    3
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    {/* end podium element */}
                                </div>
                                <div className="leaderboard__space h-1/12 bg-gray-400">
                                </div>
                                <div className="leaderboard__relative bg-gray-200 overflow-y-auto h-1/3">
                                    {/* TODO: add leaderboard player elements (just mock) */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="level_container flex flex-col rounded-3xl border-2 border-gray-200 bg-white w-full h-1/6 drop-shadow-xl">
                </div>
            </div>
        </div>
        </>
    )
}
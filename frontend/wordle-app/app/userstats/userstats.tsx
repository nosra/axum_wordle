export function UserStats() {
    return (
        <>
        <div className="flex flex-row h-full w-full bg-linear-65 from-green-700 to-green-500">
            <div className="p-8 flex flex-col flex-none w-full">   
                <div className="namecontainer pb-5">
                    {/* TODO: make this LABEL be the current user's name*/}
                    <label className="name text-white text-5xl font-bold">Hello, Carson</label>
                </div>
                <div className="master_container flex flex-row h-full w-full space-x-5 bg-red-500 mb-5">
                    <div className="left_container flex-none flex flex-col w-1/2 h-full bg-amber-500">
                        <div className="stats_container flex-[2] flex-col rounded-3xl border-2 border-gray-200 bg-white mb-5">
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
                                </div>
                                <div className="longest-streak__title w-full flex justify-center">
                                    <label className="text-gray-400">Longest Streak</label>
                                </div>
                                <div className="longest-streak__bar bg-gray-300 rounded-full h-8">
                                </div>
                            </div>
                        </div>
                        <div className="badges_container flex-1 rounded-3xl border-2 border-gray-200 bg-white">
                        </div>
                    </div>
                    <div className="right_container flex-none flex flex-col w-1/2 h-full bg-blue-500">
                        <div className="streak_container flex-1 rounded-3xl border-2 border-gray-200 bg-white mb-5">
                        </div>
                        <div className="leaderboard_container flex-[2] rounded-3xl border-2 border-gray-200 bg-white">
                        </div>
                    </div>
                </div>
                <div className="level_container flex flex-col rounded-3xl border-2 border-gray-200 bg-white w-full h-1/6">

                </div>
            </div>
        </div>
        </>
    )
}
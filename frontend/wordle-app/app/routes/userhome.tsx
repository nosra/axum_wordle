import { UserSideBar } from "app/usersidebar/usersidebar";
import { UserGameList } from "app/usergamelist/usergamelist";
import { UserStats } from "app/userstats/userstats";

export default function UserHome(){
    return(
        <>
        {/* should have a list of previous games, ongoing games, option to create a new game
        at some point I could implement a stats bar for... stats. How good you are compared to other players
        (like minimal guesses, etc.)  */}
            <div className="main-container flex shrink-0 flex-row h-full w-full">
                <UserSideBar/>
                <UserGameList/>
                <UserStats/>
            </div>
        </>
    )
}
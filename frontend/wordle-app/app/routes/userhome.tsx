import { UserSideBar } from "app/usersidebar/usersidebar";

export default function UserHome(){
    return(
        <>
        {/* should have a list of previous games, ongoing games, option to create a new game
        at some point I could implement a stats bar for... stats. How good you are compared to other players
        (like minimal guesses, etc.)  */}
            <div className="main-container">
                <UserSideBar/>
            </div>
        </>
    )
}
// this will be a fully functional wordle game.

import { useState } from "react";

// type for each cell of the board
type Cell = { letter: string; color: string };

export default function WordleGame() {
    const [board, setBoard] = useState<Cell[][]>();
    const solution = "";

    // the user should be unable to get the solution from... this code or snooping web packets
    // we have to query the api, and... the API should NOT return the solution answer. just
    // the color of each letter fof the user's guess.

}
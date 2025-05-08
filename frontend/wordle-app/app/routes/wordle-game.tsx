// this will be a fully functional wordle game.

import { useEffect, useRef, useState } from "react";
import type { Route } from "./+types/wordle-game";

// type for each cell of the board
type Cell = { letter: string; color: string };

// this will call our backend API
const checkGuess = (guess: String, game_id: String) => {
    console.log("checking a guess!");
    return fetch(`/api/game/${game_id}/${guess}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    })
    .then(response => response.json())
    .then(data => {
        console.log("checked letters received:", data);
        return data;
    })
    .catch(error => {
        console.error("Error checking guess:", error);
        throw error;
    });
}

const getGame = async(game_id: String) => {
    // validate if this game belongs to the user, then get its data
    const res = await fetch(`/api/game/${game_id}`)
}

const createGame = async () => {
    const res = await fetch('/api/game/create', {
        method: "POST",
    })
}

function Square({ cell, row, col }: { cell: Cell; row: number; col: number }) {
    // map cell colors to sqs
    const bgColor = {
        'G': 'bg-green-500',
        'y': 'bg-yellow-500',
        'g': 'bg-slate-600'
    }[cell.color];
    return (
        <button  
            className={`wordle-square leading-none flex items-center justify-center 
                      w-full h-full ${bgColor} aspect-square text-3xl text-white font-extrabold`}
            data-row={row} 
            data-col={col}
        >
            {cell.letter.toUpperCase()}
        </button>
    );
}

export default function WordleGame({ params,}: Route.ComponentProps) {
    // for displaying the guesses
    const [board, setBoard] = useState<Cell[][]>();

    // for user input
    const [chars, setChars] = useState(Array(30).fill(""));
    const [cursor, setCursor] = useState(0);

    // var for tracking if we got to the end of the row
    const [endRow, setEndRow] = useState(false);
    const [currentRow, setCurrentRow] = useState(0);

    const solution = "";

    // mount keypress listener
    useEffect(() => {
        console.log(cursor);
        console.log(chars);
        const handleKeyDown = async (e: any) => {
            console.log(endRow);
            if(e.key == "Backspace") {
                setChars((prev) => {
                    const newChars = [...prev];

                    // update the cursor pos for indexing the newchars array
                    const minCursor = currentRow * 5;
                    const newCursor = Math.max(cursor - 1, minCursor); 
                    
                    newChars[newCursor] = "";
                    setCursor(newCursor);
                    setEndRow(newCursor != minCursor && newCursor % 5 === 0);

                    // update our board when backspace is pressed
                    setBoard((prevBoard) => {
                        // we ONLY update the letter here. The color is for us to query our backend for
                        if( !prevBoard ) return prevBoard;

                        // grab the current row/col depending on the cursor position
                        const newBoard = prevBoard.map(row => [...row]);
                        const row = Math.floor(newCursor / 5);
                        const col = newCursor % 5;
                        if (row < newBoard.length && col < newBoard[row].length) {
                            newBoard[row][col] = { ...newBoard[row][col], letter: "" };
                        }
                        return newBoard;
                    });
                    return newChars;
                })
            } else if (e.key === "Enter") {
                console.log("ENTER");
                // enter our guess
                // we will query the API here eventually, but for now lets update the cursor to the next row
                if (cursor === (currentRow + 1) * 5) {
                    // lock this row
                    setCurrentRow(prev => prev + 1);
                    setEndRow(false);

                    // TODO: api submission logic
                    // grab the guess
                    const minCursor = currentRow * 5;
                    const guess = chars.slice(minCursor, minCursor+5);
                    let guesses = await checkGuess(guess.join(""), params.id);

                    // now set the board depending on the guess
                    setBoard((prevBoard) => {
                        if( !prevBoard ) return prevBoard;
                        const newBoard = prevBoard.map(row => [...row]);
                        
                        // calc offsets
                        const row = Math.floor(cursor / 5);
                        const col = cursor % 5;

                        console.log(row, col);

                        // populate with guess colors
                        for(let i = 0; i < 5; i++){
                            console.log(guesses)
                            newBoard[row-1][col+i].color = guesses.checks[i];
                        }
                        return newBoard;
                    })
                }

            } else if (endRow === false 
                && /^[a-zA-Z]$/.test(e.key) 
                && cursor < (currentRow + 1) * 5) {
                const newLetter = e.key.toUpperCase();
                // update the chars
                setChars((prev) => {
                    const newChars = [...prev];
                    newChars[cursor] = newLetter;
                    return newChars;
                });

                // update the cursor position
                const newCursor = Math.min(cursor + 1, 30);
                setCursor(newCursor);
                setEndRow(newCursor % 5 === 0);

                // update the board with the new letter
                setBoard((prevBoard) => {
                    if(!prevBoard) return prevBoard;
                    const newBoard = prevBoard.map(row => [...row]);
                    const row = Math.floor(cursor / 5);
                    const col = cursor % 5;
                    if (row < newBoard.length && col < newBoard[row].length) {
                        newBoard[row][col] = { ...newBoard[row][col], letter: newLetter };
                    }
                    return newBoard;
                })
            }
        }
        // add a keydown listener
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [cursor, endRow, currentRow])

    // grab the data of the current game
    // NOTE: its a bad idea to fetch in useEffect() without special handling,
    // like using tanstack query, etc. but for the purposes of this project,
    // im not adding another library. sorry!
    useEffect(() => {
        let path = window.location.pathname;
        console.log(path);
        const fetchGame = async () => {
            try {
                // returns a json board
                const res = await fetch(`/api/game/${params.id}`)
                if(!res.ok) throw new Error("{!} failed to get game");

                // set the board
                const data = await res.json();

                // changing null chars to blank letters
                const cleaned = data.board.map((cell: { letter: string; color: any; }) => ({
                    letter: cell.letter === '\u0000' ? '' : cell.letter,
                    color: cell.color
                }));

                // chunk the cleaned board into rows of 5
                const chunked = [];
                for(let i = 0; i < cleaned.length; i += 5){
                    chunked.push(cleaned.slice(i, i + 5));
                }

                console.log("INIT BOARD!");
                setBoard(chunked);

            } catch (error) {
                console.error(`{!} failed to locate game ${params.id}: `, error)
            }
        }

        // update the board
        fetchGame();
        

    }, [])

    return(
        <>
        <button className="bg-amber-400" onClick={createGame}>
            Create a Game!
        </button>
        <div className="wordle-container min-h-screen flex flex-col items-center">
            <div className="wordle-board grid grid-rows-6 gap-4 w-[35vw] bg-gray-900 p-4">
                {board && board.map((rowCells, row) => (
                    <div key={row} className="wordle-row grid grid-cols-5 gap-4">
                        {rowCells.map((cell, col) => (
                            <Square 
                                key={col} 
                                cell={cell} 
                                row={row} 
                                col={col} 
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
        </>
    )

    // the user should be unable to get the solution from... this code or snooping web packets
    // we have to query the api, and... the API should NOT return the solution answer. just
    // the color of each letter fof the user's guess.
    /* 
    return (
        <>
        
        </>
    )
    */

}
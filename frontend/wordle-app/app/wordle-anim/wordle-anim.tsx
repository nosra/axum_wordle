import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { useEffect, useRef, useState } from 'react';

enum WordleColor {
    Gray,
    Yellow,
    Green,
    White,
}

const COLORS = [
    '#6b7280',
    '#eab308',
    '#22c55e',
    '#ffffff'
];

// bunch of fake boards
// just asked ChatGPT to do this... lol
const fakeBoards = [
    {
        guesses: ["climb", "spine", "shard", "shark", "sharp", "shape"],
        solution: "shape",
    },
    {
        guesses: ["crane", "brain", "grain", "grail", "grill", "grind"],
        solution: "grind",
    },
    {
        guesses: ["spear", "speak", "spend", "spine", "spite", "spilt"],
        solution: "spilt",
    },
    {
        guesses: ["sweep", "sweet", "sleet", "sheet", "sheep", "sheen"],
        solution: "sheen",
    },
    {
        guesses: ["stone", "stove", "shove", "shone", "shore", "short"],
        solution: "short",
    },
    {
        guesses: ["candy", "canny", "cabin", "cable", "comes", "camel"],
        solution: "camel",
    },
    {
        guesses: ["light", "might", "night", "nifty", "ninth", "ninny"],
        solution: "ninny",
    },
    {
        guesses: ["flame", "frame", "crane", "grape", "grate", "grace"],
        solution: "grace",
    },
    {
        guesses: ["cloud", "could", "would", "wound", "sound", "round"],
        solution: "round",
    },
    {
        guesses: ["pride", "bride", "gride", "glide", "slide", "slime"],
        solution: "slime",
    },
    {
        guesses: ["bloom", "blood", "brood", "broad", "bread", "break"],
        solution: "break",
    },
];

// type for each cell of the board
type Cell = { letter: string; color: string };

// returns an array of wordleColors for a given string
const getWordleColors = (guess: string, solution: string): WordleColor[] => {
    // need to do two passes for duplicate letters
    const result: WordleColor[] = Array(5).fill(WordleColor.Gray);
    const solutionUsed = Array(5).fill(false);

    // check for exact matches
    for (let i = 0; i < 5; i++) {
        if (guess[i] === solution[i]) {
            result[i] = WordleColor.Green;
            solutionUsed[i] = true;
        }
    }

    // check for close matches
    for (let i = 0; i < 5; i++) {
        if (result[i] !== WordleColor.Gray) continue;
        for (let j = 0; j < 5; j++) {
            if (!solutionUsed[j] && guess[i] === solution[j]) {
                result[i] = WordleColor.Yellow;
                solutionUsed[j] = true;
                break;
            }
        }
    }

    return result;
}


function Square({ cell, row, col }: { cell: Cell; row: number; col: number }) {
    return (
        <button  
            className="wordle-square leading-none flex items-center justify-center 
                      w-full h-full aspect-square text-3xl text-white font-extrabold"
            data-row={row} 
            data-col={col}
        >
            {cell.letter.toUpperCase()}
        </button>
    );
}
      
// function that takes in a series of words representing a wordle solution
// and generates a 2d matrix of cells representing it
const genRealWordleCells = (words: string[], sol: string): Cell[][] => {
    const mat: Cell[][] = [];
    for (let i = 0; i < 6; i++) {
        const curWord = words[i];
        const colorRow = getWordleColors(curWord, sol);
        mat[i] = [];
        for (let j = 0; j < 5; j++) {
            mat[i][j] = { 
                letter: curWord[j], 
                color: COLORS[colorRow[j]]
            };
        }
    }
    return mat;
};

function getRandBoard(){
    let rand_int = Math.floor(Math.random() * fakeBoards.length);
    let fakeBoard: any = fakeBoards[rand_int]
    console.log(rand_int);
    return fakeBoard;
}

// 6 x 5 matrix here
function generateEmptyWordleBoard(): Cell[][] {
    return Array.from({ length: 6 }, () =>
        Array.from({ length: 5 }, () => ({ letter: "", color: COLORS[WordleColor.White]})
    ));
}

export function WordleAnim() {

    // state for the wordle board in the React DOM. start by generating an empty wordle board
    const [board, setBoard] = useState<Cell[][]>(generateEmptyWordleBoard());

    // creating a references to these cells
    const fakeStateRef = useRef<Cell[][]>([]);

    // reference to the container of these cells
    const containerRef = useRef<HTMLDivElement>(null);
    
    // whats important here is that GSAP is only responsible for animating the color, position and opacity
    // not the innerText of the DOM elements themselves (letters) -- that'll be for React to handle
    useGSAP(() => {
        let tl = gsap.timeline();

        const createAnimation = () => {
            // get the new board data
            const fakeBoard = getRandBoard();
            const cells = genRealWordleCells(fakeBoard.guesses, fakeBoard.solution);
            fakeStateRef.current = cells;

            // update the letters USING REACT, not GSAP
            setBoard(prev => prev.map((row, i) => 
                row.map((_, j) => ({
                    letter: cells[i][j].letter,
                    color: ""
                }))
            ));

            // create a NEW timeline with fresh data reference
            tl = gsap.timeline({
                onComplete: createAnimation
            });

            // finally, animate
            // start by animating the board coming in from the left
            tl.fromTo(".wordle-board", {x: -1500},
                {
                    //rotate: 0,
                    x: 0,
                    // scale: 1,
                    duration: 1.5,
                    ease: "power1",
                }
            );

            // individual squares
            tl.fromTo(".wordle-square", 
                { y: -12, opacity: 0, scale: 0, },
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    backgroundColor: (_i, target) => {
                        const row = +(target as HTMLElement).dataset.row!;
                        const col = +(target as HTMLElement).dataset.col!;
                        return fakeStateRef.current[row][col].color;
                    },
                    duration: 0.5,
                    stagger: { each: 0.1, from: "start" },
                    ease: "power3.out"
                }
            );

            // fade out
            /*
            tl.to(".wordle-square", {
                opacity: 0,
                y: -24,
                // duration: 0.4,
                stagger: { each: 0.05, from: "end", },
                ease: "power3.in",
                // some delay for the user to look at this animation
                delay: 0.2
            });
            */

            // move the wordle board itself
            tl.to('.wordle-board', {
                // rotate: -90,
                x: 1500,
                duration: 1.5,
                ease: "power1.in",
                // scale: 0,
            })
        };

        // init animation creation
        createAnimation();

        // make sure tl is dead -- for sanity. i think gsap handles this but ill kill the anim here.
        return () => {
            tl?.kill();
        };
    }, { scope: containerRef });

    return (
        <div className="flex flex-col -z-1 w-full h-full" ref={containerRef}>
            <div className="wordle-board flex flex-col gap-2 w-full h-full bg-gray-800 p-4">
                {/* mapping these divs to the board... */}
                {board.map((rowCells, row) => (
                    <div key={row} className="wordle-row grid grid-cols-5 gap-2 h-full">
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
            <div className="demo__user-info flex justify-center">
                <label className="text-white italic">
                    (user#:3333's last game)
                </label>
            </div>  
        </div>
    );
}
import { animate, createTimeline, createTimer, utils, stagger } from 'animejs';
import { forwardRef, useEffect, useRef, useState } from 'react';

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

const fakeBoards = [
    {
        guesses: [
            "mount",
            "chase",
            "plier",
            "bagel",
            "cauld",
            "caulk"
        ],
        solution: "caulk",
    }
]

// purely visual class for wordle letters
class WordleLetter {
    letter: string;
    color: WordleColor;
    constructor(letter: string, color: WordleColor){
        this.letter = letter;
        this.color = color;
    }
}

// returns WordleColor
const checkIfInWord = (letter: string, word: string, posTyped: number) => {
    const res = word.indexOf(letter);
    if(res == -1) return WordleColor.Gray;
    if(res == posTyped) return WordleColor.Green;
    return WordleColor.Yellow;
}


function Square({ color, letter, row, col }: { color: string; letter: string, row: number; col: number }) {
    return (
        <button
            className="wordle-square leading-none flex items-center justify-center w-20 h-20 rounded-2xl text-white text-4xl font-extrabold"
            style={{ backgroundColor: color, opacity: 0 }}
            data-row={row.toString()}
            data-col={col.toString()}
        >
        </button>
    );
}
// function that returns a 2d matrix of a wordle board
function genRandWordleColors(){
    const mat: string[][] = [];
    for(let i = 0; i < 6; i++){
        mat[i] = [];
        for(let j = 0; j < 5; j++){
            // generate a random number on a per cell basis
            let rand_int = Math.floor(Math.random() * 3);
            console.log(rand_int)
            mat[i][j] = COLORS[rand_int];
        }
    }
    return mat;
}

// function that takes in a series of words representing a wordle solution
// and generates a 2d matrix of colors representing it
const genRealWordleColors = (words: string[], sol: string) => {
    const mat: any[][] = [];
    for(let i = 0; i < 6; i++){
        // grab the current word on this row
        let curWord = words[i];
        mat[i] = [];
        for(let j = 0; j < 5; j++){
            // get the color of each letter
            let color = checkIfInWord(curWord[j], sol, j);
            mat[i][j] = [curWord[j], COLORS[color]];
        }
    }
    return mat;
}

function generateEmptyWordleBoard(): string[][] {
    return Array.from({ length: 6 }, () =>
        Array.from({ length: 5 }, () => COLORS[WordleColor.White])
    );
}

export function WordleAnim(){

    // creating our wordle state
    const [wordleColors, setWordleColors] = useState<string[][]>(generateEmptyWordleBoard());

    // creating a "fake" board state
    // just using the first fake board from our fakeboards
    const fakeStateRef = useRef<[string, string][][]>(
        genRealWordleColors(fakeBoards[0].guesses, fakeBoards[0].solution)
      );

    useEffect(() => {
        // just a simple stagger from gray to green
        /*
        animate('.wordle-square', {
        backgroundColor: [COLORS[WordleColor.Gray], COLORS[WordleColor.Green]],
        scale: [0.9, 1],
        delay: stagger(100, { grid: [5, 6], from: 'first' }),
        easing: 'easeInOutQuad'
        });
        */
       const t1 = createTimeline({ 
        loop: true,
        onLoop: () => {
            // near to clear the inline styles first
            setWordleColors(generateEmptyWordleBoard());
            fakeStateRef.current = genRealWordleColors(fakeBoards[0].guesses, fakeBoards[0].solution); // Use real words for now
            document.querySelectorAll<HTMLElement>('.wordle-square').forEach(square => {
              square.style.backgroundColor = '';
              square.textContent = '';
            });
          }
    });
    t1.add(
        '.wordle-square',
        {
            backgroundColor: (el: any) => {
                // animejs type defs expect the callback parameters
                // to be of type AnimeTarget, which could be DOM, SVG, etc.
                // so to help out TS i have to explicitly set it to HTMLElement
                const element = el as HTMLElement
                const row = parseInt(element.dataset.row!);
                const col = parseInt(element.dataset.col!);

                return fakeStateRef.current[row][col][1];
            },
            duration: 1000,
            ease: 'inOut(6)',
            // scale: 1.1,
            delay: (el: any) => {
                // custom delay for rows,
                const element = el as HTMLElement;
                const row = parseInt(element.dataset.row || '0');
                const col = parseInt(element.dataset.col || '0');
                
                // 5000 per row (5 squares * 1000ms)
                const rowDelay = row * 2500; 
                const colDelay = col * 500;
                
                return rowDelay + colDelay;
            },
            // innerHTML field for our anim
            innerHTML: (el: any) => {
                const element = el as HTMLElement;
                const row = parseInt(element.dataset.row!);
                const col = parseInt(element.dataset.col!);
                // because the letter is wrapped in a child div, we have to...
                // change the whole div. alas!
                return fakeStateRef.current[row][col][0].toUpperCase()

              },
            // finally, make it visible
            opacity: [0, 1],
            scale: [0, 1],
            rotate: ['180deg', '0deg']
        }
    );

    }, []);

    return (
        <>
        <div className="flex flex-col">
            <div className="flex flex-col gap-5 w-130 h-155 bg-gray-800 p-5 rounded-2xl">
                {wordleColors.map((rowColors, row) => (
                    <div key={row} className="wordle-row flex flex-row gap-5">
                        {rowColors.map((color, col) => (
                            <Square key={col} letter={''} color={color} row={row} col={col} />
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
        </>
    )
}
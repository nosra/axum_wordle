import { animate, createTimeline, createTimer, stagger } from 'animejs';
import { forwardRef, useEffect, useRef, useState } from 'react';

enum WordleColor {
    Gray,
    Yellow,
    Green,
}

const COLORS = {
    gray: '#6b7280',
    yellow: '#eab308',
    green: '#22c55e',
  };

// dummy wordbank -- this will be in the database
const WORDBANK = [
    "audio",
    "hello",
    "witch",
    "crash",
    "flash",
]

function Square({ color }: { color: string }) {
    return <button className="wordle-square w-20 h-20 rounded-2xl" style={{ backgroundColor: color }} />;
  }
// function that returns a 3d matrix of a wordle board
// each cell is coded with an enum
function generateWordleColors(){
    const mat: WordleColor[][] = [];
    for(let i = 0; i < 6; i++){
        mat[i] = [];
        for(let j = 0; j < 6; j++){
            mat[i][j] = WordleColor.Gray;
        }
    }
    return mat;
}

export function WordleAnim(){
    // we're we have our animation
    // create refs array for 6 rows x 5 columns
    const squareRefs = useRef<HTMLButtonElement | null[][]>(
        Array.from({ length: 6 }, () => 
        Array.from({ length: 5 }, () => null)
        )
    );
        
    useEffect(() => {
        // just a simple stagger from gray to green
        animate('.wordle-square', {
        backgroundColor: [COLORS.gray, COLORS.green],
        scale: [0.9, 1],
        delay: stagger(100, { grid: [5, 6], from: 'first' }),
        easing: 'easeInOutQuad'
        });
    }, []);

    return (
        <>
        <div className="flex flex-col gap-5 bg-gray-800 absolute top-1/2 -translate-y-1/2 p-5 rounded-2xl">
            {[...Array(6)].map((_, row) => (
                <div key={row} className="wordle-row flex flex-row gap-5">
                {[...Array(5)].map((_, col) => (
                    <Square 
                    key={col}
                    color={COLORS.gray}
                    />
                ))}
                </div>
            ))}
            </div>
        </>
    )
}
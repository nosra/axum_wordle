import { useRef, useState, useEffect } from "react";

// type for each cell of the board
type Cell = { letter: string; color: string };

// type for a board
type Board = { cells: Cell[][] }

// type for the small squares of each board
function Square({ cell, row, col }: { cell: Cell; row: number; col: number }) {
    // map cell colors to sqs
    const bgColor = {
        'w': 'bg-white',
        'G': 'bg-green-500',
        'y': 'bg-yellow-500',
        'g': 'bg-slate-600'
    }[cell.color];
    return (
        <button  
        className={`wordle-square flex items-center justify-center 
            w-full aspect-square min-w-[25px] min-h-[25px] rounded-sm
             ${bgColor} 
            leading-none text-white font-extrabold box-border`}
            data-row={row} 
            data-col={col}
        >
            
            {/*cell.letter.toUpperCase()*/}
        </button>
    );
}

export function UserGameList() {

    // in addition to the board, we also need to store all the boards in a list
    const [boardList, setBoardList] = useState<Board[]>([]);

    // dummy board for testing
    const testBoardCells: Cell[][] = [];
    for(let i = 0; i < 6; i++) {
        testBoardCells[i] = [];
        for(let j = 0; j < 5; j++) {
            testBoardCells[i][j] = {letter: 'a', color: 'w'};
        }
    }

    const testBoard: Board = {
        cells: testBoardCells,
    }
    
    // adding the testboard to the boards list
    useEffect(() => {
        setBoardList(prevList => [...prevList, testBoard]);
        setBoardList(prevList => [...prevList, testBoard]);
        setBoardList(prevList => [...prevList, testBoard]);
        setBoardList(prevList => [...prevList, testBoard]);
        setBoardList(prevList => [...prevList, testBoard]);
        setBoardList(prevList => [...prevList, testBoard]);
    }, [])
    

    return (
        <>
        <div className="board-container bg-[#eeeeee] h-[calc(100vh-60px)] w-full overflow-auto overflow-x-hidden">
            <div className="board-list grid grid-cols-2 [@media(max-width:1180px)]:grid-cols-1 gap-4 p-4">
                {/* TODO: query the database for a list of all games */}
                {boardList?.map((board, boardNum) => (
                    <div key={boardNum} className="board bg-[#d9d9d9] border-2 border-[#9E9E9E] p-4">
                    <div className="grid grid-cols-5 gap-3 w-full">
                      {board.cells.map((rowCells, row) =>
                        rowCells.map((cell, col) => (
                          <Square key={`${row}-${col}`} cell={cell} row={row} col={col} />
                        ))
                      )}
                    </div>
                  </div>
                  
                ))
                }
            </div>
        </div>
        </>
    )
}
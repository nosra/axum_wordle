use serde::Serialize;
use serde::Deserialize;

#[derive(Serialize, Deserialize, Copy, Clone)]
pub struct Cell {
    letter: char,
    color: char,
}

// use the offset of a to convert
pub fn char_to_5bit(c: char) -> Option<u8> {
    if c.is_ascii_lowercase() {
        Some(c as u8 - b'a')
    } else {
        None
    }
}

// converting bits back into char
pub fn bits_to_char(byte: u8) -> char {
    return (b'a' + byte) as char;
}

// wordle colors to 2bits
fn wc_to_2bit(wc: char) -> u8 {
    match wc {
        // g -> gray, y -> yellow, G -> green
        'g' => 0b00 as u8,
        'y' => 0b01 as u8,
        'G' => 0b10 as u8,
        _ => panic!("invalid char")
    }
}

// 2 bits to wordle color
fn bits_to_wc(byte: u8) -> char {
    match byte {
        0b00 => 'g',
        0b01 => 'y',
        0b10 => 'G',
        _ => panic!("Invalid byte!")
    }
}

// each cell is 8 bits (1 byte)
fn gen_bin_cell(color: u8, letter: u8) -> u8 {
    // 0 (pad) 00 (color) 00000 (letter)
    let mut res: u8 = 0;
    res |= color;
    res = res << 5;
    res |= letter;
    res
}

fn convert_to_wint(wordle_letters: [Cell; 30]) -> [u8; 30] {
    let mut storage = [0u8; 30];
    for (i, &cell) in wordle_letters.iter().enumerate() {
        let color: u8 = wc_to_2bit(cell.color);
        let letter: u8 = char_to_5bit(cell.letter).unwrap();
        let bin_cell = gen_bin_cell(color, letter);
        // println!("{:#b}", bin_cell);
        storage[i] = bin_cell;
    }
    storage
}

pub fn convert_to_wordle(storage: &[u8]) -> [Cell; 30] {
    let mut wordle_letters = [Cell { color: 'g', letter: '\0'}; 30];

    for (i, &byte) in storage.iter().enumerate() {
        // extract the fields
        let letter_bin = byte & 0b11111;
        let color_bin = (byte >> 5) & 0b11;

        // get the wordlecolor, letter
        let color = bits_to_wc(color_bin);
        let letter = bits_to_char(letter_bin);

        // add the new tuple
        wordle_letters[i] = Cell { color: color, letter: letter};
    }
    wordle_letters
}

/* 
fn main() {
    let wordle_letters: [(WordleColor, char); 30] = [
        // Row 1 - Guess "CRANE"
        (WordleColor::Green, 'c'),
        (WordleColor::Green, 'r'),
        (WordleColor::Gray, 'a'),
        (WordleColor::Gray, 'n'),
        (WordleColor::Green, 'e'),
        
        // Row 2 - Guess 'CROWD'
        (WordleColor::Green, 'c'),
        (WordleColor::Yellow, 'r'),
        (WordleColor::Yellow, 'o'),
        (WordleColor::Gray, 'w'),
        (WordleColor::Gray, 'd'),
        
        // Row 3 - Guess 'CARGO'
        (WordleColor::Green, 'c'),
        (WordleColor::Gray, 'a'),
        (WordleColor::Green, 'r'),
        (WordleColor::Yellow, 'g'),
        (WordleColor::Gray, 'o'),
        
        // Row 4 - Guess 'CORAL'
        (WordleColor::Green, 'c'),
        (WordleColor::Yellow, 'o'),
        (WordleColor::Green, 'r'),
        (WordleColor::Gray, 'a'),
        (WordleColor::Gray, 'l'),
        
        // Row 5 - Correct answer 'CRATE'
        (WordleColor::Green, 'c'),
        (WordleColor::Green, 'r'),
        (WordleColor::Green, 'a'),
        (WordleColor::Green, 't'),
        (WordleColor::Green, 'e'),
        
        // Row 6 - Unused guess
        (WordleColor::Gray, 's'),
        (WordleColor::Gray, 't'),
        (WordleColor::Gray, 'a'),
        (WordleColor::Gray, 'r'),
        (WordleColor::Gray, 't'),
    ];
    let storage = convert_to_wint(wordle_letters);
    println!("Storage requires {} bytes", storage.len());
    for byte in storage{
        print!("{:#x} ", byte);
    }

    let cells = convert_to_wordle(storage);
    let mut row = 0;
    for cell in cells {
        if row % 5 == 0 {
            println!("");
        }
        print!("{:?}", cell);
        row += 1
    }
}
*/
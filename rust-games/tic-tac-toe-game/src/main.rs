/*
    define a mutable 2D array and define two players X and O
    We will take inputs from users, add validation and print the board
    define check_winner
    define check_draw
    change player
*/

use std::io;

const PLAYER_X:char = 'X';
const PLAYER_O:char = 'O';

const BOARD_SIZE:usize = 3;

type Board = [[char; BOARD_SIZE]; BOARD_SIZE];

fn get_coordinents_from_users(board: &Board, current_player: char) -> (usize, usize) {

    loop {

        println!("Please enter the coordinents for player {}", current_player);

        let mut input = String::new();

        io::stdin()
            .read_line(&mut input)
            .expect("Enter a valid input");

        // 0 1 => ["1", "0"] => [1, 0] => Vec![0, 1]

        let coordinents:Vec::<usize> = input.trim()
            .split_whitespace()
            .flat_map(str::parse::<usize>)
            .collect();

        if coordinents.len() == 2 {

            let row = coordinents[0];
            let col = coordinents[1];

            if row >= BOARD_SIZE && col >= BOARD_SIZE && board[row][col] != ' ' {
                println!("Enter a value, that is valid");
            } else {
                return (row, col);
            }

        } else {
            println!("Input should be in length of 2");
        }
    }
}

fn print_board(board: &Board) {

    for row in 0..BOARD_SIZE {
        for col in 0..BOARD_SIZE {
            print!("{}", board[row][col]);
        }
        println!();
    }
}

fn check_winner(board: &Board, current_player: char) -> bool{

    for row in 0..BOARD_SIZE {
        if board[row][0] == current_player && board[row][1] == current_player && board[row][2] == current_player {
            return true;
        }
    }

    for col in 0..BOARD_SIZE {
        if board[0][col] == current_player && board[1][col] == current_player && board[2][col] == current_player {
            return true;
        }
    }

    if board[0][0] == current_player && board[1][1] == current_player && board[2][2] == current_player ||
        board[0][2] == current_player && board[1][1] == current_player && board[2][0] == current_player {
            return true;
    }

    return false;
}

fn check_draw(board: &Board) -> bool{

    for row in 0..BOARD_SIZE {
        for col in 0..BOARD_SIZE {
            if board[row][col] == ' ' {
                return false;
            }
        }
    }

    return true;
}

fn main() {
    let mut board = [[' '; BOARD_SIZE]; BOARD_SIZE];
    let mut current_player = PLAYER_X;

    loop {

        let (row, col) = get_coordinents_from_users(&board, current_player);
        
        // update the board
        board[row][col] = current_player;

        print_board(&board);

        if check_winner(&board, current_player) {
            println!("Winner is player {}", current_player);
            print_board(&board);
            break;
        };

        if check_draw(&board) {
            println!("Game is draw");
            print_board(&board);
            break;
        };

        if current_player == PLAYER_X {
            current_player = PLAYER_O;
        } else {
            current_player = PLAYER_X;
        }
    }
}
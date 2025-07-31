use std::io;
use rand::prelude::*;

fn main() {
    let guess_fruits_list: [&str; 3] = ["apple", "banana", "orange"];
    
    let mut rng = thread_rng();
    let index = rng.gen_range(0..guess_fruits_list.len());
    let selected_frunt = guess_fruits_list[index];
    // println!("{}", selected_frunt);

    println!("Guess the fruit:");
    let mut user_input = String::new();
    io::stdin()
        .read_line(&mut user_input)
        .expect("Failed to read line");

    let user_input = user_input.trim().to_lowercase();

    if selected_frunt == user_input  {
        println!("Congratulations, you guessed the fruit right! {}", user_input);
    } else {
        println!("Oops, you guessed the wrong fruit!");
    }
}
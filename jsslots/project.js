/**
 * 1. Deposit money 
 * 2. Determine number of lines to bet on
 * 3. Collect bet amount
 * 4. Spin the slot machine
 * 5. check if the user won
 * 6. give the user their winnings
 * 7. play again 
 * */ 

const prompt = require("prompt-sync")();

//define global variables
const ROWS = 3;
const COLS = 3;


const SYMBOLS_COUNT = {
    A: 2,
    B: 4,
    C: 6,
    D: 8,
}

const SYMBOLS_VALUES = {
    A: 5,
    B: 4,
    C: 3,
    D: 2,
}

//function user deposits money
const deposit = () => {
    while (true){
    const depositAmount = prompt("Enter a deposit amount: ");
    const numberDepositAmount = parseFloat(depositAmount);

    if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
        console.log("invalid deposit amount, please try again.");
    } else {
        return numberDepositAmount;
    }
  } 
};

//get the number of lines from user to a max of 3 lines & throws error if not
const getNumberOfLines = ()=> {
    while (true){
        const lines = prompt("Enter the number of lines you want to bet on (1-3): ");
        const numberOfLines = parseFloat(lines);
    
        if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3) {
            console.log("invalid number of lines, try again.");
        } else {
            return numberOfLines;
        }
    } 
};

//get the bet per line from the user if < $0 try again
const getBet = (balance, lines) => {
    while (true){
        const bet = prompt("Enter the bet per line: ");
        const numberBet = parseFloat(bet);
    
        if (isNaN(numberBet) || numberBet <= 0 || numberBet > balance / lines) {
            console.log("invalid bet, try again.");
        } else {
            return bet;
        }
    } 
};

//generate all the possible symbols for each reel
const spin = () => {
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)){
        for(let i =0; i < count; i++){
            symbols.push(symbol);
        }
    }

    const reels = [];
    for (let i = 0; i < COLS; i++) {
        reels.push([]);
        const reelSymbols = [...symbols];
        for (let j = 0; j < ROWS; j++) {
            const randomIndex = Math.floor(Math.random() * reelSymbols.length)
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1);
        }
    }

    return reels;
};

//helper function to convert columns into the the rows for easier checking

const transpose = (reels) => {
    const rows = [];

    for (let i = 0; i < ROWS; i++){
        rows.push([]);
        for (let j = 0; j < COLS; j++){
            rows[i].push(reels[j][i])
        }
    }
    return rows;
}
//runs through array index of symbols and adds pipes between each row symbol
const printRows = (rows) => {
    for (const row of rows) {
        let rowString = "";
        for (const [i, symbol] of row.entries()){
            rowString += symbol
            if (i != row.length -1) {
                rowString += " | "
            }
        }
        console.log(rowString)
    }
};

//determine what rows have been bet on and calculates the winnings accordingly
const getWinnings = (rows, bet, lines) => {
    let winnings = 0;

    for (let row =0; row < lines; row++) {
        const symbols = rows[row];
        let allSame = true;

        for (const symbol of symbols) {
            if (symbol != symbols[0]) {
                allSame = false;
                break;
            }
        }
        if (allSame){
            winnings += bet * SYMBOLS_VALUES[symbols[0]]
        }
    }
    return winnings;
}


const game = () => {
let balance = deposit();

while (true) {
   console.log("You have a balance of $" + balance);
   const numberOfLines = getNumberOfLines();
   const bet = getBet(balance, numberOfLines);
   balance -= bet * numberOfLines;

   const reels = spin();
   const rows = transpose(reels);
   printRows(rows);
   const winnings = getWinnings(rows, bet, numberOfLines);
   balance += winnings;
    console.log("You won: $" + winnings.toString());

    if(balance <= 0) {
        console.log("You ran out of money!");
        break;
    }
    const playAgain = prompt("Do you want to play again (y/n)? ")

    if (playAgain != "y") break;
   }
};

game();

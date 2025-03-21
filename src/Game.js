import { useState, useEffect } from 'react'
import GuessTable from './GuessTable'
import Hints from './Hints'

import './Game.css'

function Game() {
    const [guessWordID, setGuessWordID] = useState(0)
    const [currentGuess, setCurrentGuess] = useState("")
    const [guesses, setGuesses] = useState([])
    const [errorMessage, setErrorMessage] = useState("")
    const [winMessage, setWinMessage] = useState("")

    useEffect(() => {
        processDaily()
    }, [])
    
    useEffect(() => {
        // the code that runs when the user manually changes the guessWordID.
        setGuesses([])
        setErrorMessage("")
        setWinMessage("")
    }, [guessWordID])

    const processRandom = () => {
        setGuessWordID(Math.floor(Math.random() * 1000))
    }

    const processDaily = () => {
        // set the guessWordID to some deterministic value based on the current date.
        const currDate = new Date()
        const newID = Math.floor(currDate.getTime() / (1000 * 60 * 60 * 24))
        setGuessWordID(newID)
    }

    const processGuess = async () => {
        // fetch from the backend server the result
        // if it is a valid guess, add it to guesses. if not, display an error message to the user.
        try {
            const response = await fetch(`https://guessthewordbackend.onrender.com/eval/${guessWordID}/${currentGuess}`);
            if (!response.ok) {
                throw new Error("Failed to fetch data");
            }

            const data = await response.json();
            setGuesses((prevGuesses) => {
                const existingGuess = prevGuesses.find((guess) => guess[1] === currentGuess);
                const guessNumber = existingGuess ? existingGuess[0] : prevGuesses.length+1;
                const newGuess = [guessNumber, currentGuess, data.similarity]
                return [newGuess, ...prevGuesses.filter((guess) => guess[1] !== currentGuess).sort((x, y) => y[2] - x[2])];
            })

            if (data.similarity === 100) {
                setWinMessage("ניצחת! המילה היומית הייתה '" + currentGuess + "'")
            }

            setCurrentGuess("")
            setErrorMessage("")
        } catch (error) {
            setErrorMessage("לא הצלחנו להשתמש במילה " + currentGuess)
        }
    }

    return(
        <div id="GameWindow">
            <div id="GuessID" className="d-flex align-items-center justify-content-center gap-3 pb-5">
                <button className="btn darkBlue gameButton d-flex align-items-center justify-content-center" onClick={processRandom}>
                    אקראי
                </button>
                <button className="btn darkBlue gameButton d-flex align-items-center justify-content-center" onClick={processDaily}>
                    יומי
                </button>
            </div>

            <div id="CurrentGuess" className="d-flex align-items-center justify-content-center gap-3 pb-2">
                <input className="inputBox" placeholder="כתבו ניחוש משלכם" value={currentGuess} onChange={(e) => setCurrentGuess(e.target.value)}/>
                <button className="btn btn-primary gameButton d-flex align-items-center justify-content-center" onClick={processGuess}>
                    נחש
                </button>
            </div>

            <p className="text-success">
                {winMessage}
            </p>

            <p className="text-danger">
                {errorMessage}
            </p>

            <Hints guessWordID={guessWordID} />

            <GuessTable guesses={guesses}/>
        </div>
    )
}

export default Game
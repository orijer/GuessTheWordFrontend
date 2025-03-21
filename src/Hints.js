import { useState, useEffect } from 'react'
import "./Hints.css"

function Hints({ guessWordID }) {
    const [hints, setHints] = useState([])
    const [noMoreHintsMessage, setNoMoreHintsMessage] = useState("")

    const requestHint = async () => {
        setNoMoreHintsMessage("");
        let currentAttempt = 1;
        const maxAttempts = 5;
        while (currentAttempt < maxAttempts) {
            try {
                const response = await fetch(`https://guessthewordbackend.onrender.com/hint/${guessWordID}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch a hint")
                }

                const json = await response.json();
                const hint = json.hint;

                if (!hints.includes(hint)) {
                    setHints((prevHints) => [...prevHints, hint]);
                    return;
                }

                currentAttempt++;
            } catch (error) {
                console.error("Error fetching hint:", error);
            }
        }

        setNoMoreHintsMessage("לא נמצאו עוד רמזים למילה.")
    }

    useEffect(() => {
        setHints([])
        setNoMoreHintsMessage("")
    }, [guessWordID])

    return (
        <div>
            <button onClick={requestHint} id="requestHintButton" className="btn btn-success mb-2">
                בקש רמז
            </button>

            <p className="text-danger">{noMoreHintsMessage}</p>

            {hints.length > 0 && (
                <ul id="HintsListDisplay" className="border rounded border-success w-50 mx-auto">
                    {
                        hints.map((hint, index) => (
                            <li key={index}>
                                {hint}
                            </li>
                        ))
                    }
                </ul>
            )}
        </div>
    )
}

export default Hints
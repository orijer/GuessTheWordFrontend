function GuessTable({ guesses }) {
    return (
        <table className="table table-striped mx-auto">
            <thead>
                <tr>
                    <td className="fw-bold">מספר</td>
                    <td className="fw-bold">ניחוש</td>
                    <td className="fw-bold">דימיון</td>
                </tr>
            </thead>

            <tbody>
                {
                    guesses.map(([number, word, similarity], index) => (
                        <tr key={index}>
                            <td>{number}</td>
                            <td>{word}</td>
                            <td>{similarity}</td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
    )
}

export default GuessTable
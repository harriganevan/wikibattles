function DailyWinBlock({ route, timer, startPage, endPage }) {

    return (
        <>
            <h3 className="daily-you-win">YOU WIN!</h3>
            <p>You got from {startPage} to {endPage} in <span className="daily-stat">{timer}</span> seconds, travelling through <span className="daily-stat">{route.length-1}</span> pages, and following this path:</p>
            <div className="daily-route flex-fill">
                {route.map((page, i) =>
                    <div key={page + i}>
                        <p >{page}</p>
                        {i != route.length - 1 && <>&darr;</>}
                    </div >
                )}
            </div>
        </>
    )
}

export default DailyWinBlock
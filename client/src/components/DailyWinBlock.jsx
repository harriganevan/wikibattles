function DailyWinBlock({ route }) {

    return (
        <>
            <p>you win!</p>
            <div>
                {route.map((page, i) =>
                    <div key={page + i}>
                        <p >{page}</p>
                        <p>&darr;</p>
                    </div >
                )}
            </div>
        </>
    )
}

export default DailyWinBlock
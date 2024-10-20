import React from 'react'
import { useSelector } from "react-redux"
import CircularLoader from "src/components/loaders/CircularLoader"
import NavBar from "src/components/navigations/NavBar"

function Home() {
    const { loading } = useSelector(({ app }) => app)

    return (
        <>
            <NavBar />
            {loading && <CircularLoader />}
        </>
    )
}

export default Home
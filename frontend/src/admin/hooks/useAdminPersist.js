import { useState, useEffect } from "react"

const useAdminPersist = () => {
    const [adminPersist, setAdminPersist] = useState(JSON.parse(localStorage.getItem("persist")) || false);

    useEffect(() => {
        localStorage.setItem("persist", JSON.stringify(adminPersist))
    }, [adminPersist])

    return [adminPersist, setAdminPersist]
}
export default useAdminPersist
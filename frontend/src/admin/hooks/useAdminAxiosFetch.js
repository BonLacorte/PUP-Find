import { useState, useEffect } from 'react'
import axios from 'axios'

const useAdminAxiosFetch = (url, method, body) => {
    const [data, setData] = useState([])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const source = axios.CancelToken.source()
        const fetchData = async () => {
            try {
                const response = await axios({
                    method,
                    url,
                    data: body,
                    cancelToken: source.token
                })
                setData(response.data)
            } catch (error) {
                setError(error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
        return () => {
            source.cancel()
        }
    }, [url, method, body])

    return { data, error, loading }
}
export default useAdminAxiosFetch                    
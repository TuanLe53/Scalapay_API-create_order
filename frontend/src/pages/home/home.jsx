import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import ServerURL from "../../api/ServerURL"
import "./home.css"

function Home() {
    const [products, setProduct] = useState([])

    const fetchPD = async () => {
        let res = await fetch(ServerURL.PD_URL)
        let data = await res.json()
        if (res.status === 200) {
            setProduct(data)
        } else {
            console.log(data.error)
        }
    }

    useEffect(() => {
        fetchPD()
    }, [])

    return (
        <div id="products">
            <h1>Products</h1>
            <ul>
            {products.map((pd) => (
                <li key={pd.id} className="product">
                    <Link to={`/product/${pd.id}`} state={pd.id}>
                        <img src={pd.image} />
                        <p>{pd.name}</p>
                        <p>{pd.price} €</p>
                    </Link>
                </li>
            ))}
            </ul>
        </div>
    )
}

export default Home
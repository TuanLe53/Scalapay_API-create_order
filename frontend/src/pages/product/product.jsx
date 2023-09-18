import { useLocation, useNavigate } from "react-router-dom"
import ServerURL from "../../api/ServerURL"
import { useEffect, useState, useContext } from "react"
import AuthContext from "../../context/AuthContext"
import "./product.css"

export default function Product() {
    const {user, accessToken} = useContext(AuthContext)
    const id = useLocation().state
    let [product, setProduct] = useState()
    let [quantity, setQuantity] = useState(0)

    const navigate = useNavigate()
    const fetchProduct = async () => {
        let res = await fetch(ServerURL.PD_URL + id)
        let data = await res.json()
        if (res.status === 200) {
            setProduct(data)
        } else {
            console.log(data.error)
        }
    }

    const orderHandle = async (e) => {
        e.preventDefault()
        if (!user) navigate("/login")
        
        let res = await fetch(ServerURL.ORDER_URL + "add-product", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + String(accessToken.accessToken),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user_id: user.id,
                total_price: quantity * product.price,
                quantity: quantity,
                pd_id: product.id
            }),
            credentials: "include"
        })
        let data = await res.json()
        if (res.status === 201) {
            alert("Add to order")
        } else {
            alert(data.error)
        }
    }

    useEffect(() => {
        fetchProduct()
    }, [])

    return (
        <>
            {product ?
                <div id="product-detail">
                    <img src={product.image} />
                    <div>
                        <p>{product.name}</p>
                        <p>{product.price} €</p>
                        <form onSubmit={orderHandle}>
                            <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} min={1} max={product.quantity}/><br />
                            <button type="submit">Add to order</button>
                        </form>
                    </div>
                </div>
                    :
                <>
                    Loading...
                </>
            }
        </>
    )
}
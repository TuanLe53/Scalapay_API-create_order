import { useContext, useEffect, useState } from "react"
import ServerURL from "../../api/ServerURL"
import AuthContext from "../../context/AuthContext"
import "./order.css"

export default function Order() {
    const { accessToken } = useContext(AuthContext)
    
    const [order, setOrder] = useState()

    const [givenName, setGivenName] = useState("")
    const [surname, setSurname] = useState("")
    const [email, setEmail] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")

    const [productType, setProductType] = useState("pay-in-3")

    const fetchOrder = async () => {
        let res = await fetch(ServerURL.ORDER_URL, {
            headers: {
                "Authorization": "Bearer " + String(accessToken.accessToken),
            },
            credentials: "include"
        })
        let data = await res.json()
        if (res.status === 200) {
            setOrder(data)
        } else {
            console.log(data.error)
        }
    }

    const orderHandle = async (e) => {
        e.preventDefault()
        let obj = {
            order_id: order.order_id,
            api_obj: {
                "totalAmount": {
                    "currency": "EUR",
                    "amount": order.order_total_price
                },
                "consumer": {
                    givenNames: givenName,
                    surname: surname,
                    email: email,
                    phoneNumber: phoneNumber,
                },
                "taxAmount": {
                    "currency": "EUR",
                    "amount": "3.70"
                },
                "shippingAmount": {
                    "currency": "EUR",
                    "amount": "10.00"
                },
                "merchant": {
                    "redirectCancelUrl": "https://portal.integration.scalapay.com/failure-url",
                    "redirectConfirmUrl": "https://portal.integration.scalapay.com/success-url"
                },
                "type": "online",
                "orderExpiryMilliseconds": 600000,
                "product": productType
            }
        }
        let res = await fetch(ServerURL.ORDER_URL + "check", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + String(accessToken.accessToken),
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(obj)
        })
        let data = await res.json()

        if (res.status === 200) {
            window.location = data.checkoutUrl
        } else {
            alert("Something went wrong. Please try again later")
        }
    }

    useEffect(() => {
        fetchOrder()
    }, [])

    if(order === undefined) return <>Still loading... Try to add new products to order and revisit this page again</>

    return (
        <div id="order">
            <div>
                <h2>Order</h2>
                <p id="order-id">#{order.order_id}</p>
            </div>
            <hr />
            <form onSubmit={orderHandle}>
                <label htmlFor="givenNames">Given Name</label><br />
                <input type="text" id="givenNames" placeholder="Enter your given name" value={givenName} onChange={e=>setGivenName(e.target.value)}required/><br />
                <label htmlFor="surname">Surname</label><br />
                <input type="text" id="surname" placeholder="Enter your surname" value={surname} onChange={e => setSurname(e.target.value)} required /><br />
                <label htmlFor="email">Email</label><br />
                <input type="email" id="email" placeholder="Enter your email(not required)" value={email} onChange={e => setEmail(e.target.value)} /><br />
                <label htmlFor="phone-number">Phone number</label><br />
                <input type="tel" id="phone-number" placeholder="Enter your phone number(not required)" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} /><br />
                <ul id="order-products">
                    <h3>Products:</h3>
                    <hr />
                    {order && order.order_pd.map(pd => (
                        <li>
                            <div>
                                <p>{pd.name}</p>
                                <p>Quantity: {pd.quantity}</p>
                            </div>
                            <div>
                                <p>{pd.total_price} €</p>
                            </div>
                        </li>
                    ))}
                </ul>
                <label>Type: </label>
                <select onChange={e => setProductType(e.target.value)}>
                    <option selected value={"pay-in-3"}>pay-in-3</option>
                    <option value={"pay-in-4"}>pay-in-4</option>
                </select>
                <div id="other-fee">
                    <p>Tax amount: 10 €</p>
                    <p>Shipping amount: 5 €</p>
                    <p>Total amount: {order.order_total_price} €</p>
                </div>

                <div id="order-btn-wrapper">
                    <button type="submit">Order</button>
                </div>
            </form> 
        </div>
    )
}
import { useContext } from "react";
import { Outlet, Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

export default function Layout() {
    const { logoutUser, user } = useContext(AuthContext)

    return (
        <>
            <header>
                <p><Link to={"/"}>Header</Link></p>
                {user
                    ?
                <div className="nav-btn">
                    <div>
                        <Link to={"/order"}>       
                            <span class="material-symbols-outlined">shopping_basket</span>
                        </Link>         
                    </div>
                    <div>
                        <button onClick={logoutUser}>Log out</button>
                    </div>
                </div>

                    :
                <div>
                    <button>
                        <Link to={"/login"}>Login</Link>
                    </button>
                </div>
            }
            </header>

            <main>
                <Outlet />
            </main>

            <footer>
                <div>About us</div>
                <div>Privacy</div>
            </footer>
        </>
    )
}
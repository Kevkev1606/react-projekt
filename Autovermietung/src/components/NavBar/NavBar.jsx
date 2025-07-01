import "./NavBar.css";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import { CircleUserRound } from 'lucide-react';
import Hamburger from 'hamburger-react';

const NavBar = () => {
    const {isLoggedIn} = useSelector(state => state.auth);
    const [isOpen, setOpen] = useState(false);

    return (
        <div className="NavBar">
            <div className="NavBar__TopRow">
                <div className="NavBar__Menu">
                    <Hamburger toggled={isOpen} toggle={setOpen} />
                </div>
                <div className="NavBar__Title">
                    <img id="NavBar__Icon__Car" src="/car.png" alt="Autovermietung" />
                    <span className="NavBar__Title__Text">Drive Easy</span>
                </div>
                <div className="NavBar__Account">
                    {isLoggedIn ? (
                        <Link to="/account" className="NavBar__Account__Button">
                            <CircleUserRound id="NavBar__Icon__User" />
                            <span className="NavBar__Account__Text">Mein Konto</span>
                        </Link>
                    ) : (
                        <Link to="/login" className="NavBar__Account__Button">
                            <CircleUserRound id="NavBar__Icon__User" />
                            <span className="NavBar__Account__Text">Login</span>
                        </Link>
                    )}
                </div>
            </div>

            {isOpen && (
                <div className="NavBar__Menu__Buttons">
                    <Link to="/" className="NavBar__Menu__Button" onClick={() => setOpen(false)}>Home</Link>
                    <Link to="/search" className="NavBar__Menu__Button" onClick={() => setOpen(false)}>Auto suchen & mieten</Link>
                    <Link to="/add" className="NavBar__Menu__Button" onClick={() => setOpen(false)}>Eigenes Auto vermieten</Link>
                </div>
            )}
        </div>
    );
};

export default NavBar;

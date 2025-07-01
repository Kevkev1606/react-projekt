import "./Account.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { updateAuth } from "../../reducer/authReducer";
import axios from "../../axiosURL";

const Account = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isLoggedIn, user } = useSelector(state => state.auth);

    const [rentedCars, setRentedCars] = useState([]);
    const [lentCars, setLentCars] = useState([]);

    const loadRentedCars = () => {
        axios.get("/carrental/rented/", { withCredentials: true }).then(res => {
            console.log("Laden der Miet-Historie war erfolgreich!");
            setRentedCars(res.data);
        }).catch(err => {
            console.error("Fehler beim Laden der Miet-Historie:", err);
        });
    }

    const loadLentCars = () =>  {
        axios.get("/carrental/lent/", { withCredentials: true }).then(res => {
            console.log("Laden der Vermietungen war erfolgreich!");
            setLentCars(res.data);
        }).catch(err => {
            console.error("Fehler beim Laden der Vermietungen:", err);
        });
    }

    useEffect(() => {
        loadRentedCars();
        loadLentCars();
    }, []);

    if (!isLoggedIn) {
        return (
            <div className="Account">
                <h2>Mein Konto</h2>
                <p className="Account__Error">Bitte zuerst anmelden, um auf Ihren Account zuzugreifen</p>
            </div>
        );
    }

    const onLogout = () => {
        axios.post("/logout", {}, { withCredentials: true }).then((res) => {
            if (res.status === 200) {
                console.log("Logout erfolgreich!");
                dispatch(updateAuth(false, null));
                navigate("/");
            } else {
                console.error("Logout fehlgeschlagen!");
            }
        }).catch(err => {
            console.error(err);
        });
    };

    const formatDate = (formatDate) => {
        const date = new Date(formatDate);
        return date.toLocaleDateString();
    };

    let rentedCarsMap = null;
    let lentCarsMap = null;

    if(rentedCars.length > 0) {
        rentedCarsMap = rentedCars.map((v) => {
            return (
                <div className="Account__Rented__Cars">
                    <p><strong>{v._id}</strong></p>
                    {v.rented.map(rent => (
                        <div className="Account__HistoryItem">
                            <p>Zeitraum: {formatDate(rent.startDate)} – {formatDate(rent.endDate)}</p>
                            <p>Preis: {rent.price} €</p>
                        </div>
                    ))}
                </div>
            )
        })
    } else {
        rentedCarsMap = <p className="Account__Error">Keine Mietvorgänge gefunden.</p>
    }

    if(lentCars.length > 0) {
        lentCarsMap = lentCars.map(v => {
            return (
                <div className="Account__Lent__Cars">
                    <p><strong>{v.brand} {v.carmodel}</strong></p>
                    {v.rented.map(rent => (
                        <div className="Account__HistoryItem">
                            <p>Zeitraum: {formatDate(rent.startDate)} – {formatDate(rent.endDate)}</p>
                            <p>Vermietet an: {rent.userId}</p>
                            <p>Preis: {rent.price} €</p>
                        </div>
                    ))}
                </div>
            )
        })
    } else {
        lentCarsMap = <p className="Account__Error">Keine Vermietungen gefunden.</p>
    }

    return (
        <div className="Account">
            <div className="Account__Header">
                <h2>Mein Konto</h2>
                <p>Hier können Sie Ihre Kontodaten sehen.</p>
            </div>
            <div className="Account__Details">
                <label>E-Mail:</label>
                <p>{user.email}</p>

                <label>ID-Nummer:</label>
                <p>{user.id}</p>
            </div>

            <div className="Account__History">
                <h3>Meine Miet-Historie</h3>
                {rentedCarsMap}
            </div>

            <div className="Account__History">
                <h3>Vermietungen meiner Autos</h3>
                {lentCarsMap}
            </div>

            <div className="Account__Buttons">
                <button className="Account__Button" onClick={onLogout}>Logout</button>
            </div>
        </div>
    );
};

export default Account;

import "./CarSearch.css";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadCarSeach } from "../../reducer/carrentalReducer";
import Car from "../Car/Car";
import { Link } from "react-router-dom";
import axios from "../../axiosURL";

const CarSearch = () => {
    const dispatch = useDispatch();
    const { isLoggedIn } = useSelector(state => state.auth);
    const [allCartypes, setAllCartypes] = useState([]);
    const cars = useSelector(state => state.car.searchResults || []);

    const [tag, setTag] = useState("");
    const [cartype, setCartype] = useState("");
    const [rentalStart, setRentalStart] = useState("");
    const [rentalEnd, setRentalEnd] = useState("");

    const loadAllCartypes = () => {
        axios.get("/carrental/cartypes", { withCredentials: true }).then(res => {
            console.log("Laden der Fahrzeugkategorien war erfolgreich!");
            setAllCartypes(res.data);
        }).catch(err => {
            console.error("Fehler beim Laden der Fahrzeugkategorien", err);
        });
    };

    const onSearch = () => {
        const params = {};

        if (tag.trim()) {
            params.tags = tag.trim();
        }

        if (cartype && cartype.trim() !== "") {
            params.category = cartype;
        }

        if (rentalStart && rentalEnd) {
            const formatDate = (isoDate) => {
                const d = new Date(isoDate);
                const day = String(d.getDate()).padStart(2, '0');
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const year = d.getFullYear();
                return `${day}.${month}.${year}`;
            };

            params.startDate = formatDate(rentalStart);
            params.endDate = formatDate(rentalEnd);
        }

        dispatch(loadCarSeach(params));
    };


    useEffect(() => {
        loadAllCartypes();
    }, []);

    if (!isLoggedIn) {
        return (
            <div className="CarSearch">
                <h2>Auto suchen</h2>
                <div className="CarSearch__Error">
                    Bitte zuerst anmelden, um die Autosuche zu verwenden.
                </div>
            </div>
        );
    }

    let carsMap = null;
    let cartypesMap = null;

    if (cars.length > 0) {
        carsMap = cars.map((v, i) => {
            if(!v.completed){
                return (
                    <Link to={"/cars/" + v._id} key={v._id}>
                        <Car id={v._id} href={v.href} brand={v.brand} carmodel={v.carmodel} />
                    </Link>
                );
            }
        });
    } else {
        carsMap = <p className="CarSearch__Error">Keine passenden Autos gefunden.</p>;
    }

    if (allCartypes.length > 0) {
        cartypesMap = allCartypes.map((c) => (
            <option key={c._id} value={c._id}>{c.cartype}</option>
        ))
    } else {
        cartypesMap = <option value="">Keine Fahrzeugkategorien verfügbar</option>;
    }

    return (
        <div className="CarSearch">
            <h2>Auto suchen</h2>
            <div className="CarSearch__Section">
                <label>Tag:</label>
                <input type="text" value={tag} onChange={(e) => setTag(e.target.value)} placeholder="Luxus, BMW, ..." />
            </div>

            <div className="CarSearch__Section">
                <label>Mietbeginn:</label>
                <input type="date" value={rentalStart} onChange={(e) => setRentalStart(e.target.value)} />
            </div>
            <div className="CarSearch__Section">
                <label>Mietende:</label>
                <input type="date" value={rentalEnd} onChange={(e) => setRentalEnd(e.target.value)} />
            </div>

            <div className="CarSearch__Section">
                <label>Kategorie:</label>
                <select value={cartype} onChange={(e) => setCartype(e.target.value)} >
                    <option value="">Keine Kategorie ausgewählt</option>
                    {cartypesMap}
                </select>
            </div>

            <div className="CarSearch__Section">
                <button onClick={onSearch}>Suchen</button>
            </div>

            <div className="CarSearch__Results">
                { carsMap }
            </div>
        </div>
    );
};

export default CarSearch;

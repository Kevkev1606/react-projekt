import "./RentCar.css";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { loadCarSeach } from "../../reducer/carrentalReducer";
import axios from "../../axiosURL";

const RentCar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    const { isLoggedIn, user } = useSelector(state => state.auth);
    const [car, setCar] = useState(null);

    const [step, setStep] = useState(1);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const loadCar = () => {
        axios.get("/carrental/car/" + id, { withCredentials: true }).then(res => {
            console.log("Laden des Autos war erfolgreich!");
            setCar(res.data);
        }).catch(err => {
            setErrorMessage("Fehler beim Laden des Autos. Bitte versuche es später erneut.");
            console.error("Fehler beim Laden des Autos:", err);
        });
    };

    useEffect(() => {
        loadCar();
    }, []);

    // Rundet Zahl auf volle Tage auf
    const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 3600 * 24)) + 1;
    const totalPrice = car ? days * car.price : 0;

    const formatDate = (isoDate) => {
        const d = new Date(isoDate);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}.${month}.${year}`;
    };

    const onRent = () => {
        axios.post("/carrental/rent", {
            rentalId: car._id,
            userId: user.id,
            startDate: formatDate(startDate),
            endDate: formatDate(endDate),
            price: totalPrice
        }, { withCredentials: true }).then(() => {
            console.log("Auto wurde erfolgreich gemietet!");
            navigate("/");
        }).catch(() => {
            console.error("Fehler beim Mieten des Autos.");
         });
    };

    const checkAvailability = async () => {
        setErrorMessage("");

        const params = {
            startDate: startDate,
            endDate: endDate
        };

        const action = await dispatch(loadCarSeach(params));
        const matchingCars = action.payload;

        const found = matchingCars.find((c) => c._id === car._id);

        if (found) {
            setStep(2);
        } else {
            setErrorMessage("Dieses Auto ist im gewählten Zeitraum leider nicht verfügbar.");
        }
    };

    if (!isLoggedIn) {
        return (
            <div className="RenctCar">
                <h2>Auto mieten</h2>
                <p className="RentCar__Error">Bitte zuerst anmelden, um ein Auto zu mieten.</p>
            </div>
        );
    }

    if (!car) {
        return (
            <div className="RenctCar">
                <h2>Auto mieten</h2>
                <p className="RentCar__Error">Das Auto konnte nicht geladen werden.</p>
            </div>
        );
    }

    return (
        <div className="RentCar">
            <h2>Auto mieten</h2>

            {step === 1 && (
                <div className="RentCar__DateSelection">
                    <input className="RentCar__Date" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                    <input className="RentCar__Date" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                     {errorMessage && <p className="RentCar__Error">{errorMessage}</p>}
                    <button className="RentCar__Button" onClick={checkAvailability} disabled={!startDate || !endDate}>Weiter</button>
                </div>
            )}

            {step === 2 && (
                <div className="RentCar__Summary">
                    <p><strong>Auto:</strong> {car.brand} {car.carmodel}</p>
                    <p><strong>Zeitraum:</strong> {formatDate(startDate)} bis {formatDate(endDate)}</p>
                    <p><strong>Tage:</strong> {days}</p>
                    <p><strong>Preis pro Tag:</strong> {car.price} €</p>
                    <p><strong>Gesamt:</strong> {totalPrice} €</p>
                    <button className="RentCar__Button" onClick={onRent}>Miete bestätigen</button>
                </div>
            )}
        </div>
    );
};

export default RentCar;

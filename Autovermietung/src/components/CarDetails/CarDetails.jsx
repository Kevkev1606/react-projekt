import "./CarDetails.css";
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../../axiosURL";

const CarDetails = () => {
    const { id } = useParams();
    const [car, setCar] = useState(null);
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

    if (!car) {
        return (
            <p className="CarDetails__Error">{errorMessage}</p>
        );
    }

    return (
        <div className="CarDetails">
            <h2 className="CarDetails__Title">{car.brand} {car.carmodel}</h2>
            <img className="CarDetails__Image" src={car.href} alt="Bild konnte nicht geladen werden" />
            <div className="CarDetails__Info">
                <p><strong>Preis:</strong> {car.price} € pro Tag</p>
                <p><strong>Marke:</strong> {car.brand}</p>
                <p><strong>Modell:</strong> {car.carmodel}</p>
                <p><strong>Kilometerstand:</strong> {car.kilometers} km</p>
                <p><strong>Leistung:</strong> {car.horsepower} PS</p>
                <p><strong>Gewicht:</strong> {car.weight} kg</p>
                <p><strong>Türen:</strong> {car.doors}</p>
                <p><strong>Beschreibung:</strong> {car.description}</p>
                <p><strong>Tags:</strong> {car.tags.join(", ")}</p>
            </div>
            <h3>Interesse geweckt?</h3>
            <div className="CarDetails__Buttons">
                <Link to={"/rent/"+id} className="CarDetails__Button">
                    Jetzt Auto mieten
                </Link>
            </div>
        </div>
    );
};

export default CarDetails;

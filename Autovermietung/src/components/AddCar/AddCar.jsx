import "./AddCar.css";
import { useEffect, useState } from "react";
import axios from "../../axiosURL";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AddCar = () => {
    const { isLoggedIn, user } = useSelector(state => state.auth);
    const navigate = useNavigate();

    const [allCartypes, setAllCartypes] = useState([]);
    const [newCategory, setNewCategory] = useState("");
    const [categoryMessage, setCategoryMessage] = useState("");


    const [cartype, setCartype] = useState("");
    const [price, setPrice] = useState("");
    const [brand, setBrand] = useState("");
    const [carmodel, setCarmodel] = useState("");
    const [kilometers, setKilometers] = useState("");
    const [horsepower, setHorsepower] = useState("");
    const [weight, setWeight] = useState("");
    const [doors, setDoors] = useState("");
    const [active, setActive] = useState("true");
    const [href, setHref] = useState("");
    const rentedLength = useState(0);
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState("");

    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        getAllCartypes();
    }, []);

    const getAllCartypes = () => {
        axios.get("/carrental/cartypes", { withCredentials: true }).then((res) => {
            setAllCartypes(res.data);
            setCartype(res.data[0]);
        }).catch(err => {
            setErrorMessage("Es gab einen Fehler beim Laden der verschiedenen Autokategorien!");
            console.log(err);
        });
    };

    const addNewCarCategory = () => {
        if (!newCategory.trim()) { //Entfernt Leerzeichen vom Anfang und Ende des Strings
            setCategoryMessage("Bitte gib einen Namen für die Kategorie ein.");
            return;
        }

        axios.post("/carrental/cartype", {
            cartype: newCategory
        }, { withCredentials: true }).then(res => {
            setCategoryMessage("Kategorie erfolgreich hinzugefügt.");
            setNewCategory("");
            getAllCartypes();
        }).catch(err => {
            setCategoryMessage("Fehler beim Hinzufügen der Kategorie.");
            console.error(err);
        });
    };

    const onAddCar = () => {
        setErrorMessage("");

        axios.post("/carrental/rental", {
            cartype,
            owner: user.id,
            price,
            brand,
            carmodel,
            kilometers,
            horsepower,
            weight,
            doors,
            active: active === "true",
            href,
            rentedLength,
            description,
            tags: tags.split(",").map(t => t.trim())
        }, { withCredentials: true }).then((res) => {
            if (res.status === 201) {
                console.log("Auto erfolgreich hinzugefügt!");
                navigate("/");
            } else {
                setErrorMessage("Auto konnte nicht hinzugefügt werden!");
                console.error("Fehler beim Hinzufügen.");
            }
        }).catch((err) => {
            setErrorMessage("Fehler beim Hinzufügen des Fahrzeugs.");
            console.error(err);
        });
    };

    const cartypes = allCartypes.map((v) => (
        <option key={v._id} value={v._id}>{v.cartype}</option>
    ));

    if (!isLoggedIn) {
        return (
            <div className="AddCar">
                <div className="AddCar__Inputs">
                    <h2>Neues Auto hinzufügen</h2>
                </div>
                <div className="AddCar__Error">Bitte zuerst anmelden, um ein Fahrzeug hinzuzufügen.</div>
            </div>
        );
    }

    return (
        <div className="AddCar">
            <div className="AddCar__Inputs">
                <h2>Neues Auto hinzufügen</h2>

                <div>
                    <label>Fahrzeugkategorie:</label>
                    <select onChange={e => setCartype(e.target.value)} value={cartype}>
                        {cartypes}
                    </select>
                </div>

                <div className="AddCar__NewCategory">
                    <h3>Neue Kategorie hinzufügen</h3>
                    <input type="text" placeholder="z.B. Cabrio" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
                    <button onClick={addNewCarCategory}>Kategorie hinzufügen</button>
                    {categoryMessage && <p className="AddCar__Message">{categoryMessage}</p>}
                </div>

                <div>
                    <label>Preis (€/Tag):</label>
                    <input type="number" min="0" value={price} onChange={e => setPrice(e.target.value)} />
                </div>

                <div>
                    <label>Marke:</label>
                    <input type="text" value={brand} onChange={e => setBrand(e.target.value)} />
                </div>

                <div>
                    <label>Modell:</label>
                    <input type="text" value={carmodel} onChange={e => setCarmodel(e.target.value)} />
                </div>

                <div>
                    <label>Kilometerstand:</label>
                    <input type="number" min="0" value={kilometers} onChange={e => setKilometers(e.target.value)} />
                </div>

                <div>
                    <label>Leistung (PS):</label>
                    <input type="number" min="0" value={horsepower} onChange={e => setHorsepower(e.target.value)} />
                </div>

                <div>
                    <label>Gewicht (kg):</label>
                    <input type="number" min="0" value={weight} onChange={e => setWeight(e.target.value)} />
                </div>

                <div>
                    <label>Anzahl Türen:</label>
                    <input type="number" min="1" max="6" value={doors} onChange={e => setDoors(e.target.value)} />
                </div>

                <div>
                    <label>Aktiv/Verfügbar:</label>
                    <select value={active} onChange={e => setActive(e.target.value)}>
                        <option value="true">Ja</option>
                        <option value="false">Nein</option>
                    </select>
                </div>

                <div>
                    <label>Bild-URL:</label>
                    <input type="url" value={href} onChange={e => setHref(e.target.value)} />
                </div>

                <div>
                    <label>Beschreibung:</label>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} />
                </div>

                <div>
                    <label>Tags (kommagetrennt):</label>
                    <input type="text" value={tags} onChange={e => setTags(e.target.value)} placeholder="Luxus, BMW, ..." />
                </div>
            </div>

            {errorMessage && <div className="AddCar__Error">{errorMessage}</div>}

            <div className="AddCar__Buttons">
                <button className="AddCar__Submit" onClick={onAddCar}>
                    Auto hinzufügen
                </button>
            </div>
        </div>
    );
};

export default AddCar;

import "./Registration.css";
import { useState } from "react";
import { Mail, Lock, User, Eye, EyeOff, Phone, MapPinHouse } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../../axiosURL";

const Registration = () => {
    const navigate = useNavigate();

    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [street, setStreet] = useState("");
    const [postcode, setPostcode] = useState("");
    const [city, setCity] = useState("");
    const [country, setCountry] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const onFirstnameChange = (e) => {
        setFirstname(e.target.value);
    };

    const onLastnameChange = (e) => {
        setLastname(e.target.value);
    };

    const onStreetChange = (e) => {
        setStreet(e.target.value);
    };

    const onPostcodeChange = (e) => {
        setPostcode(e.target.value);
    };

    const onCityChange = (e) => {
        setCity(e.target.value);
    };

    const onCountryChange = (e) => {
        setCountry(e.target.value);
    };

    const onPhoneChange = (e) => {
        setPhone(e.target.value);
    };

    const onEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const onPasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const onShowPasswordChange = () => {
        setShowPassword(!showPassword);
    };

    const onSignup = () => {
        setErrorMessage("");

        axios.post("/signup", {
            firstname,
            lastname,
            street,
            postcode,
            city,
            country,
            phone,
            email,
            password
        }, { withCredentials: true }).then((res) => {
            if (res.status === 201) {
                navigate("/login");
                console.log("Registrierung erfolgreich!");
            } else {
                setErrorMessage("Registrierung fehlgeschlagen!");
                setPassword("");
                console.error("Registrierung fehlgeschlagen!");
            }
        }).catch((err) => {
            setErrorMessage("Registrierung fehlgeschlagen!");
            setPassword("");
            console.error(err);
        });
    };

    return (
        <div className="Registration">
            <h2>Registrierung</h2>

            <div className="Registration__Input">
                <User className="Registration__Input__Icon__Left" />
                <input type="text" value={firstname} onChange={onFirstnameChange} placeholder="Vorname" />
            </div>

            <div className="Registration__Input">
                <User className="Registration__Input__Icon__Left" />
                <input type="text" value={lastname} onChange={onLastnameChange} placeholder="Nachname" />
            </div>

            <div className="Registration__Input">
                <MapPinHouse className="Registration__Input__Icon__Left" />
                <input type="text" value={street} onChange={onStreetChange} placeholder="Straße" />
            </div>

            <div className="Registration__Input">
                <MapPinHouse className="Registration__Input__Icon__Left" />
                <input type="text" value={postcode} onChange={onPostcodeChange} placeholder="Postleitzahl" />
            </div>

            <div className="Registration__Input">
                <MapPinHouse className="Registration__Input__Icon__Left" />
                <input type="text" value={city} onChange={onCityChange} placeholder="Stadt" />
            </div>

            <div className="Registration__Input">
                <MapPinHouse className="Registration__Input__Icon__Left" />
                <input type="text" value={country} onChange={onCountryChange} placeholder="Land" />
            </div>

            <div className="Registration__Input">
                <Phone className="Registration__Input__Icon__Left" />
                <input type="text" value={phone} onChange={onPhoneChange} placeholder="Telefonnummer" />
            </div>

            <div className="Registration__Input">
                <Mail className="Registration__Input__Icon__Left" />
                <input type="email" value={email} onChange={onEmailChange} placeholder="Email" />
            </div>

            <div className="Registration__Input">
                <Lock className="Registration__Input__Icon__Left" />
                <input type={showPassword ? "text" : "password"} value={password} onChange={onPasswordChange} placeholder="Passwort" />
                <span className="Registration__Input__Icon__Right" onClick={onShowPasswordChange}>
                    {showPassword ? <EyeOff /> : <Eye />}
                </span>
            </div>

            {errorMessage && <div className="Registration__Error">{errorMessage}</div>}

            <button className="Registration__Button" onClick={onSignup}>
                Registrieren
            </button>

            <p className="Registration__LoginLink">
                Bereits registriert? <Link to="/login">Zum Login</Link>
            </p>
        </div>
    );
};

export default Registration;

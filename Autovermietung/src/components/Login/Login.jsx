import "./Login.css";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "../../axiosURL";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { checkAuth } from "../../reducer/authReducer";

const Login = () => {
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const onLogin = ()=>{
        setErrorMessage("");

        axios.post("/login",{email,password},{withCredentials:true}).then((res)=>{
            if (res.status === 201) {
                console.log("Login erfolgreich!");
                dispatch(checkAuth());
                navigate("/");
            } else {
                setErrorMessage("Entweder Email oder Passwort ist falsch!");
                setPassword("");
                console.error("Login fehlgeschlagen!");
            }
        }).catch(err=>{
            setErrorMessage("Entweder Email oder Passwort ist falsch!");
            setPassword("");
            console.error(err);
        })
    }

    const onEmailChange = (e)=>{
        setEmail(e.target.value);
    }

    const onPasswordChange = (e)=>{
        setPassword(e.target.value);
    }

    const onShowPasswordChange = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="Login">
            <h2>Login</h2>
            <div className="Login__Input">
                <Mail className="Login__Input__Icon__Left" />
                <input type="email" value={email} onChange={onEmailChange} placeholder="Email" />
            </div>

            <div className="Login__Input">
                <Lock className="Login__Input__Icon__Left" />
                <input type={showPassword ? "text" : "password"} value={password} onChange={onPasswordChange} placeholder="Passwort" />
                <span className="Login__Input__Icon__Right" onClick={onShowPasswordChange}>
                    {showPassword ? <EyeOff /> : <Eye />}
                </span>
            </div>

            {errorMessage && <div className="Login__Error">{errorMessage}</div>}

            <button className="Login__Button" onClick={onLogin}>Login</button>

            <p className="Login__Register">
                Kein Account? <Link to="/signup">Registrieren</Link>
            </p>

        </div>
    );
};

export default Login;

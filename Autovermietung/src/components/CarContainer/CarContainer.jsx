import "./CarContainer.css";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadCars } from "../../reducer/carrentalReducer";
import Car from "../Car/Car";
import { Link } from "react-router-dom";

const CarContainer = () => {
    const {cars} = useSelector((state)=> state.car);
    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(loadCars())
    },[])

    let carsMap = null;
    
    if (cars.length > 0) {
        carsMap = cars.map((v, i) => {
            if(!v.completed){
                return (
                    <Link to={"/cars/"+v._id} key={v._id}>
                        <Car id={v._id} key={v._id} href={v.href} brand={v.brand} carmodel={v.carmodel}/>
                    </Link>
                );
            }
        });
    } else {
        carsMap = <p className="CarContainer__Error">Es sind derzeit keine Autos verfügbar. Bitte versuchen Sie es später erneut.</p>;
    }

    return (
        <div className="CarContainer">
            <div className="CarContainer__Title">
                <h2>Herzlich Willkommen bei Drive Easy!</h2>
                <p>Finden Sie Ihr Traumauto oder vermieten Sie Ihr eigenes Fahrzeug. Ralf Schuhmacher weiß aber nicht, wie viel Ihr Auto Wert ist!</p>
            </div>
            <div className="CarContainer__Cars">
                {carsMap}
            </div>
        </div>
    );
};

export default CarContainer;
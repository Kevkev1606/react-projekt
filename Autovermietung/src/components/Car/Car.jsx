import "./Car.css" ;

const Car = (props) => {
    return (
        <div className="Car">
            <div className="Car__Image">
                <img id="Picture__Image" src={props.href} alt={"Bild konnte nicht geladen werden"} />
            </div>
            <div className="Car__Title">{props.brand + " | " + props.carmodel}</div>
        </div>
    );
};

export default Car;
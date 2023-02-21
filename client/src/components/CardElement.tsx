import {FC} from "react";
import styles from "../styles/Card.module.css";
// import cost and art from images/card
import cost from "../images/card/cost.png";
import art from "../images/card/art.jpeg";

interface CardStats{
    name: string;
    type: string;
    description: string;
    costNumber: number;
    attack: number;
    defense: number;

}

const CardElement: FC<CardStats> = (
    {name, type, description, costNumber, attack, defense}
) => {
    return (
        <div className={styles.card}>
            <div className={styles.card__header}>
                <div className={styles.card__name}>{name}</div>
                <span className={styles.card__type__text}>{costNumber}</span>
                <img src={cost}/>
            </div>
            <div className={styles.card__image}>
                <img src={art} alt="Nom de la carte"/>
            </div>

            <div className={styles.card__type}>Type: {type}</div>
            <div className={styles.card__details}>
                <p className={styles.card__description}>{description}</p>
                 <div className={styles.card__stats}>
                     <span className={styles.card__stats__text}>{attack}</span>
                     <div>/</div>
                        <span className={styles.card__stats__text}>{defense}</span>
                 </div>
            </div>
        </div>

    );
}


export  default CardElement;
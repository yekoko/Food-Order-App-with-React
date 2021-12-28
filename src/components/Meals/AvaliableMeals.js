import { useEffect, useState } from 'react';
import classes from './AvailableMeals.module.css';
import MealItem from './MealItem/MealItem';
import Card from '../UI/Card';

const AvaliableMeals = () => {
    const [meals, setMeals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState();

    useEffect(() => {
        const fetchMeals = async () => {
            const response = await fetch('https://react-http-8bbed-default-rtdb.asia-southeast1.firebasedatabase.app/meals.json');

            if(!response.ok) {
                throw new Error('Something went wrong!');
            }

            const data = await response.json();

            const loadedMeals = [];
            for(const key in data){
                loadedMeals.push({
                    id: key,
                    name: data[key].name,
                    description: data[key].description,
                    price: data[key].price
                });
            }

            setMeals(loadedMeals);
            setIsLoading(false);
        };

         
        fetchMeals().catch((e) => {
            setIsLoading(false);
            setHttpError(e.message);
        });
    }, []);

    if(isLoading){
        return (
            <section className={classes.MealsLoading}>
                <p>Loading.....</p>
            </section>
        );
    }

    if(httpError) {
        return (
            <section className={classes.MealsError}>
                <p>{httpError}</p>
            </section>
        );
    }

    const mealList = meals.map(meal => (
        <MealItem 
            id={meal.id}
            key={meal.id} 
            name={meal.name} 
            description={meal.description} 
            price={meal.price} 
        />
    ));
    
    return (
        <section className={classes.meals}>
            <Card>
                <ul>
                    {mealList}
                </ul>
            </Card>
        </section>
    );
};

export default AvaliableMeals;
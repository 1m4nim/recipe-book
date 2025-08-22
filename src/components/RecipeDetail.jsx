import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const RecipeDetail = () => {
    // URLからレシピIDを取得
    const { id } = useParams();
    const navigate = useNavigate();

    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecipeDetail = async () => {
            try {
                const response = await axios.get(
                    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
                );
                // APIからのレスポンスをチェック
                if (response.data.meals && response.data.meals.length > 0) {
                    setRecipe(response.data.meals[0]);
                } else {
                    setError('レシピが見つかりませんでした。');
                }
            } catch (err) {
                console.error(err);
                setError('レシピ詳細の取得中にエラーが発生しました。');
            } finally {
                setLoading(false);
            }
        };

        fetchRecipeDetail();
    }, [id]); // IDが変更されたときに再実行

    if (loading) {
        return <p>読み込み中...</p>;
    }

    if (error) {
        return <p className="error">{error}</p>;
    }
    
    // 材料と分量をリスト化
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        const ingredient = recipe[`strIngredient${i}`];
        const measure = recipe[`strMeasure${i}`];
        if (ingredient && ingredient.trim() !== '') {
            ingredients.push({ ingredient, measure });
        }
    }

    return (
        <div className="recipe-detail-container">
            <button onClick={() => navigate(-1)} className="back-button">
                &larr; 戻る
            </button>
            <div className="detail-header">
                <img src={recipe.strMealThumb} alt={recipe.strMeal} className="detail-image" />
                <h1>{recipe.strMeal}</h1>
            </div>
            <div className="detail-content">
                <div className="info-box">
                    <h2>カテゴリー: {recipe.strCategory}</h2>
                    <h2>地域: {recipe.strArea}</h2>
                </div>
                <div className="ingredients-box">
                    <h3>材料</h3>
                    <ul>
                        {ingredients.map((item, index) => (
                            <li key={index}>
                                {item.ingredient} - {item.measure}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="instructions-box">
                    <h3>作り方</h3>
                    <p>{recipe.strInstructions}</p>
                </div>
                {recipe.strYoutube && (
                    <div className="youtube-box">
                        <h3>動画で見る</h3>
                        <a href={recipe.strYoutube} target="_blank" rel="noopener noreferrer">
                            YouTubeでレシピを見る
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecipeDetail;
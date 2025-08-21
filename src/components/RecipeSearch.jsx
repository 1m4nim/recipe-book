import React, { useState } from 'react';
import axios from 'axios';

const RecipeSearch = () => {
    const [query, setQuery] = useState(''); // 検索キーワードを管理
    const [recipes, setRecipes] = useState([]); // 検索結果のレシピを管理
    const [loading, setLoading] = useState(false); // API通信中の状態を管理
    const [error, setError] = useState(null); // エラーメッセージを管理

    const searchRecipes = async () => {
        if (!query) return;

        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(
                `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
            );

            setRecipes(response.data.meals || []);
        } catch (err) {
            console.error(err);
            setError('レシピの取得中にエラーが発生しました。');
            setRecipes([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="recipe-search-container">
            <h1>レシピ検索アプリ </h1>
            <div className="search-form">
                <input
                    type="text"
                    placeholder="料理名や食材を入力..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button onClick={searchRecipes}>検索</button>
            </div>

            {loading && <p>検索中...</p>}
            {error && <p className="error">{error}</p>}

            <div className="recipe-list">
                {recipes.length > 0 ? (
                    recipes.map((recipe) => (
                        <div key={recipe.idMeal} className="recipe-card">
                            <img src={recipe.strMealThumb} alt={recipe.strMeal} />
                            <h3>{recipe.strMeal}</h3>
                            <p>カテゴリ: {recipe.strCategory}</p>
                            <a href={recipe.strSource} target="_blank" rel="noopener noreferrer">
                                レシピを見る
                            </a>
                        </div>
                    ))
                ) : (
                    !loading && <p>レシピが見つかりませんでした。</p>
                )}
            </div>
        </div>
    );
};

export default RecipeSearch;
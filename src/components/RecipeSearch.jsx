import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const RecipeSearch = () => {
    // sessionStorageから状態を読み込む関数
    const getInitialState = (key, defaultValue) => {
        try {
            const savedState = sessionStorage.getItem(key);
            return savedState ? JSON.parse(savedState) : defaultValue;
        } catch (error) {
            console.error("Failed to load state from sessionStorage:", error);
            return defaultValue;
        }
    };

    const [query, setQuery] = useState(() => getInitialState('searchQuery', ''));
    const [recipes, setRecipes] = useState(() => getInitialState('searchResults', []));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(() => getInitialState('currentPage', 1));

    // 検索実行時に状態をsessionStorageに保存
    const searchRecipes = async () => {
        if (!query) return;

        setLoading(true);
        setError(null);
        setCurrentPage(1);

        try {
            const response = await axios.get(
                `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
            );

            const newRecipes = response.data.meals || [];
            setRecipes(newRecipes);

            // 検索結果とクエリを保存
            sessionStorage.setItem('searchQuery', JSON.stringify(query));
            sessionStorage.setItem('searchResults', JSON.stringify(newRecipes));
            sessionStorage.setItem('currentPage', JSON.stringify(1));

        } catch (err) {
            console.error(err);
            setError('レシピの取得中にエラーが発生しました。');
            setRecipes([]);
            sessionStorage.removeItem('searchResults');
        } finally {
            setLoading(false);
        }
    };
    
    // ページ変更時に状態をsessionStorageに保存
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        sessionStorage.setItem('currentPage', JSON.stringify(pageNumber));
    };

    const recipesPerPage = 10;
    const indexOfLastRecipes = currentPage * recipesPerPage;
    const indexOfFirstRecipes = indexOfLastRecipes - recipesPerPage;
    const currentRecipes = recipes.slice(indexOfFirstRecipes, indexOfLastRecipes);

    const totalPages = Math.ceil(recipes.length / recipesPerPage);

    return (
        <div className="recipe-search-container">
            <h1>レシピ検索アプリ </h1>
            <div className="search-form">
                <input
                    type="text"
                    placeholder="料理名や食材を英語で入力..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            searchRecipes();
                        }
                    }}
                />
                <button onClick={searchRecipes}>検索</button>
            </div>

            {loading && <p>検索中...</p>}
            {error && <p className="error">{error}</p>}
            {!loading && recipes.length === 0 && query !== '' && <p>レシピが見つかりませんでした。</p>}

            <div className="recipe-list">
                {currentRecipes.map((recipe) => (
                    <Link key={recipe.idMeal} to={`/recipe/${recipe.idMeal}`} className="recipe-card-link">
                        <div className="recipe-card">
                            <img src={recipe.strMealThumb} alt={recipe.strMeal} />
                            <h3>{recipe.strMeal}</h3>
                            <p>カテゴリ: {recipe.strCategory}</p>
                        </div>
                    </Link>
                ))}
            </div>

            {totalPages > 1 && (
                <div className='pagination'>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index}
                            onClick={() => handlePageChange(index + 1)}
                            className={currentPage === index + 1 ? "active" : ""}>
                            {index + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RecipeSearch;
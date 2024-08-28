import React, { useEffect, useState } from 'react';
import './Row.css';
import axios from './axios';

function Row({ title, fetchUrl, isLargeRow = false }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const base_url = 'https://image.tmdb.org/t/p/original/';
  
  useEffect(() => {
    async function fetchData() {
      try {
        const request = await axios.get(fetchUrl);
        setMovies(request.data.results);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    }
    fetchData();
  }, [fetchUrl]);

  if (loading) {
    return <div className="row__loading">Loading...</div>; // You can customize this loading state
  }

  if (error) {
    return <div className="row__error">Error loading movies</div>; // Customize error state
  }

  return (
    <div className='row'>
      <h1>{title}</h1>
      <div className='row__posters'>
        {movies.map(
          (movie) =>
            ((isLargeRow && movie.poster_path) ||
            (!isLargeRow && movie.backdrop_path)) && (
              <img 
                className={`row__poster ${isLargeRow && 'row__posterLarge'}`}
                key={movie.id}
                src={`${base_url}${
                  isLargeRow ? movie.poster_path : movie.backdrop_path
                }`} 
                alt={movie.title || movie.name || 'Movie Poster'} // Improved alt text for accessibility
              />
            )
        )}
      </div>
    </div>
  );
}

export default Row;

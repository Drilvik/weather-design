import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFetchWeather } from '../hooks/useFetchWeather';
import { useWeather } from '../context/WeatherContext';
import styles from './ForecastPage.module.css';

const weekDays = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'НД'];

function getDayName(dateString) {
  const date = new Date(dateString);
  const dayName = date.toLocaleDateString('uk-UA', { weekday: 'long' });
  return dayName.charAt(0).toUpperCase() + dayName.slice(1);
}

function getWeatherInfo(code) {
  if (code === 0) return { icon: 'sun', text: 'Ясно' };
  if (code >= 1 && code <= 3) return { icon: 'cloud', text: 'Переважно хмарно' };
  if ((code >= 50 && code <= 67) || (code >= 80 && code <= 82)) return { icon: 'rain', text: 'Дощ' };
  if (code >= 71 && code <= 77) return { icon: 'rain', text: 'Сніг' };
  return { icon: 'cloud', text: 'Хмарно' };
}

function WeatherIcon({ type }) {
  if (type === 'rain') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="#3db8ff" strokeWidth="1.8" strokeLinecap="round">
        <path d="M16 13a4 4 0 0 1-8 0" />
        <path d="M8 19l.5 2M12 21l.5 2M16 19l.5 2M18 10h-1.3A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
      </svg>
    );
  }

  if (type === 'sun') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="#ffb800" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round">
      <path d="M18 10h-1.3A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
    </svg>
  );
}

function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <svg className={styles.logo} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.6">
        <path d="M18 10h-1.3A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
      </svg>

      <Link to="/home" className={styles.navLink}>
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.5 1.8 11.4h2.9V21h5.6v-6h3.4v6h5.6v-9.6h2.9z" />
        </svg>
      </Link>

      <Link to="/forecast" className={`${styles.navLink} ${styles.navLinkActive}`}>
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M7 1.5v2H5A2.5 2.5 0 0 0 2.5 6v13A2.5 2.5 0 0 0 5 21.5h14a2.5 2.5 0 0 0 2.5-2.5V6A2.5 2.5 0 0 0 19 3.5h-2v-2h-2v2H9v-2zM4.5 9h15v10a.5.5 0 0 1-.5.5H5a.5.5 0 0 1-.5-.5z" />
        </svg>
      </Link>

      <div className={styles.navBottom}>
        <Link to="/profile" className={styles.navLink}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 4.3a3.2 3.2 0 1 1 0 6.4 3.2 3.2 0 0 1 0-6.4zM6.2 18.2c.8-2.6 3.2-4 5.8-4s5 1.4 5.8 4a8 8 0 0 1-11.6 0z" />
          </svg>
        </Link>
      </div>
    </aside>
  );
}

function WeatherPanel({ data, loading, error }) {
  const { city, setCity, tempUnit, addFavorite, removeFavorite, isFavorite } = useWeather();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const formatTemp = (celsius) => {
    if (tempUnit === 'F') return Math.round(celsius * 1.8 + 32);
    return Math.round(celsius);
  };

  const searchCities = async (query) => {
    if (!query) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=uk&format=json`
      );
      const result = await response.json();
      if (result.results) {
        setSearchResults(result.results);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      console.error('Помилка пошуку:', err);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.length > 2) {
      searchCities(value);
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectCity = (selectedCity) => {
    setCity({
      name: selectedCity.name,
      country: selectedCity.country || '',
      lat: Number(selectedCity.latitude),
      lon: Number(selectedCity.longitude),
    });

    setSearchTerm('');
    setSearchResults([]);
  };

  const isFav = isFavorite(city.name);

  const toggleFavorite = () => {
    if (isFav) {
      removeFavorite(city.name);
    } else {
      addFavorite(city);
    }
  };

  if (loading) {
    return (
      <div className={`${styles.panel} ${styles.leftPanel}`}>
        <p style={{ color: '#fff', textAlign: 'center', marginTop: '20px' }}>Завантаження... ⏳</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={`${styles.panel} ${styles.leftPanel}`}>
        <p style={{ color: '#ff6b6b', textAlign: 'center', marginTop: '20px' }}>
          Помилка: {error || 'Не вдалося завантажити дані'}
        </p>
      </div>
    );
  }

  const rawTodayTemp = data.current_weather?.temperature != null
    ? data.current_weather.temperature
    : (data.daily?.temperature_2m_max?.[0] ?? data.temperature_2m_max?.[0] ?? 0);
    
  const todayTemp = formatTemp(rawTodayTemp);

  const todayCode = data.current_weather?.weathercode 
    ?? data.daily?.weathercode?.[0] 
    ?? data.weathercode?.[0] 
    ?? 0;

  const todayInfo = getWeatherInfo(todayCode);

  const times = (data.daily?.time || data.time || []).slice(0, 7);
  const minTemps = data.daily?.temperature_2m_min || data.temperature_2m_min || [];
  const maxTemps = data.daily?.temperature_2m_max || data.temperature_2m_max || [];
  const codes = data.daily?.weathercode || data.weathercode || [];

  return (
    <div className={`${styles.panel} ${styles.leftPanel}`}>
      <div className={styles.searchBox} style={{ position: 'relative' }}>
        <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="currentColor">
          <path d="M10.5 2a8.5 8.5 0 0 1 6.8 13.6l5.1 5.1-1.7 1.7-5.1-5.1A8.5 8.5 0 1 1 10.5 2zm0 2.4a6.1 6.1 0 1 0 0 12.2 6.1 6.1 0 0 0 0-12.2z" />
        </svg>
        <input 
          className={styles.searchInput} 
          type="text" 
          placeholder="Оберіть місто..." 
          value={searchTerm}
          onChange={handleInputChange}
        />

        {searchResults.length > 0 && (
          <ul style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: '#1E1E1E',
            border: '1px solid #333',
            borderRadius: '12px',
            listStyle: 'none',
            padding: '8px 0',
            margin: '4px 0 0 0',
            zIndex: 10,
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
          }}>
            {searchResults.map((result, index) => (
              <li 
                key={index}
                onClick={() => handleSelectCity(result)}
                style={{
                  padding: '10px 16px',
                  cursor: 'pointer',
                  color: '#fff',
                  borderBottom: index !== searchResults.length - 1 ? '1px solid #333' : 'none',
                  fontSize: '14px',
                  display: 'flex',
                  flexDirection: 'column'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2A2A2A'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <span>{result.name}</span>
                <span style={{ fontSize: '11px', color: '#888' }}>
                  {result.admin1 ? `${result.admin1}, ` : ''}{result.country}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={styles.mainIcon}>
        <WeatherIcon type={todayInfo.icon} />
      </div>
      <div className={styles.bigTemp}>{todayTemp}°{tempUnit}</div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '10px' }}>
        <h2 className={styles.cityName} style={{ margin: 0 }}>
          {city.name}{city.country ? `, ${city.country}` : ''}
        </h2>
        <button 
          onClick={toggleFavorite} 
          style={{ 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer', 
            fontSize: '24px',
            padding: 0,
            lineHeight: 1
          }}
          title={isFav ? 'Видалити з улюблених' : 'Додати в улюблені'}
        >
          {isFav ? '❤️' : '🤍'}
        </button>
      </div>
      <p className={styles.condition}>{todayInfo.text}</p>

      <div className={styles.forecastBlock}>
        <h4 className={styles.forecastTitle}>Прогноз на 7 днів</h4>

        <div
          style={{
            maxHeight: '165px',
            overflowY: 'auto',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {times.map((dateStr, index) => {
            const code = codes[index] ?? 0;
            const info = getWeatherInfo(code);
            const min = formatTemp(minTemps[index] ?? 0);
            const max = formatTemp(maxTemps[index] ?? 0);

            return (
              <div key={dateStr} className={styles.forecastItem}>
                <span className={styles.dayName}>{getDayName(dateStr)}</span>
                <div className={styles.iconBox}>
                  <WeatherIcon type={info.icon} />
                </div>
                <span className={styles.tempRange}>
                  {min}°{tempUnit} / {max}°{tempUnit}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function MonthlyForecast({ data, loading, error }) {
  const { city, tempUnit } = useWeather();

  const formatTemp = (celsius) => {
    if (tempUnit === 'F') return Math.round(celsius * 1.8 + 32);
    return Math.round(celsius);
  };

  if (loading) {
    return (
      <div className={`${styles.panel} ${styles.rightSide}`}>
        <p style={{ color: '#fff', textAlign: 'center', marginTop: '20px' }}>
          Завантаження 30-денного прогнозу... ⏳
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={`${styles.panel} ${styles.rightSide}`}>
        <p style={{ color: '#ff6b6b', textAlign: 'center', marginTop: '20px' }}>
          Помилка: {error || 'Не вдалося завантажити дані'}
        </p>
      </div>
    );
  }

  const times = data.daily?.time || data.time || [];
  const minTemps = data.daily?.temperature_2m_min || data.temperature_2m_min || [];
  const maxTemps = data.daily?.temperature_2m_max || data.temperature_2m_max || [];
  const codes = data.daily?.weathercode || data.weathercode || [];

  const monthDays = times.map((dateStr, index) => {
    const dateObj = new Date(dateStr);
    const dayNum = dateObj.getDate();
    const code = codes[index] ?? 0;
    const info = getWeatherInfo(code);
    
    const min = formatTemp(minTemps[index] ?? 0);
    const max = formatTemp(maxTemps[index] ?? 0);

    let monthLabel = null;
    if (dayNum === 1 || index === 0) {
      monthLabel = dateObj.toLocaleDateString('uk-UA', { month: 'short' }).replace('.', '');
    }

    return {
      num: dayNum,
      month: monthLabel,
      today: index === 0,
      icon: info.icon,
      max,
      min,
      dateStr,
    };
  });

  const maxTempsArr = monthDays.map((d) => d.max);
  const minTempsArr = monthDays.map((d) => d.min);
  const maxTemp = maxTempsArr.length ? Math.max(...maxTempsArr) : 0;
  const minTemp = minTempsArr.length ? Math.min(...minTempsArr) : 0;
  const avgTemp = maxTempsArr.length
    ? Math.round(maxTempsArr.reduce((acc, curr) => acc + curr, 0) / maxTempsArr.length)
    : 0;
  const rainDays = monthDays.filter((d) => d.icon === 'rain').length;
  const sunDays = monthDays.filter((d) => d.icon === 'sun').length;

  const startDate = new Date(times[0] || Date.now());
  const endDate = new Date(times[times.length - 1] || Date.now());
  
  const cityNameFull = `${city.name}${city.country ? `, ${city.country}` : ''}`;
  const subtitle = `${startDate.toLocaleDateString('uk-UA', {
    day: 'numeric',
    month: 'long',
  })} — ${endDate.toLocaleDateString('uk-UA', {
    day: 'numeric',
    month: 'long',
  })} · ${cityNameFull}`;

  return (
    <div className={`${styles.panel} ${styles.rightSide}`}>
      <div className={styles.forecastHeader}>
        <div>
          <h1 className={styles.forecastTitleBig}>Прогноз на 30 днів</h1>
          <p className={styles.forecastSubtitle}>{subtitle}</p>
        </div>

        <div className={styles.chips}>
          <div className={styles.chip}>
            <small>Середня</small>
            <b>{avgTemp}°{tempUnit}</b>
          </div>
          <div className={styles.chip}>
            <small>Макс.</small>
            <b>{maxTemp}°{tempUnit}</b>
          </div>
          <div className={styles.chip}>
            <small>Мін.</small>
            <b>{minTemp}°{tempUnit}</b>
          </div>
          <div className={styles.chip}>
            <WeatherIcon type="rain" />
            <b>{rainDays}</b>
            <small>дощових</small>
          </div>
          <div className={styles.chip}>
            <WeatherIcon type="sun" />
            <b>{sunDays}</b>
            <small>ясних</small>
          </div>
        </div>
      </div>

      <div className={styles.weekRow}>
        {weekDays.map((wd) => (
          <span key={wd}>{wd}</span>
        ))}
      </div>

      <div className={styles.calendarGrid}>
        {monthDays.map((d, index) => (
          <div key={d.dateStr || index} className={`${styles.day} ${d.today ? styles.dayToday : ''}`}>
            <div className={styles.dayTop}>
              <span>
                <span className={styles.dayNum}>{d.num}</span>
                {d.month && <span className={styles.dayMonth}> {d.month}</span>}
                {d.today && <span className={styles.todayLabel}>Сьогодні</span>}
              </span>
              <span className={styles.dayIcon}>
                <WeatherIcon type={d.icon} />
              </span>
            </div>
            <div className={styles.dayTemps}>
              <span className={styles.dayMax}>{d.max}°</span>
              <span className={styles.dayMin}>{d.min}°</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ForecastPage() {
  const { data, loading, error } = useFetchWeather(30);

  return (
    <div className={styles.page}>
      <Sidebar />

      <main className={styles.main}>
        <WeatherPanel data={data} loading={loading} error={error} />
        <MonthlyForecast data={data} loading={loading} error={error} />
      </main>
    </div>
  );
}
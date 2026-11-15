import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useFetchWeather } from '../hooks/useFetchWeather';
import { useWeather } from '../context/WeatherContext';
import styles from './Home.module.css';

function getDayName(dateString) {
  const date = new Date(dateString);
  const dayName = date.toLocaleDateString('uk-UA', { weekday: 'long' });
  return dayName.charAt(0).toUpperCase() + dayName.slice(1);
}

function getWeatherInfo(code) {
  if (code === 0) return { type: 'sun', text: 'Ясно' };
  if (code >= 1 && code <= 3) return { type: 'cloud', text: 'Переважно хмарно' };
  if ((code >= 50 && code <= 67) || (code >= 80 && code <= 82)) return { type: 'rain', text: 'Дощ' };
  if (code >= 71 && code <= 77) return { type: 'rain', text: 'Сніг' };
  return { type: 'cloud', text: 'Хмарно' };
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
      <svg viewBox="0 0 24 24" fill="none" stroke="#ffb83d" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
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

      <Link to="/" className={`${styles.navLink} ${styles.navLinkActive}`}>
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.5 1.8 11.4h2.9V21h5.6v-6h3.4v6h5.6v-9.6h2.9z" />
        </svg>
      </Link>

      <Link to="/map" className={styles.navLink}>
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 1.5a5.5 5.5 0 0 0-5.5 5.5c0 3.7 5.5 9 5.5 9s5.5-5.3 5.5-9A5.5 5.5 0 0 0 12 1.5zm0 3.3a2.2 2.2 0 1 1 0 4.4 2.2 2.2 0 0 1 0-4.4z" />
        </svg>
      </Link>

      <Link to="/forecast" className={styles.navLink}>
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

        <Link to="/settings" className={styles.navLink}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3.2" />
            <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4" />
          </svg>
        </Link>
      </div>
    </aside>
  );
}

function WeatherPanel({ data, loading, error }) {
  const { city, setCity, addFavorite, removeFavorite, isFavorite, tempUnit } = useWeather(); 

  const formatTemp = (celsius) => {
    if (tempUnit === 'F') return Math.round(celsius * 1.8 + 32);
    return Math.round(celsius);
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchCities = async (query) => {
    if (!query) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    try {
      const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=uk&format=json`);
      const result = await response.json();
      if (result.results) {
        setSearchResults(result.results);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Помилка пошуку:', error);
    } finally {
      setIsSearching(false);
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
      lon: Number(selectedCity.longitude)
    });
    
    setSearchTerm('');
    setSearchResults([]);
  };

  if (loading) {
    return (
      <div className={`${styles.panel} ${styles.leftPanel}`}>
        <p style={{ color: '#fff', textAlign: 'center', marginTop: '20px' }}>
          Завантаження погоди для {city.name}... ⏳ 
        </p>
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

  const rawCurrentTemp = data.current_weather?.temperature != null
    ? data.current_weather.temperature
    : (data.daily?.temperature_2m_max?.[0] ?? data.temperature_2m_max?.[0] ?? 0);
  
  const currentTemp = formatTemp(rawCurrentTemp);

  const currentCode = data.current_weather?.weathercode 
    ?? data.daily?.weathercode?.[0] 
    ?? data.weathercode?.[0] 
    ?? 0;

  const todayInfo = getWeatherInfo(currentCode);

  const times = data.daily?.time || data.time || [];
  const maxTemps = data.daily?.temperature_2m_max || data.temperature_2m_max || [];
  const minTemps = data.daily?.temperature_2m_min || data.temperature_2m_min || [];
  const codes = data.daily?.weathercode || data.weathercode || [];

  const isFav = isFavorite(city.name);

  const toggleFavorite = () => {
    if (isFav) {
      removeFavorite(city.name);
    } else {
      addFavorite(city);
    }
  };

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
        <WeatherIcon type={todayInfo.type} />
      </div>
      <div className={styles.bigTemp}>{currentTemp}°{tempUnit}</div>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '10px' }}>
        <h2 className={styles.cityName} style={{ margin: 0, marginBottom: 0 }}>{city.name}</h2> 
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
            const maxTemp = formatTemp(maxTemps[index] ?? 0);
            const minTemp = formatTemp(minTemps[index] ?? 0);

            return (
              <div key={dateStr} className={styles.forecastItem}>
                <span className={styles.dayName}>{getDayName(dateStr)}</span>
                <div className={styles.iconBox}>
                  <WeatherIcon type={info.type} />
                </div>
                <span className={styles.tempRange}>
                  {minTemp}°{tempUnit} / {maxTemp}°{tempUnit}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatsGrid({ data }) {
  const { windUnit } = useWeather();
  
  const rawWindSpeed = data?.current_weather?.windspeed ?? 0;
  
  const windSpeed = windUnit === 'ms' 
    ? (rawWindSpeed / 3.6).toFixed(1) 
    : Math.round(rawWindSpeed);
    
  const windLabel = windUnit === 'ms' ? 'м/с' : 'км/год';

  const uvIndex = Number(data?.daily?.uv_index_max?.[0] ?? 0); 
  const sunriseRaw = data?.daily?.sunrise?.[0];
  const sunsetRaw = data?.daily?.sunset?.[0];

  const formatTime = (isoTime) => {
    if (!isoTime) return '--:--';
    return new Date(isoTime).toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
  };

  const uvPercentage = Math.min(Math.max(uvIndex, 0) / 11, 1);
  const pathLength = 126;
  const dashOffset = pathLength - (pathLength * uvPercentage);

  let sunPosition = 0;
  if (sunriseRaw && sunsetRaw) {
    const now = new Date().getTime();
    const sunriseTime = new Date(sunriseRaw).getTime();
    const sunsetTime = new Date(sunsetRaw).getTime();

    if (now < sunriseTime) {
      sunPosition = 0;
    } else if (now > sunsetTime) {
      sunPosition = 100;
    } else {
      const totalDaylight = sunsetTime - sunriseTime;
      const passedDaylight = now - sunriseTime;
      sunPosition = (passedDaylight / totalDaylight) * 100;
    }
  }

  return (
    <div className={styles.statsGrid}>
      <div className={styles.panel}>
        <div className={styles.statLabel}>Швидкість вітру</div>
        <div className={styles.windValue}>{windSpeed} {windLabel}</div>
        <div className={styles.windChart}>
          <svg viewBox="0 0 100 30" width="100%">
            <path d="M0 20 Q 25 5, 50 20 T 100 20" fill="none" stroke="#3db8ff" strokeWidth="3" />
          </svg>
        </div>
      </div>

      <div className={styles.panel}>
        <div className={styles.statLabel}>УФ Індекс</div>
        <div className={styles.uvBox}>
          <svg width="100" height="60" viewBox="0 0 100 60">
            <path d="M10 50 A 40 40 0 0 1 90 50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="7" />
            <path 
              className={styles.uvArc} 
              d="M10 50 A 40 40 0 0 1 90 50" 
              fill="none" 
              stroke="#3db8ff" 
              strokeWidth="7"
              style={{ 
                strokeDasharray: pathLength,
                strokeDashoffset: dashOffset,
                transition: 'stroke-dashoffset 1s ease-out' 
              }} 
            />
          </svg>
          <div className={styles.uvNum}>{uvIndex}</div>
        </div>
      </div>

      <div className={styles.panel}>
        <div className={styles.statLabel}>Схід та Захід Сонця</div>
        <div className={styles.sunPath} style={{ position: 'relative' }}>
          <img className={styles.sunIcon} src="https://img.icons8.com/fluency/48/sun--v1.png" alt="схід сонця" />
          
          <div 
            className={styles.sunNode} 
            style={{ 
              position: 'absolute',
              left: `calc(${sunPosition}% - 6px)`,
              transition: 'left 1s ease-out',
              width: '12px',
              height: '12px',
              backgroundColor: '#ffb83d',
              borderRadius: '50%',
              top: '50%',
              transform: 'translateY(-50%)',
              boxShadow: '0 0 10px #ffb83d'
            }}
          ></div>

          <img className={styles.moonIcon} src="https://img.icons8.com/fluency/48/full-moon.png" alt="захід сонця" />
        </div>
        <p className={styles.sunCount}>Схід: {formatTime(sunriseRaw)} | Захід: {formatTime(sunsetRaw)}</p>
      </div>
    </div>
  );
}

function WeatherMap() {
  const { city, setCity } = useWeather();
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    if (!window.L) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }

    function initMap() {
      if (!mapContainerRef.current || mapInstanceRef.current) return;
      const L = window.L;

      const lat = Number(city.lat) || 48.62;
      const lon = Number(city.lon) || 22.28;

      const map = L.map(mapContainerRef.current, {
        center: [lat, lon],
        zoom: 9,
        zoomControl: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap',
      }).addTo(map);

      const marker = L.marker([lat, lon]).addTo(map);
      marker.bindPopup(`<b>${city.name}</b>`).openPopup();

      markerRef.current = marker;
      mapInstanceRef.current = map;

      map.on('click', async (e) => {
        const clickedLat = e.latlng.lat;
        const clickedLon = e.latlng.lng;

        try {
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${clickedLat}&longitude=${clickedLon}&localityLanguage=uk`
          );
          const geocodeData = await res.json();

          const detectedName =
            geocodeData.city ||
            geocodeData.locality ||
            geocodeData.principalSubdivision ||
            'Невідоме місто';
          const detectedCountry = geocodeData.countryName || '';

          setCity({
            name: detectedName,
            country: detectedCountry,
            lat: clickedLat,
            lon: clickedLon,
          });
        } catch (err) {
          console.error('Помилка геокодування при кліку на карту:', err);
        }
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current && window.L) {
      const lat = Number(city.lat) || 48.62;
      const lon = Number(city.lon) || 22.28;

      mapInstanceRef.current.setView([lat, lon], 9);

      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lon]);
        markerRef.current.bindPopup(`<b>${city.name}</b>`).openPopup();
      }
    }
  }, [city]);

  return (
    <div
      ref={mapContainerRef}
      className={styles.mapContainer}
      style={{
        width: '100%',
        height: '240px',
        borderRadius: '16px',
        overflow: 'hidden',
        zIndex: 1,
      }}
    />
  );
}

export default function Home() {
  const { data, loading, error } = useFetchWeather(7);

  return (
    <div className={styles.page}>
      <Sidebar />

      <main className={styles.main}>
        <WeatherPanel data={data} loading={loading} error={error} />

        <div className={styles.rightPanel}>
          <StatsGrid data={data} />
          <WeatherMap />
        </div>
      </main>
    </div>
  );
}
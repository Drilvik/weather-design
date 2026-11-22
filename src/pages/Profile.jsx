import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFetchWeather } from '../hooks/useFetchWeather';
import { useAuth } from '../hooks/useAuth';
import { useWeather } from '../context/WeatherContext';
import styles from './Profile.module.css';

function getWeatherInfo(code) {
  if (code === 0) return { condition: 'Ясно', icon: 'sun' };
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(code)) {
    return { condition: 'Дощ', icon: 'rain' };
  }
  if ([71, 73, 75, 77, 85, 86].includes(code)) {
    return { condition: 'Мокрий сніг', icon: 'rain' };
  }
  return { condition: 'Переважно хмарно', icon: 'cloud' };
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

      <Link to="/forecast" className={styles.navLink}>
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M7 1.5v2H5A2.5 2.5 0 0 0 2.5 6v13A2.5 2.5 0 0 0 5 21.5h14a2.5 2.5 0 0 0 2.5-2.5V6A2.5 2.5 0 0 0 19 3.5h-2v-2h-2v2H9v-2zM4.5 9h15v10a.5.5 0 0 1-.5.5H5a.5.5 0 0 1-.5-.5z" />
        </svg>
      </Link>

      <div className={styles.navBottom}>
        <Link to="/profile" className={`${styles.navLink} ${styles.navLinkActive}`}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 4.3a3.2 3.2 0 1 1 0 6.4 3.2 3.2 0 0 1 0-6.4zM6.2 18.2c.8-2.6 3.2-4 5.8-4s5 1.4 5.8 4a8 8 0 0 1-11.6 0z" />
          </svg>
        </Link>
      </div>
    </aside>
  );
}

function WeatherPanel() {
  const { city, setCity, isFavorite, addFavorite, removeFavorite, tempUnit } = useWeather();
  const { data, loading, error } = useFetchWeather(7);

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

  const isFavoriteCity = isFavorite(city.name);

  const handleToggleFavorite = () => {
    if (isFavoriteCity) {
      removeFavorite(city.name);
    } else {
      addFavorite(city);
    }
  };

  if (loading) {
    return (
      <div className={`${styles.panel} ${styles.leftPanel}`}>
        <p style={{ textAlign: 'center', color: '#aaa', marginTop: '50px' }}>
          Завантаження погоди...
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={`${styles.panel} ${styles.leftPanel}`}>
        <p style={{ textAlign: 'center', color: '#ff6b6b', marginTop: '50px' }}>
          Помилка завантаження
        </p>
      </div>
    );
  }

  const currentTemp = formatTemp(data.current_weather?.temperature ?? 0);
  const currentInfo = getWeatherInfo(data.current_weather?.weathercode ?? 3);

  const dailyForecast = (data.daily?.time || []).map((timeStr, i) => {
    const dateObj = new Date(timeStr);
    const rawDay = dateObj.toLocaleDateString('uk-UA', { weekday: 'long' });
    const day = rawDay.charAt(0).toUpperCase() + rawDay.slice(1);

    const min = formatTemp(data.daily?.temperature_2m_min?.[i] ?? 0);
    const max = formatTemp(data.daily?.temperature_2m_max?.[i] ?? 0);
    const icon = getWeatherInfo(data.daily?.weathercode?.[i] ?? 3).icon;

    return { day, min, max, icon };
  });

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
        <WeatherIcon type={currentInfo.icon} />
      </div>
      <div className={styles.bigTemp}>{currentTemp}°{tempUnit}</div>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
        <h2 className={styles.cityName}>
          {city.name}
        </h2>
        <button
          onClick={handleToggleFavorite}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center'
          }}
          title={isFavoriteCity ? 'Видалити з улюблених' : 'Додати до улюблених'}
        >
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            stroke={isFavoriteCity ? '#ff4757' : '#fff'}
            fill={isFavoriteCity ? '#ff4757' : 'none'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      <p className={styles.condition}>{currentInfo.condition}</p>

      <div className={styles.forecastBlock}>
        <h4 className={styles.forecastTitle}>Прогноз на 7 днів</h4>
        <div style={{ maxHeight: '165px', overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {dailyForecast.map((item, index) => (
            <div key={`${item.day}-${index}`} className={styles.forecastItem}>
              <span className={styles.dayName}>{item.day}</span>
              <div className={styles.iconBox}>
                <WeatherIcon type={item.icon} />
              </div>
              <span className={styles.tempRange}>
                {item.min}°{tempUnit} / {item.max}°{tempUnit}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProfileHeader() {
  const { favoriteCities, userProfile, updateAvatar } = useWeather();
  const fileInputRef = useRef(null);

  let storedUser = null;
  try {
    storedUser = JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    storedUser = null;
  }

  const username =
    userProfile?.name ||
    userProfile?.username ||
    storedUser?.name ||
    localStorage.getItem('username') ||
    'Користувач';

  const badge = userProfile?.badge || storedUser?.badge || localStorage.getItem('userBadge') || '★ Premium';
  const email = userProfile?.email || storedUser?.email || '';
  const location =
    userProfile?.location ||
    (userProfile?.cityName
      ? `${userProfile.cityName}${userProfile.country ? `, ${userProfile.country}` : ''}`
      : 'Ужгород, Україна');
  const joinedYear = userProfile?.joinedYear || '2026';

  const initials = username
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        alert('Файл занадто великий. Будь ласка, оберіть зображення розміром до 1MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        updateAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={`${styles.panel} ${styles.profileHeader}`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />
      <div 
        className={styles.avatarWrap} 
        onClick={handleAvatarClick} 
        style={{ cursor: 'pointer' }}
      >
        {userProfile?.avatar ? (
          <img
            src={userProfile.avatar}
            alt="Avatar"
            className={styles.avatar}
            style={{ objectFit: 'cover', display: 'block', padding: 0 }}
          />
        ) : (
          <div className={styles.avatar}>{initials}</div>
        )}
        <div className={styles.avatarEdit}>
          <svg viewBox="0 0 24 24" fill="#000">
            <path d="M4 16.5V20h3.5L18 9.5 14.5 6zM19.7 7.8a1 1 0 0 0 0-1.4l-2.1-2.1a1 1 0 0 0-1.4 0L14.9 5.6l3.5 3.5z" />
          </svg>
        </div>
      </div>

      <div className={styles.profileInfo}>
        <h2 className={styles.profileName}>{username}</h2>
        <p className={styles.profileEmail}>{email}</p>
        <p className={styles.profileMeta}>{location} · З нами з {joinedYear}</p>
        <div className={styles.badge}>
          <svg viewBox="0 0 24 24">
            <path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.2 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8z" />
          </svg>
          {badge}
        </div>
      </div>

      <div className={styles.profileSide}>
        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <b>{favoriteCities.length}</b>
            <span>Збережених міст</span>
          </div>
          <div className={styles.statCard}>
            <b>12</b>
            <span>Сповіщень за тиждень</span>
          </div>
        </div>

        <div className={styles.headerButtons}>
          <button className={styles.btnPrimary}>Редагувати профіль</button>
          <button className={styles.btnDark} onClick={handleAvatarClick}>
            Змінити аватар
          </button>
        </div>
      </div>
    </div>
  );
}

function FavoriteCities() {
  const { favoriteCities, removeFavorite, setCity } = useWeather();

  return (
    <div className={styles.panel}>
      <h4 className={styles.cardTitle}>Улюблені міста</h4>
      
      {favoriteCities.length === 0 ? (
        <p style={{ color: '#aaa', fontSize: '14px', marginTop: '10px' }}>
          Список улюблених міст порожній.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>
          {favoriteCities.map((favCity, index) => (
            <div 
              key={favCity.id || `${favCity.name}-${index}`} 
              className={styles.favItem}
              onClick={() => setCity({
                name: favCity.name,
                country: favCity.country || '',
                lat: Number(favCity.lat),
                lon: Number(favCity.lon)
              })}
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ width: '24px', height: '24px' }}>
                  <WeatherIcon type="sun" />
                </div>
                <div className={styles.favName}>
                  <b style={{ fontSize: '16px' }}>{favCity.name}</b>
                  <span style={{ fontSize: '12px', color: '#aaa', marginLeft: '6px' }}>
                    {favCity.country || ''}
                  </span>
                </div>
              </div>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  removeFavorite(favCity.name);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ff6b6b',
                  fontSize: '14px',
                  cursor: 'pointer',
                  padding: '5px'
                }}
                title="Видалити зі списку"
              >
                ❌
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function NotificationsCard() {
  const { userProfile, toggleNotification } = useWeather();

  const notifRain = userProfile?.notifRain ?? true;
  const notifWind = userProfile?.notifWind ?? true;
  const notifMorning = userProfile?.notifMorning ?? true;
  const notifUv = userProfile?.notifUv ?? false;

  return (
    <div className={styles.panel}>
      <h4 className={styles.cardTitle}>Сповіщення</h4>
      <div 
        className={styles.toggleRow} 
        onClick={() => toggleNotification('notifRain', notifRain)}
        style={{ cursor: 'pointer' }}
      >
        <div className={styles.toggleText}>
          <b>Дощ і мокрий сніг</b>
          <span>За годину до початку</span>
        </div>
        <div className={`${styles.switch} ${notifRain ? styles.switchOn : ''}`}></div>
      </div>
      <div 
        className={styles.toggleRow} 
        onClick={() => toggleNotification('notifWind', notifWind)}
        style={{ cursor: 'pointer' }}
      >
        <div className={styles.toggleText}>
          <b>Сильний вітер</b>
          <span>Від 15 км/год</span>
        </div>
        <div className={`${styles.switch} ${notifWind ? styles.switchOn : ''}`}></div>
      </div>
      <div 
        className={styles.toggleRow} 
        onClick={() => toggleNotification('notifMorning', notifMorning)}
        style={{ cursor: 'pointer' }}
      >
        <div className={styles.toggleText}>
          <b>Ранковий прогноз</b>
          <span>Щодня о 07:30</span>
        </div>
        <div className={`${styles.switch} ${notifMorning ? styles.switchOn : ''}`}></div>
      </div>
      <div 
        className={styles.toggleRow} 
        onClick={() => toggleNotification('notifUv', notifUv)}
        style={{ cursor: 'pointer' }}
      >
        <div className={styles.toggleText}>
          <b>Високий УФ індекс</b>
          <span>Від 6 і вище</span>
        </div>
        <div className={`${styles.switch} ${notifUv ? styles.switchOn : ''}`}></div>
      </div>
    </div>
  );
}

function SettingsCard({ handleLogout }) {
  const { tempUnit, setTempUnit, windUnit, setWindUnit } = useWeather();

  return (
    <div className={`${styles.panel} ${styles.settingsCard}`}>
      <h4 className={styles.cardTitle}>Налаштування</h4>
      <div className={styles.settingGroup}>
        <span className={styles.settingLabel}>Температура</span>
        <div className={styles.segmented}>
          <button 
            className={`${styles.segmentBtn} ${tempUnit === 'C' ? styles.segmentOn : ''}`}
            onClick={() => setTempUnit('C')}
          >
            °C
          </button>
          <button 
            className={`${styles.segmentBtn} ${tempUnit === 'F' ? styles.segmentOn : ''}`}
            onClick={() => setTempUnit('F')}
          >
            °F
          </button>
        </div>
      </div>
      <div className={styles.settingGroup}>
        <span className={styles.settingLabel}>Швидкість вітру</span>
        <div className={styles.segmented}>
          <button 
            className={`${styles.segmentBtn} ${windUnit === 'kmh' ? styles.segmentOn : ''}`}
            onClick={() => setWindUnit('kmh')}
          >
            км/год
          </button>
          <button 
            className={`${styles.segmentBtn} ${windUnit === 'ms' ? styles.segmentOn : ''}`}
            onClick={() => setWindUnit('ms')}
          >
            м/с
          </button>
        </div>
      </div>
      <div className={styles.settingGroup}>
        <span className={styles.settingLabel}>Мова</span>
        <div className={styles.select}>Українська</div>
      </div>
      <div className={styles.settingsFooter}>
        <button className={styles.btnFooter}>Змінити пароль</button>
        <button className={`${styles.btnFooter} ${styles.btnFooterDanger}`} onClick={handleLogout}>
          Вийти
        </button>
      </div>
    </div>
  );
}

export default function Profile() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className={styles.page}>
      <Sidebar />
      <main className={styles.main}>
        <WeatherPanel />
        <div className={styles.rightSide}>
          <ProfileHeader />
          <div className={styles.cardsGrid}>
            <FavoriteCities />
            <NotificationsCard />
            <SettingsCard handleLogout={handleLogout} />
          </div>
        </div>
      </main>
    </div>
  );
}
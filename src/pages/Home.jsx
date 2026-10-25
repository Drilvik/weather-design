import { Link } from 'react-router-dom';
import styles from './Home.module.css';

const forecastList = [
  { day: 'Вівторок', min: 2, max: 5, icon: 'rain' },
  { day: 'Середа', min: 1, max: 4, icon: 'cloud' },
  { day: 'Четвер', min: 1, max: 3, icon: 'rain' },
  { day: "П'ятниця", min: 0, max: 3, icon: 'cloud' },
];

function WeatherIcon({ type }) {
  if (type === 'rain') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="#3db8ff" strokeWidth="1.8" strokeLinecap="round">
        <path d="M16 13a4 4 0 0 1-8 0" />
        <path d="M8 19l.5 2M12 21l.5 2M16 19l.5 2M18 10h-1.3A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
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

function WeatherPanel() {
  return (
    <div className={`${styles.panel} ${styles.leftPanel}`}>
      <div className={styles.searchBox}>
        <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="currentColor">
          <path d="M10.5 2a8.5 8.5 0 0 1 6.8 13.6l5.1 5.1-1.7 1.7-5.1-5.1A8.5 8.5 0 1 1 10.5 2zm0 2.4a6.1 6.1 0 1 0 0 12.2 6.1 6.1 0 0 0 0-12.2z" />
        </svg>
        <input className={styles.searchInput} type="text" placeholder="Оберіть місто..." />
      </div>

      <div className={styles.mainIcon}>
        <WeatherIcon type="cloud" />
      </div>
      <div className={styles.bigTemp}>4°C</div>
      <h2 className={styles.cityName}>Ужгород, UA</h2>
      <p className={styles.condition}>Переважно хмарно</p>

      <div className={styles.forecastBlock}>
        <h4 className={styles.forecastTitle}>Прогноз на 7 днів</h4>

        {forecastList.map((item) => (
          <div key={item.day} className={styles.forecastItem}>
            <span className={styles.dayName}>{item.day}</span>
            <div className={styles.iconBox}>
              <WeatherIcon type={item.icon} />
            </div>
            <span className={styles.tempRange}>
              {item.min}°C / {item.max}°C
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatsGrid() {
  return (
    <div className={styles.statsGrid}>
      <div className={styles.panel}>
        <div className={styles.statLabel}>Швидкість вітру</div>
        <div className={styles.windValue}>6.5 км/год</div>
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
            <path className={styles.uvArc} d="M10 50 A 40 40 0 0 1 90 50" />
          </svg>
          <div className={styles.uvNum}>0.8</div>
        </div>
      </div>

      <div className={styles.panel}>
        <div className={styles.statLabel}>Схід та Захід Сонця</div>
        <div className={styles.sunPath}>
          <img className={styles.sunIcon} src="https://img.icons8.com/fluency/48/sun--v1.png" alt="схід сонця" />
          <div className={styles.sunNode}></div>
          <img className={styles.moonIcon} src="https://img.icons8.com/fluency/48/full-moon.png" alt="захід сонця" />
        </div>
        <p className={styles.sunCount}>До заходу: 4г 17хв</p>
      </div>
    </div>
  );
}

function WeatherMap() {
  return <div className={styles.mapContainer}>Карта (Поки що не реалізована)</div>;
}

export default function Home() {
  return (
    <div className={styles.page}>
      <Sidebar />

      <main className={styles.main}>
        <WeatherPanel />

        <div className={styles.rightPanel}>
          <StatsGrid />
          <WeatherMap />
        </div>
      </main>
    </div>
  );
}

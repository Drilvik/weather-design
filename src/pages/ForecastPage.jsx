import { Link } from 'react-router-dom';
import styles from './ForecastPage.module.css';

const forecastList = [
  { day: 'Вівторок', min: 2, max: 5, icon: 'rain' },
  { day: 'Середа', min: 1, max: 4, icon: 'cloud' },
  { day: 'Четвер', min: 1, max: 3, icon: 'cloud' },
  { day: 'П\'ятниця', min: 0, max: 3, icon: 'cloud' },
  { day: 'Субота', min: -1, max: 2, icon: 'cloud' },
  { day: 'Неділя', min: -2, max: 2, icon: 'sun' },
  { day: 'Понеділок', min: 0, max: 4, icon: 'cloud' },
];

const weekDays = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'НД'];

const monthDays = [
  { num: 12, month: null, today: true, icon: 'cloud', max: 4, min: 2 },
  { num: 13, month: null, today: false, icon: 'rain', max: 5, min: 2 },
  { num: 14, month: null, today: false, icon: 'cloud', max: 4, min: 1 },
  { num: 15, month: null, today: false, icon: 'rain', max: 3, min: 1 },
  { num: 16, month: null, today: false, icon: 'cloud', max: 3, min: 0 },
  { num: 17, month: null, today: false, icon: 'cloud', max: 2, min: -1 },
  { num: 18, month: null, today: false, icon: 'sun', max: 2, min: -2 },

  { num: 19, month: null, today: false, icon: 'cloud', max: 4, min: 0 },
  { num: 20, month: null, today: false, icon: 'sun', max: 3, min: -1 },
  { num: 21, month: null, today: false, icon: 'sun', max: 3, min: -2 },
  { num: 22, month: null, today: false, icon: 'cloud', max: 2, min: 0 },
  { num: 23, month: null, today: false, icon: 'rain', max: 4, min: 1 },
  { num: 24, month: null, today: false, icon: 'rain', max: 5, min: 2 },
  { num: 25, month: null, today: false, icon: 'cloud', max: 4, min: 1 },

  { num: 26, month: null, today: false, icon: 'cloud', max: 3, min: 0 },
  { num: 27, month: null, today: false, icon: 'sun', max: 2, min: -2 },
  { num: 28, month: null, today: false, icon: 'sun', max: 1, min: -3 },
  { num: 29, month: null, today: false, icon: 'cloud', max: 1, min: -2 },
  { num: 30, month: null, today: false, icon: 'rain', max: 3, min: 0 },
  { num: 31, month: null, today: false, icon: 'cloud', max: 2, min: -1 },
  { num: 1, month: 'лют', today: false, icon: 'sun', max: 3, min: -2 },

  { num: 2, month: null, today: false, icon: 'cloud', max: 4, min: 0 },
  { num: 3, month: null, today: false, icon: 'cloud', max: 5, min: 1 },
  { num: 4, month: null, today: false, icon: 'rain', max: 6, min: 2 },
  { num: 5, month: null, today: false, icon: 'rain', max: 6, min: 3 },
  { num: 6, month: null, today: false, icon: 'cloud', max: 5, min: 1 },
  { num: 7, month: null, today: false, icon: 'cloud', max: 4, min: 0 },
  { num: 8, month: null, today: false, icon: 'sun', max: 4, min: -1 },

  { num: 9, month: null, today: false, icon: 'sun', max: 5, min: -1 },
  { num: 10, month: null, today: false, icon: 'cloud', max: 4, min: 0 },
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

      <Link to="/map" className={styles.navLink}>
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 1.5a5.5 5.5 0 0 0-5.5 5.5c0 3.7 5.5 9 5.5 9s5.5-5.3 5.5-9A5.5 5.5 0 0 0 12 1.5zm0 3.3a2.2 2.2 0 1 1 0 4.4 2.2 2.2 0 0 1 0-4.4z" />
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

        <div
          style={{
            maxHeight: '165px',
            overflowY: 'auto',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
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
    </div>
  );
}

function MonthlyForecast() {
  return (
    <div className={`${styles.panel} ${styles.rightSide}`}>
      <div className={styles.forecastHeader}>
        <div>
          <h1 className={styles.forecastTitleBig}>Прогноз на 30 днів</h1>
          <p className={styles.forecastSubtitle}>12 січня — 10 лютого · Ужгород, UA</p>
        </div>

        <div className={styles.chips}>
          <div className={styles.chip}>
            <small>Середня</small>
            <b>4°C</b>
          </div>
          <div className={styles.chip}>
            <small>Макс.</small>
            <b>6°C</b>
          </div>
          <div className={styles.chip}>
            <small>Мін.</small>
            <b>-3°C</b>
          </div>
          <div className={styles.chip}>
            <WeatherIcon type="rain" />
            <b>7</b>
            <small>дощових</small>
          </div>
          <div className={styles.chip}>
            <WeatherIcon type="sun" />
            <b>8</b>
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
          <div key={index} className={`${styles.day} ${d.today ? styles.dayToday : ''}`}>
            <div className={styles.dayTop}>
              <span>
                <span className={styles.dayNum}>{d.num}</span>
                {d.month && <span className={styles.dayMonth}>{d.month}</span>}
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
  return (
    <div className={styles.page}>
      <Sidebar />

      <main className={styles.main}>
        <WeatherPanel />
        <MonthlyForecast />
      </main>
    </div>
  );
}
import { Link } from 'react-router-dom';
import styles from './Profile.module.css';

const forecastList = [
  { day: 'Вівторок', min: 2, max: 5, icon: 'rain' },
  { day: 'Середа', min: 1, max: 4, icon: 'cloud' },
  { day: 'Четвер', min: 1, max: 3, icon: 'cloud' },
  { day: 'П\'ятниця', min: 0, max: 3, icon: 'cloud' },
  { day: 'Субота', min: -1, max: 2, icon: 'cloud' },
  { day: 'Неділя', min: -2, max: 2, icon: 'sun' },
  { day: 'Понеділок', min: 0, max: 4, icon: 'cloud' },
];

const favoriteCities = [
  { name: 'Ужгород', condition: 'Переважно хмарно', temp: '4°C', icon: 'cloud' },
  { name: 'Терново', condition: 'Туманно', temp: '2°C', icon: 'cloud' },
  { name: 'Київ', condition: 'Мокрий сніг', temp: '1°C', icon: 'rain' },
  { name: 'Плзень, Чехія', condition: 'Ясно', temp: '3°C', icon: 'sun' },
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

        {/* Блок з усім списком днів, де вміщається 3 дні й приховано сірий повзунок */}
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

function ProfileHeader() {
  return (
    <div className={`${styles.panel} ${styles.profileHeader}`}>
      <div className={styles.avatarWrap}>
        <div className={styles.avatar}>МК</div>
        <div className={styles.avatarEdit}>
          <svg viewBox="0 0 24 24" fill="#000">
            <path d="M4 16.5V20h3.5L18 9.5 14.5 6zM19.7 7.8a1 1 0 0 0 0-1.4l-2.1-2.1a1 1 0 0 0-1.4 0L14.9 5.6l3.5 3.5z" />
          </svg>
        </div>
      </div>

      <div className={styles.profileInfo}>
        <h2 className={styles.profileName}>Марія Ковальчук</h2>
        <p className={styles.profileEmail}>maria.kovalchuk@gmail.com</p>
        <p className={styles.profileMeta}>Ужгород, Україна · З нами з березня 2025</p>
        <div className={styles.badge}>
          <svg viewBox="0 0 24 24">
            <path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.2 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8z" />
          </svg>
          Weathry Premium
        </div>
      </div>

      <div className={styles.profileSide}>
        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <b>5</b>
            <span>Збережених міст</span>
          </div>
          <div className={styles.statCard}>
            <b>12</b>
            <span>Сповіщень за тиждень</span>
          </div>
        </div>

        <div className={styles.headerButtons}>
          <button className={styles.btnPrimary}>Редагувати профіль</button>
          <button className={styles.btnDark}>Змінити аватар</button>
        </div>
      </div>
    </div>
  );
}

function FavoriteCities() {
  return (
    <div className={styles.panel}>
      <h4 className={styles.cardTitle}>Улюблені міста</h4>

      {favoriteCities.map((city) => (
        <div key={city.name} className={styles.favItem}>
          <WeatherIcon type={city.icon} />
          <div className={styles.favName}>
            <b>{city.name}</b>
            <span>{city.condition}</span>
          </div>
          <span className={styles.favTemp}>{city.temp}</span>
        </div>
      ))}
    </div>
  );
}

function NotificationsCard() {
  return (
    <div className={styles.panel}>
      <h4 className={styles.cardTitle}>Сповіщення</h4>

      <div className={styles.toggleRow}>
        <div className={styles.toggleText}>
          <b>Дощ і мокрий сніг</b>
          <span>За годину до початку</span>
        </div>
        <div className={`${styles.switch} ${styles.switchOn}`}></div>
      </div>

      <div className={styles.toggleRow}>
        <div className={styles.toggleText}>
          <b>Сильний вітер</b>
          <span>Від 15 км/год</span>
        </div>
        <div className={`${styles.switch} ${styles.switchOn}`}></div>
      </div>

      <div className={styles.toggleRow}>
        <div className={styles.toggleText}>
          <b>Ранковий прогноз</b>
          <span>Щодня о 07:30</span>
        </div>
        <div className={`${styles.switch} ${styles.switchOn}`}></div>
      </div>

      <div className={styles.toggleRow}>
        <div className={styles.toggleText}>
          <b>Високий УФ індекс</b>
          <span>Від 6 і вище</span>
        </div>
        <div className={styles.switch}></div>
      </div>
    </div>
  );
}

function SettingsCard() {
  return (
    <div className={`${styles.panel} ${styles.settingsCard}`}>
      <h4 className={styles.cardTitle}>Налаштування</h4>

      <div className={styles.settingGroup}>
        <span className={styles.settingLabel}>Температура</span>
        <div className={styles.segmented}>
          <button className={`${styles.segmentBtn} ${styles.segmentOn}`}>°C</button>
          <button className={styles.segmentBtn}>°F</button>
        </div>
      </div>

      <div className={styles.settingGroup}>
        <span className={styles.settingLabel}>Швидкість вітру</span>
        <div className={styles.segmented}>
          <button className={`${styles.segmentBtn} ${styles.segmentOn}`}>км/год</button>
          <button className={styles.segmentBtn}>м/с</button>
        </div>
      </div>

      <div className={styles.settingGroup}>
        <span className={styles.settingLabel}>Мова</span>
        <div className={styles.select}>Українська</div>
      </div>

      <div className={styles.settingsFooter}>
        <button className={styles.btnFooter}>Змінити пароль</button>
        <button className={`${styles.btnFooter} ${styles.btnFooterDanger}`}>Вийти</button>
      </div>
    </div>
  );
}

export default function Profile() {
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
            <SettingsCard />
          </div>
        </div>
      </main>
    </div>
  );
}
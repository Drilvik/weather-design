import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Auth.module.css';


const CloudLogoIcon = () => (
  <svg className={styles.logoIcon} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.6" width="24" height="24">
    <path d="M18 10h-1.3A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
  </svg>
);

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="20" height="20">
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="20" height="20">
    <path d="M3 3l18 18" />
    <path d="M10.6 5.2A10.9 10.9 0 0 1 12 5c7 0 11 7 11 7a18.5 18.5 0 0 1-3.2 3.9M6.6 6.6C3.9 8.3 2 12 2 12s4 7 11 7a10.6 10.6 0 0 0 4.4-.9" />
    <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
  </svg>
);

export default function AuthPage() {
  // Залишаємо лише візуальну логіку (показати/сховати пароль)
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true); // Перемикач Вхід/Реєстрація для вигляду

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <CloudLogoIcon />
          <span className={styles.logoName}>Weathry</span>
        </div>

        <h2 className={styles.title}>{isLogin ? 'З поверненням' : 'Створити акаунт'}</h2>
        <p className={styles.subtitle}>
          {isLogin
            ? 'Увійди, щоб бачити свій прогноз'
            : 'Кілька секунд — і твій прогноз завжди під рукою'}
        </p>

        <form>
          {!isLogin && (
            <div className={styles.field}>
              <label className={styles.label} htmlFor="auth-name">Ім'я</label>
              <div className={styles.inputBox}>
                <input
                  id="auth-name"
                  className={styles.input}
                  type="text"
                  placeholder="Марія Ковальчук"
                />
              </div>
            </div>
          )}

          <div className={styles.field}>
            <label className={styles.label} htmlFor="auth-email">Email</label>
            <div className={styles.inputBox}>
              <input
                id="auth-email"
                className={styles.input}
                type="email"
                placeholder="maria@gmail.com"
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="auth-password">Пароль</label>
            <div className={styles.inputBox}>
              <input
                id="auth-password"
                className={styles.input}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
              />
              <button
                type="button"
                className={styles.eyeButton}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          {isLogin && (
            <div className={styles.row}>
              <Link to="#" className={styles.forgotLink}>Забули пароль?</Link>
            </div>
          )}

          {/* Замість submit робимо просте посилання на головну сторінку, як вимагає лаба */}
          <Link to="/home" className={styles.btnPrimary} style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
            {isLogin ? 'Увійти' : 'Зареєструватися'}
          </Link>
        </form>

        <div className={styles.divider}>або</div>

        <button type="button" className={styles.btnSocial}>
          <span className={styles.googleIcon}>G</span>
          Продовжити з Google
        </button>

        <p className={styles.switchRow}>
          {isLogin ? (
            <>
              Немає акаунта?{' '}
              <button type="button" className={styles.switchLink} onClick={() => setIsLogin(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}>
                Зареєструватися
              </button>
            </>
          ) : (
            <>
              Вже є акаунт?{' '}
              <button type="button" className={styles.switchLink} onClick={() => setIsLogin(true)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}>
                Увійти
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
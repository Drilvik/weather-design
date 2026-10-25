import { Link } from 'react-router-dom';
import styles from './NotFound.module.css';

export default function NotFound() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>404</h1>
      <Link to="/home" className={styles.link}>Повернутися на Головну</Link>
    </div>
  );
}
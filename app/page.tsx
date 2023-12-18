import LoginForm from './LoginForm';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <h1> Testing</h1>
      <br />
      <br />
      <LoginForm />
    </main>
  );
}

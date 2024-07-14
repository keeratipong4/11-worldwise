import styles from "./Button.module.css";
function Button({ type, onClick, children }) {
  return (
    <div onClick={onClick} className={`${styles.btn} ${styles[type]}`}>
      {children}
    </div>
  );
}

export default Button;

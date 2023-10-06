import s from "./Notification.module.scss";

const Notification = ({ title, content, onClose }) => {
  return (
    <div className={s.notifAll}>
      <div className={s.notification}>
        <div className={s.close}></div>
        <strong>{title}</strong>
        <p>{content}</p>
      </div>
    </div>
  );
};

export default Notification;

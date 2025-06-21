import { useEffect } from "react";
import "./Notification.scss";

const Notification = ({ message, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return message ? <div className="notification">{message}</div> : null;
};

export default Notification;

import { useEffect, useState } from 'react';
import './index.css';

const Toast = ({ message, type = 'info', duration = 3000, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div className={`toast toast-${type} ${isVisible ? 'visible' : 'hidden'}`}>
            <div className="toast-content">
                {type === 'error' && <span className="toast-icon">⚠️</span>}
                {type === 'success' && <span className="toast-icon">✅</span>}
                {type === 'info' && <span className="toast-icon">ℹ️</span>}
                <p>{message}</p>
            </div>
        </div>
    );
};

export default Toast;
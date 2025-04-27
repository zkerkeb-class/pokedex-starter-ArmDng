import { createContext, useEffect, useState } from 'react';
import { isAuthenticated, getUsernameFromToken } from '../services/auth';
import Toast from '../components/Toast';

const AuthContext = createContext();
export default AuthContext;

export const AuthProvider = ({ children }) => {
    const [isAuth, setIsAuth] = useState(isAuthenticated());
    const [username, setUsername] = useState(getUsernameFromToken());
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('error');

    const showToastMessage = (message, type = 'error') => {
        setToastMessage(message);
        setToastType(type);
        setShowToast(true);
    };

    useEffect(() => {
        const handleTokenExpired = () => {
            setIsAuth(false);
            setToastMessage('Votre session a expiré. Veuillez vous reconnecter.');
            setShowToast(true);

            setTimeout(() => {
                window.location.href = '/login';
            }, 3000);
        };

        window.addEventListener('tokenExpired', handleTokenExpired);

        return () => {
            window.removeEventListener('tokenExpired', handleTokenExpired);
        };
    }, []);

    useEffect(() => {
        if (isAuth) {
            setUsername(getUsernameFromToken());
        } else {
            setUsername(null);
        }
    }, [isAuth]);

    return (
        <AuthContext.Provider
            value={{
                isAuth,
                setIsAuth,
                username,
                showToastMessage,
            }}
        >
            {children}
            {showToast && (
                <Toast
                    message={toastMessage}
                    type={toastType}
                    onClose={() => setShowToast(false)}
                />
            )}
        </AuthContext.Provider>
    );
};
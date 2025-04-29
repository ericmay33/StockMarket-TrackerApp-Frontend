import { useState, useEffect } from 'react'
import styles from './Login.module.css'
import { login } from '../utils/api.ts'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate('/browse')
        }
        document.title = "Login"
    }, []);
    
    async function submitForm(e: any) {
        e.preventDefault()
        setErrorMessage('')
        if (!username) {
            setErrorMessage('Username cannot be empty!')
            return
        }
        if (!password) {
            setErrorMessage('Password cannot be empty!')
            return
        }
        try {
            const token = await login(username, password);
            localStorage.setItem('token', token)
            window.dispatchEvent(new Event("storage"));
            navigate('/browse')
        }
        catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    setErrorMessage('Incorrect username and/or password')
                    return
                }
            }
            setErrorMessage('Unable to login -- please try again later')
        }
    }

    return (
        <div className={styles['main-container']}>
            <div className={styles['center']}>
                <h1>Login</h1>
                <form onSubmit={submitForm}>
                    <div className={styles['field-container']}>
                        <label className={styles['field-label']}>Username</label>
                        <input className={styles['field-input']} value={username} type="text" onChange={(e) => { setUsername(e.target.value)}}/>
                    </div>
                    <div className={styles['field-container']}>
                        <label className={styles['field-label']}>Password</label>
                        <input className={styles['field-input']} value={password} type="password" onChange={(e) => { setPassword(e.target.value)}}/>
                    </div>
                    <div className={styles['bottom-container']}>
                        <button className={styles.button} type='submit'>Login</button>
                        <p>Don't have an account?
                            <Link className={styles['link']} to={'/register'}>
                                <span>Sign Up</span>
                            </Link>
                        </p>
                        <p className={styles.error}>{errorMessage}</p>
                    </div>
                </form>
            </div>
        </div>
    )
}
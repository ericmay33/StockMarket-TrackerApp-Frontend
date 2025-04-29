import { useState, useEffect } from 'react'
import styles from './Register.module.css'
import { register } from '../utils/api.ts'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import logo from '../../public/stockapp-logo.jpg'

export default function Login() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate('/browse')
        }
        document.title = "Sign Up"
    }, []);
    
    async function submitForm(e: any) {
        e.preventDefault()
        setErrorMessage('')
        if (!firstName) {
            setErrorMessage('First Name cannot be empty!')
            return
        }
        if (!lastName) {
            setErrorMessage('Last Name cannot be empty!')
            return
        }
        if (!username) {
            setErrorMessage('Username cannot be empty!')
            return
        }
        if (!password) {
            setErrorMessage('Password cannot be empty!')
            return
        }
        try {
            const token = await register(firstName, lastName, username, password);
            localStorage.setItem('token', token)
            window.dispatchEvent(new Event("storage"));
            navigate('/browse');
        }
        catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 403) {
                    setErrorMessage('User with that username already exists.')
                    return
                }
            }
            setErrorMessage('Unable to login -- please try again later')
        }
    }

    return (
        <div className={styles['main-container']}>
            <div className={styles['center']}>
                <div className={styles.header}>
                    <img src={logo} alt="" className={styles.image}/>
                    <h1>Register</h1>
                </div>
                <form onSubmit={submitForm}>
                    <div className={styles['field-container']}>
                        <p className={styles['field-label']}>First Name:</p>
                        <input className={styles['field-input']} value={firstName} type="text" onChange={(e) => { setFirstName(e.target.value)}}/>
                    </div>
                    <div className={styles['field-container']}>
                        <p className={styles['field-label']}>Last Name:</p>
                        <input className={styles['field-input']} value={lastName} type="text" onChange={(e) => { setLastName(e.target.value)}}/>
                    </div>
                    <div className={styles['field-container']}>
                        <p className={styles['field-label']}>Username:</p>
                        <input className={styles['field-input']} value={username} type="text" onChange={(e) => { setUsername(e.target.value)}}/>
                    </div>
                    <div className={styles['field-container']}>
                        <p className={styles['field-label']}>Password:</p>
                        <input className={styles['field-input']} value={password} type="password" onChange={(e) => { setPassword(e.target.value)}}/>
                    </div>
                    <div className={styles['bottom-container']}>
                        <button className={styles.button} type='submit'>Submit</button>
                        <p className={styles.grey}>Already have an account?
                            <Link className={styles['link']} to={'/login'}>
                                <span>Login</span>
                            </Link>
                        </p>
                        <p className={styles.error}>{errorMessage}</p>
                    </div>
                </form>
            </div>
        </div>
    )
}
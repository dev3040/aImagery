'use client';
import { useEffect, useState } from 'react';
import './page.css'
import _ from "lodash"
import { useFormik } from 'formik';
import { login, setToken, signup, validateUser } from '../services/caption.service';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation'

export default function Dashboard() {
    const [isRegister, setRegister] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isDisabled, setDisabled] = useState(false);
    const router = useRouter();
    const validate = values => {
        const errors = {};
        if (!values.email) {
            errors.email = 'Required';
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
            errors.email = 'Invalid email address';
        }
        if (!values.password) {
            errors.password = 'Required';
        }
        if (!values.full_name && isRegister) {
            errors.full_name = 'Required';
        }
        return errors;
    };
    useEffect(() => {
        validateUser().then(user => {
            if (!_.isEmpty(user)) {
                console.log(user);
                router.push("/")
                logout();
            }
        }).catch(err => {
        })
    }, [])
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            full_name: ''
        },
        validate,
        onSubmit: async values => {
            setLoading(true);
            if (isRegister) {
                signup(values)
                    .then(response => {
                        toast.success(response.data.message)
                        setRegister(false);
                        setLoading(false);
                    })
                    .catch((err) => {
                        setLoading(false);
                        toast.error(err.response?.data?.detail || "Something wents wrong!")
                    })
            } else {
                var details = {
                    'email': values.email,
                    'password': values.password,
                };

                let formBody = [];
                for (var property in details) {
                    var encodedKey = encodeURIComponent(property);
                    var encodedValue = encodeURIComponent(details[property]);
                    formBody.push(encodedKey + "=" + encodedValue);
                }
                formBody = formBody.join("&");
                login(formBody)
                    .then(response => {
                        setLoading(false);
                        setToken(response.data)
                        router.push("/")
                    })
                    .catch((err) => {
                        console.log('err: ', err);
                        toast.error(err.response?.data?.message || "Something wents wrong!")
                        setLoading(false);
                    })
            }

        },
    });
    return (
        <main >
            <ToastContainer />
            <form onSubmit={formik.handleSubmit}>
                <div className="limiter">
                    <div className="container-login100">
                        <div className="wrap-login100">
                            <div className="login100-pic js-tilt" data-tilt>
                                <img src="https://colorlib.com/etc/lf/Login_v1/images/img-01.png" alt="IMG" />
                            </div>
                            <div className="login100-form validate-form">
                                <span className="login100-form-title">
                                    {isRegister ? 'Register' : 'Login'}
                                </span>
                                {isRegister && <div>
                                    <div className="wrap-input100 validate-input" data-validate="Valid email is required: ex@abc.xyz">
                                        <input className="input100" type="text" onChange={formik.handleChange} value={formik.values.full_name} name="full_name" placeholder="Full Name" />
                                        <span className="focus-input100"></span>
                                    </div>
                                    <div className='error'>
                                        {formik.touched.full_name && formik.errors.full_name ? (
                                            <span>{formik.errors.full_name}</span>
                                        ) : null}
                                    </div>
                                </div>}
                                <div>
                                    <div className="wrap-input100 validate-input" data-validate="Valid email is required: ex@abc.xyz">
                                        <input className="input100" type="text" name="email" onChange={formik.handleChange} value={formik.values.email} placeholder="Email" />
                                        <span className="focus-input100"></span>
                                    </div>
                                    <div className='error'>
                                        {formik.touched.email && formik.errors.email ? (
                                            <span>{formik.errors.email}</span>
                                        ) : null}
                                    </div>
                                </div>
                                <div>
                                    <div className="wrap-input100 validate-input" data-validate="Password is required">
                                        <input className="input100" type="password" name="password" onChange={formik.handleChange} value={formik.values.password} placeholder="Password" />
                                        <span className="focus-input100"></span>
                                    </div>
                                    <div className='error'>
                                        {formik.touched.password && formik.errors.password ? (
                                            <span>{formik.errors.password}</span>
                                        ) : null}
                                    </div>
                                </div>

                                <div className="container-login100-form-btn">
                                    <button type='submit' disabled={loading} className="login100-form-btn">
                                        {loading ? 'Loading...' : isRegister ? 'Register' : 'Login'}
                                    </button>
                                </div>

                                {/* <div className="text-center p-t-12">
                                <span className="txt1">
                                    Forgot &nbsp;
                                </span>
                                <a className="txt2" href="#">
                                    Username / Password?
                                </a>
                            </div> */}
                                <div className="text-center p-t-136 create-acc">
                                    {/* <a className="txt2" onClick={() => setRegister(false)}>
                                        Login from here
                                        <i className="fa fa-long-arrow-right m-l-5" aria-hidden="true"></i>
                                    </a> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </main>
    )
}

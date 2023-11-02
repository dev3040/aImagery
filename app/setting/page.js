'use client';
import { useEffect, useState } from 'react';
import '../styles.css'
import _ from "lodash"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation'
import { checkServer } from '../services/caption.service';
import nextConfig from "@/next.config";

export default function Dashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [start, setStart] = useState(false);
    useEffect(() => {
        const toastId = toast.info("Waiting for server response", { autoClose: false, isLoading: true, closeButton: false, closeOnClick: false });
        const token = localStorage.getItem('user_details');
        if (!token) {
            router.push('/');
        }
        checkServer().then(() => {
            toast.update(toastId, {
                render: "Server is up and running 😄!",
                type: toast.TYPE.SUCCESS,
                isLoading: false,
                autoClose: true
            })
            setStart(true)
            setLoading(false)
        }).catch(error => {
            console.log('toastId: ', toastId);
            toast.update(toastId, {
                render: "Please start the server!",
                type: toast.TYPE.ERROR,
                isLoading: false,
                autoClose: true
            })
            setStart(false)
            setLoading(false)

        })
    }, []);

    const handleStartClick = async () => {
        setLoading(true)
        try {
            const token = JSON.parse(localStorage.getItem('user_details'));
            if (!token) {
                console.error('Bearer token not found in local storage');
                return;
            }

            const response = await fetch(`${nextConfig.BACKEND_URL}/google/startInstance`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token.access.token}`, // Add the token to the Authorization header
                },
            });

            if (response.ok) {
                console.log('response: ', response);
                // const successResponse = await response.json();
                const toastId = toast.info("Server will start in 10 min", { autoClose: false, isLoading: true, closeButton: false, closeOnClick: false });
                // console.log('response', successResponse);
                setTimeout(() => {
                    toast.update(toastId, {
                        render: "Server is up and running 😄!",
                        type: toast.TYPE.SUCCESS,
                        isLoading: false,
                        autoClose: true
                    })
                    setLoading(false)
                    setStart(true)
                }, 600000);
                // Do something with successResponse
            } else {
                setLoading(false)
                toast.update(toastId, {
                    render: "Server error!",
                    type: toast.TYPE.ERROR,
                    isLoading: false,
                    autoClose: true
                })
            }
        } catch (error) {
            setLoading(false)
            console.log('error: ', error);
            toast.update(toastId, {
                render: "Server error!",
                type: toast.TYPE.ERROR,
                isLoading: false,
                autoClose: true
            })

        }
    };


    const handleStopClick = async () => {
        setLoading(true)
        try {
            const token = JSON.parse(localStorage.getItem('user_details'));
            if (!token) {
                console.error('Bearer token not found in local storage');
                return;
            }
            const response = await fetch(`${nextConfig.BACKEND_URL}/google/stopInstance`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token.access.token}`, // Add the token to the Authorization header
                },
            });

            if (response.ok) {
                setLoading(false)
                setStart(false)
                // const successResponse = await response.json();
                // console.log("response", successResponse);
                toast.success("Server Stoped")
            } else {
                setLoading(false)
                toast.error("Server error")
            }
        } catch (error) {
            setLoading(false)
            toast.error("An error occurred:")
        }
    };

    return (
        <main>
            <ToastContainer />
            <div className="text-center">
                <button type="button" className="btn btn-primary m-3" style={{ padding: "10px 50px" }} disabled={loading || start} onClick={handleStartClick}>Start</button>
                <button type="button" className="btn btn-primary m-3" style={{ padding: "10px 50px" }} disabled={loading || !start} onClick={handleStopClick}>Stop</button> <br></br>
                <button type="button" className="btn btn-primary m-3" style={{ padding: "10px 50px" }} disabled={loading} onClick={() => { router.push("/") }}>Let&apos;s Start the Demo</button>
            </div>
        </main>
    );
}

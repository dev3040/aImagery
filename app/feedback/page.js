"use client"
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import { contactUs } from '../services/caption.service';

export default function Dashboard() {
    const initialValues = {
        name: '',
        email: '',
        subject: '',
        message: ''
    };

    const router = useRouter();

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            console.log('values: ', values);
            contactUs(values).then(res => {
                toast.success('Feedback sent successfully!');
                resetForm();
            }).catch(err => {
                toast.error('Failed to send message. Please try again later.');
            })
        } catch (error) {
            // Handle errors or display a toast message
            console.error('Error submitting form:', error);
            toast.error('Failed to send message. Please try again later.');
        } finally {
            setSubmitting(false);
        }
    };

    const validateForm = (values) => {
        const errors = {};

        if (!values.name) {
            errors.name = 'Required';
        }

        if (!values.email) {
            errors.email = 'Required';
        } else if (!isValidEmail(values.email)) {
            errors.email = 'Invalid email address';
        }

        if (!values.subject) {
            errors.subject = 'Required';
        }

        if (!values.message) {
            errors.message = 'Required';
        }

        return errors;
    };

    const isValidEmail = (email) => {
        return /\S+@\S+\.\S+/.test(email);
    };

    return (
        <main>
            <ToastContainer />
            <div className="container">
                <div className="row align-items-stretch justify-content-center no-gutters">
                    <div className="col-md-7">
                        <div className="form h-100 contact-wrap p-5">
                            <h3 className="text-center">Let&apos;s Talk</h3>
                            <Formik
                                initialValues={initialValues}
                                onSubmit={handleSubmit}
                                validate={validateForm}
                            >
                                {({ isSubmitting }) => (
                                    <Form className="mb-5">
                                        <div className="row">
                                            <div className="col-md-6 form-group mb-3">
                                                <label htmlFor="name" className="col-form-label">Name *</label>
                                                <Field type="text" className="form-control" id="name" name="name" placeholder="Your name" />
                                                <ErrorMessage name="name" component="div" className="invalid-feedback" />
                                            </div>
                                            <div className="col-md-6 form-group mb-3">
                                                <label htmlFor="email" className="col-form-label">Email *</label>
                                                <Field type="email" className="form-control" id="email" name="email" placeholder="Your email" />
                                                <ErrorMessage name="email" component="div" className="invalid-feedback" />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-12 form-group mb-3">
                                                <label htmlFor="subject" className="col-form-label">Subject</label>
                                                <Field type="text" className="form-control" id="subject" name="subject" placeholder="Your subject" />
                                                <ErrorMessage name="subject" component="div" className="invalid-feedback" />
                                            </div>
                                        </div>
                                        <div className="row mb-5">
                                            <div className="col-md-12 form-group mb-3">
                                                <label htmlFor="message" className="col-form-label">Message *</label>
                                                <Field as="textarea" className="form-control" id="message" name="message" rows="4" placeholder="Write your message" />
                                                <ErrorMessage name="message" component="div" className="invalid-feedback" />
                                            </div>
                                        </div>
                                        <div className="row justify-content-center">
                                            <div className="col-md-5 form-group text-center">
                                                <button type="submit" disabled={isSubmitting} className="btn btn-block btn-primary rounded-0 py-2 px-4">
                                                    {isSubmitting ? 'Submitting...' : 'Send Message'}
                                                </button>
                                                <span className="submitting"></span>
                                            </div>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                            <div id="form-message-warning mt-4"></div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

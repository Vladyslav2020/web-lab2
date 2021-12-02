import React, { useEffect, useRef, useState } from 'react';
import { useHttp } from './useHttp';
import { Config } from './Config';

let needToAddEventListeners = true;
let needToCheckValidation = false;

const SendEmailForm = ({
    showLoader,
    hideLoader,
    showMessage,
    hideMessage,
}) => {
    const [isValid, setIsValid] = useState(true);
    const { loading, request, cleanErrors } = useHttp();
    const form = useRef(null);
    const [state, setState] = useState({
        firstName: '',
        lastName: '',
        subject: '',
        message: '',
    });
    useEffect(() => {
        if (loading) showLoader();
        else hideLoader();
    }, [loading]);

    const changeState = (key, newValue) => {
        setState(prevState => ({ ...prevState, [key]: newValue }));
    };
    useEffect(() => {
        if (needToAddEventListeners) {
            needToAddEventListeners = false;
        }
    }, []);

    useEffect(() => {
        if (!needToCheckValidation) {
            return;
        }
        setIsValid(form.current.checkValidity());
    });

    const sendEmail = async event => {
        event.preventDefault();
        needToCheckValidation = true;
        if (!form.current.checkValidity()) {
            form.current.classList.add('was-validated');
            return;
        }
        try {
            const response = await request(Config.url, 'POST', { ...state });
            showMessage({ message: response.message, type: 'success' });
            setTimeout(hideMessage, 3000);
        } catch (err) {
            showMessage({ message: err.message, type: 'danger' });
            setTimeout(hideMessage, 3000);
            cleanErrors();
        } finally {
            needToCheckValidation = false;
        }
    };
    return (
        <div className="container mt-2">
            <form className="row g-3 needs-validation" noValidate ref={form}>
                <div className="md">
                    <label htmlFor="firstName" className="form-label">
                        First name
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="firstName"
                        value={state.firstName}
                        onChange={event =>
                            changeState('firstName', event.target.value)
                        }
                        required
                    />
                    <div className="valid-feedback">Validated!</div>
                    <div className="invalid-feedback">Invalid!</div>
                </div>
                <div className="md">
                    <label htmlFor="lastName" className="form-label">
                        Last name
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="lastName"
                        value={state.lastName}
                        onChange={event =>
                            changeState('lastName', event.target.value)
                        }
                        required
                    />
                    <div className="valid-feedback">Validated!</div>
                    <div className="invalid-feedback">Invalid!</div>
                </div>
                <div className="md">
                    <label htmlFor="subject" className="form-label">
                        Subject
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="subject"
                        value={state.subject}
                        onChange={event =>
                            changeState('subject', event.target.value)
                        }
                        required
                    />
                    <div className="valid-feedback">Validated!</div>
                    <div className="invalid-feedback">Invalid!</div>
                </div>
                <div className="md">
                    <label htmlFor="message" className="form-label">
                        Email message
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="message"
                        value={state.message}
                        onChange={event =>
                            changeState('message', event.target.value)
                        }
                        required
                    />
                    <div className="valid-feedback">Validated!</div>
                    <div className="invalid-feedback">Invalid!</div>
                </div>
                <div className="col-12">
                    <button
                        className="btn btn-primary"
                        type="button"
                        onClick={sendEmail}
                        disabled={
                            loading || (!isValid && needToCheckValidation)
                        }
                    >
                        Submit form
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SendEmailForm;

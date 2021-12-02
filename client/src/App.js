import React, { useState } from 'react';
import SendEmailForm from './SendEmailForm';
import './index.css';
import Loader from './Loader';
import Message from './Message';

const App = () => {
    const [loading, setLoading] = useState(false);
    const [report, setReport] = useState({ message: '', type: '' });
    const showLoader = () => {
        setLoading(true);
    };
    const hideLoader = () => {
        setLoading(false);
    };
    const showMessage = ({ type, message }) => {
        setReport({ type, message });
    };
    const hideMessage = () => {
        setReport({ message: '', type: '' });
    };
    return (
        <div>
            <Message
                type={report.type}
                message={report.message}
                hideMessage={hideMessage}
            />
            <div className="container mt-2">
                <h2 className="text-center">Fill send email form</h2>
            </div>
            <SendEmailForm
                showLoader={showLoader}
                hideLoader={hideLoader}
                showMessage={showMessage}
                hideMessage={hideMessage}
            />
            {loading && <Loader />}
        </div>
    );
};

export default App;

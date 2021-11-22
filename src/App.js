import React, {useState} from 'react';
import SendEmailForm from './SendEmailForm';
import './index.css';
import Loader from "./Loader";

const App = () => {
    const [loading, setLoading] = useState(false);
    const showLoader = () => {
        setLoading(true);
    }
    const hideLoader = () => {
        setLoading(false);
    }
    return (
        <div>
            <div className = "container mt-2">
                <h2 className = "text-center">Fill send email form</h2>
            </div>
            <SendEmailForm showLoader={showLoader} hideLoader={hideLoader}/>
            {loading && <Loader />}
        </div>
    );
}

export default App;

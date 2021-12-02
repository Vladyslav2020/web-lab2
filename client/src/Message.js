import React from 'react';
import { CSSTransition } from 'react-transition-group';
import './index.css';

const Message = ({ type, message, hideMessage }) => {
    const _className =
        'alert-dismissible message fade show alert alert-' + type;
    return (
        <CSSTransition
            in={type.length > 0}
            timeout={400}
            classNames="message"
            mountOnEnter
            unmountOnExit
        >
            <div className={_className} role="alert">
                <strong>Attention!! </strong>
                {message}
                <button
                    className="btn-close"
                    data-bs-dismiss="alert"
                    aria-label="Close"
                    onClick={() => hideMessage()}
                ></button>
            </div>
        </CSSTransition>
    );
};

export default Message;

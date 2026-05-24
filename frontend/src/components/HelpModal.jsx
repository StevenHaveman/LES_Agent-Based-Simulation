import React from 'react';
import PropTypes from 'prop-types';
import './HelpModal.css';

export default function HelpModal({ open, onClose, text, html }) {
    if (!open) return null;

    return (
        <div className="help-overlay" role="dialog" aria-label="Help" aria-modal="true">
            <div className="help-box">
                <div className="help-header">
                    <h3 className="help-title">Help</h3>
                    <button onClick={onClose} aria-label="Close help" className="help-close-button">✕</button>
                </div>
                {html ? (
                    <div className="help-content" dangerouslySetInnerHTML={{ __html: html }} />
                ) : (
                    <div className="help-content">{text}</div>
                )}
                <div className="help-close-footer">
                    <button onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
}

HelpModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    text: PropTypes.string,
    html: PropTypes.string,
};

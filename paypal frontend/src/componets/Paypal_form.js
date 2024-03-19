import React, { useState } from 'react';
import { Toast } from 'react-bootstrap';

const Paypal_form = () => {
    const [amount, setAmount] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastColor, setToastColor] = useState('');

    const handleAmountChange = (e) => {
        setAmount(e.target.value);
    };

    const handleSubmit = () => {
        // Perform API call with entered amount
        fetch('http://192.168.29.70:5000/paypal', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ amount: amount })
        })
            .then(response => {
                // Parse response as JSON
                return response.json();
            })
            .then(data => {
                // Handle response data
                console.log('API call successful');
                console.log("approvalUrl:", data.approvalUrl);
                // Show success toast
                setToastColor('success');
                setToastMessage('API call successful');
                setShowToast(true);
                // Redirect user to approvalUrl
                window.location.href = data.approvalUrl;
            })
            .catch(error => {
                console.error('Error occurred:', error);
                // Show error toast
                setToastColor('danger');
                setToastMessage('API call failed');
                setShowToast(true);
                // Handle error scenario
            });
    };

    return (
        <>
            <div className="container d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div className="card p-4">
                    <div className="d-flex justify-content-center">
                        <img src="https://cdn.pixabay.com/photo/2015/05/26/09/37/paypal-784404_1280.png" style={{ width: '100px',  }} alt="" />
                    </div>


                    <div className="mb-3">
                        <label className="form-label">Enter Amount</label>
                        <input type="number" className="form-control" id="amount" placeholder="Enter Amount" value={amount} onChange={handleAmountChange} />
                    </div>

                    <button type="button" className="btn btn-primary" onClick={handleSubmit}>Submit</button>
                </div>
            </div>

            {/* Toast component */}
            <Toast show={showToast} onClose={() => setShowToast(false)} bg={toastColor} className={`text-white ${toastColor === 'success' ? 'bg-success' : 'bg-danger'}`} delay={3000} autohide>
                <Toast.Body>{toastMessage}</Toast.Body>
            </Toast>
        </>
    );
};

export default Paypal_form;

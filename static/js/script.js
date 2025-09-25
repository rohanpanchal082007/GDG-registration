document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    const successMessage = document.getElementById('successMessage');
    
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        clearErrors();
        
        if (validateForm()) {
            submitForm();
        }
    });
    
    function validateForm() {
        let isValid = true;
        
        const name = document.getElementById('name').value.trim();
        if (name === '') {
            showError('nameError', 'Name is required');
            isValid = false;
        } else if (name.length < 2) {
            showError('nameError', 'Name must be at least 2 characters');
            isValid = false;
        }
        
        const email = document.getElementById('email').value.trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email === '') {
            showError('emailError', 'Email is required');
            isValid = false;
        } else if (!emailPattern.test(email)) {
            showError('emailError', 'Please enter a valid email address');
            isValid = false;
        }
        
        const phone = document.getElementById('phone').value.trim();
        const phonePattern = /^\d{10}$/;
        if (phone === '') {
            showError('phoneError', 'Phone number is required');
            isValid = false;
        } else if (!phonePattern.test(phone)) {
            showError('phoneError', 'Please enter a valid 10-digit phone number');
            isValid = false;
        }
        
        const year = document.getElementById('year').value;
        if (year === '') {
            showError('yearError', 'Please select your academic year');
            isValid = false;
        }
        
        const branch = document.getElementById('branch').value;
        if (branch === '') {
            showError('branchError', 'Please select your branch');
            isValid = false;
        }
        
        return isValid;
    }
    
    function showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        errorElement.textContent = message;
    }
    
    function clearErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(element => {
            element.textContent = '';
        });
    }
    
    function submitForm() {
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Registering...';
        submitBtn.disabled = true;
        
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            year: document.getElementById('year').value,
            branch: document.getElementById('branch').value
        };
        
        fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                form.style.display = 'none';
                successMessage.classList.remove('hidden');
            } else {
                alert('Registration failed: ' + (data.error || 'Please try again.'));
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please check your connection and try again.');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    }
});

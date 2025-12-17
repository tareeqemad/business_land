// Contact Form Handling
(function() {
    'use strict';
    
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    const formMessage = document.getElementById('formMessage');
    
    // Get all form fields
    const fields = {
        fullName: document.getElementById('full-name'),
        email: document.getElementById('email'),
        company: document.getElementById('company'),
        budget: document.getElementById('budget'),
        phone: document.getElementById('phone'),
        projectDetails: document.getElementById('project-details')
    };
    
    // Validation functions
    function validateFullName(name) {
        if (!name || name.trim().length < 3) {
            return 'Name must be at least 3 characters long';
        }
        if (!/^[a-zA-Z\s\u0600-\u06FF]+$/.test(name.trim())) {
            return 'Name should only contain letters and spaces';
        }
        return '';
    }
    
    function validateEmail(email) {
        if (!email) {
            return 'Email is required';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return 'Please enter a valid email address';
        }
        return '';
    }
    
    function validatePhone(phone) {
        if (phone && phone.trim()) {
            const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
            if (!phoneRegex.test(phone.trim())) {
                return 'Please enter a valid phone number';
            }
        }
        return '';
    }
    
    function validateProjectDetails(details) {
        if (!details || details.trim().length < 10) {
            return 'Project details must be at least 10 characters long';
        }
        return '';
    }
    
    // Show error message
    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(fieldId + '-error');
        
        if (field && errorElement) {
            field.classList.add('form-field--error');
            errorElement.textContent = message;
            errorElement.setAttribute('aria-live', 'polite');
        }
    }
    
    // Clear error message
    function clearError(fieldId) {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(fieldId + '-error');
        
        if (field && errorElement) {
            field.classList.remove('form-field--error');
            errorElement.textContent = '';
        }
    }
    
    // Show form message
    function showFormMessage(message, type = 'success') {
        formMessage.textContent = message;
        formMessage.className = `form-message form-message--${type}`;
        formMessage.setAttribute('role', 'alert');
        formMessage.style.display = 'block';
        
        // Scroll to message
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Hide after 5 seconds for success messages
        if (type === 'success') {
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
        }
    }
    
    // Hide form message
    function hideFormMessage() {
        formMessage.style.display = 'none';
        formMessage.textContent = '';
        formMessage.className = 'form-message';
    }
    
    // Set loading state
    function setLoading(loading) {
        if (loading) {
            submitBtn.disabled = true;
            btnText.style.opacity = '0';
            btnLoader.style.display = 'inline-block';
        } else {
            submitBtn.disabled = false;
            btnText.style.opacity = '1';
            btnLoader.style.display = 'none';
        }
    }
    
    // Validate all fields
    function validateForm() {
        let isValid = true;
        
        // Clear all previous errors
        Object.keys(fields).forEach(key => {
            if (key !== 'company' && key !== 'budget' && key !== 'phone') {
                clearError(fields[key].id);
            }
        });
        
        // Validate full name
        const fullNameError = validateFullName(fields.fullName.value);
        if (fullNameError) {
            showError('full-name', fullNameError);
            isValid = false;
        }
        
        // Validate email
        const emailError = validateEmail(fields.email.value);
        if (emailError) {
            showError('email', emailError);
            isValid = false;
        }
        
        // Validate phone (optional)
        if (fields.phone.value) {
            const phoneError = validatePhone(fields.phone.value);
            if (phoneError) {
                showError('phone', phoneError);
                isValid = false;
            }
        }
        
        // Validate project details
        const projectDetailsError = validateProjectDetails(fields.projectDetails.value);
        if (projectDetailsError) {
            showError('project-details', projectDetailsError);
            isValid = false;
        }
        
        return isValid;
    }
    
    // Real-time validation
    Object.keys(fields).forEach(key => {
        const field = fields[key];
        if (field) {
            field.addEventListener('blur', function() {
                if (this.hasAttribute('required') || this.value.trim()) {
                    let error = '';
                    switch(key) {
                        case 'fullName':
                            error = validateFullName(this.value);
                            break;
                        case 'email':
                            error = validateEmail(this.value);
                            break;
                        case 'phone':
                            error = validatePhone(this.value);
                            break;
                        case 'projectDetails':
                            error = validateProjectDetails(this.value);
                            break;
                    }
                    if (error) {
                        showError(this.id, error);
                    } else {
                        clearError(this.id);
                    }
                }
            });
            
            field.addEventListener('input', function() {
                if (this.classList.contains('form-field--error')) {
                    clearError(this.id);
                }
                hideFormMessage();
            });
        }
    });
    
    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        hideFormMessage();
        
        if (!validateForm()) {
            showFormMessage('Please correct the errors in the form.', 'error');
            return;
        }
        
        // Prepare form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Set loading state
        setLoading(true);
        
        try {
            // Simulate API call (replace with actual endpoint)
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // In a real application, you would send the data to your server:
            // const response = await fetch('/api/contact', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(data)
            // });
            // const result = await response.json();
            
            // Success message
            showFormMessage('Thank you! Your message has been sent successfully. We\'ll get back to you within 24-48 hours.', 'success');
            form.reset();
            
            // Clear all errors
            Object.keys(fields).forEach(key => {
                clearError(fields[key].id);
            });
            
        } catch (error) {
            console.error('Form submission error:', error);
            showFormMessage('Sorry, there was an error sending your message. Please try again later or contact us directly.', 'error');
        } finally {
            setLoading(false);
        }
    });
    
    // Form reset
    form.addEventListener('reset', function() {
        hideFormMessage();
        Object.keys(fields).forEach(key => {
            clearError(fields[key].id);
        });
    });
})();


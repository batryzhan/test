// Global variables for tracking current field and element being edited
let currentField = null;
let currentElement = null;

// DOM Elements
const modal = document.getElementById('editModal');
const modalInput = document.getElementById('modalInput');
const modalSelect = document.getElementById('modalSelect');
const modalTitle = document.getElementById('modalTitle');
const avatarInput = document.getElementById('avatarInput');
const avatarWrapper = document.querySelector('.avatar-wrapper');

// Utility function to initialize profile data
function initializeProfile() {
    loadFromLocalStorage();
    setDefaultValues();
    updateStatus();
}

// Load data from localStorage
function loadFromLocalStorage() {
    const name = localStorage.getItem('donorName') || 'Name Surname';
    const bloodType = localStorage.getItem('bloodType') || 'A+';
    const lastDonation = localStorage.getItem('lastDonation') || '2024-01-01';
    const birthdate = localStorage.getItem('birthdate') || '1990-01-01';
    const donated = localStorage.getItem('donated') || '0 times';

    document.querySelector('.name-section h1').textContent = name;
    document.getElementById('bloodType').textContent = bloodType;
    document.getElementById('lastDonation').textContent = lastDonation;
    document.getElementById('birthdate').textContent = birthdate;
    document.querySelector('.detail-item:nth-child(4) .detail-value').textContent = donated;
}

// Set default values if none exist
function setDefaultValues() {
    if (!document.getElementById('bloodType').textContent) {
        document.getElementById('bloodType').textContent = 'Not Specified';
    }
    if (!document.getElementById('lastDonation').textContent) {
        document.getElementById('lastDonation').textContent = 'Never';
    }
    if (!document.getElementById('birthdate').textContent) {
        document.getElementById('birthdate').textContent = 'Not Specified';
    }
}

// Update donor status based on last donation date
function updateStatus() {
    const lastDonation = new Date(document.getElementById('lastDonation').textContent);
    const today = new Date();
    const daysSince = Math.floor((today - lastDonation) / (1000 * 60 * 60 * 24));

    const statusCircle = document.querySelector('.status-circle');
    const statusText = document.querySelector('.status-card h2');
    const statusDesc = document.querySelector('.status-card p');

    if (daysSince >= 56 || isNaN(daysSince)) {
        statusCircle.style.background = '#28a745';
        statusText.textContent = 'Green Light';
        statusDesc.textContent = 'It means that person can be a donor even today';
    } else {
        statusCircle.style.background = '#dc3545';
        statusText.textContent = 'Red Light';
        statusDesc.textContent = 'Cannot donate yet. Wait until 56 days have passed.';
    }
}

// Open modal for editing
function openModal(fieldType, currentValue) {
    modal.classList.add('active');
    modalTitle.textContent = `Edit ${fieldType}`;

    if (fieldType === 'bloodType') {
        modalSelect.style.display = 'block';
        modalInput.style.display = 'none';
        modalSelect.value = currentValue;
        currentField = 'select';
    } else {
        modalSelect.style.display = 'none';
        modalInput.style.display = 'block';
        modalInput.value = currentValue;
        currentField = 'input';

        if (fieldType === 'Donation Date' || fieldType === 'Birthdate') {
            modalInput.type = 'date';
        } else {
            modalInput.type = 'text';
        }
    }
}

// Close modal
function closeModal() {
    modal.classList.remove('active');
    currentField = null;
    currentElement = null;
    modalInput.value = '';
    modalSelect.value = 'A+';
}

// Save changes from modal
function saveChanges() {
    if (!currentField || !currentElement) return;

    const value = currentField === 'input' ? modalInput.value : modalSelect.value;

    if (value.trim() === '') {
        alert('Please enter a valid value');
        return;
    }

    currentElement.textContent = value;
    saveToLocalStorage();
    updateStatus();
    closeModal();
}

// Save data to localStorage
function saveToLocalStorage() {
    localStorage.setItem('donorName', document.querySelector('.name-section h1').textContent);
    localStorage.setItem('bloodType', document.getElementById('bloodType').textContent);
    localStorage.setItem('lastDonation', document.getElementById('lastDonation').textContent);
    localStorage.setItem('birthdate', document.getElementById('birthdate').textContent);
    localStorage.setItem('donated', document.querySelector('.detail-item:nth-child(4) .detail-value').textContent);
}

// Edit functions
function editName() {
    currentElement = document.querySelector('.name-section h1');
    openModal('Name', currentElement.textContent);
}

function editBloodType() {
    currentElement = document.getElementById('bloodType');
    openModal('bloodType', currentElement.textContent);
}

function editDonationDate() {
    currentElement = document.getElementById('lastDonation');
    openModal('Donation Date', currentElement.textContent);
}

function editBirthdate() {
    currentElement = document.getElementById('birthdate');
    openModal('Birthdate', currentElement.textContent);
}

// Update avatar image
function updateAvatar(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            avatarWrapper.style.backgroundImage = `url(${e.target.result})`;
            avatarWrapper.style.backgroundSize = 'cover';
            avatarWrapper.style.backgroundPosition = 'center';
            localStorage.setItem('avatar', e.target.result);
        };
        reader.readAsDataURL(file);
    } else {
        alert('Please upload a valid image file');
    }
}

// Load avatar from localStorage
function loadAvatar() {
    const avatarData = localStorage.getItem('avatar');
    if (avatarData) {
        avatarWrapper.style.backgroundImage = `url(${avatarData})`;
        avatarWrapper.style.backgroundSize = 'cover';
        avatarWrapper.style.backgroundPosition = 'center';
    }
}

// Footer navigation active state
function setActive(element) {
    document.querySelectorAll('.fot-item').forEach(item => {
        item.classList.remove('active');
    });
    element.classList.add('active');
}

// Event Listeners
document.querySelector('.modal-close').addEventListener('click', closeModal);
document.querySelector('.modal-btn.cancel').addEventListener('click', closeModal);
document.querySelector('.modal-btn.save').addEventListener('click', saveChanges);
avatarInput.addEventListener('change', updateAvatar);

// Global click event to close modal when clicking outside
window.addEventListener('click', function(event) {
    if (event.target === modal) {
        closeModal();
    }
});

// Escape key to close modal
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// Hover effects for detail items
document.querySelectorAll('.detail-item').forEach(item => {
    item.addEventListener('mouseover', () => {
        item.style.transform = 'translateX(10px)';
    });
    item.addEventListener('mouseout', () => {
        item.style.transform = 'translateX(0)';
    });
});

// Validation for birthdate (must be in the past)
function validateBirthdate(dateStr) {
    const date = new Date(dateStr);
    const today = new Date();
    return date < today;
}

// Validation for donation date (not in the future)
function validateDonationDate(dateStr) {
    const date = new Date(dateStr);
    const today = new Date();
    return date <= today;
}

// Increment donation count
function incrementDonationCount() {
    const donatedElement = document.querySelector('.detail-item:nth-child(4) .detail-value');
    let count = parseInt(donatedElement.textContent) || 0;
    count++;
    donatedElement.textContent = `${count} times`;
    saveToLocalStorage();
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    initializeProfile();
    loadAvatar();
});

// Additional utility functions for future expansion
function resetProfile() {
    localStorage.clear();
    initializeProfile();
}

function exportProfileData() {
    const data = {
        name: document.querySelector('.name-section h1').textContent,
        bloodType: document.getElementById('bloodType').textContent,
        lastDonation: document.getElementById('lastDonation').textContent,
        birthdate: document.getElementById('birthdate').textContent,
        donated: document.querySelector('.detail-item:nth-child(4) .detail-value').textContent
    };
    const json = JSON.stringify(data, null, 2);
    console.log(json);
    return json;
}

function logActivity(action) {
    console.log(`User performed action: ${action} at ${new Date().toISOString()}`);
}

// Placeholder for future features
function checkEligibility() {
    const age = calculateAge(document.getElementById('birthdate').textContent);
    if (age < 18 || age > 65) {
        alert('Donor must be between 18 and 65 years old');
    }
}

function calculateAge(birthdate) {
    const birth = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
}

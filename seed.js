
const fs = require('fs');
const path = require('path');

const DATA_FILE = 'registrations.json';
const SAMPLE_COUNT = 25;

const firstNames = [
    'Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan',
    'Shaurya', 'Atharv', 'Advik', 'Pranav', 'Rishabh', 'Kabir', 'Aryan', 'Yuvraj', 'Rudra', 'Karthik',
    'Ananya', 'Diya', 'Priya', 'Kavya', 'Anika', 'Isha', 'Tanvi', 'Riya', 'Sneha', 'Pooja',
    'Shruti', 'Meera', 'Nisha', 'Divya', 'Sakshi', 'Rashika', 'Simran', 'Aditi', 'Khushi', 'Mansi'
];

const lastNames = [
    'Sharma', 'Verma', 'Gupta', 'Singh', 'Kumar', 'Patel', 'Jain', 'Agarwal', 'Bansal', 'Mittal',
    'Shah', 'Chopra', 'Malhotra', 'Arora', 'Kapoor', 'Mehta', 'Joshi', 'Tiwari', 'Pandey', 'Saxena',
    'Srivastava', 'Mishra', 'Yadav', 'Thakur', 'Chauhan', 'Rajput', 'Bhardwaj', 'Agnihotri', 'Dixit', 'Tripathi'
];

const emailDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com'];

const branches = ['CSE', 'IT', 'ECE', 'ME', 'CE'];
const years = ['1', '2', '3', '4'];

function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function generatePhone() {
    const firstDigit = Math.floor(Math.random() * 4) + 6;
    const remainingDigits = Math.floor(Math.random() * 900000000) + 100000000;
    return firstDigit.toString() + remainingDigits.toString();
}

function generateEmail(firstName, lastName) {
    const username = firstName.toLowerCase() + '.' + lastName.toLowerCase() + Math.floor(Math.random() * 99);
    const domain = getRandomElement(emailDomains);
    return `${username}@${domain}`;
}

function generateTimestamp(daysBack = 30) {
    const now = new Date();
    const pastDate = new Date(now.getTime() - (Math.random() * daysBack * 24 * 60 * 60 * 1000));
    return pastDate.toISOString();
}

function generateRegistration() {
    const firstName = getRandomElement(firstNames);
    const lastName = getRandomElement(lastNames);
    const fullName = `${firstName} ${lastName}`;
    
    return {
        name: fullName,
        email: generateEmail(firstName, lastName),
        phone: generatePhone(),
        year: getRandomElement(years),
        branch: getRandomElement(branches),
        timestamp: generateTimestamp()
    };
}

function validateRegistration(registration) {
    const requiredFields = ['name', 'email', 'phone', 'year', 'branch'];
    
    for (const field of requiredFields) {
        if (!registration[field] || !registration[field].toString().trim()) {
            return false;
        }
    }
    
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(registration.email)) {
        return false;
    }
    
    const phonePattern = /^\d{10}$/;
    if (!phonePattern.test(registration.phone)) {
        return false;
    }
    
    if (!years.includes(registration.year)) {
        return false;
    }
    
    if (!branches.includes(registration.branch)) {
        return false;
    }
    
    if (registration.name.trim().length < 2) {
        return false;
    }
    
    return true;
}

function generateSeedData() {
    const registrations = [];
    const usedEmails = new Set();
        
    let attempts = 0;
    const maxAttempts = SAMPLE_COUNT * 3;
    
    while (registrations.length < SAMPLE_COUNT && attempts < maxAttempts) {
        attempts++;
        const registration = generateRegistration();
        
        if (usedEmails.has(registration.email.toLowerCase())) {
            continue;
        }
        
        if (validateRegistration(registration)) {
            usedEmails.add(registration.email.toLowerCase());
            registrations.push(registration);
            
            if (registrations.length % 5 === 0) {

            }
        }
    }
    
    if (registrations.length < SAMPLE_COUNT) {
        console.warn(`Warning: Only generated ${registrations.length} valid registrations out of ${SAMPLE_COUNT} requested.`);
    }
    
    return registrations;
}

function saveRegistrations(registrations) {
    try {
        const sortedRegistrations = registrations.sort((a, b) => {
            return new Date(b.timestamp) - new Date(a.timestamp);
        });
        
        fs.writeFileSync(DATA_FILE, JSON.stringify(sortedRegistrations, null, 2));

        
        const branchStats = {};
        const yearStats = {};
        
        sortedRegistrations.forEach(reg => {
            branchStats[reg.branch] = (branchStats[reg.branch] || 0) + 1;
            yearStats[reg.year] = (yearStats[reg.year] || 0) + 1;
        });
        
    } catch (error) {
        console.error('❌ Error saving registrations:', error.message);
        process.exit(1);
    }
}

function backupExistingData() {
    if (fs.existsSync(DATA_FILE)) {
        const backupFile = `${DATA_FILE}.backup.${Date.now()}`;
        try {
            fs.copyFileSync(DATA_FILE, backupFile);
            console.log(`📦 Existing data backed up to: ${backupFile}`);
        } catch (error) {
            console.warn('⚠️ Warning: Could not create backup of existing data:', error.message);
        }
    }
}

function main() {
    
    if (process.argv.includes('--backup') || process.argv.includes('-b')) {
        backupExistingData();
    }
    
    const registrations = generateSeedData();
    
    if (registrations.length === 0) {
        console.error('❌ No valid registrations generated. Exiting.');
        process.exit(1);
    }
    
    saveRegistrations(registrations);
    
    console.log('🎉 Seeding completed successfully!');
}

if (require.main === module) {
    main();
}

module.exports = {
    generateSeedData,
    generateRegistration,
    validateRegistration
};

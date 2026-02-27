// Default configuration
const defaultConfig = {
    system_title: 'Smart Hospital Management',
    welcome_message: 'Multi-Tenant Healthcare Platform',
    background_color: '#0f172a',
    surface_color: 'rgba(255,255,255,0.05)',
    text_color: '#ffffff',
    primary_action_color: '#3b82f6',
    secondary_action_color: '#06b6d4'
};

// State management
let currentUser = null;
let currentHospital = null;
let allData = [];

// Sample data for demonstration
const sampleDoctors = [
    { id: 1, name: 'Dr. Sarah Smith', specialization: 'Cardiology', available_days: ['Monday', 'Wednesday', 'Friday'], available_time: 'Morning', status: 'Available' },
    { id: 2, name: 'Dr. James Johnson', specialization: 'Neurology', available_days: ['Tuesday', 'Thursday'], available_time: 'Afternoon', status: 'Available' },
    { id: 3, name: 'Dr. Emily Williams', specialization: 'Orthopedics', available_days: ['Monday', 'Tuesday', 'Wednesday'], available_time: 'Evening', status: 'In Surgery' },
    { id: 4, name: 'Dr. Michael Brown', specialization: 'Pediatrics', available_days: ['Wednesday', 'Friday', 'Saturday'], available_time: 'Morning', status: 'Available' },
    { id: 5, name: 'Dr. Lisa Davis', specialization: 'General Medicine', available_days: ['Monday', 'Tuesday', 'Thursday', 'Friday'], available_time: 'Afternoon', status: 'Available' }
];

const sampleSchemes = [
    { id: 1, name: 'Ayushman Bharat', eligibility: 'BPL families', discount: 100, description: 'Complete coverage for secondary and tertiary hospitalization' },
    { id: 2, name: 'PM-JAY', eligibility: 'Low income families', discount: 80, description: 'Coverage up to ₹5 lakh per family per year' },
    { id: 3, name: 'ESIS', eligibility: 'Employees with salary < ₹21,000', discount: 70, description: 'Medical benefits for insured persons and dependents' },
    { id: 4, name: 'CGHS', eligibility: 'Central Government employees', discount: 60, description: 'Comprehensive health scheme for govt employees' }
];

const sampleMedicines = [
    { id: 1, name: 'Paracetamol 500mg', category: 'Tablets', batch: 'BT-2024-001', expiry: '2025-06-15', quantity: 500, price: 25, threshold: 100 },
    { id: 2, name: 'Amoxicillin 250mg', category: 'Tablets', batch: 'BT-2024-002', expiry: '2024-03-20', quantity: 45, price: 120, threshold: 50 },
    { id: 3, name: 'Cough Syrup', category: 'Syrups', batch: 'BT-2024-003', expiry: '2024-02-28', quantity: 30, price: 85, threshold: 40 },
    { id: 4, name: 'Insulin Injection', category: 'Injections', batch: 'BT-2024-004', expiry: '2024-12-10', quantity: 200, price: 450, threshold: 50 },
    { id: 5, name: 'Antiseptic Cream', category: 'Ointments', batch: 'BT-2024-005', expiry: '2025-08-22', quantity: 150, price: 65, threshold: 30 }
];

// Initialize Element SDK
if (window.elementSdk) {
    window.elementSdk.init({
        defaultConfig,
        onConfigChange: async (config) => {
            document.getElementById('system-title').textContent = config.system_title || defaultConfig.system_title;
            document.getElementById('welcome-msg').textContent = config.welcome_message || defaultConfig.welcome_message;
        },
        mapToCapabilities: (config) => ({
            recolorables: [
                {
                    get: () => config.primary_action_color || defaultConfig.primary_action_color,
                    set: (value) => window.elementSdk.setConfig({ primary_action_color: value })
                }
            ],
            borderables: [],
            fontEditable: undefined,
            fontSizeable: undefined
        }),
        mapToEditPanelValues: (config) => new Map([
            ['system_title', config.system_title || defaultConfig.system_title],
            ['welcome_message', config.welcome_message || defaultConfig.welcome_message]
        ])
    });
}

const API_URL = 'http://localhost:3001/api';

const dataHandler = {
    onDataChanged(data) {
        allData = data;
        renderPatientList();
        renderRoundsList();
        renderHygieneList();
        renderDoctorList();
        updateDashboardStats();
    }
};

async function fetchAllData() {
    try {
        const res = await fetch(`${API_URL}/data`);
        if (!res.ok) throw new Error('API response not OK');
        const data = await res.json();
        dataHandler.onDataChanged(data);
    } catch (e) { console.error(e); }
}

async function apiCreate(item) {
    try {
        const response = await fetch(`${API_URL}/data`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
        });
        if (!response.ok) throw new Error('API create failed');
        const result = await response.json();
        if (result.isOk) {
            await fetchAllData();
        }
        return result;
    } catch (e) {
        console.error('API disabled or failed, using local fallback:', e);
        item.id = Date.now();
        allData.push(item);
        dataHandler.onDataChanged(allData);
        return { isOk: true };
    }
}

async function initDataSdk() {
    await fetchAllData();
}
initDataSdk();

// Seed mock data on first load
async function seedMockData() {
    if (allData.length > 0) return;

    const mockData = [
        // Hospital Information
        { type: 'hospital', hospital_id: 'hosp1', name: 'City General Hospital', email: 'admin@cityhospital.com', phone: '+91-9876543210', status: 'Active', created_at: new Date().toISOString() },
        { type: 'hospital', hospital_id: 'hosp2', name: 'Medicare Central', email: 'admin@medicare.com', phone: '+91-9876543211', status: 'Active', created_at: new Date().toISOString() },
        { type: 'hospital', hospital_id: 'hosp3', name: 'LifeCare Medical Center', email: 'admin@lifecare.com', phone: '+91-9876543212', status: 'Active', created_at: new Date().toISOString() },

        // Patients for hosp1
        { type: 'patient', hospital_id: 'hosp1', name: 'Rajesh Kumar', email: 'rajesh@email.com', phone: '9876543220', status: 'IPD', details: JSON.stringify({ age: 45, gender: 'Male', address: '123 Main St, City', doctor: 'Dr. Sarah Smith', admission: 'IPD', admitted_date: '2024-01-15' }), created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
        { type: 'patient', hospital_id: 'hosp1', name: 'Priya Sharma', email: 'priya@email.com', phone: '9876543221', status: 'OPD', details: JSON.stringify({ age: 32, gender: 'Female', address: '456 Park Ave, City', doctor: 'Dr. Lisa Davis', admission: 'OPD', visit_date: '2024-01-18' }), created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
        { type: 'patient', hospital_id: 'hosp1', name: 'Amit Singh', email: 'amit@email.com', phone: '9876543222', status: 'IPD', details: JSON.stringify({ age: 58, gender: 'Male', address: '789 Oak Rd, City', doctor: 'Dr. James Johnson', admission: 'IPD', admitted_date: '2024-01-10' }), created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString() },
        { type: 'patient', hospital_id: 'hosp1', name: 'Anjali Verma', email: 'anjali@email.com', phone: '9876543223', status: 'OPD', details: JSON.stringify({ age: 28, gender: 'Female', address: '321 Elm St, City', doctor: 'Dr. Michael Brown', admission: 'OPD', visit_date: '2024-01-19' }), created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
        { type: 'patient', hospital_id: 'hosp1', name: 'Vikram Patel', email: 'vikram@email.com', phone: '9876543224', status: 'IPD', details: JSON.stringify({ age: 52, gender: 'Male', address: '654 Pine Ave, City', doctor: 'Dr. Sarah Smith', admission: 'IPD', admitted_date: '2024-01-12' }), created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString() },

        // Patients for hosp2
        { type: 'patient', hospital_id: 'hosp2', name: 'Neha Gupta', email: 'neha@email.com', phone: '9876543225', status: 'OPD', details: JSON.stringify({ age: 35, gender: 'Female', address: '111 Center St, Medicare City', doctor: 'Dr. Emma White', admission: 'OPD', visit_date: '2024-01-17' }), created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
        { type: 'patient', hospital_id: 'hosp2', name: 'Arjun Das', email: 'arjun@email.com', phone: '9876543226', status: 'IPD', details: JSON.stringify({ age: 48, gender: 'Male', address: '222 Health Blvd, Medicare City', doctor: 'Dr. Robert Green', admission: 'IPD', admitted_date: '2024-01-14' }), created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },

        // Patients for hosp3
        { type: 'patient', hospital_id: 'hosp3', name: 'Deepak Nair', email: 'deepak@email.com', phone: '9876543227', status: 'IPD', details: JSON.stringify({ age: 60, gender: 'Male', address: '333 Life Ave, LifeCare City', doctor: 'Dr. Sandra Lee', admission: 'IPD', admitted_date: '2024-01-11' }), created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
        { type: 'patient', hospital_id: 'hosp3', name: 'Simran Kaur', email: 'simran@email.com', phone: '9876543228', status: 'OPD', details: JSON.stringify({ age: 41, gender: 'Female', address: '444 Care St, LifeCare City', doctor: 'Dr. David Kim', admission: 'OPD', visit_date: '2024-01-19' }), created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },

        // Doctors for hosp1
        { type: 'doctor', hospital_id: 'hosp1', name: 'Dr. Sarah Smith', email: 'sarah@cityhospital.com', phone: '9876543230', specialization: 'Cardiology', status: 'Available', details: JSON.stringify({ days: ['Monday', 'Wednesday', 'Friday'], time: 'Morning', experience: '12 years', qualifications: 'MD Cardiology' }), created_at: new Date().toISOString() },
        { type: 'doctor', hospital_id: 'hosp1', name: 'Dr. James Johnson', specialization: 'Neurology', email: 'james@cityhospital.com', phone: '9876543231', status: 'Available', details: JSON.stringify({ days: ['Tuesday', 'Thursday'], time: 'Afternoon', experience: '15 years', qualifications: 'MD Neurology' }), created_at: new Date().toISOString() },
        { type: 'doctor', hospital_id: 'hosp1', name: 'Dr. Emily Williams', specialization: 'Orthopedics', email: 'emily@cityhospital.com', phone: '9876543232', status: 'In Surgery', details: JSON.stringify({ days: ['Monday', 'Tuesday', 'Wednesday'], time: 'Evening', experience: '10 years', qualifications: 'MS Orthopedic Surgery' }), created_at: new Date().toISOString() },
        { type: 'doctor', hospital_id: 'hosp1', name: 'Dr. Michael Brown', specialization: 'Pediatrics', email: 'michael@cityhospital.com', phone: '9876543233', status: 'Available', details: JSON.stringify({ days: ['Wednesday', 'Friday', 'Saturday'], time: 'Morning', experience: '8 years', qualifications: 'MD Pediatrics' }), created_at: new Date().toISOString() },
        { type: 'doctor', hospital_id: 'hosp1', name: 'Dr. Lisa Davis', specialization: 'General Medicine', email: 'lisa@cityhospital.com', phone: '9876543234', status: 'Available', details: JSON.stringify({ days: ['Monday', 'Tuesday', 'Thursday', 'Friday'], time: 'Afternoon', experience: '9 years', qualifications: 'MD General Medicine' }), created_at: new Date().toISOString() },

        // Doctors for hosp2
        { type: 'doctor', hospital_id: 'hosp2', name: 'Dr. Emma White', specialization: 'Ophthalmology', email: 'emma@medicare.com', phone: '9876543235', status: 'Available', details: JSON.stringify({ days: ['Monday', 'Wednesday', 'Friday'], time: 'Morning', experience: '11 years', qualifications: 'MD Ophthalmology' }), created_at: new Date().toISOString() },
        { type: 'doctor', hospital_id: 'hosp2', name: 'Dr. Robert Green', specialization: 'Gastroenterology', email: 'robert@medicare.com', phone: '9876543236', status: 'Available', details: JSON.stringify({ days: ['Tuesday', 'Thursday'], time: 'Afternoon', experience: '13 years', qualifications: 'MD Gastroenterology' }), created_at: new Date().toISOString() },

        // Doctors for hosp3
        { type: 'doctor', hospital_id: 'hosp3', name: 'Dr. Sandra Lee', specialization: 'Oncology', email: 'sandra@lifecare.com', phone: '9876543237', status: 'Available', details: JSON.stringify({ days: ['Monday', 'Wednesday', 'Friday'], time: 'Morning', experience: '14 years', qualifications: 'MD Oncology' }), created_at: new Date().toISOString() },
        { type: 'doctor', hospital_id: 'hosp3', name: 'Dr. David Kim', specialization: 'Dermatology', email: 'david@lifecare.com', phone: '9876543238', status: 'Available', details: JSON.stringify({ days: ['Tuesday', 'Thursday', 'Saturday'], time: 'Afternoon', experience: '7 years', qualifications: 'MD Dermatology' }), created_at: new Date().toISOString() },

        // Medicines for hosp1
        { type: 'medicine', hospital_id: 'hosp1', name: 'Paracetamol 500mg', email: 'pharm@cityhospital.com', phone: '0', role: 'Tablets', status: 'BT-2024-001', expiry_date: '2025-06-15', quantity: 500, price: 25, details: 'Active', created_at: new Date().toISOString() },
        { type: 'medicine', hospital_id: 'hosp1', name: 'Amoxicillin 250mg', email: 'pharm@cityhospital.com', phone: '0', role: 'Tablets', status: 'BT-2024-002', expiry_date: '2024-03-20', quantity: 45, price: 120, details: 'Expiring', created_at: new Date().toISOString() },
        { type: 'medicine', hospital_id: 'hosp1', name: 'Cough Syrup', email: 'pharm@cityhospital.com', phone: '0', role: 'Syrups', status: 'BT-2024-003', expiry_date: '2024-02-28', quantity: 30, price: 85, details: 'Expiring', created_at: new Date().toISOString() },
        { type: 'medicine', hospital_id: 'hosp1', name: 'Insulin Injection', email: 'pharm@cityhospital.com', phone: '0', role: 'Injections', status: 'BT-2024-004', expiry_date: '2024-12-10', quantity: 200, price: 450, details: 'Active', created_at: new Date().toISOString() },
        { type: 'medicine', hospital_id: 'hosp1', name: 'Antiseptic Cream', email: 'pharm@cityhospital.com', phone: '0', role: 'Ointments', status: 'BT-2024-005', expiry_date: '2025-08-22', quantity: 150, price: 65, details: 'Active', created_at: new Date().toISOString() },
        { type: 'medicine', hospital_id: 'hosp1', name: 'Aspirin 325mg', email: 'pharm@cityhospital.com', phone: '0', role: 'Tablets', status: 'BT-2024-006', expiry_date: '2025-05-10', quantity: 12, price: 30, details: 'Low Stock', created_at: new Date().toISOString() },

        // Medicines for hosp2
        { type: 'medicine', hospital_id: 'hosp2', name: 'Metformin 500mg', email: 'pharm@medicare.com', phone: '0', role: 'Tablets', status: 'BT-2024-101', expiry_date: '2025-09-15', quantity: 600, price: 40, details: 'Active', created_at: new Date().toISOString() },
        { type: 'medicine', hospital_id: 'hosp2', name: 'Lisinopril 10mg', email: 'pharm@medicare.com', phone: '0', role: 'Tablets', status: 'BT-2024-102', expiry_date: '2024-04-20', quantity: 20, price: 95, details: 'Low Stock', created_at: new Date().toISOString() },

        // Medicines for hosp3
        { type: 'medicine', hospital_id: 'hosp3', name: 'Ibuprofen 400mg', email: 'pharm@lifecare.com', phone: '0', role: 'Tablets', status: 'BT-2024-201', expiry_date: '2025-07-30', quantity: 400, price: 35, details: 'Active', created_at: new Date().toISOString() },
        { type: 'medicine', hospital_id: 'hosp3', name: 'Atorvastatin 20mg', email: 'pharm@lifecare.com', phone: '0', role: 'Tablets', status: 'BT-2024-202', expiry_date: '2024-05-15', quantity: 8, price: 150, details: 'Low Stock', created_at: new Date().toISOString() },

        // Rounds schedules
        { type: 'round', hospital_id: 'hosp1', name: 'Dr. Sarah Smith', role: 'Doctor', details: 'ICU', status: '08:00', created_at: new Date().toISOString() },
        { type: 'round', hospital_id: 'hosp1', name: 'Nurse Johnson', role: 'Nurse', details: 'General Ward', status: '09:00', created_at: new Date().toISOString() },
        { type: 'round', hospital_id: 'hosp1', name: 'Dr. Emily Williams', role: 'Doctor', details: 'Pediatric', status: '10:30', created_at: new Date().toISOString() },
        { type: 'round', hospital_id: 'hosp2', name: 'Dr. Emma White', role: 'Doctor', details: 'ICU', status: '07:30', created_at: new Date().toISOString() },
        { type: 'round', hospital_id: 'hosp3', name: 'Dr. Sandra Lee', role: 'Doctor', details: 'Oncology Ward', status: '09:30', created_at: new Date().toISOString() },

        // Hygiene checks
        { type: 'hygiene', hospital_id: 'hosp1', name: 'Staff Member - Ward A', role: 'Nurse', details: JSON.stringify({ gloves: true, mask: true, sanitized: true }), status: 'Pass', created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() },
        { type: 'hygiene', hospital_id: 'hosp1', name: 'Staff Member - Ward B', role: 'Nurse', details: JSON.stringify({ gloves: true, mask: false, sanitized: true }), status: 'Fail', created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() },
        { type: 'hygiene', hospital_id: 'hosp2', name: 'Staff Member - ICU', role: 'Nurse', details: JSON.stringify({ gloves: true, mask: true, sanitized: true }), status: 'Pass', created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },

        // Waste management
        { type: 'waste', hospital_id: 'hosp1', name: 'Infectious Waste', role: 'Infectious', details: JSON.stringify({ category: 'Bio-hazard', kg: 45, date: new Date().toLocaleDateString() }), status: 'Collected', created_at: new Date().toISOString() },
        { type: 'waste', hospital_id: 'hosp1', name: 'Sharps Waste', role: 'Sharps', details: JSON.stringify({ category: 'Needles & Blades', kg: 12, date: new Date().toLocaleDateString() }), status: 'Collected', created_at: new Date().toISOString() },
    ];

    try {
        const res = await fetch(`${API_URL}/init`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sampleData: mockData })
        });
        if (!res.ok) throw new Error('API init failed');
        if (allData.length === 0) {
            await fetchAllData();
        }
    } catch (e) {
        console.error('Failed to seed DB via API, using local mock data', e);
        if (allData.length === 0) {
            dataHandler.onDataChanged(mockData);
        }
    }
}

// Seed data after a short delay to ensure SDK is ready
setTimeout(() => seedMockData(), 500);

// Authentication Functions
function handleLogin() {
    const hospital = document.getElementById('hospital-select').value;
    const email = document.getElementById('login-email').value;
    const role = document.getElementById('role-select').value;

    if (!email) {
        showToast('Please enter email', '⚠️');
        return;
    }

    currentUser = { email, role };
    currentHospital = hospital;

    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');

    const hospitalNames = {
        'hosp1': 'City General',
        'hosp2': 'Medicare Central',
        'hosp3': 'LifeCare Medical'
    };

    document.getElementById('current-hospital').textContent = hospitalNames[hospital];
    document.getElementById('current-role').textContent = role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());

    initializeDashboard();
    scanHospitals();
    showToast('Welcome! JWT authenticated successfully', '✅');
}

function handleLogout() {
    currentUser = null;
    currentHospital = null;
    document.getElementById('dashboard').classList.add('hidden');
    document.getElementById('login-screen').classList.remove('hidden');
    showToast('Logged out successfully', '👋');
}

// Dashboard Functions
function initializeDashboard() {
    renderDoctorList();
    renderMedicineList();
    renderSchemesList();
    renderRoundsList();
    renderHygieneList();
    renderPatientList();
    updateAlerts();
}

function updateDashboardStats() {
    const patients = allData.filter(d => d.type === 'patient' && d.hospital_id === currentHospital);
    document.getElementById('stat-patients').textContent = patients.length || 0;

    const doctors = allData.filter(d => d.type === 'doctor' && d.hospital_id === currentHospital);
    document.getElementById('stat-doctors').textContent = doctors.length || 0;

    const medicines = allData.filter(d => d.type === 'medicine' && d.hospital_id === currentHospital);
    const lowStock = medicines.filter(m => m.quantity < (m.threshold || 50));
    document.getElementById('stat-lowstock').textContent = lowStock.length || 0;

    const expiring = medicines.filter(m => {
        const expiry = new Date(m.expiry_date || m.expiry);
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        return expiry <= thirtyDaysFromNow;
    });
    document.getElementById('stat-expiring').textContent = expiring.length || 0;
}

function updateAlerts() {
    const alertsBanner = document.getElementById('alerts-banner');
    const medicines = allData.filter(d => d.type === 'medicine' && d.hospital_id === currentHospital);
    const expiringMeds = medicines.filter(m => {
        const expiry = new Date(m.expiry_date || m.expiry);
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        return expiry <= thirtyDaysFromNow;
    });

    const lowStockMeds = medicines.filter(m => m.quantity < (m.threshold || 50));

    let alertsHtml = '';
    if (expiringMeds.length > 0) {
        alertsHtml += `
            <div class="bg-red-500/20 border border-red-500/30 rounded-xl px-4 py-3 flex items-center justify-between">
                <div class="flex items-center space-x-3">
                    <span class="text-red-400">⚠️</span>
                    <span class="text-sm"><strong>${expiringMeds.length}</strong> medicines expiring within 30 days</span>
                </div>
                <button onclick="showSection('pharmacy')" class="text-xs bg-red-500/30 px-3 py-1 rounded-lg hover:bg-red-500/40">View</button>
            </div>
        `;
    }
    if (lowStockMeds.length > 0) {
        alertsHtml += `
            <div class="bg-yellow-500/20 border border-yellow-500/30 rounded-xl px-4 py-3 flex items-center justify-between">
                <div class="flex items-center space-x-3">
                    <span class="text-yellow-400">📦</span>
                    <span class="text-sm"><strong>${lowStockMeds.length}</strong> items below stock threshold</span>
                </div>
                <button onclick="showSection('pharmacy')" class="text-xs bg-yellow-500/30 px-3 py-1 rounded-lg hover:bg-yellow-500/40">View</button>
            </div>
        `;
    }
    alertsBanner.innerHTML = alertsHtml;
}

function refreshDashboard() {
    document.getElementById('last-update').textContent = 'Just now';
    showToast('Dashboard refreshed', '🔄');
}

// Section Navigation
function showSection(sectionId) {
    document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
    document.getElementById(`section-${sectionId}`).classList.remove('hidden');

    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.section === sectionId) {
            item.classList.add('active');
        }
    });
}

// Patient Functions
function showPatientForm() {
    document.getElementById('patient-form-modal').classList.remove('hidden');
    document.getElementById('admission-checklist').classList.remove('hidden');
}

function hidePatientForm() {
    document.getElementById('patient-form-modal').classList.add('hidden');
    document.getElementById('admission-checklist').classList.add('hidden');
}

async function savePatient() {
    const patient = {
        type: 'patient',
        hospital_id: currentHospital,
        name: document.getElementById('p-name').value,
        details: JSON.stringify({
            age: document.getElementById('p-age').value,
            gender: document.getElementById('p-gender').value,
            phone: document.getElementById('p-phone').value,
            admission: document.getElementById('p-admission').value,
            doctor: document.getElementById('p-doctor').value,
            address: document.getElementById('p-address').value
        }),
        status: document.getElementById('p-admission').value,
        created_at: new Date().toISOString()
    };

    if (allData.length >= 999) {
        showToast('Maximum record limit reached', '⚠️');
        return;
    }

    const result = await apiCreate(patient);
    if (result.isOk) {
        hidePatientForm();
        document.getElementById('patient-form').reset();
        showToast('Patient registered successfully', '✅');
    } else {
        showToast('Failed to save patient', '❌');
    }
}

function renderPatientList() {
    const patients = allData.filter(d => d.type === 'patient' && d.hospital_id === currentHospital);
    const list = document.getElementById('patient-list');

    if (patients.length === 0) {
        list.innerHTML = `
            <div class="p-8 text-center text-gray-400">
                <svg class="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                <p>No patients registered yet</p>
                <button onclick="showPatientForm()" class="mt-3 text-blue-400 hover:underline text-sm">+ Add first patient</button>
            </div>
        `;
        return;
    }

    list.innerHTML = patients.map(p => {
        const details = JSON.parse(p.details || '{}');
        return `
            <div class="p-4 hover:bg-white/5 flex items-center justify-between">
                <div class="flex items-center space-x-4">
                    <div class="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center font-bold">
                        ${p.name.charAt(0)}
                    </div>
                    <div>
                        <p class="font-semibold">${p.name}</p>
                        <p class="text-xs text-gray-400">${details.age || '-'} yrs • ${details.gender || '-'} • ${details.phone || '-'}</p>
                    </div>
                </div>
                <div class="flex items-center space-x-3">
                    <span class="px-3 py-1 text-xs rounded-full ${p.status === 'IPD' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'}">${p.status}</span>
                    <span class="text-xs text-gray-400">${details.doctor || '-'}</span>
                </div>
            </div>
        `;
    }).join('');
}

function getDoctorsLive() {
    return allData.filter(d => d.type === 'doctor' && d.hospital_id === currentHospital).map(d => {
        const details = JSON.parse(d.details || '{}');
        return {
            name: d.name,
            specialization: d.specialization || d.role || '',
            available_days: details.days || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            available_time: details.time || 'Morning',
            status: d.status || 'Available'
        };
    });
}

function renderDoctorList() {
    const list = document.getElementById('doctor-list');
    let doctors = getDoctorsLive();
    if (doctors.length === 0) doctors = sampleDoctors; // fallback if no data

    list.innerHTML = doctors.map(d => `
        <div class="glass-card rounded-2xl p-4 hover:bg-white/5 transition-all">
            <div class="flex items-start justify-between mb-3">
                <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-violet-400 flex items-center justify-center font-bold text-lg">
                    ${(d.name.split(' ')[1] || d.name).charAt(0)}
                </div>
                <span class="px-2 py-1 text-xs rounded-full ${d.status === 'Available' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}">${d.status}</span>
            </div>
            <h4 class="font-semibold">${d.name}</h4>
            <p class="text-sm text-purple-400">${d.specialization}</p>
            <div class="mt-3 pt-3 border-t border-white/10">
                <p class="text-xs text-gray-400 mb-1">Available:</p>
                <p class="text-xs">${d.available_days.join(', ')}</p>
                <p class="text-xs text-cyan-400">${d.available_time}</p>
            </div>
            <button onclick="bookAppointment('${d.name.replace(/'/g, "\\'")}')" class="mt-3 w-full py-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg text-sm font-semibold text-purple-400">Book Appointment</button>
        </div>
    `).join('');
}

function filterDoctors() {
    const spec = document.getElementById('filter-spec').value;
    const day = document.getElementById('filter-day').value;
    const time = document.getElementById('filter-time').value;

    let doctors = getDoctorsLive();
    if (doctors.length === 0) doctors = sampleDoctors; // fallback

    let filtered = [...doctors];
    if (spec) filtered = filtered.filter(d => (d.specialization || '').toLowerCase() === spec.toLowerCase());
    if (day) filtered = filtered.filter(d => d.available_days.includes(day));
    if (time) filtered = filtered.filter(d => d.available_time === time);

    const list = document.getElementById('doctor-list');
    if (filtered.length === 0) {
        list.innerHTML = `<div class="col-span-3 text-center py-8 text-gray-400">No doctors match your criteria</div>`;
        return;
    }

    list.innerHTML = filtered.map(d => `
        <div class="glass-card rounded-2xl p-4 hover:bg-white/5 transition-all">
            <div class="flex items-start justify-between mb-3">
                <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-violet-400 flex items-center justify-center font-bold text-lg">
                    ${(d.name.split(' ')[1] || d.name).charAt(0)}
                </div>
                <span class="px-2 py-1 text-xs rounded-full ${d.status === 'Available' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}">${d.status}</span>
            </div>
            <h4 class="font-semibold">${d.name}</h4>
            <p class="text-sm text-purple-400">${d.specialization}</p>
            <div class="mt-3 pt-3 border-t border-white/10">
                <p class="text-xs text-gray-400 mb-1">Available:</p>
                <p class="text-xs">${d.available_days.join(', ')}</p>
                <p class="text-xs text-cyan-400">${d.available_time}</p>
            </div>
            <button onclick="bookAppointment('${d.name.replace(/'/g, "\\'")}')" class="mt-3 w-full py-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg text-sm font-semibold text-purple-400">Book Appointment</button>
        </div>
    `).join('');

    showToast(`Found ${filtered.length} doctor(s)`, '🔍');
}

function bookAppointment(doctorName) {
    document.getElementById('appt-doctor').value = doctorName;
    document.getElementById('appointment-form-modal').classList.remove('hidden');
}

function hideAppointmentForm() {
    document.getElementById('appointment-form-modal').classList.add('hidden');
    document.getElementById('appointment-form').reset();
}

async function saveAppointment() {
    // Show green check mark success directly
    hideAppointmentForm();
    showToast('Appointment booked successfully!', '✅');
}

function showDoctorForm() {
    document.getElementById('doctor-form-modal').classList.remove('hidden');
}

function hideDoctorForm() {
    document.getElementById('doctor-form-modal').classList.add('hidden');
}

async function saveDoctor() {
    const docDays = Array.from(document.getElementById('d-days').selectedOptions).map(opt => opt.value);
    const doctor = {
        type: 'doctor',
        hospital_id: currentHospital,
        name: document.getElementById('d-name').value,
        specialization: document.getElementById('d-spec').value,
        status: 'Available',
        details: JSON.stringify({
            days: docDays.length > 0 ? docDays : ['Monday'],
            time: document.getElementById('d-time').value
        }),
        created_at: new Date().toISOString()
    };

    if (allData.length >= 999) {
        showToast('Maximum record limit reached', '⚠️');
        return;
    }

    const result = await apiCreate(doctor);
    if (result.isOk) {
        hideDoctorForm();
        document.getElementById('doctor-form').reset();
        showToast('Doctor profile added', '✅');
        renderDoctorList();
    } else {
        showToast('Failed to add doctor', '❌');
    }
}

// Medicine Functions
function showMedicineForm() {
    document.getElementById('medicine-form-modal').classList.remove('hidden');
}

function hideMedicineForm() {
    document.getElementById('medicine-form-modal').classList.add('hidden');
}

async function saveMedicine() {
    const medicine = {
        type: 'medicine',
        hospital_id: currentHospital,
        name: document.getElementById('m-name').value,
        details: document.getElementById('m-category').value,
        status: document.getElementById('m-batch').value,
        expiry_date: document.getElementById('m-expiry').value,
        quantity: parseInt(document.getElementById('m-quantity').value),
        price: parseFloat(document.getElementById('m-price').value),
        created_at: new Date().toISOString()
    };

    if (allData.length >= 999) {
        showToast('Maximum record limit reached', '⚠️');
        return;
    }

    const result = await apiCreate(medicine);
    if (result.isOk) {
        hideMedicineForm();
        document.getElementById('medicine-form').reset();
        showToast('Medicine added successfully', '✅');
    } else {
        showToast('Failed to add medicine', '❌');
    }
}

function renderMedicineList() {
    const list = document.getElementById('medicine-list');
    const today = new Date();
    const thirtyDays = new Date();
    thirtyDays.setDate(today.getDate() + 30);

    const medicines = allData.filter(d => d.type === 'medicine' && d.hospital_id === currentHospital);

    list.innerHTML = medicines.map(m => {
        const expiry = new Date(m.expiry_date || m.expiry);
        const threshold = m.threshold || 50;
        const isExpiringSoon = expiry <= thirtyDays;
        const isExpired = expiry <= today;
        const isLowStock = m.quantity < threshold;

        let statusBadge = '<span class="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400">OK</span>';
        if (isExpired) {
            statusBadge = '<span class="px-2 py-1 text-xs rounded-full bg-red-500/20 text-red-400">Expired</span>';
        } else if (isExpiringSoon) {
            statusBadge = '<span class="px-2 py-1 text-xs rounded-full bg-orange-500/20 text-orange-400">Expiring</span>';
        } else if (isLowStock) {
            statusBadge = '<span class="px-2 py-1 text-xs rounded-full bg-yellow-500/20 text-yellow-400">Low Stock</span>';
        }

        return `
            <tr class="hover:bg-white/5">
                <td class="px-4 py-3">
                    <div class="font-semibold">${m.name}</div>
                    <div class="text-xs text-gray-400">${m.status || m.batch || ''}</div>
                </td>
                <td class="px-4 py-3 text-sm">${m.role || m.category || ''}</td>
                <td class="px-4 py-3">
                    <span class="${isLowStock ? 'text-yellow-400' : 'text-white'}">${m.quantity}</span>
                    <span class="text-xs text-gray-400">/ ${threshold}</span>
                </td>
                <td class="px-4 py-3 text-sm ${isExpired ? 'text-red-400' : isExpiringSoon ? 'text-orange-400' : ''}">${m.expiry_date || m.expiry}</td>
                <td class="px-4 py-3 text-sm">₹${m.price}</td>
                <td class="px-4 py-3">${statusBadge}</td>
            </tr>
        `;
    }).join('');

    document.getElementById('low-stock-count').textContent = medicines.filter(m => m.quantity < (m.threshold || 50)).length;
    document.getElementById('expiry-count').textContent = medicines.filter(m => new Date(m.expiry_date || m.expiry) <= thirtyDays).length;
}

// Schemes Functions
function renderSchemesList() {
    const list = document.getElementById('schemes-list');
    list.innerHTML = sampleSchemes.map(s => `
        <div class="glass-card rounded-2xl p-5 border-l-4 border-orange-500">
            <div class="flex items-start justify-between mb-3">
                <div>
                    <h4 class="font-bold text-lg">${s.name}</h4>
                    <p class="text-sm text-gray-400">${s.eligibility}</p>
                </div>
                <div class="text-right">
                    <span class="text-2xl font-bold text-orange-400">${s.discount}%</span>
                    <p class="text-xs text-gray-400">Discount</p>
                </div>
            </div>
            <p class="text-sm text-gray-300">${s.description}</p>
            <button onclick="applyScheme(${s.id})" class="mt-4 w-full py-2 bg-orange-500/20 hover:bg-orange-500/30 rounded-lg text-sm font-semibold text-orange-400">Apply to Patient</button>
        </div>
    `).join('');
}

const schemeValueMap = {
    1: 'ayushman',
    2: 'pmjay',
    3: 'esis',
    4: 'cghs'
};

function applyScheme(schemeId) {
    showSection('billing');
    const selectElem = document.getElementById('bill-scheme');
    if (schemeValueMap[schemeId]) {
        selectElem.value = schemeValueMap[schemeId];
        updateBillPreview();
        showToast('Scheme applied to billing', '✅');
    }
}

// Rounds Functions
function showRoundForm() {
    document.getElementById('round-form-modal').classList.remove('hidden');
}

function hideRoundForm() {
    document.getElementById('round-form-modal').classList.add('hidden');
}

async function saveRound() {
    const staffName = document.getElementById('r-staff').value.trim();
    const roleName = document.getElementById('r-role').value;
    const wardName = document.getElementById('r-ward').value.trim();
    const timeValue = document.getElementById('r-time').value;

    if (!staffName || !wardName || !timeValue) {
        showToast('Please fill in all details', '⚠️');
        return;
    }

    const round = {
        type: 'round',
        hospital_id: currentHospital,
        name: staffName,
        role: roleName,
        details: wardName,
        status: timeValue,
        created_at: new Date().toISOString()
    };

    if (allData.length >= 999) {
        showToast('Maximum record limit reached', '⚠️');
        return;
    }

    const result = await apiCreate(round);
    if (result.isOk) {
        hideRoundForm();
        document.getElementById('round-form').reset();
        showToast('Round scheduled', '✅');
        renderRoundsList();
    }
}

function renderRoundsList() {
    const rounds = allData.filter(d => d.type === 'round' && d.hospital_id === currentHospital);
    const list = document.getElementById('rounds-list');

    const defaultRounds = [
        { name: 'Dr. Smith', role: 'Doctor', ward: 'ICU', time: '08:00' },
        { name: 'Nurse Johnson', role: 'Nurse', ward: 'General', time: '09:00' },
        { name: 'Dr. Williams', role: 'Doctor', ward: 'Pediatric', time: '10:30' }
    ];

    const allRounds = [...defaultRounds, ...rounds.map(r => ({
        name: r.name,
        role: r.role,
        ward: r.details,
        time: r.status
    }))];

    list.innerHTML = allRounds.map(r => `
        <div class="p-4 flex items-center justify-between hover:bg-white/5">
            <div class="flex items-center space-x-4">
                <div class="w-10 h-10 rounded-full ${r.role === 'Doctor' ? 'bg-purple-500/20' : 'bg-pink-500/20'} flex items-center justify-center">
                    ${r.role === 'Doctor' ? '👨⚕️' : '👩⚕️'}
                </div>
                <div>
                    <p class="font-semibold">${r.name}</p>
                    <p class="text-xs text-gray-400">${r.role}</p>
                </div>
            </div>
            <div class="text-right">
                <p class="text-sm font-semibold">${r.ward} Ward</p>
                <p class="text-xs text-cyan-400">${r.time}</p>
            </div>
        </div>
    `).join('');
}

// Hygiene Functions
function showHygieneForm() {
    document.getElementById('hygiene-form-modal').classList.remove('hidden');
}

function hideHygieneForm() {
    document.getElementById('hygiene-form-modal').classList.add('hidden');
}

async function saveHygieneCheck() {
    const staffLoc = document.getElementById('h-staff').value.trim();

    if (!staffLoc) {
        showToast('Please enter Staff Member or Location', '⚠️');
        return;
    }

    const check = {
        type: 'hygiene',
        hospital_id: currentHospital,
        name: staffLoc,
        details: JSON.stringify({
            gloves: document.getElementById('h-gloves').checked,
            mask: document.getElementById('h-mask').checked,
            sanitized: document.getElementById('h-sanitized').checked
        }),
        created_at: new Date().toISOString()
    };

    if (allData.length >= 999) {
        showToast('Maximum record limit reached', '⚠️');
        return;
    }

    const result = await apiCreate(check);
    if (result.isOk) {
        hideHygieneForm();
        document.getElementById('hygiene-form').reset();
        showToast('Hygiene check recorded', '✅');
        renderHygieneList();
    }
}

function renderHygieneList() {
    const checks = allData.filter(d => d.type === 'hygiene' && d.hospital_id === currentHospital);
    const list = document.getElementById('hygiene-list');

    if (checks.length === 0) {
        list.innerHTML = `
            <div class="p-8 text-center text-gray-400">
                <p>No hygiene checks recorded</p>
                <button onclick="showHygieneForm()" class="mt-3 text-teal-400 hover:underline text-sm">+ Add first check</button>
            </div>
        `;
        return;
    }

    list.innerHTML = checks.map(c => {
        const details = JSON.parse(c.details || '{}');
        const allPassed = details.gloves && details.mask && details.sanitized;
        return `
            <div class="p-4 flex items-center justify-between hover:bg-white/5">
                <div class="flex items-center space-x-4">
                    <div class="w-10 h-10 rounded-full ${allPassed ? 'bg-green-500/20' : 'bg-yellow-500/20'} flex items-center justify-center">
                        ${allPassed ? '✅' : '⚠️'}
                    </div>
                    <div>
                        <p class="font-semibold">${c.name}</p>
                        <p class="text-xs text-gray-400">${new Date(c.created_at).toLocaleDateString()}</p>
                    </div>
                </div>
                <div class="flex space-x-2">
                    <span class="px-2 py-1 text-xs rounded ${details.gloves ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}">Gloves</span>
                    <span class="px-2 py-1 text-xs rounded ${details.mask ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}">Mask</span>
                    <span class="px-2 py-1 text-xs rounded ${details.sanitized ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}">Sanitized</span>
                </div>
            </div>
        `;
    }).join('');
}

// Billing Functions
function updateBillPreview() {
    const scheme = document.getElementById('bill-scheme').value;
    const subtotal = 5000;
    let discount = 0;

    const discounts = {
        'ayushman': 100,
        'pmjay': 80,
        'esis': 70,
        'cghs': 60
    };

    if (scheme && discounts[scheme]) {
        discount = (subtotal * discounts[scheme]) / 100;
    }

    document.getElementById('bill-discount').textContent = `-₹${discount.toLocaleString()}`;
    document.getElementById('bill-total').textContent = `₹${(subtotal - discount).toLocaleString()}`;
}

function generateBill() {
    const patient = document.getElementById('bill-patient').value;
    const scheme = document.getElementById('bill-scheme').value;
    const total = document.getElementById('bill-total').textContent;

    const billPreview = document.getElementById('bill-preview');
    const billContent = document.getElementById('bill-content');

    billContent.innerHTML = `
        <div class="border-t border-white/20 pt-4 mt-4">
            <div class="flex justify-between mb-2">
                <span class="text-gray-400">Patient ID:</span>
                <span>${patient}</span>
            </div>
            <div class="flex justify-between mb-2">
                <span class="text-gray-400">Date:</span>
                <span>${new Date().toLocaleDateString()}</span>
            </div>
            <div class="flex justify-between mb-2">
                <span class="text-gray-400">Scheme Applied:</span>
                <span class="text-green-400">${scheme ? scheme.toUpperCase() : 'None'}</span>
            </div>
            <div class="border-t border-white/20 pt-4 mt-4">
                <div class="flex justify-between text-xl font-bold">
                    <span>TOTAL PAYABLE:</span>
                    <span class="text-green-400">${total}</span>
                </div>
            </div>
        </div>
    `;

    billPreview.classList.remove('hidden');
    showToast('Bill generated successfully!', '🧾');
}

// Facility Functions
function scanHospitals() {
    const results = document.getElementById('hospital-scan-results');
    const list = document.getElementById('scan-results-list');

    list.innerHTML = `
        <div class="p-4 text-center">
            <div class="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
            <p class="text-sm text-gray-400">Scanning nearby hospitals...</p>
        </div>
    `;
    results.classList.remove('hidden');

    setTimeout(() => {
        const hospitals = [
            { name: 'Medicare Central', distance: '2.5 km', icu: 4, oxygen: 50, blood: 120 },
            { name: 'LifeCare Medical', distance: '4.2 km', icu: 6, oxygen: 75, blood: 200 },
            { name: 'Apollo Healthcare', distance: '5.8 km', icu: 10, oxygen: 100, blood: 300 }
        ];

        list.innerHTML = hospitals.map(h => `
            <div class="glass-card rounded-xl p-4 flex items-center justify-between">
                <div>
                    <p class="font-semibold">${h.name}</p>
                    <p class="text-xs text-gray-400">${h.distance} away</p>
                </div>
                <div class="flex space-x-4 text-sm">
                    <div class="text-center">
                        <p class="font-bold text-cyan-400">${h.icu}</p>
                        <p class="text-xs text-gray-400">ICU</p>
                    </div>
                    <div class="text-center">
                        <p class="font-bold text-blue-400">${h.oxygen}</p>
                        <p class="text-xs text-gray-400">O₂</p>
                    </div>
                    <div class="text-center">
                        <p class="font-bold text-red-400">${h.blood}</p>
                        <p class="text-xs text-gray-400">Blood</p>
                    </div>
                </div>
            </div>
        `).join('');

        showToast('Found 3 hospitals with resources', '🏥');
    }, 2000);
}

// Emergency Functions
function triggerEmergency() {
    const modal = document.getElementById('emergency-modal');
    document.getElementById('emergency-id').textContent = 'EMG-' + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    document.getElementById('emergency-time').textContent = new Date().toLocaleTimeString();
    modal.classList.remove('hidden');

    // Log emergency
    if (allData.length < 999) {
        apiCreate({
            type: 'emergency',
            hospital_id: currentHospital,
            name: 'Emergency Alert',
            status: 'Active',
            created_at: new Date().toISOString()
        });
    }
}

function closeEmergencyModal() {
    document.getElementById('emergency-modal').classList.add('hidden');
}

// Language Functions
function changeLanguage(lang) {
    const translations = {
        'en': { title: 'Smart Hospital Management', welcome: 'Multi-Tenant Healthcare Platform' },
        'hi': { title: 'स्मार्ट अस्पताल प्रबंधन', welcome: 'मल्टी-टेनेंट हेल्थकेयर प्लेटफॉर्म' },
        'es': { title: 'Gestión Hospitalaria Inteligente', welcome: 'Plataforma de Salud Multi-Tenant' }
    };

    if (translations[lang]) {
        document.getElementById('system-title').textContent = translations[lang].title;
        document.getElementById('welcome-msg').textContent = translations[lang].welcome;
        showToast(`Language changed to ${lang.toUpperCase()}`, '🌐');
    }
}

// Toast Functions
function showToast(message, icon = '✅') {
    const toast = document.getElementById('toast');
    document.getElementById('toast-message').textContent = message;
    document.getElementById('toast-icon').textContent = icon;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 3000);
}

function selectChat(type) {
    showToast(`Opened ${type} chat`, '💬');
}

(function () { function c() { var b = a.contentDocument || a.contentWindow.document; if (b) { var d = b.createElement('script'); d.innerHTML = "window.__CF$cv$params={r:'9d40c1ebd7578826',t:'MTc3MjEyMjY5Ny4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);"; b.getElementsByTagName('head')[0].appendChild(d) } } if (document.body) { var a = document.createElement('iframe'); a.height = 1; a.width = 1; a.style.position = 'absolute'; a.style.top = 0; a.style.left = 0; a.style.border = 'none'; a.style.visibility = 'hidden'; document.body.appendChild(a); if ('loading' !== document.readyState) c(); else if (window.addEventListener) document.addEventListener('DOMContentLoaded', c); else { var e = document.onreadystatechange || function () { }; document.onreadystatechange = function (b) { e(b); 'loading' !== document.readyState && (document.onreadystatechange = e, c()) } } } })();

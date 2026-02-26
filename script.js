// Initialize Icons
lucide.createIcons();

// --- Data Models ---
const hospitalData = {
    doctors: [
        { id: 1, name: "Dr. Sarah Jenkins", specialty: "Cardiologist", experience: "15 Years", education: "MD, FACC", successRate: "98%", rating: "4.9/5", contact: "sarah.j@medicare.com", image: "https://i.pravatar.cc/150?img=5" },
        { id: 2, name: "Dr. Michael Chen", specialty: "Neurologist", experience: "12 Years", education: "MD, PhD", successRate: "95%", rating: "4.8/5", contact: "m.chen@medicare.com", image: "https://i.pravatar.cc/150?img=11" },
        { id: 3, name: "Dr. Emily Rodriguez", specialty: "General Surgeon", experience: "8 Years", education: "MD, FACS", successRate: "99%", rating: "4.9/5", contact: "e.rodriguez@medicare.com", image: "https://i.pravatar.cc/150?img=9" }
    ],
    bloodBank: {
        inventory: {
            "A+": { units: 45, status: "Available" },
            "A-": { units: 12, status: "Low" },
            "B+": { units: 30, status: "Available" },
            "B-": { units: 5, status: "Critical" },
            "AB+": { units: 15, status: "Available" },
            "AB-": { units: 2, status: "Critical" },
            "O+": { units: 50, status: "Available" },
            "O-": { units: 8, status: "Low" }
        },
        donors: [
            { name: "John Doe", group: "O-", lastDonated: "2023-10-15" },
            { name: "Jane Smith", group: "A+", lastDonated: "2023-11-01" }
        ],
        interested: [
            { name: "Alice Johnson", group: "B+", signups: "2023-11-10" }
        ]
    },
    icu: {
        totalBeds: 50,
        occupiedBeds: 42,
        get availableBeds() { return this.totalBeds - this.occupiedBeds; },
        dischargeTimings: ["10:00 AM", "04:00 PM"]
    },
    wards: {
        totalBeds: 200,
        occupiedBeds: 150,
        doctorVisit: "08:00 AM - 11:00 AM"
    },
    ventilators: {
        total: 30,
        occupied: 12
    },
    emergency: {
        capacity: 25,
        currentPatients: 10,
        oxygenTanks: 150,
        surgicalKits: "Fully Stocked"
    },
    ambulances: {
        total: 15,
        available: 6,
        avgResponseTime: "8 mins",
        drivers: [
            { name: "Robert Dave", phone: "+1 (555) 019-2831" },
            { name: "Steve Miller", phone: "+1 (555) 018-4422" }
        ]
    }
};

// --- Dashboard Categories Configuration ---
const categories = [
    { id: 'doctors', title: "Doctors Info", icon: "stethoscope", color: "text-blue-500", bg: "bg-blue-50", desc: "View profiles, experience, and book appointments." },
    { id: 'bloodBank', title: "Blood Bank", icon: "droplet", color: "text-red-500", bg: "bg-red-50", desc: "Check real-time blood group availability and donors." },
    { id: 'icu', title: "ICU Availability", icon: "activity", color: "text-rose-500", bg: "bg-rose-50", desc: `${hospitalData.icu.availableBeds} beds currently available.` },
    { id: 'wards', title: "General Wards", icon: "bed", color: "text-emerald-500", bg: "bg-emerald-50", desc: `${hospitalData.wards.totalBeds - hospitalData.wards.occupiedBeds} beds available. Visits 8 AM - 11 AM.` },
    { id: 'ventilators', title: "Ventilators", icon: "wind", color: "text-cyan-500", bg: "bg-cyan-50", desc: `${hospitalData.ventilators.total - hospitalData.ventilators.occupied} out of ${hospitalData.ventilators.total} available.` },
    { id: 'pharmacy', title: "Medical Store", icon: "pill", color: "text-indigo-500", bg: "bg-indigo-50", desc: "Search medicines, check stock, and view purchases." },
    { id: 'ambulances', title: "Ambulances", icon: "car", color: "text-amber-500", bg: "bg-amber-50", desc: `${hospitalData.ambulances.available} vehicles ready. Avg response: 8 mins.` },
    { id: 'appointments', title: "Appointments", icon: "calendar", color: "text-violet-500", bg: "bg-violet-50", desc: "Book consultation slots and manage schedules." },
    { id: 'emergency', title: "Emergency Ward", icon: "alert-triangle", color: "text-orange-500", bg: "bg-orange-50", desc: `Capacity: ${hospitalData.emergency.currentPatients}/${hospitalData.emergency.capacity}. Oxygen status: Optimal.` }
];

// --- Render Functions ---

function renderDashboard() {
    const grid = document.getElementById('dashboard-grid');
    if (!grid) return;

    grid.innerHTML = categories.map((cat, index) => `
        <div class="glass-card category-card rounded-2xl p-6 cursor-pointer hover:border-medical-300 animate-fade-in-up" 
             style="animation-delay: ${index * 0.05}s"
             onclick="openModal('${cat.id}')">
            <div class="w-12 h-12 rounded-full ${cat.bg} ${cat.color} flex items-center justify-center mb-4">
                <i data-lucide="${cat.icon}" class="w-6 h-6"></i>
            </div>
            <h3 class="text-xl font-semibold text-slate-800 mb-2">${cat.title}</h3>
            <p class="text-slate-500 text-sm leading-relaxed">${cat.desc}</p>
            <div class="mt-4 flex items-center text-medical-600 text-sm font-medium group-hover:underline">
                View Details <i data-lucide="chevron-right" class="w-4 h-4 ml-1"></i>
            </div>
        </div>
    `).join('');

    lucide.createIcons();
}

// --- Modal System ---

function openModal(categoryId) {
    const container = document.getElementById('modal-container');
    let category = categories.find(c => c.id === categoryId);

    if (!category) {
        if (categoryId === 'staffLogin') {
            category = { id: 'staffLogin', title: "Staff Authentication", icon: "lock", color: "text-slate-600", bg: "bg-slate-100", desc: "" };
        } else if (categoryId === 'search') {
            category = { id: 'search', title: "Search Results", icon: "search", color: "text-medical-600", bg: "bg-medical-50", desc: "" };
        } else {
            return;
        }
    }

    const currentHospitalContext = document.getElementById('hero-hospital') ? document.getElementById('hero-hospital').value : 'City General Hospital';
    const displayHospitalName = currentHospitalContext || "City General Hospital";

    const isStaffLogin = categoryId === 'staffLogin';
    const backdropStyle = isStaffLogin ? 'background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(16px);' : 'background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(8px);';
    const modalBgClass = isStaffLogin ? 'bg-slate-900 border border-slate-800' : 'bg-white/95';
    const headerBgClass = isStaffLogin ? 'bg-slate-900/80 border-slate-800' : 'bg-white/50 border-slate-200';
    const titleColor = isStaffLogin ? 'text-white' : 'text-slate-800';
    const subtitleColor = isStaffLogin ? 'text-slate-400' : 'text-slate-500';
    const closeBtnClass = isStaffLogin ? 'hover:bg-slate-800 text-slate-400 hover:text-red-400' : 'hover:bg-slate-100 text-slate-500 hover:text-red-500';
    const bodyBgClass = isStaffLogin ? 'bg-slate-900' : '';

    const modalHTML = `
        <div id="active-modal" class="fixed inset-0 z-[100] flex items-center justify-center modal-backdrop p-4 sm:p-6" style="${backdropStyle}">
            <div class="glass-card modal-content w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden flex flex-col ${modalBgClass} relative shadow-2xl">
                <!-- Modal Header -->
                <div class="px-6 py-4 border-b flex justify-between items-center sticky top-0 z-10 ${headerBgClass}">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full ${category.bg} ${category.color} flex items-center justify-center">
                            <i data-lucide="${category.icon}" class="w-5 h-5"></i>
                        </div>
                        <div>
                            <h2 class="text-2xl font-bold ${titleColor}">${category.title}</h2>
                            <p class="text-xs font-medium tracking-wide ${subtitleColor}"><i data-lucide="building-2" class="w-3 h-3 inline-block"></i> ${categoryId === 'search' || categoryId === 'staffLogin' ? 'System Network' : displayHospitalName}</p>
                        </div>
                    </div>
                    <button onclick="closeModal()" class="w-10 h-10 flex items-center justify-center rounded-full transition-colors ${closeBtnClass}">
                        <i data-lucide="x" class="w-6 h-6"></i>
                    </button>
                </div>
                
                <!-- Modal Body -->
                <div class="p-6 overflow-y-auto flex-1 custom-scrollbar ${bodyBgClass}">
                    ${generateModalContent(categoryId, displayHospitalName)}
                </div>
            </div>
        </div>
    `;

    container.innerHTML = modalHTML;
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    lucide.createIcons();
}

function closeModal() {
    const modal = document.getElementById('active-modal');
    if (modal) {
        modal.classList.remove('modal-backdrop');
        modal.style.opacity = '0';
        setTimeout(() => {
            document.getElementById('modal-container').innerHTML = '';
            document.body.style.overflow = '';
        }, 300);
    }
}

// Close on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

// --- Content Generators ---

function generateModalContent(id, currentHospital) {
    // Generate slight variations in data based on hospital name hash (for appearance of separate hospitals)
    const hospitalGenRand = currentHospital ? currentHospital.length : 10;

    switch (id) {
        case 'doctors':
            return `
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    ${hospitalData.doctors.slice(0, hospitalData.doctors.length - (hospitalGenRand % 3)).map(doc => `
                        <div class="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex gap-5">
                            <img src="${doc.image}" alt="${doc.name}" class="w-20 h-20 rounded-xl object-cover shadow-sm">
                            <div class="flex-1">
                                <h4 class="text-lg font-bold text-slate-800">${doc.name}</h4>
                                <p class="text-medical-600 font-medium text-sm mb-2">${doc.specialty}</p>
                                <div class="grid grid-cols-2 gap-y-1 gap-x-4 text-xs text-slate-500 mb-3">
                                    <span class="flex items-center gap-1"><i data-lucide="award" class="w-3 h-3"></i> ${doc.experience}</span>
                                    <span class="flex items-center gap-1"><i data-lucide="book-open" class="w-3 h-3"></i> ${doc.education}</span>
                                    <span class="flex items-center gap-1"><i data-lucide="activity" class="w-3 h-3"></i> Success: ${doc.successRate}</span>
                                    <span class="flex items-center gap-1"><i data-lucide="star" class="w-3 h-3 text-yellow-500"></i> ${doc.rating}</span>
                                </div>
                                <button class="w-full py-2 bg-slate-50 hover:bg-medical-50 text-medical-600 rounded-lg text-sm font-medium transition-colors border border-slate-200 hover:border-medical-200" onclick="openModal('appointments')">
                                    Book Appointment
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;

        case 'bloodBank':
            return `
                <div class="space-y-8">
                    <div>
                        <h4 class="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2"><i data-lucide="activity" class="w-5 h-5 text-red-500"></i> Current Inventory</h4>
                        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            ${Object.entries(hospitalData.bloodBank.inventory).map(([group, data]) => `
                                <div class="bg-white border rounded-xl p-4 text-center ${data.status === 'Critical' ? 'border-red-200 bg-red-50/50' : 'border-slate-100'} shadow-sm">
                                    <div class="text-2xl font-bold text-slate-800">${group}</div>
                                    <div class="text-3xl font-light text-${data.status === 'Critical' ? 'red' : 'medical'}-500 my-1">${data.units} <span class="text-sm text-slate-400">units</span></div>
                                    <span class="inline-block px-2 py-1 rounded text-xs font-medium ${data.status === 'Critical' ? 'bg-red-100 text-red-700' : data.status === 'Low' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}">
                                        ${data.status}
                                    </span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div class="grid md:grid-cols-2 gap-6">
                        <div class="bg-white border border-slate-100 rounded-xl p-5 shadow-sm">
                            <h4 class="font-medium text-slate-800 mb-3 border-b pb-2">Recent Donors</h4>
                            <ul class="space-y-3">
                                ${hospitalData.bloodBank.donors.map(d => `
                                    <li class="flex justify-between items-center text-sm">
                                        <span class="font-medium text-slate-700">${d.name} <span class="text-red-500 ml-1">(${d.group})</span></span>
                                        <span class="text-slate-400">${d.lastDonated}</span>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                        <div class="bg-slate-50 border border-slate-100 rounded-xl p-5 shadow-inner text-center flex flex-col justify-center">
                            <i data-lucide="heart-handshake" class="w-12 h-12 text-red-400 mx-auto mb-3"></i>
                            <h4 class="font-semibold text-slate-800 mb-2">Be a Hero Today</h4>
                            <p class="text-sm text-slate-500 mb-4">Your single donation can save up to 3 lives. Register to donate blood.</p>
                            <button class="bg-red-500 text-white py-2 px-6 rounded-lg font-medium hover:bg-red-600 transition-colors shadow-sm shadow-red-500/30">
                                Register as Donor
                            </button>
                        </div>
                    </div>
                </div>
            `;

        case 'icu':
            const icuTotal = 50 + (hospitalGenRand % 5) * 10;
            const icuOccupy = 40 + (hospitalGenRand % 15);
            const icuAvail = icuTotal - icuOccupy;
            const icuPercent = (icuOccupy / icuTotal) * 100;

            return `
                <div class="grid md:grid-cols-2 gap-6">
                    <!-- Metrics side -->
                    <div class="space-y-6">
                        <div class="glass-card p-6 rounded-3xl relative overflow-hidden border border-slate-100">
                            <div class="absolute -right-10 -top-10 w-32 h-32 rounded-full ${icuAvail > 5 ? 'bg-emerald-100/50' : 'bg-red-100/50'} blur-xl"></div>
                            <h3 class="text-sm font-semibold text-slate-500 mb-2 tracking-wide uppercase">Live ICU Status</h3>
                            <div class="text-6xl font-bold bg-clip-text text-transparent ${icuAvail > 5 ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gradient-to-r from-red-500 to-rose-500'}">
                                ${icuAvail}
                            </div>
                            <p class="text-slate-400 mt-2">out of ${icuTotal} total beds</p>
                            
                            <!-- Progress Bar -->
                            <div class="mt-6">
                                <div class="w-full bg-slate-100 rounded-full h-3">
                                <div class="${icuPercent > 90 ? 'bg-red-500' : 'bg-medical-500'} h-3 rounded-full transition-all duration-1000" style="width: ${icuPercent}%"></div>
                                </div>
                                <div class="flex justify-between mt-2 text-xs font-medium text-slate-500">
                                <span>Occupied: ${icuOccupy}</span>
                                <span>Occupancy: ${icuPercent.toFixed(0)}%</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-4 items-start">
                            <i data-lucide="clock" class="w-5 h-5 text-amber-500 mt-0.5 shrink-0"></i>
                            <div>
                                <h5 class="font-semibold text-amber-800 mb-1">Standard Discharge Timings</h5>
                                <p class="text-amber-700/80 text-sm">Bed availability usually updates around <strong>${hospitalData.icu.dischargeTimings.join(' and ')}</strong>.</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Emergency Alert -->
                    <div class="md:w-1/3">
                        <div class="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center h-full flex flex-col justify-center relative overflow-hidden">
                            <div class="absolute -top-10 -right-10 w-32 h-32 bg-rose-200/50 rounded-full blur-2xl"></div>
                            <i data-lucide="bell-ring" class="w-12 h-12 text-rose-500 mx-auto mb-4 animate-pulse"></i>
                            <h4 class="text-lg font-bold text-rose-900 mb-2">Emergency Alert</h4>
                            <p class="text-rose-700/80 text-sm mb-6">Use this only for critical patients requiring immediate life support allocation in booked rooms.</p>
                            <button class="bg-rose-600 text-white w-full py-3 rounded-xl font-bold hover:bg-rose-700 transition-colors shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 relative z-10 hover:-translate-y-0.5 transform">
                                Trigger Alert 
                                <i data-lucide="zap" class="w-4 h-4"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;

        case 'appointments':
            return `
                <div class="max-w-2xl mx-auto">
                    <div class="mb-6 relative">
                        <div class="flex justify-between mb-2">
                            <span class="text-xs font-semibold text-medical-600 uppercase tracking-wider">Step 1 of 3</span>
                            <span class="text-xs text-slate-400">Select Doctor</span>
                        </div>
                        <div class="w-full bg-slate-100 rounded-full h-1.5">
                            <div class="bg-medical-500 h-1.5 rounded-full w-1/3"></div>
                        </div>
                    </div>
                    
                    <form class="space-y-5" id="appointment-form" onsubmit="event.preventDefault(); submitAppointment(event);">
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1.5">Select Department / Doctor</label>
                            <select id="doctor-id" class="w-full border border-slate-200 rounded-lg px-4 py-3 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:border-transparent" required>
                                <option value="">Choose a doctor...</option>
                                ${hospitalData.doctors.map(d => `<option value="${d._id || d.id}">${d.name} (${d.specialty})</option>`).join('')}
                            </select>
                        </div>
                        
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-slate-700 mb-1.5">Date</label>
                                <input type="date" id="appointment-date" class="w-full border border-slate-200 rounded-lg px-4 py-3 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-medical-500" required>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-slate-700 mb-1.5">Time Slot</label>
                                <select id="appointment-time" class="w-full border border-slate-200 rounded-lg px-4 py-3 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-medical-500" required>
                                    <option value="">Select a time</option>
                                    <option value="09:00 AM">09:00 AM</option>
                                    <option value="10:30 AM">10:30 AM</option>
                                    <option value="02:00 PM">02:00 PM</option>
                                    <option value="04:15 PM">04:15 PM</option>
                                </select>
                            </div>
                        </div>

                        <div class="bg-blue-50/50 border border-blue-100 rounded-xl p-4 mt-6">
                            <h5 class="text-sm font-semibold text-slate-800 mb-3 block">Payment Details (Online Confirmation)</h5>
                            <div class="bg-white rounded-lg border border-slate-200 p-3 mb-4 flex justify-between items-center bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNFMkU4RjAiLz48L3N2Zz4=')]">
                                <span class="text-slate-500 text-sm">Consultation Fee</span>
                                <span class="font-bold text-slate-800">₹150.00</span>
                            </div>
                            
                            <button type="submit" class="w-full bg-slate-800 hover:bg-slate-900 text-white font-medium py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2">
                                <i data-lucide="credit-card" class="w-4 h-4"></i> Complete Booking & Pay
                            </button>
                            <p class="text-center text-xs text-slate-400 mt-3 flex items-center justify-center gap-1">
                                <i data-lucide="shield-check" class="w-3 h-3 text-emerald-500"></i> Secure encrypted transaction
                            </p>
                        </div>
                    </form>
                </div>
            `;

        case 'pharmacy':
            return `
                <div class="space-y-6">
                    <div class="relative max-w-xl mx-auto">
                        <input type="text" placeholder="Search for medicines, surgical items..." class="w-full border border-slate-200 rounded-full pl-12 pr-4 py-3 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-medical-500 shadow-sm">
                        <i data-lucide="search" class="w-5 h-5 text-slate-400 absolute left-4 top-3.5"></i>
                        <button class="absolute right-2 top-2 bg-medical-500 text-white px-4 py-1.5 rounded-full text-sm font-medium">Search</button>
                    </div>
                    
                    <div class="grid md:grid-cols-2 gap-6 pt-4">
                        <div class="border border-slate-100 rounded-xl overflow-hidden shadow-sm">
                            <div class="bg-slate-50 px-4 py-3 border-b border-slate-100 font-semibold text-slate-700">Top Availability</div>
                            <div class="divide-y divide-slate-100">
                                <div class="px-4 py-3 flex justify-between items-center bg-white hover:bg-slate-50">
                                    <div>
                                        <div class="font-medium text-slate-800">Paracetamol 500mg</div>
                                        <div class="text-xs text-slate-400">Tablet • 100 strips</div>
                                    </div>
                                    <span class="text-emerald-500 text-sm font-medium">In Stock</span>
                                </div>
                                <div class="px-4 py-3 flex justify-between items-center bg-white hover:bg-slate-50">
                                    <div>
                                        <div class="font-medium text-slate-800">Amoxicillin</div>
                                        <div class="text-xs text-slate-400">Capsule • 20 strips</div>
                                    </div>
                                    <span class="text-amber-500 text-sm font-medium">Low Stock</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="border border-slate-100 rounded-xl overflow-hidden shadow-sm bg-white">
                            <div class="bg-indigo-50 px-4 py-3 border-b border-indigo-100 font-semibold text-indigo-900 flex justify-between items-center">
                                My Recent Purchases
                                <i data-lucide="shopping-bag" class="w-4 h-4 text-indigo-500"></i>
                            </div>
                            <div class="p-4 flex flex-col items-center justify-center text-center h-32">
                                <i data-lucide="receipt" class="w-8 h-8 text-slate-200 mb-2"></i>
                                <span class="text-sm text-slate-500">Please log in to view your purchase history</span>
                                <button class="mt-2 text-indigo-600 text-sm font-medium hover:underline">Sign In</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

        case 'ambulances':
            return `
                <div class="space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div class="bg-amber-50/50 border border-amber-100 rounded-xl p-5 text-center shadow-sm">
                            <i data-lucide="truck" class="w-8 h-8 text-amber-500 mx-auto mb-2"></i>
                            <h3 class="text-2xl font-bold text-slate-800">${hospitalData.ambulances.available}<span class="text-sm text-slate-500 font-normal"> / ${hospitalData.ambulances.total}</span></h3>
                            <p class="text-sm text-slate-500 font-medium">Available Units</p>
                        </div>
                        <div class="bg-emerald-50/50 border border-emerald-100 rounded-xl p-5 text-center shadow-sm md:col-span-2 flex flex-col justify-center items-center">
                            <h3 class="text-lg font-bold text-slate-800 mb-1">Nearest Hospital Status</h3>
                            <div class="flex items-center gap-2 text-emerald-600 bg-emerald-100 px-4 py-2 rounded-full font-medium">
                                <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                Active Response Time: ${hospitalData.ambulances.avgResponseTime}
                            </div>
                        </div>
                    </div>
                    
                    <h4 class="font-semibold text-slate-800 mt-6 pt-6 border-t border-slate-100">On-Duty Drivers</h4>
                    <div class="grid md:grid-cols-2 gap-4">
                        ${hospitalData.ambulances.drivers.map(driver => `
                            <div class="flex items-center justify-between p-4 border border-slate-100 rounded-xl bg-white shadow-sm hover:border-amber-200 transition-colors cursor-pointer group">
                                <div class="flex items-center gap-3">
                                    <div class="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                                        <i data-lucide="user" class="w-5 h-5"></i>
                                    </div>
                                    <div>
                                        <div class="font-medium text-slate-800">${driver.name}</div>
                                        <div class="text-xs text-slate-500">BLS Certified</div>
                                    </div>
                                </div>
                                <a href="tel:${driver.phone}" class="text-medical-600 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-medical-50 rounded-full">
                                    <i data-lucide="phone" class="w-5 h-5"></i>
                                </a>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;

        case 'wards':
            const wardTotal = 200 + (hospitalGenRand * 5);
            const wardOccupy = 100 + (hospitalGenRand * 6);
            return `
                <div class="space-y-6">
                    <div class="grid grid-cols-2 gap-4 text-center">
                        <div class="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                            <i data-lucide="bed" class="w-8 h-8 text-emerald-500 mx-auto mb-2"></i>
                            <h3 class="text-2xl font-bold text-emerald-700">${wardTotal - wardOccupy}</h3>
                            <p class="text-sm text-emerald-600">Available Beds</p>
                        </div>
                        <div class="p-4 bg-slate-50 rounded-xl border border-slate-200">
                            <i data-lucide="users" class="w-8 h-8 text-slate-500 mx-auto mb-2"></i>
                            <h3 class="text-2xl font-bold text-slate-700">${wardOccupy}</h3>
                            <p class="text-sm text-slate-600">Occupied Beds</p>
                        </div>
                    </div>
                    <div class="p-4 bg-white border border-slate-100 rounded-xl">
                        <h4 class="font-bold text-slate-800 mb-2">Ward Information (${currentHospital})</h4>
                        <p class="text-sm text-slate-600"><span class="font-medium text-slate-800">Doctor Visit Timings:</span> ${hospitalData.wards.doctorVisit}</p>
                        <p class="text-sm text-slate-600 mt-2">Only 2 visitors allowed per patient during visiting hours.</p>
                    </div>
                </div>
            `;

        case 'ventilators':
            const ventTotal = 30 + (hospitalGenRand % 4);
            const ventOccupy = 10 + (hospitalGenRand % 10);
            return `
                <div class="space-y-6">
                    <div class="grid grid-cols-2 gap-4 text-center">
                        <div class="p-4 bg-cyan-50 rounded-xl border border-cyan-100">
                            <i data-lucide="wind" class="w-8 h-8 text-cyan-500 mx-auto mb-2"></i>
                            <h3 class="text-2xl font-bold text-cyan-700">${ventTotal - ventOccupy}</h3>
                            <p class="text-sm text-cyan-600">Available Ventilators</p>
                        </div>
                        <div class="p-4 bg-slate-50 rounded-xl border border-slate-200">
                            <i data-lucide="activity" class="w-8 h-8 text-slate-500 mx-auto mb-2"></i>
                            <h3 class="text-2xl font-bold text-slate-700">${ventOccupy}</h3>
                            <p class="text-sm text-slate-600">In Use</p>
                        </div>
                    </div>
                </div>
            `;

        case 'emergency':
            const erTotal = 25 + (hospitalGenRand % 5);
            const erPats = 10 + (hospitalGenRand % 15);
            return `
                <div class="space-y-6">
                    <div class="bg-orange-50 border border-orange-200 rounded-2xl p-6 text-center">
                         <i data-lucide="alert-triangle" class="w-12 h-12 text-orange-500 mx-auto mb-2"></i>
                         <h3 class="text-2xl font-bold text-orange-700">Emergency Ward Status (${currentHospital})</h3>
                         <div class="mt-4 grid grid-cols-2 gap-4 max-w-sm mx-auto">
                             <div class="p-3 bg-white rounded-lg border border-orange-100">
                                 <div class="text-xl font-bold text-orange-600">${erPats} / ${erTotal}</div>
                                 <div class="text-xs text-orange-500">Current Patients</div>
                             </div>
                             <div class="p-3 bg-white rounded-lg border border-orange-100">
                                 <div class="text-xl font-bold text-emerald-600">${hospitalData.emergency.oxygenTanks}</div>
                                 <div class="text-xs text-emerald-500">Oxygen Tanks</div>
                             </div>
                         </div>
                    </div>
                </div>
            `;

        case 'staffLogin':
            return `
                <div class="max-w-md mx-auto space-y-6 text-center py-4">
                    <div class="w-20 h-20 rounded-full bg-slate-800 text-medical-400 flex items-center justify-center mx-auto mb-4 border border-slate-700 shadow-inner">
                        <i data-lucide="shield-check" class="w-10 h-10"></i>
                    </div>
                    <h3 class="text-2xl font-bold text-white">Authorized Access Only</h3>
                    <p class="text-slate-400 text-sm">Please enter your assigned hospital credentials to access the secure administration portal.</p>
                    <form onsubmit="handleStaffLogin(event)" class="space-y-4 text-left mt-6">
                        <div>
                            <label class="block text-sm font-medium text-slate-300 mb-1">Hospital ID / Username</label>
                            <input type="text" id="login-username" class="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-3 focus:ring-2 focus:ring-medical-500 focus:border-medical-500 outline-none transition-all" placeholder="Enter Hospital ID" required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-300 mb-1">Admin Password</label>
                            <input type="password" id="login-password" class="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-3 focus:ring-2 focus:ring-medical-500 focus:border-medical-500 outline-none transition-all" placeholder="Enter Password" required>
                        </div>
                        <button type="submit" class="w-full bg-gradient-to-r from-medical-500 to-medical-600 text-white py-3 rounded-xl hover:shadow-lg hover:shadow-medical-500/30 font-bold transition-all mt-4 transform hover:-translate-y-0.5">
                            Authenticate
                        </button>
                    </form>
                </div>
            `;

        case 'search':
            const searchResults = window.currentSearchResults || [];
            const diseaseInfo = window.currentSearchDisease;

            return `
                <div class="space-y-6">
                    <h3 class="text-xl font-bold text-slate-800 border-b pb-2">Search Results</h3>
                    
                    ${diseaseInfo ? `
                    <div class="bg-medical-50 border border-medical-100 rounded-xl p-5 mb-4 shadow-sm">
                        <div class="flex items-center gap-3 mb-2">
                            <div class="w-10 h-10 rounded-full bg-medical-200 text-medical-700 flex items-center justify-center">
                                <i data-lucide="${diseaseInfo.icon || 'activity'}" class="w-5 h-5"></i>
                            </div>
                            <h4 class="text-lg font-bold text-slate-800">${diseaseInfo.name}</h4>
                        </div>
                        <p class="text-sm text-slate-600 mb-2">${diseaseInfo.details}</p>
                        <p class="text-sm font-medium text-slate-700">Common Symptoms: <span class="text-slate-500 font-normal">${diseaseInfo.symptoms}</span></p>
                    </div>
                    ` : ''}

                    ${searchResults.length === 0 ? `<p class="text-slate-500 text-center py-8">No results found for your search.</p>` : `
                        <div class="grid gap-4">
                            ${searchResults.map(res => `
                                <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div>
                                        <h4 class="text-lg font-bold text-slate-800\">${res.doctor.name} <span class="text-sm text-medical-600 font-medium">(${res.doctor.specialty})</span></h4>
                                        <p class="text-sm text-slate-500 mt-1"><i data-lucide="building-2" class="w-4 h-4 inline-block align-text-bottom mr-1"></i> ${res.hospital}</p>
                                        <p class="text-xs text-slate-400 mt-1"><i data-lucide="map-pin" class="w-3 h-3 inline-block align-text-bottom mr-0.5"></i> ${res.address}</p>
                                        <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(res.hospital + ' ' + res.address)}" target="_blank" class="inline-flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700 font-medium mt-2">
                                            <i data-lucide="map" class="w-3 h-3"></i> View on Google Maps
                                        </a>
                                    </div>
                                    <button class="w-full sm:w-auto px-5 py-2.5 bg-slate-50 text-medical-600 rounded-lg text-sm font-medium border border-slate-200 hover:bg-medical-50 hover:border-medical-200 transition-colors" onclick="openModal('appointments')">
                                        Book Appointment
                                    </button>
                                </div>
                            `).join('')}
                        </div>
                    `}
                </div>
            `;

        default:
            return `
                <div class="text-center py-12">
                    <i data-lucide="cpu" class="w-16 h-16 text-slate-200 mx-auto mb-4"></i>
                    <h3 class="text-xl font-medium text-slate-800">Module Under Construction</h3>
                    <p class="text-slate-500 mt-2">The detailed view is being configured.</p>
                </div>
            `;
    }
}

// --- Search Handler ---

window.handleSearch = function (source) {
    let diseaseQuery, hospitalQuery;

    if (source === 'nav') {
        const val = document.getElementById('nav-search').value.toLowerCase();
        diseaseQuery = val;
        hospitalQuery = val; // General search acts as both
    } else {
        diseaseQuery = document.getElementById('hero-disease').value.toLowerCase();
        hospitalQuery = document.getElementById('hero-hospital').value.toLowerCase();
    }

    // If empty queries, do nothing
    if (!diseaseQuery && !hospitalQuery) return;

    // Simulate multiple hospitals existing in the network with their locations
    const allHospitals = [
        { name: "Apollo Hospitals", specialties: ["cardiologist", "neurologist", "general surgeon", "orthopedics"], address: "Health City, Arilova, Visakhapatnam, AP 530040" },
        { name: "KIMS ICON Hospital", specialties: ["general surgeon", "orthopedics", "pediatrics"], address: "Sheela Nagar, Visakhapatnam, AP 530012" },
        { name: "Ramesh Hospitals", specialties: ["cardiologist", "pediatrics", "neurologist"], address: "MG Road, Labbipet, Vijayawada, AP 520010" },
        { name: "Manipal Hospital", specialties: ["cardiologist", "general surgeon", "pediatrics", "neurologist"], address: "Tadepalli, Vijayawada, AP 522501" },
        { name: "AIIMS Mangalagiri", specialties: ["neurologist", "orthopedics", "cardiologist", "general surgeon"], address: "Mangalagiri, Guntur, AP 522503" },
        { name: "Narayana Medical College Hospital", specialties: ["pediatrics", "cardiologist", "general surgeon", "neurologist"], address: "Chinthareddypalem, Nellore, AP 524003" },
        // Sri Sathya Sai District Hospitals
        { name: "Sri Sathya Sai Institute of Higher Medical Sciences", specialties: ["cardiologist", "neurologist", "orthopedics", "general surgeon"], address: "Prasanthigram, Puttaparthi, Sri Sathya Sai District, AP 515134" },
        { name: "Sri Sathya Sai General Hospital", specialties: ["pediatrics", "general surgeon", "orthopedics"], address: "Prasanthi Nilayam, Puttaparthi, Sri Sathya Sai District, AP 515134" },
        { name: "Government General Hospital", specialties: ["general surgeon", "pediatrics"], address: "Hindupur, Sri Sathya Sai District, AP 515201" },
        { name: "Kusuma Hospital", specialties: ["cardiologist", "pediatrics"], address: "Penukonda Road, Hindupur, Sri Sathya Sai District, AP 515201" }
    ];

    // Added Disease Dictionary for rich information feed
    const diseaseDatabase = {
        "heart": { name: "Cardiovascular Disease", details: "Conditions affecting the heart and blood vessels. Treatment usually involves medications, lifestyle modifications, or surgery by a Cardiologist.", icon: "heart-pulse", symptoms: "Chest pain, shortness of breath, extreme fatigue." },
        "cardiologist": { name: "Cardiology", details: "Study and treatment of disorders of the heart and blood vessels.", icon: "heart-pulse", symptoms: "Chest pain, shortness of breath, fatigue." },
        "neuro": { name: "Neurological Disorders", details: "Diseases of the central and peripheral nervous system, including the brain, spinal cord, and nerves.", icon: "brain", symptoms: "Headaches, numbness, muscle weakness, memory loss." },
        "brain": { name: "Neurological Disorders", details: "Diseases of the central and peripheral nervous system, including the brain, spinal cord, and nerves.", icon: "brain", symptoms: "Headaches, numbness, muscle weakness, memory loss." },
        "surgeon": { name: "General Surgery Needs", details: "Requires surgical intervention. Focuses on abdominal contents, traumas, and emergencies.", icon: "scissors", symptoms: "Severe localized pain, structural injuries, acute abdominal issues." },
        "bone": { name: "Orthopedic Conditions", details: "Conditions involving the musculoskeletal system. Treated by an Orthopedist.", icon: "bone", symptoms: "Joint pain, stiffness, swelling, suspected fractures." },
        "orthopedic": { name: "Orthopedic Conditions", details: "Conditions involving the musculoskeletal system. Treated by an Orthopedist.", icon: "bone", symptoms: "Joint pain, stiffness, swelling, suspected fractures." },
        "child": { name: "Pediatric Condition", details: "Medical care of infants, children, and adolescents.", icon: "baby", symptoms: "High fever unresolving, growth issues, severe childhood illnesses." },
        "pediat": { name: "Pediatric Condition", details: "Medical care of infants, children, and adolescents.", icon: "baby", symptoms: "High fever unresolving, growth issues, severe childhood illnesses." },
        "fever": { name: "General Infection / Fever", details: "A temporary increase in your body temperature, often due to an illness.", icon: "thermometer", symptoms: "Sweating, chills, shivering, headache, muscle aches." }
    };

    let matchedDiseaseInfo = null;
    if (diseaseQuery) {
        for (const [key, info] of Object.entries(diseaseDatabase)) {
            if (diseaseQuery.includes(key) || key.includes(diseaseQuery)) {
                matchedDiseaseInfo = info;
                break;
            }
        }
    }

    let results = [];

    // Check our database of doctors against the search
    hospitalData.doctors.forEach(doc => {
        const specMatches = diseaseQuery && (doc.specialty.toLowerCase().includes(diseaseQuery) || doc.name.toLowerCase().includes(diseaseQuery));
        const hasHospitalQueryMatch = hospitalQuery ? allHospitals.some(h => h.name.toLowerCase().includes(hospitalQuery)) : false;

        // Match conditions: if we typed a disease, doctor must match it.
        // If we typed a hospital, we filter by hospitals that have this doctor's specialty.
        if (specMatches || (!diseaseQuery && hospitalQuery)) {
            let matchedHospitals = allHospitals.filter(h => h.specialties.includes(doc.specialty.toLowerCase()));

            // Further filter if user specifically searched a hospital name
            if (hospitalQuery) {
                matchedHospitals = matchedHospitals.filter(h => h.name.toLowerCase().includes(hospitalQuery));
            }

            // Add mock orthopedics or pediatrics if DB doesn't have them
            // In a real app we would seed all these in the backend
            matchedHospitals.forEach(h => {
                results.push({ doctor: doc, hospital: h.name, address: h.address });
            });
        }
    });

    // Store globally so the modal can access it
    window.currentSearchResults = results;
    window.currentSearchDisease = matchedDiseaseInfo;

    // Open the result view
    openModal('search');
}

// --- Protected Authentication & Dashboard ---

window.handleStaffLogin = function (e) {
    e.preventDefault();
    const user = document.getElementById('login-username').value.trim();
    const pass = document.getElementById('login-password').value.trim();

    // Map common credentials to hospitals for dynamic simulation
    const validLogins = {
        'admin': { hospital: 'Global Health Administration', members: 120, pats: 540 },
        'apollo_admin': { hospital: 'Apollo Hospitals', members: 45, pats: 154 },
        'aiims_admin': { hospital: 'AIIMS Mangalagiri', members: 89, pats: 320 },
        'sathya_admin': { hospital: 'Sri Sathya Sai Institute', members: 60, pats: 210 }
    };

    if (validLogins[user] && pass === 'Admin#2026') {
        // Authenticated successfully!
        const adminData = validLogins[user];
        closeModal();

        // Hide Main View, Show Staff View
        document.getElementById('app-root').style.display = 'none';
        const dashboard = document.getElementById('staff-dashboard');
        dashboard.style.display = 'block';

        // Render hospital specific details securely
        document.getElementById('staff-hosp-name').textContent = adminData.hospital + " Portal";
        document.getElementById('staff-members-count').textContent = adminData.members;
        document.getElementById('staff-patients-count').textContent = adminData.pats;

        // Generate dynamic table mock data based on hospital name for realism
        const hospitalGenRand = adminData.hospital.length;

        // Populate Facility Sidebar Stats
        document.getElementById('staff-detail-wards').textContent = 100 + (hospitalGenRand * 6);
        document.getElementById('staff-detail-icu').textContent = 50 + (hospitalGenRand % 5) * 10 - (40 + (hospitalGenRand % 15));
        document.getElementById('staff-detail-vents').textContent = 10 + (hospitalGenRand % 10);
        document.getElementById('staff-detail-er').textContent = 10 + (hospitalGenRand % 15);

        // Populate Table Details
        const patientNames = ['Rahul Sharma', 'Anjali Desai', 'Venkatesh Rao', 'Priya Kumari', 'Karthik Reddy', 'Sita Ram', 'Ravi Teja', 'Lakshmi N.'];
        const departments = ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'General Surgery', 'Emergency'];
        const statuses = [
            { label: 'Stable', class: 'bg-emerald-100 text-emerald-700' },
            { label: 'Critical', class: 'bg-red-100 text-red-700' },
            { label: 'Discharging', class: 'bg-blue-100 text-blue-700' },
            { label: 'Under Obs.', class: 'bg-amber-100 text-amber-700' }
        ];

        let tableContent = '';
        const rowsToGenerate = 5 + (hospitalGenRand % 4); // 5 to 8 rows
        for (let i = 0; i < rowsToGenerate; i++) {
            const pName = patientNames[(hospitalGenRand + i + 2) % patientNames.length];
            const dept = departments[(hospitalGenRand + i * 3) % departments.length];
            const stat = statuses[(hospitalGenRand + i * 7) % statuses.length];
            const pId = 'PT-' + (20000 + (hospitalGenRand * 133) + i * 17);

            tableContent += `
                <tr class="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td class="py-3 items-center gap-2 font-medium text-slate-800">
                        <div class="h-8 w-8 rounded-full bg-slate-200 inline-flex items-center justify-center text-xs font-bold text-slate-600 mr-2 uppercase">${pName.substring(0, 2)}</div>
                        ${pName}
                    </td>
                    <td class="py-3 text-slate-500 font-mono text-xs">${pId}</td>
                    <td class="py-3 text-slate-600">${dept}</td>
                    <td class="py-3">
                        <span class="px-2.5 py-1 rounded-full text-xs font-medium ${stat.class}">${stat.label}</span>
                    </td>
                    <td class="py-3">
                        <button class="text-slate-400 hover:text-medical-600"><i data-lucide="more-horizontal" class="w-5 h-5"></i></button>
                    </td>
                </tr>
            `;
        }
        document.getElementById('staff-patient-records').innerHTML = tableContent;

        // Re-init generic icons for the hidden view
        lucide.createIcons();
    } else {
        alert('Access Denied: Invalid credentials. Note: This is a restricted system.');
    }
}

window.logoutStaff = function () {
    document.getElementById('staff-dashboard').style.display = 'none';
    document.getElementById('app-root').style.display = 'block';

    // Clear forms just in case
    const usernameInput = document.getElementById('login-username');
    if (usernameInput) usernameInput.value = '';
    const passInput = document.getElementById('login-password');
    if (passInput) passInput.value = '';
}

// --- API Connections ---

// Fetch real doctors from the backend when the page loads
async function fetchRealDoctors() {
    try {
        const response = await fetch('http://127.0.0.1:5000/api/doctors');
        if (response.ok) {
            const doctorsFromDB = await response.json();
            if (doctorsFromDB.length > 0) {
                // Format DB doctors to match our UI expectations
                hospitalData.doctors = doctorsFromDB.map(doc => ({
                    _id: doc._id,
                    name: doc.name,
                    specialty: doc.specialty,
                    experience: doc.experience,
                    education: "Degree Verification Pending",
                    successRate: "N/A",
                    rating: doc.rating,
                    image: "https://i.pravatar.cc/150?img=3"
                }));
            }
        }
    } catch (error) {
        console.log("Could not fetch API doctors. Falling back to default mock data.", error);
    }
}

// Function to handle booking submission
async function submitAppointment(event) {
    event.preventDefault(); // Stop the form from refreshing the page!

    // Grab values from our form using the IDs we assigned
    const doctorId = document.getElementById('doctor-id').value;
    const date = document.getElementById('appointment-date').value;
    const time = document.getElementById('appointment-time').value;

    try {
        const response = await fetch('http://127.0.0.1:5000/api/appointments', {
            method: 'POST',
            headers: {
                // Tell the backend we are sending JSON data
                'Content-Type': 'application/json'
            },
            // Convert our data into a JSON string
            body: JSON.stringify({ doctorId, date, time })
        });

        const result = await response.json();

        // Check if the backend gave a success status (200 or 201)
        if (response.ok) {
            alert('Success: ' + result.message);
            closeModal(); // Close the UI modal
        } else {
            alert('Error: ' + result.message);
        }
    } catch (error) {
        console.error('Network Error:', error);
        alert('Failed to connect to the backend server. Error Details: ' + error.message);
    }
}

// --- Initialization ---

document.addEventListener('DOMContentLoaded', async () => {
    // Add scroll effect to navbar
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('.glass-nav');
        if (window.scrollY > 20) {
            nav.classList.add('scrolled', 'shadow-sm');
        } else {
            nav.classList.remove('scrolled', 'shadow-sm');
        }
    });

    // Fetch real API data before rendering
    await fetchRealDoctors();

    // Render components
    renderDashboard();
});

// --- Language Function ---

window.changeLanguage = function (lang) {
    // Sets the Google Translate cookie
    document.cookie = `googtrans=/en/${lang}; path=/`;
    document.cookie = `googtrans=/en/${lang}; domain=.${document.domain}; path=/`;

    // Reload the page to apply the Google Translation script
    window.location.reload();
}

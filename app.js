/**
 * Family Reunion PWA - Main Application Logic
 * Organized, maintainable JavaScript with clear sections
 */

// ===========================
// Service Worker Registration
// ===========================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker registered successfully:', registration.scope);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    });
}

// ===========================
// Tab Navigation Module
// ===========================
const TabNavigation = {
    init() {
        const tabs = document.querySelectorAll('.tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', this.handleTabClick.bind(this));
        });
    },

    handleTabClick(event) {
        const targetTab = event.currentTarget.dataset.tab;

        // Update active tab
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        event.currentTarget.classList.add('active');

        // Update active content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(targetTab).classList.add('active');
    }
};

// ===========================
// Photo Upload Module
// ===========================
const PhotoUpload = {
    photoInput: null,
    photoGrid: null,
    uploadArea: null,

    init() {
        this.photoInput = document.getElementById('photoInput');
        this.photoGrid = document.getElementById('photoGrid');
        this.uploadArea = document.getElementById('uploadArea');

        if (!this.photoInput || !this.photoGrid || !this.uploadArea) {
            console.error('Photo upload elements not found');
            return;
        }

        this.attachEventListeners();
    },

    attachEventListeners() {
        // Click to upload
        this.uploadArea.addEventListener('click', () => {
            this.photoInput.click();
        });

        // File input change
        this.photoInput.addEventListener('change', (e) => {
            this.handleFileSelect(e.target.files);
        });

        // Drag and drop
        this.uploadArea.addEventListener('dragover', this.handleDragOver.bind(this));
        this.uploadArea.addEventListener('dragleave', this.handleDragLeave.bind(this));
        this.uploadArea.addEventListener('drop', this.handleDrop.bind(this));
    },

    handleFileSelect(files) {
        const fileArray = Array.from(files);

        fileArray.forEach(file => {
            if (file.type.startsWith('image/')) {
                this.readAndDisplayImage(file);
            }
        });
    },

    readAndDisplayImage(file) {
        const reader = new FileReader();

        reader.onload = (e) => {
            const photoItem = document.createElement('div');
            photoItem.className = 'photo-item';
            photoItem.innerHTML = `<img src="${e.target.result}" alt="Family photo">`;
            this.photoGrid.appendChild(photoItem);
        };

        reader.readAsDataURL(file);
    },

    handleDragOver(e) {
        e.preventDefault();
        this.uploadArea.style.borderColor = 'var(--terracotta)';
        this.uploadArea.style.background = 'white';
    },

    handleDragLeave() {
        this.uploadArea.style.borderColor = 'var(--sage)';
        this.uploadArea.style.background = 'var(--cream)';
    },

    handleDrop(e) {
        e.preventDefault();
        this.handleDragLeave();

        const files = e.dataTransfer.files;
        this.handleFileSelect(files);
    }
};

// ===========================
// Payment Module
// ===========================
const Payment = {
    init() {
        const payButton = document.getElementById('payButton');
        if (payButton) {
            payButton.addEventListener('click', this.toggleQRCode);
        }
    },

    toggleQRCode() {
        const qrContainer = document.getElementById('qrCodeContainer');
        if (qrContainer) {
            qrContainer.classList.toggle('show');
        }
    }
};

// ===========================
// RSVP Module
// ===========================
const RSVP = {
    rsvpList: null,
    rsvpForm: null,
    guestsSelect: null,
    familyMembersContainer: null,
    loadedRSVPs: new Set(), // Track loaded RSVPs to avoid duplicates

    init() {
        this.rsvpList = document.getElementById('rsvpList');
        this.rsvpForm = document.getElementById('rsvpForm');
        this.guestsSelect = document.getElementById('guests');
        this.familyMembersContainer = document.getElementById('familyMembersContainer');

        if (!this.rsvpForm) {
            console.error('RSVP form not found');
            return;
        }

        this.rsvpForm.addEventListener('submit', this.handleSubmit.bind(this));
        this.guestsSelect.addEventListener('change', this.handleGuestsChange.bind(this));

        // Make existing RSVP items draggable
        this.makeDraggable(document.querySelectorAll('.rsvp-item'));

        // Load existing RSVPs from Firebase and listen for new ones
        this.loadFromFirebase();
        this.listenForUpdates();
    },

    saveToFirebase(rsvpData) {
        if (!window.firebaseDB) {
            console.log('Firebase not configured - RSVP saved locally only');
            return;
        }

        const rsvpsRef = window.firebaseDB.ref('rsvps');
        const newRsvpRef = rsvpsRef.push();

        newRsvpRef.set({
            id: rsvpData.id,
            name: rsvpData.name,
            guests: rsvpData.guests,
            familyMembers: rsvpData.familyMembers,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        })
        .then(() => {
            console.log('RSVP saved to Firebase');
        })
        .catch((error) => {
            console.error('Error saving RSVP:', error);
            alert('Could not save RSVP online. Please check your connection.');
        });
    },

    loadFromFirebase() {
        if (!window.firebaseDB) {
            console.log('Firebase not configured - skipping load');
            return;
        }

        const rsvpsRef = window.firebaseDB.ref('rsvps');

        rsvpsRef.once('value')
            .then((snapshot) => {
                snapshot.forEach((childSnapshot) => {
                    const rsvpData = childSnapshot.val();
                    if (!this.loadedRSVPs.has(rsvpData.id)) {
                        this.addRSVPItem(rsvpData.name, rsvpData.guests, rsvpData.familyMembers, rsvpData.id, false);
                    }
                });
            })
            .catch((error) => {
                console.error('Error loading RSVPs:', error);
            });
    },

    listenForUpdates() {
        if (!window.firebaseDB) {
            console.log('Firebase not configured - skipping real-time updates');
            return;
        }

        const rsvpsRef = window.firebaseDB.ref('rsvps');

        rsvpsRef.on('child_added', (snapshot) => {
            const rsvpData = snapshot.val();

            // Only add if we haven't loaded it yet
            if (!this.loadedRSVPs.has(rsvpData.id)) {
                this.addRSVPItem(rsvpData.name, rsvpData.guests, rsvpData.familyMembers, rsvpData.id, false);
            }
        });
    },

    handleGuestsChange(e) {
        const numGuests = parseInt(e.target.value);
        this.familyMembersContainer.innerHTML = '';

        if (numGuests > 1) {
            const div = document.createElement('div');
            div.className = 'family-members-section';
            div.innerHTML = `
                <h4 style="color: var(--forest); margin: 1.5rem 0 1rem; font-family: 'Karla', sans-serif;">
                    Add Your Family Members (${numGuests - 1} additional ${numGuests === 2 ? 'person' : 'people'})
                </h4>
            `;

            for (let i = 2; i <= numGuests; i++) {
                const memberDiv = document.createElement('div');
                memberDiv.className = 'form-group';
                memberDiv.innerHTML = `
                    <label for="member${i}">Family Member ${i} Name</label>
                    <input type="text" id="member${i}" name="member${i}"
                           placeholder="e.g., Spouse, Child's name" class="family-member-input">
                `;
                div.appendChild(memberDiv);
            }

            this.familyMembersContainer.appendChild(div);
        }
    },

    handleSubmit(e) {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const guests = document.getElementById('guests').value;

        if (!name || !guests) {
            alert('Please fill in all fields');
            return;
        }

        // Collect family member names
        const familyMembers = [name]; // Start with head of household
        const numGuests = parseInt(guests);

        for (let i = 2; i <= numGuests; i++) {
            const memberInput = document.getElementById(`member${i}`);
            if (memberInput && memberInput.value.trim()) {
                familyMembers.push(memberInput.value.trim());
            }
        }

        // Create unique ID and save to Firebase
        const rsvpId = `rsvp-${Date.now()}`;
        this.addRSVPItem(name, guests, familyMembers, rsvpId, true);

        this.rsvpForm.reset();
        this.familyMembersContainer.innerHTML = '';

        alert('Thank you for your RSVP! Now drag your name to the family tree below to show your connection to Philomae.');
    },

    addRSVPItem(name, guests, familyMembers = [name], id = null, saveToFirebase = false) {
        const rsvpItem = document.createElement('div');
        rsvpItem.className = 'rsvp-item';
        rsvpItem.draggable = true;
        rsvpItem.id = id || `rsvp-${Date.now()}`;

        // Mark as loaded BEFORE saving to Firebase to prevent duplicate from listener
        this.loadedRSVPs.add(rsvpItem.id);

        // Store family members data
        rsvpItem.dataset.familyMembers = JSON.stringify(familyMembers);

        rsvpItem.innerHTML = `
            <span class="rsvp-name">${this.escapeHtml(name)}</span>
            <span class="rsvp-count">${guests} ${parseInt(guests) === 1 ? 'person' : 'people'}</span>
        `;

        this.makeDraggable([rsvpItem]);
        this.rsvpList.appendChild(rsvpItem);

        // Save to Firebase if this is a new RSVP
        if (saveToFirebase) {
            this.saveToFirebase({
                id: rsvpItem.id,
                name: name,
                guests: guests,
                familyMembers: familyMembers
            });
        }
    },

    makeDraggable(elements) {
        elements.forEach(element => {
            element.addEventListener('dragstart', this.handleDragStart);
            element.addEventListener('dragend', this.handleDragEnd);
        });
    },

    handleDragStart(e) {
        e.dataTransfer.setData('text', e.target.id);
        e.target.style.opacity = '0.5';
    },

    handleDragEnd(e) {
        e.target.style.opacity = '1';
    },

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

// ===========================
// Family Tree Module
// ===========================
const FamilyTree = {
    loadedPlacements: new Set(), // Track loaded placements to avoid duplicates

    init() {
        const dropZones = document.querySelectorAll('.drop-zone');
        dropZones.forEach((zone, index) => {
            // Assign IDs to initial drop zones for Firebase reference
            if (!zone.id) {
                zone.id = zone.dataset.branchId || `root-zone-${index}`;
            }
            zone.addEventListener('dragover', this.handleDragOver);
            zone.addEventListener('dragleave', this.handleDragLeave);
            zone.addEventListener('drop', this.handleDrop.bind(this));
        });

        // Load existing tree placements from Firebase
        this.loadFromFirebase();
        this.listenForUpdates();
    },

    saveToFirebase(placementData) {
        if (!window.firebaseDB) {
            console.log('Firebase not configured - tree placement saved locally only');
            return;
        }

        const treeRef = window.firebaseDB.ref('treePlacements');
        const newPlacementRef = treeRef.push();

        newPlacementRef.set({
            id: placementData.id,
            rsvpId: placementData.rsvpId,
            parentZoneId: placementData.parentZoneId,
            familyMembers: placementData.familyMembers,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        })
        .then(() => {
            console.log('Tree placement saved to Firebase');
        })
        .catch((error) => {
            console.error('Error saving tree placement:', error);
        });
    },

    loadFromFirebase() {
        if (!window.firebaseDB) {
            console.log('Firebase not configured - skipping tree load');
            return;
        }

        const treeRef = window.firebaseDB.ref('treePlacements');

        treeRef.once('value')
            .then((snapshot) => {
                snapshot.forEach((childSnapshot) => {
                    const placementData = childSnapshot.val();
                    if (!this.loadedPlacements.has(placementData.id)) {
                        this.restorePlacement(placementData);
                    }
                });
            })
            .catch((error) => {
                console.error('Error loading tree placements:', error);
            });
    },

    listenForUpdates() {
        if (!window.firebaseDB) {
            console.log('Firebase not configured - skipping tree real-time updates');
            return;
        }

        const treeRef = window.firebaseDB.ref('treePlacements');

        treeRef.on('child_added', (snapshot) => {
            const placementData = snapshot.val();

            // Only add if we haven't loaded it yet
            if (!this.loadedPlacements.has(placementData.id)) {
                this.restorePlacement(placementData);
            }
        });
    },

    restorePlacement(placementData) {
        const dropZone = document.getElementById(placementData.parentZoneId);
        if (!dropZone) {
            console.warn('Drop zone not found for placement:', placementData);
            return;
        }

        // Mark as loaded to prevent duplicates
        this.loadedPlacements.add(placementData.id);

        // Remove placeholder if exists
        const placeholder = dropZone.querySelector('span[style*="italic"]');
        if (placeholder) {
            placeholder.remove();
        }

        // Create and add the member wrapper
        this.createMemberWrapper(dropZone, placementData.familyMembers, placementData.rsvpId);

        // Mark the RSVP as placed if it exists
        const rsvpElement = document.getElementById(placementData.rsvpId);
        if (rsvpElement) {
            rsvpElement.classList.add('placed');
            rsvpElement.draggable = false;
        }
    },

    createMemberWrapper(dropZone, familyMembers, rsvpId) {
        const memberWrapper = document.createElement('div');
        memberWrapper.className = 'member-wrapper';
        memberWrapper.dataset.rsvpId = rsvpId;

        // Add the primary member name (head of household)
        const memberName = document.createElement('div');
        memberName.className = 'tree-member-name';
        memberName.textContent = familyMembers[0];

        memberWrapper.appendChild(memberName);

        // If there are additional family members, display them
        if (familyMembers.length > 1) {
            const familyList = document.createElement('div');
            familyList.className = 'family-members-list';

            for (let i = 1; i < familyMembers.length; i++) {
                if (familyMembers[i]) {
                    const memberItem = document.createElement('div');
                    memberItem.className = 'family-member-item';
                    memberItem.textContent = familyMembers[i];
                    familyList.appendChild(memberItem);
                }
            }

            memberWrapper.appendChild(familyList);
        }

        // Create a drop zone for descendants (children of this person)
        const descendantZone = document.createElement('div');
        descendantZone.className = 'descendant-zone';
        descendantZone.id = `zone-${rsvpId}`;
        descendantZone.innerHTML = '<span style="color: var(--sage); font-style: italic; font-size: 0.8rem;">Add children</span>';

        // Make the descendant zone droppable
        descendantZone.addEventListener('dragover', this.handleDragOver);
        descendantZone.addEventListener('dragleave', this.handleDragLeave);
        descendantZone.addEventListener('drop', this.handleDrop.bind(this));

        memberWrapper.appendChild(descendantZone);

        // Append the member wrapper to the drop zone
        dropZone.appendChild(memberWrapper);

        return memberWrapper;
    },

    handleDragOver(e) {
        e.preventDefault();
        e.currentTarget.classList.add('drag-over');
    },

    handleDragLeave(e) {
        e.currentTarget.classList.remove('drag-over');
    },

    handleDrop(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');

        const data = e.dataTransfer.getData('text');
        const draggedElement = document.getElementById(data);

        if (draggedElement && draggedElement.classList.contains('rsvp-item')) {
            const dropZone = e.currentTarget;

            // Remove placeholder text if it exists (only on first add)
            const placeholder = dropZone.querySelector('span[style*="italic"]');
            if (placeholder) {
                placeholder.remove();
            }

            // Get family members data
            const familyMembersData = draggedElement.dataset.familyMembers;
            const familyMembers = familyMembersData ? JSON.parse(familyMembersData) : [draggedElement.querySelector('.rsvp-name').textContent];

            const rsvpId = draggedElement.id;

            // Create the member wrapper
            this.createMemberWrapper(dropZone, familyMembers, rsvpId);

            // Mark original as placed
            draggedElement.classList.add('placed');
            draggedElement.draggable = false;

            // Save to Firebase
            const placementId = `placement-${Date.now()}`;
            // Mark as loaded BEFORE saving to prevent duplicate from listener
            this.loadedPlacements.add(placementId);

            this.saveToFirebase({
                id: placementId,
                rsvpId: rsvpId,
                parentZoneId: dropZone.id,
                familyMembers: familyMembers
            });
        }
    }
};

// ===========================
// Storage Module (for offline data persistence)
// ===========================
const Storage = {
    save(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    },

    load(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            return null;
        }
    },

    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return false;
        }
    }
};

// ===========================
// PWA Install Prompt Module
// ===========================
const PWAInstall = {
    deferredPrompt: null,

    init() {
        window.addEventListener('beforeinstallprompt', (e) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later
            this.deferredPrompt = e;
            // Optionally, show your own install button
            this.showInstallButton();
        });

        window.addEventListener('appinstalled', () => {
            console.log('PWA was installed');
            this.deferredPrompt = null;
        });
    },

    showInstallButton() {
        // You can create and show an install button here
        // For now, we'll just log that the app is installable
        console.log('App is installable');
    },

    async promptInstall() {
        if (!this.deferredPrompt) {
            return;
        }

        // Show the install prompt
        this.deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await this.deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);

        // Clear the deferredPrompt
        this.deferredPrompt = null;
    }
};

// ===========================
// Smooth Scroll Module
// ===========================
const SmoothScroll = {
    init() {
        // Handle smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');

                // Skip if it's just "#"
                if (href === '#') return;

                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
};

// ===========================
// App Initialization
// ===========================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    TabNavigation.init();
    PhotoUpload.init();
    Payment.init();
    RSVP.init();
    FamilyTree.init();
    PWAInstall.init();
    SmoothScroll.init();

    console.log('Family Reunion App initialized');
});

// ===========================
// Export modules for testing (optional)
// ===========================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        TabNavigation,
        PhotoUpload,
        Payment,
        RSVP,
        FamilyTree,
        Storage,
        PWAInstall,
        SmoothScroll
    };
}

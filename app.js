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

    init() {
        this.rsvpList = document.getElementById('rsvpList');
        this.rsvpForm = document.getElementById('rsvpForm');

        if (!this.rsvpForm) {
            console.error('RSVP form not found');
            return;
        }

        this.rsvpForm.addEventListener('submit', this.handleSubmit.bind(this));

        // Make existing RSVP items draggable
        this.makeDraggable(document.querySelectorAll('.rsvp-item'));
    },

    handleSubmit(e) {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const guests = document.getElementById('guests').value;

        if (!name || !guests) {
            alert('Please fill in all fields');
            return;
        }

        this.addRSVPItem(name, guests);
        this.rsvpForm.reset();

        alert('Thank you for your RSVP! Now drag your name to the family tree below to show your connection to Grandmother.');
    },

    addRSVPItem(name, guests) {
        const rsvpItem = document.createElement('div');
        rsvpItem.className = 'rsvp-item';
        rsvpItem.draggable = true;
        rsvpItem.id = `rsvp-${Date.now()}`;
        rsvpItem.innerHTML = `
            <span class="rsvp-name">${this.escapeHtml(name)}</span>
            <span class="rsvp-count">${guests} guest${guests > 1 ? 's' : ''}</span>
        `;

        this.makeDraggable([rsvpItem]);
        this.rsvpList.appendChild(rsvpItem);
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
    init() {
        const dropZones = document.querySelectorAll('.drop-zone');
        dropZones.forEach(zone => {
            zone.addEventListener('dragover', this.handleDragOver);
            zone.addEventListener('dragleave', this.handleDragLeave);
            zone.addEventListener('drop', this.handleDrop.bind(this));
        });
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
            // Clone the element for the tree
            const clone = draggedElement.cloneNode(true);
            clone.classList.remove('rsvp-item');
            clone.classList.add('family-member', 'placed');
            clone.draggable = false;
            clone.id = '';

            // Add to drop zone (clear placeholder text on first add)
            const dropZone = e.currentTarget;

            // Remove placeholder text if it exists
            const placeholder = dropZone.querySelector('span');
            if (placeholder) {
                placeholder.remove();
            }

            // Append the member (allows multiple people under one child)
            dropZone.appendChild(clone);

            // Mark original as placed
            draggedElement.classList.add('placed');
            draggedElement.draggable = false;
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

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
    photoGallery: null,
    loadedPhotos: new Set(), // Track loaded photos to prevent duplicates

    init() {
        this.photoInput = document.getElementById('photoInput');
        this.photoGrid = document.getElementById('photoGrid');
        this.uploadArea = document.getElementById('uploadArea');
        this.photoGallery = document.getElementById('photoGallery');

        if (!this.photoInput || !this.photoGrid || !this.uploadArea) {
            console.error('Photo upload elements not found');
            return;
        }

        this.attachEventListeners();
        this.loadPhotosFromFirebase();
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
        // Display image locally first
        const reader = new FileReader();

        reader.onload = (e) => {
            const photoItem = document.createElement('div');
            photoItem.className = 'photo-item';
            photoItem.innerHTML = `<img src="${e.target.result}" alt="Family photo">`;
            this.photoGrid.appendChild(photoItem);
        };

        reader.readAsDataURL(file);

        // Upload to Firebase Storage
        this.uploadToFirebase(file);
    },

    uploadToFirebase(file) {
        if (!window.firebaseStorage) {
            console.log('Firebase Storage not configured - photo saved locally only');
            return;
        }

        // Create a unique filename
        const timestamp = Date.now();
        const filename = `reunion-photos/${timestamp}-${file.name}`;
        const storageRef = window.firebaseStorage.ref();
        const photoRef = storageRef.child(filename);

        // Upload the file
        const uploadTask = photoRef.put(file);

        uploadTask.on('state_changed',
            (snapshot) => {
                // Progress
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
            },
            (error) => {
                // Error
                console.error('Error uploading photo:', error);
                alert('Failed to upload photo. Please try again.');
            },
            () => {
                // Success - get download URL and save to database
                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                    this.savePhotoToDatabase(downloadURL, filename);
                    console.log('Photo uploaded successfully!');
                });
            }
        );
    },

    savePhotoToDatabase(url, filename) {
        if (!window.firebaseDB) {
            console.log('Firebase Database not configured');
            return;
        }

        const photosRef = window.firebaseDB.ref('photos');
        photosRef.push({
            url: url,
            filename: filename,
            uploadedAt: firebase.database.ServerValue.TIMESTAMP
        })
        .then(() => {
            console.log('Photo URL saved to database');
        })
        .catch((error) => {
            console.error('Error saving photo URL:', error);
        });
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
    },

    loadPhotosFromFirebase() {
        if (!window.firebaseDB) {
            console.log('Firebase not configured - skipping photo load');
            return;
        }

        const photosRef = window.firebaseDB.ref('photos');

        photosRef.on('child_added', (snapshot) => {
            const photoData = snapshot.val();
            // Only add if we haven't loaded this photo yet
            if (!this.loadedPhotos.has(photoData.url)) {
                this.displayPhotoFromURL(photoData.url);
                this.loadedPhotos.add(photoData.url);
            }
        });
    },

    displayPhotoFromURL(url) {
        // Add to photo grid (for upload preview)
        const photoItem = document.createElement('div');
        photoItem.className = 'photo-item';
        photoItem.innerHTML = `<img src="${url}" alt="Family reunion photo">`;
        this.photoGrid.appendChild(photoItem);
        
        // Add to main photo gallery (for display) - only if gallery exists
        if (this.photoGallery) {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.innerHTML = `<img src="${url}" alt="Family reunion memory" loading="lazy">`;
            this.photoGallery.appendChild(galleryItem);
        }
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
    nonAttendingList: null,
    addNonAttendingBtn: null,
    nonAttendingCount: 0,
    loadedRSVPs: new Set(), // Track loaded RSVPs to avoid duplicates

    init() {
        this.rsvpList = document.getElementById('rsvpList');
        this.rsvpForm = document.getElementById('rsvpForm');
        this.guestsSelect = document.getElementById('guests');
        this.familyMembersContainer = document.getElementById('familyMembersContainer');
        this.nonAttendingList = document.getElementById('nonAttendingList');
        this.addNonAttendingBtn = document.getElementById('addNonAttendingBtn');

        if (!this.rsvpForm) {
            console.error('RSVP form not found');
            return;
        }

        this.rsvpForm.addEventListener('submit', this.handleSubmit.bind(this));
        this.guestsSelect.addEventListener('change', this.handleGuestsChange.bind(this));

        if (this.addNonAttendingBtn) {
            this.addNonAttendingBtn.addEventListener('click', this.addNonAttendingField.bind(this));
        }

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
            shirtSizes: rsvpData.shirtSizes || [],
            nonAttending: rsvpData.nonAttending || [],
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
                        // Load RSVP with non-attending members (but don't pass shirt sizes)
                        this.addRSVPItem(rsvpData.name, rsvpData.guests, rsvpData.familyMembers, [], rsvpData.nonAttending || [], rsvpData.id, false);
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

            // Only add if we haven't loaded it yet (include non-attending but not shirt sizes)
            if (!this.loadedRSVPs.has(rsvpData.id)) {
                this.addRSVPItem(rsvpData.name, rsvpData.guests, rsvpData.familyMembers, [], rsvpData.nonAttending || [], rsvpData.id, false);
            }
        });
    },

    handleGuestsChange(e) {
        const numGuests = parseInt(e.target.value);
        this.familyMembersContainer.innerHTML = '';

        if (numGuests >= 1) {
            const div = document.createElement('div');
            div.className = 'family-members-section';

            // Add shirt size for head of household first
            div.innerHTML = `
                <h4 style="color: var(--forest); margin: 1.5rem 0 1rem; font-family: 'Karla', sans-serif;">
                    T-Shirt Sizes ($10 each)
                </h4>
                <div class="form-group">
                    <label for="shirtSize1">Your Shirt Size</label>
                    <select id="shirtSize1" name="shirtSize1" required>
                        <option value="">Select size</option>
                        <option value="Youth Small">Youth Small</option>
                        <option value="Youth Medium">Youth Medium</option>
                        <option value="Youth Large">Youth Large</option>
                        <option value="Adult Small">Adult Small</option>
                        <option value="Adult Medium">Adult Medium</option>
                        <option value="Adult Large">Adult Large</option>
                        <option value="Adult XL">Adult XL</option>
                        <option value="Adult 2XL">Adult 2XL</option>
                        <option value="Adult 3XL">Adult 3XL</option>
                    </select>
                </div>
            `;

            // Add additional family members if more than 1 person
            if (numGuests > 1) {
                const additionalHeader = document.createElement('h4');
                additionalHeader.style.cssText = 'color: var(--forest); margin: 1.5rem 0 1rem; font-family: Karla, sans-serif;';
                additionalHeader.textContent = `Additional Family Members (${numGuests - 1} ${numGuests === 2 ? 'person' : 'people'})`;
                div.appendChild(additionalHeader);

                for (let i = 2; i <= numGuests; i++) {
                    const memberDiv = document.createElement('div');
                    memberDiv.style.cssText = 'display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;';
                    memberDiv.innerHTML = `
                        <div class="form-group" style="margin-bottom: 0;">
                            <label for="member${i}">Family Member ${i} Name</label>
                            <input type="text" id="member${i}" name="member${i}"
                                   placeholder="e.g., Spouse, Child's name" class="family-member-input">
                        </div>
                        <div class="form-group" style="margin-bottom: 0;">
                            <label for="shirtSize${i}">Shirt Size</label>
                            <select id="shirtSize${i}" name="shirtSize${i}" required>
                                <option value="">Select size</option>
                                <option value="Youth Small">Youth Small</option>
                                <option value="Youth Medium">Youth Medium</option>
                                <option value="Youth Large">Youth Large</option>
                                <option value="Adult Small">Adult Small</option>
                                <option value="Adult Medium">Adult Medium</option>
                                <option value="Adult Large">Adult Large</option>
                                <option value="Adult XL">Adult XL</option>
                                <option value="Adult 2XL">Adult 2XL</option>
                                <option value="Adult 3XL">Adult 3XL</option>
                            </select>
                        </div>
                    `;
                    div.appendChild(memberDiv);
                }
            }

            this.familyMembersContainer.appendChild(div);
        }
    },

    addNonAttendingField() {
        this.nonAttendingCount++;
        const itemDiv = document.createElement('div');
        itemDiv.className = 'non-attending-item';
        itemDiv.dataset.index = this.nonAttendingCount;
        itemDiv.innerHTML = `
            <input type="text"
                   id="nonAttending${this.nonAttendingCount}"
                   placeholder="Enter name of family member not attending"
                   class="non-attending-input">
            <button type="button" class="remove-non-attending-btn" data-index="${this.nonAttendingCount}">
                Remove
            </button>
        `;

        const removeBtn = itemDiv.querySelector('.remove-non-attending-btn');
        removeBtn.addEventListener('click', () => this.removeNonAttendingField(this.nonAttendingCount));

        this.nonAttendingList.appendChild(itemDiv);
    },

    removeNonAttendingField(index) {
        const item = this.nonAttendingList.querySelector(`[data-index="${index}"]`);
        if (item) {
            item.remove();
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

        const numGuests = parseInt(guests);

        // Collect shirt sizes
        const shirtSizes = [];
        for (let i = 1; i <= numGuests; i++) {
            const shirtInput = document.getElementById(`shirtSize${i}`);
            if (shirtInput && shirtInput.value) {
                shirtSizes.push(shirtInput.value);
            } else {
                alert('Please select shirt sizes for all family members');
                return;
            }
        }

        // Collect family member names
        const familyMembers = [name]; // Start with head of household

        for (let i = 2; i <= numGuests; i++) {
            const memberInput = document.getElementById(`member${i}`);
            if (memberInput && memberInput.value.trim()) {
                familyMembers.push(memberInput.value.trim());
            }
        }

        // Collect non-attending family members
        const nonAttending = [];
        const nonAttendingInputs = document.querySelectorAll('.non-attending-input');
        nonAttendingInputs.forEach(input => {
            if (input.value.trim()) {
                nonAttending.push(input.value.trim());
            }
        });

        // Create unique ID and save to Firebase
        const rsvpId = `rsvp-${Date.now()}`;
        this.addRSVPItem(name, guests, familyMembers, shirtSizes, nonAttending, rsvpId, true);

        this.rsvpForm.reset();
        this.familyMembersContainer.innerHTML = '';
        this.nonAttendingList.innerHTML = '';
        this.nonAttendingCount = 0;

        alert('Thank you for your RSVP! Now drag your name to the family tree below to show your connection to Philomae.');
    },

    addRSVPItem(name, guests, familyMembers = [name], shirtSizes = [], nonAttending = [], id = null, saveToFirebase = false) {
        const rsvpItem = document.createElement('div');
        rsvpItem.className = 'rsvp-item';
        rsvpItem.draggable = true;
        rsvpItem.id = id || `rsvp-${Date.now()}`;

        // Mark as loaded BEFORE saving to Firebase to prevent duplicate from listener
        this.loadedRSVPs.add(rsvpItem.id);

        // Store both attending and non-attending family members data
        rsvpItem.dataset.familyMembers = JSON.stringify(familyMembers);
        rsvpItem.dataset.nonAttending = JSON.stringify(nonAttending);

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
                familyMembers: familyMembers,
                shirtSizes: shirtSizes,
                nonAttending: nonAttending
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

        // Create and add the member wrapper (with non-attending members)
        this.createMemberWrapper(dropZone, placementData.familyMembers, placementData.rsvpId, placementData.nonAttending || []);

        // Mark the RSVP as placed if it exists
        const rsvpElement = document.getElementById(placementData.rsvpId);
        if (rsvpElement) {
            rsvpElement.classList.add('placed');
            rsvpElement.draggable = false;
        }
    },

    createMemberWrapper(dropZone, familyMembers, rsvpId, nonAttending = []) {
        const memberWrapper = document.createElement('div');
        memberWrapper.className = 'member-wrapper tree-member-draggable';
        memberWrapper.dataset.rsvpId = rsvpId;
        memberWrapper.id = `member-wrapper-${rsvpId}`;

        // Add delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'tree-member-delete';
        deleteBtn.innerHTML = '×';
        deleteBtn.title = 'Remove from family tree';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent drag events
            this.deleteMemberFromTree(memberWrapper, rsvpId);
        });
        memberWrapper.appendChild(deleteBtn);

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
        
        // Add non-attending family members with different styling
        if (nonAttending && nonAttending.length > 0) {
            const nonAttendingList = document.createElement('div');
            nonAttendingList.className = 'non-attending-members-list';
            
            // Add a label for non-attending members
            const label = document.createElement('div');
            label.className = 'non-attending-label';
            label.textContent = 'Cannot attend:';
            nonAttendingList.appendChild(label);

            nonAttending.forEach(memberName => {
                if (memberName) {
                    const memberItem = document.createElement('div');
                    memberItem.className = 'family-member-item non-attending';
                    memberItem.textContent = memberName;
                    nonAttendingList.appendChild(memberItem);
                }
            });

            memberWrapper.appendChild(nonAttendingList);
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

        // Make the member wrapper draggable for rearranging
        this.makeMemberWrapperDraggable(memberWrapper);

        return memberWrapper;
    },

    makeMemberWrapperDraggable(memberWrapper) {
        memberWrapper.draggable = true;
        memberWrapper.classList.add('tree-member-draggable');
        
        memberWrapper.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text', memberWrapper.id || `tree-member-${Date.now()}`);
            e.dataTransfer.effectAllowed = 'move';
            memberWrapper.classList.add('dragging');
            
            // Store the original parent for reference
            e.dataTransfer.setData('originalParent', memberWrapper.parentElement.id);
        });
        
        memberWrapper.addEventListener('dragend', () => {
            memberWrapper.classList.remove('dragging');
        });
        
        // Add visual cues
        memberWrapper.style.cursor = 'grab';
        memberWrapper.addEventListener('mousedown', () => {
            memberWrapper.style.cursor = 'grabbing';
        });
        memberWrapper.addEventListener('mouseup', () => {
            memberWrapper.style.cursor = 'grab';
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
            // Handle new RSVP being added to tree
            this.handleNewRSVPDrop(e, draggedElement);
        } else if (draggedElement && draggedElement.classList.contains('member-wrapper')) {
            // Handle existing tree member being rearranged
            this.handleTreeMemberMove(e, draggedElement);
        }
    },

    handleNewRSVPDrop(e, draggedElement) {
        const dropZone = e.currentTarget;

        // Remove placeholder text if it exists (only on first add)
        const placeholder = dropZone.querySelector('span[style*="italic"]');
        if (placeholder) {
            placeholder.remove();
        }

        // Get family members data
        const familyMembersData = draggedElement.dataset.familyMembers;
        const familyMembers = familyMembersData ? JSON.parse(familyMembersData) : [draggedElement.querySelector('.rsvp-name').textContent];
        
        // Get non-attending members data
        const nonAttendingData = draggedElement.dataset.nonAttending;
        const nonAttending = nonAttendingData ? JSON.parse(nonAttendingData) : [];

        const rsvpId = draggedElement.id;

        // Create the member wrapper
        this.createMemberWrapper(dropZone, familyMembers, rsvpId, nonAttending);

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
            familyMembers: familyMembers,
            nonAttending: nonAttending
        });
    },

    handleTreeMemberMove(e, draggedElement) {
        const dropZone = e.currentTarget;
        const originalParentId = e.dataTransfer.getData('originalParent');
        const originalParent = document.getElementById(originalParentId);

        // Don't allow dropping on itself or its descendants
        if (dropZone === draggedElement || dropZone.closest('.member-wrapper') === draggedElement) {
            return;
        }

        // Remove from original location
        const originalPlaceholder = originalParent.querySelector('span[style*="italic"]');
        if (draggedElement.parentElement.children.length === 1 && !originalPlaceholder) {
            // Add placeholder back if this was the only child
            originalParent.innerHTML = '<span style="color: var(--sage); font-style: italic; font-size: 0.8rem;">Add children</span>';
        }

        // Remove placeholder from new location
        const placeholder = dropZone.querySelector('span[style*="italic"]');
        if (placeholder) {
            placeholder.remove();
        }

        // Move the element
        dropZone.appendChild(draggedElement);

        // Update Firebase with new placement
        const rsvpId = draggedElement.dataset.rsvpId;
        if (rsvpId) {
            // Remove old placement from Firebase
            this.removeOldPlacement(rsvpId);
            
            // Save new placement
            const placementId = `placement-${Date.now()}`;
            this.loadedPlacements.add(placementId);
            
            // Get family data from the wrapper
            const familyMembers = this.extractFamilyMembersFromWrapper(draggedElement);
            const nonAttending = this.extractNonAttendingFromWrapper(draggedElement);
            
            this.saveToFirebase({
                id: placementId,
                rsvpId: rsvpId,
                parentZoneId: dropZone.id,
                familyMembers: familyMembers,
                nonAttending: nonAttending
            });
        }
    },

    extractFamilyMembersFromWrapper(wrapper) {
        const members = [];
        const primaryName = wrapper.querySelector('.tree-member-name');
        if (primaryName) members.push(primaryName.textContent);
        
        const familyItems = wrapper.querySelectorAll('.family-member-item:not(.non-attending)');
        familyItems.forEach(item => members.push(item.textContent));
        
        return members;
    },

    extractNonAttendingFromWrapper(wrapper) {
        const nonAttending = [];
        const nonAttendingItems = wrapper.querySelectorAll('.family-member-item.non-attending');
        nonAttendingItems.forEach(item => nonAttending.push(item.textContent));
        return nonAttending;
    },

    removeOldPlacement(rsvpId) {
        if (!window.firebaseDB) return;
        
        const treeRef = window.firebaseDB.ref('treePlacements');
        treeRef.orderByChild('rsvpId').equalTo(rsvpId).once('value', (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                childSnapshot.ref.remove();
            });
        });
    },

    deleteMemberFromTree(memberWrapper, rsvpId) {
        // Confirm deletion
        const memberName = memberWrapper.querySelector('.tree-member-name')?.textContent || 'this member';
        if (!confirm(`Remove ${memberName} from the family tree? They can be re-added by dragging from the RSVP list.`)) {
            return;
        }

        // Get the parent drop zone
        const parentZone = memberWrapper.parentElement;
        
        // Remove from DOM
        memberWrapper.remove();
        
        // Add placeholder back if the zone is now empty
        if (parentZone.children.length === 0) {
            const placeholder = document.createElement('span');
            placeholder.style.cssText = 'color: var(--sage); font-style: italic; font-size: 0.8rem;';
            placeholder.textContent = parentZone.classList.contains('descendant-zone') ? 'Add children' : 'Drag family members here';
            parentZone.appendChild(placeholder);
        }
        
        // Remove from Firebase
        this.removeOldPlacement(rsvpId);
        
        // Make the original RSVP draggable again if it exists
        const originalRSVP = document.getElementById(rsvpId);
        if (originalRSVP) {
            originalRSVP.classList.remove('placed');
            originalRSVP.draggable = true;
        }
        
        // Remove from loaded placements tracking
        this.loadedPlacements.forEach(placementId => {
            if (placementId.includes(rsvpId)) {
                this.loadedPlacements.delete(placementId);
            }
        });
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
// Modal Module
// ===========================
const Modal = {
    modals: {},
    contentSections: {},

    init() {
        // Collect all modal content sections (the ones to hide)
        const sections = document.querySelectorAll('.modal-content-section');
        sections.forEach(section => {
            const target = section.dataset.modalTarget;
            if (target) {
                this.contentSections[target] = section;
            }
        });

        // Collect all modals
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            this.modals[modal.id] = modal;
        });

        // Move content sections into their respective modals
        this.moveContentToModals();

        // Attach event listeners
        this.attachEventListeners();
    },

    moveContentToModals() {
        Object.keys(this.contentSections).forEach(targetId => {
            const section = this.contentSections[targetId];
            const modalBody = document.getElementById(targetId);

            if (modalBody && section) {
                // Clone the section content
                const clonedSection = section.cloneNode(true);
                clonedSection.style.display = 'block';
                modalBody.appendChild(clonedSection);
            }
        });
    },

    attachEventListeners() {
        // Access card buttons
        const accessCards = document.querySelectorAll('.access-card');
        accessCards.forEach(card => {
            card.addEventListener('click', () => {
                const modalId = card.dataset.modal;
                this.openModal(modalId);
            });
        });

        // Close buttons
        const closeButtons = document.querySelectorAll('.modal-close');
        closeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) {
                    this.closeModal(modal.id);
                }
            });
        });

        // Close when clicking outside modal content
        Object.values(this.modals).forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // Close all open modals
                Object.keys(this.modals).forEach(modalId => {
                    const modal = this.modals[modalId];
                    if (modal.classList.contains('show')) {
                        this.closeModal(modalId);
                    }
                });
            }
        });

        // Re-initialize photo upload and payment in modals after content is moved
        this.reinitializeModalFeatures();
    },

    openModal(modalId) {
        const modal = this.modals[modalId];
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    },

    closeModal(modalId) {
        const modal = this.modals[modalId];
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    },

    reinitializeModalFeatures() {
        // Photos modal
        const photosModalContent = document.getElementById('photosModalContent');
        if (photosModalContent) {
            const uploadArea = photosModalContent.querySelector('#uploadArea');
            const photoInput = photosModalContent.querySelector('#photoInput');
            const photoGrid = photosModalContent.querySelector('#photoGrid');

            if (uploadArea && photoInput && photoGrid) {
                uploadArea.addEventListener('click', () => photoInput.click());

                photoInput.addEventListener('change', (e) => {
                    Array.from(e.target.files).forEach(file => {
                        if (file.type.startsWith('image/')) {
                            // Display locally
                            const reader = new FileReader();
                            reader.onload = (e) => {
                                const photoItem = document.createElement('div');
                                photoItem.className = 'photo-item';
                                photoItem.innerHTML = `<img src="${e.target.result}" alt="Family photo">`;
                                photoGrid.appendChild(photoItem);
                            };
                            reader.readAsDataURL(file);

                            // Upload to Firebase
                            PhotoUpload.uploadToFirebase(file);
                        }
                    });
                });

                // Load existing photos from Firebase
                this.loadModalPhotos(photoGrid);
            }
        }
    },

    loadModalPhotos(photoGrid) {
        if (!window.firebaseDB) {
            return;
        }

        const photosRef = window.firebaseDB.ref('photos');

        photosRef.on('child_added', (snapshot) => {
            const photoData = snapshot.val();
            // Check if this photo is already displayed in modal
            const existingPhoto = photoGrid.querySelector(`img[src="${photoData.url}"]`);
            if (!existingPhoto) {
                const photoItem = document.createElement('div');
                photoItem.className = 'photo-item';
                photoItem.innerHTML = `<img src="${photoData.url}" alt="Family reunion photo">`;
                photoGrid.appendChild(photoItem);
            }
        });
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
    Modal.init();
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
        Modal,
        SmoothScroll
    };
}

# Project Structure & Architecture

This document explains the organization and architecture of the Family Reunion PWA.

## File Organization

```
family-reunion-pwa/
├── index.html              # Main HTML structure
├── styles.css              # All CSS styling
├── app.js                  # Application logic
├── sw.js                   # Service Worker
├── manifest.json           # PWA configuration
├── generate-icons.html     # Icon generation tool
├── package.json            # NPM configuration
├── .gitignore             # Git ignore rules
├── README.md              # Full documentation
├── QUICKSTART.md          # Quick start guide
├── PROJECT_STRUCTURE.md   # This file
└── icons/                 # App icons directory
    └── .gitkeep
```

## Architecture Overview

### HTML Structure (index.html)

**Purpose**: Semantic HTML5 markup with accessibility in mind

**Key Sections**:
- `<head>`: Meta tags, PWA configuration, fonts
- `<header>`: Page title and subtitle
- `<nav>`: Tab navigation for different years
- `<div.container>`: Main content area
  - Event Details
  - Photo Upload
  - Hotel Recommendations
  - Rental Cars
  - Things to Do
  - Carpool Routes
  - Payment
  - RSVP & Family Tree

**PWA Integration**:
- Manifest link
- Theme color meta tags
- Icon references
- Apple-specific meta tags

### CSS Architecture (styles.css)

**Organization**:
1. **Fonts & Variables**: Google Fonts, CSS custom properties
2. **Global Styles**: Base resets and body styling
3. **Header Section**: Top banner styling
4. **Navigation Tabs**: Tab switching interface
5. **Main Content**: Container and tab content
6. **Section Styling**: Reusable section cards
7. **Component Styles**: Individual feature styles
   - Event details grid
   - Photo upload
   - Recommendations
   - Routes/Carpool
   - Payment
   - RSVP form
   - Family tree
8. **Animations**: All keyframe animations
9. **Responsive Design**: Mobile breakpoints

**Methodology**:
- BEM-like naming for clarity
- CSS custom properties for theming
- Mobile-first responsive design
- Progressive enhancement

### JavaScript Architecture (app.js)

**Module Pattern**: Each feature is a self-contained module

**Modules**:

1. **Service Worker Registration**
   - Registers sw.js
   - Handles installation

2. **TabNavigation**
   - Switches between year tabs
   - Updates active states

3. **PhotoUpload**
   - File input handling
   - Drag and drop
   - Image preview display
   - FileReader API usage

4. **Payment**
   - QR code toggle
   - Simple show/hide logic

5. **RSVP**
   - Form handling
   - List management
   - Drag and drop setup
   - Data sanitization

6. **FamilyTree**
   - Drop zone handling
   - Drag and drop logic
   - Visual feedback

7. **Storage**
   - LocalStorage abstraction
   - Error handling
   - Data persistence

8. **PWAInstall**
   - Install prompt handling
   - Installation tracking

**Design Patterns**:
- Module pattern for encapsulation
- Event delegation where appropriate
- Progressive enhancement
- Graceful degradation

### Service Worker (sw.js)

**Purpose**: Offline functionality and caching

**Features**:
- Static asset caching
- Runtime caching
- Network-first strategy
- Offline fallback
- Cache versioning
- Background sync (prepared)
- Push notifications (prepared)

**Cache Strategy**:
- **Static Cache**: HTML, CSS, JS, Fonts
- **Runtime Cache**: Dynamic content, API responses
- **Network First**: Try network, fallback to cache

**Lifecycle**:
1. Install: Cache static assets
2. Activate: Clean old caches
3. Fetch: Serve cached content when offline

### PWA Manifest (manifest.json)

**Configuration**:
- App metadata (name, description)
- Display mode (standalone)
- Theme colors
- Icon definitions (8 sizes)
- Shortcuts
- Categories

**Features**:
- Installable on all platforms
- Custom splash screen
- App shortcuts for quick access

## Data Flow

### RSVP Flow
```
User fills form
    ↓
Submit event fires
    ↓
Data validated
    ↓
Create RSVP item
    ↓
Add to DOM
    ↓
Make draggable
    ↓
(Optional) Save to localStorage
```

### Photo Upload Flow
```
User selects/drops files
    ↓
FileReader reads file
    ↓
Convert to base64
    ↓
Create preview element
    ↓
Add to photo grid
    ↓
(Optional) Save to localStorage
```

### Family Tree Flow
```
User drags RSVP item
    ↓
Drag start event
    ↓
Store data in dataTransfer
    ↓
Drop zone receives item
    ↓
Clone and transform element
    ↓
Place in tree
    ↓
Mark original as placed
```

## State Management

**Current Approach**: DOM as single source of truth

**Data Persistence**:
- localStorage for offline storage
- Base64 encoding for images
- JSON for structured data

**Future Enhancement**:
- Consider IndexedDB for larger datasets
- Add backend API integration
- Implement state management library

## Performance Considerations

**Optimization Strategies**:
1. **Lazy loading**: Images load on demand
2. **Code splitting**: Modules are self-contained
3. **Caching**: Service Worker caches assets
4. **Minification**: Ready for build tools
5. **Compression**: Server-side gzip/brotli

**Metrics to Monitor**:
- First Contentful Paint (FCP)
- Time to Interactive (TTI)
- Lighthouse PWA score
- Cache hit rate

## Security Considerations

**Implemented**:
- HTML escaping for user input
- Content Security Policy ready
- HTTPS required for PWA
- No inline scripts (CSP-friendly)

**Future Enhancements**:
- Add input validation
- Implement rate limiting
- Add authentication
- Sanitize uploaded files

## Accessibility

**Current Features**:
- Semantic HTML5 elements
- Proper heading hierarchy
- ARIA labels where needed
- Keyboard navigation support
- High contrast color scheme
- Readable font sizes

**Future Improvements**:
- Add skip links
- Improve ARIA labels
- Add screen reader announcements
- Keyboard shortcuts

## Browser Compatibility

**Target Support**:
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (iOS 11.3+)
- Opera: Full support

**Fallbacks**:
- Service Worker: Progressive enhancement
- Drag and Drop: Desktop only
- LocalStorage: Cookie fallback possible

## Deployment Considerations

**Production Checklist**:
- [ ] Replace placeholder icons
- [ ] Add actual QR code
- [ ] Update manifest metadata
- [ ] Configure CSP headers
- [ ] Enable HTTPS
- [ ] Minify CSS/JS
- [ ] Optimize images
- [ ] Test offline mode
- [ ] Test on real devices
- [ ] Run Lighthouse audit

## Maintenance Guide

**Regular Updates**:
1. Update service worker version
2. Clear old caches
3. Test on latest browsers
4. Monitor console errors
5. Check PWA compliance

**Code Quality**:
- Follow existing patterns
- Comment complex logic
- Keep modules focused
- Test before deploying

**Version Control**:
- Use semantic versioning
- Update cache names
- Document breaking changes

## Testing Strategy

**Manual Testing**:
- Install on mobile devices
- Test offline functionality
- Verify all interactions
- Check responsive design
- Test drag and drop

**Automated Testing** (Future):
- Unit tests for modules
- E2E tests for user flows
- Performance testing
- Accessibility testing

## Extensibility

**Adding Features**:

1. **Create Module** in app.js:
```javascript
const NewFeature = {
    init() {
        // Initialization logic
    },

    // Methods
};
```

2. **Add Styles** in styles.css:
```css
/* ===========================
   New Feature Section
   =========================== */
```

3. **Add HTML** in index.html:
```html
<div class="section">
    <!-- New content -->
</div>
```

4. **Initialize** in DOMContentLoaded:
```javascript
NewFeature.init();
```

## Future Enhancements

**Planned Features**:
- Backend API integration
- Real-time updates (WebSockets)
- Advanced photo gallery
- Calendar integration
- Email notifications
- Multi-event support
- Admin dashboard
- Analytics integration

**Infrastructure**:
- CI/CD pipeline
- Automated testing
- Performance monitoring
- Error tracking
- A/B testing

---

This architecture supports growth while maintaining simplicity and clarity.

# LeaveSync Features

Complete overview of all features implemented in LeaveSync.

## Core Features

### 1. Shared Calendar View

**Description:** All staff can view a unified calendar showing leaves and public holidays.

**Features:**
- Month view with intuitive date grid
- Color-coded events for easy identification
- Event indicators (dots) on dates with activities
- Interactive date selection
- Month navigation (previous/next)
- Current date highlighting

**User Experience:**
- Clean, modern design using Tailwind CSS
- Responsive layout for all screen sizes
- Smooth animations and transitions
- Mobile-friendly touch interactions

### 2. Color-Coded Leave Types

**Description:** Visual distinction between different types of leave and holidays.

**Color Scheme:**
- 🟢 **Green** - Normal Leave
- 🟠 **Orange/Amber** - Connected Leave (adjacent to weekend/holiday)
- 🔵 **Blue** - Public Holiday
- ⚪ **Gray** - Future: School Holiday (optional)

**Purpose:**
- Quickly identify leave patterns
- Spot connected leave usage
- Distinguish public holidays
- Better calendar readability

### 3. Event Details Modal

**Description:** Tap any date to see detailed information about events.

**Information Shown:**
- Staff member names on leave
- Department and position
- Leave type (Normal/Connected)
- Leave notes/reasons
- Public holiday names and types
- State-specific holidays

**Interaction:**
- Tap date to open modal
- Tap outside modal to close
- Scrollable content for multiple events
- Visual indicators with color coding

### 4. Add Leave Functionality

**Description:** Staff can easily submit leave requests through a dedicated screen.

**Form Fields:**
- Staff member selection (dropdown)
- Start date (YYYY-MM-DD format)
- End date (YYYY-MM-DD format)
- Optional notes/reason

**Features:**
- Quick "Today" button for date selection
- Date format validation
- Date range validation
- User feedback on submission
- Automatic navigation back to calendar

**Backend Processing:**
- Automatic connected leave detection
- Validation of date ranges
- Database transaction safety
- Immediate calendar update

### 5. Connected Leave Detection

**Description:** Intelligent system that automatically identifies leave adjacent to weekends or holidays.

**Detection Logic:**

**Day Before Start Date:**
- Weekend check (state-specific)
- Public holiday check
- Mark as "Connected" if true

**Day After End Date:**
- Weekend check (state-specific)
- Public holiday check
- Mark as "Connected" if true

**State-Specific Weekends:**
- Most states: Saturday-Sunday
- Johor, Kedah, Kelantan, Terengganu: Friday-Saturday

**Benefits:**
- Track long weekend patterns
- Identify leave optimization
- Better resource planning
- Transparent leave tracking

### 6. Malaysia Public Holiday Integration

**Description:** Automatic fetching and caching of Malaysian public holidays by state.

**Features:**
- Integration with Calendarific API
- State-specific holidays
- National holidays visible to all
- Automatic caching in database
- Year-based holiday fetching

**Supported States:**
- Johor, Kedah, Kelantan, Melaka
- Negeri Sembilan, Pahang, Penang, Perak
- Perlis, Selangor, Terengganu
- Sabah, Sarawak
- Kuala Lumpur, Labuan, Putrajaya

**Holiday Types:**
- National holidays (all states)
- State-specific holidays
- Federal Territory holidays

**Caching:**
- Reduces API calls
- Faster calendar loading
- Offline capability
- Manual refresh option

### 7. Advanced Filtering

**Description:** Powerful filtering system to customize calendar view.

**Filter Options:**

**By Staff:**
- View all staff (default)
- Filter by individual staff member
- Horizontal scrollable list

**By Department:**
- Engineering, Marketing, HR, Finance
- Sales, Operations, IT, Legal
- Custom departments supported

**By Leave Type:**
- All leaves (default)
- Normal leave only
- Connected leave only

**By State:**
- All states (default)
- Filter by specific state
- Affects both leaves and holidays

**User Experience:**
- Modal-based filter interface
- Active filter count badge
- "Clear All" quick action
- Instant filter application
- Persistent during session

### 8. Dashboard Statistics

**Description:** Quick overview of key metrics at the top of calendar.

**Metrics Displayed:**
- **Active Leaves**: Current number of leave records
- **Total Staff**: Number of users in system
- **Holidays**: Number of public holidays

**Purpose:**
- Quick insights at a glance
- Track leave volume
- Monitor system usage

### 9. Pull-to-Refresh

**Description:** Easy data refresh mechanism.

**Features:**
- Native pull-to-refresh gesture
- Refreshes all data sources
- Visual loading indicator
- Automatic state management

**Refreshes:**
- All leave records
- User list
- Public holidays
- Filter state maintained

## Technical Features

### Backend

**Node.js + Express API:**
- RESTful endpoints
- CORS enabled
- JSON response format
- Error handling middleware

**MySQL Database:**
- Relational data structure
- Foreign key constraints
- Indexed queries
- Transaction support

**TypeScript:**
- Type safety
- Better IDE support
- Compile-time error checking
- Modern JavaScript features

**Services:**
- Connected leave detection
- Public holiday fetching
- Date calculations
- State-based logic

### Frontend

**React Native + Expo:**
- Cross-platform (iOS, Android, Web)
- Hot reload development
- Native performance
- Web deployment ready

**NativeWind (Tailwind CSS):**
- Utility-first styling
- Consistent design system
- Responsive utilities
- Custom color palette

**React Navigation:**
- Stack-based navigation
- Type-safe routing
- Smooth transitions
- Back button support

**Axios:**
- HTTP client
- Promise-based
- Request/response interceptors
- Error handling

**Date-fns:**
- Modern date manipulation
- Lightweight
- Immutable
- Tree-shakeable

## Future Features (Roadmap)

### Phase 2
- [ ] User authentication and authorization
- [ ] Role-based access control
- [ ] Leave approval workflow
- [ ] Push notifications
- [ ] School holidays integration

### Phase 3
- [ ] Dashboard analytics
  - [ ] Leave heatmap
  - [ ] Peak leave days
  - [ ] Connected leave statistics
  - [ ] Department-wise breakdown
- [ ] Export calendar to PDF/Excel
- [ ] Leave balance tracking
- [ ] Leave type customization

### Phase 4
- [ ] Mobile app stores release
- [ ] Offline mode support
- [ ] Calendar sync (Google/Outlook)
- [ ] Multi-language support
- [ ] Dark mode theme

## Performance Features

**Optimization:**
- Lazy loading components
- Memoized calculations
- Efficient re-renders
- Database query optimization
- Index-based queries

**Caching:**
- Public holiday caching
- API response caching
- Image asset caching
- State management

**Scalability:**
- Connection pooling
- Horizontal scaling ready
- Stateless API design
- Database replication support

## Security Features

**Current:**
- Input validation
- SQL injection prevention (parameterized queries)
- CORS configuration
- Environment variable protection

**Future:**
- JWT authentication
- Password hashing
- Rate limiting
- HTTPS enforcement
- XSS protection
- CSRF protection

## Accessibility Features

**Mobile-First Design:**
- Touch-friendly interface
- Adequate touch targets
- Swipe gestures
- Pull-to-refresh

**Visual Design:**
- High contrast colors
- Clear typography
- Consistent iconography
- Visual feedback on actions

**User Experience:**
- Loading states
- Error messages
- Success confirmations
- Intuitive navigation

## Browser/Platform Support

**Web:**
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

**Mobile:**
- iOS 13+
- Android 5.0+

**Desktop:**
- Works as responsive web app
- Future: Electron desktop app

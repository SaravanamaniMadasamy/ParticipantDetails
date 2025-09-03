# 🎯 Participants Portal

A modern, feature-rich Angular application for managing participant data with advanced UI/UX features and comprehensive functionality.

![Angular](https://img.shields.io/badge/Angular-20-red.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)
![Material](https://img.shields.io/badge/Material%20Design-3.0-green.svg)
![RxJS](https://img.shields.io/badge/RxJS-7.8-purple.svg)

## ✨ Features

### 📊 Dashboard
- **Analytics Overview**: Total participants count and statistics
- **Skill Distribution**: Visual representation of participant skill levels
- **Recent Participants**: Quick access to recently added participants
- **Navigation Cards**: Easy access to different sections of the application

### 👥 Participant Management
- **CRUD Operations**: Complete Create, Read, Update, Delete functionality
- **Advanced Search**: Search across all participant fields (name, email, skills, etc.)
- **Sortable Columns**: Click any column header to sort data
- **Pagination**: Customizable page sizes (5, 10, 20, 50 records per page)
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### 🔄 Enhanced Refresh System
- **Manual Refresh**: Instant data reload with visual feedback
- **Auto-Refresh**: Toggle automatic refreshing every 30 seconds
- **Last Refresh Indicator**: Shows time since last data update
- **Smart Notifications**: Material Design snackbar notifications for all operations

### 🎨 Modern UI/UX
- **Material Design 3**: Latest Material Design components and styling
- **Icons Throughout**: Comprehensive icon integration for better visual hierarchy
- **Smooth Animations**: CSS transitions and loading animations
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support
- **Professional Styling**: Clean, modern interface with hover effects

### 💾 Data Management
- **Reactive Data Flow**: RxJS observables for real-time data synchronization
- **Local Storage**: Persistent data storage in browser
- **Error Handling**: Comprehensive error handling with user feedback
- **Type Safety**: Full TypeScript integration with strict typing

## 🚀 Getting Started

### Prerequisites
- Node.js (version 18 or higher)
- npm or yarn package manager
- Angular CLI (latest version)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AnandSowmithiran/participants-portal.git
   cd participants-portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:4200/`

### Build for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## 🏗️ Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── dashboard/           # Dashboard with analytics
│   │   ├── header/              # Navigation header
│   │   ├── participant-form/    # Add/Edit participant form
│   │   └── participant-list/    # Participant list with table
│   ├── dialogs/
│   │   └── success-dialog/      # Material modal dialogs
│   ├── services/
│   │   └── participant.service  # Data management service
│   └── models/
│       └── participant.model    # TypeScript interfaces
├── assets/                      # Static assets
└── styles/                      # Global styles
```

## 🛠️ Technologies Used

- **Frontend Framework**: Angular 20
- **UI Components**: Angular Material 20
- **Language**: TypeScript 5.0
- **Styling**: SCSS with Material Design
- **State Management**: RxJS Observables
- **Data Storage**: Browser LocalStorage
- **Build Tool**: Angular CLI with Vite
- **Package Manager**: npm

## 📱 Responsive Design

The application is fully responsive and provides optimal user experience across all device sizes:

- **Desktop**: Full feature set with multi-column layouts
- **Tablet**: Optimized layouts with touch-friendly controls
- **Mobile**: Condensed layouts with essential functionality

## 🔧 Key Components

### ParticipantService
- Reactive data management with RxJS
- CRUD operations with error handling
- Real-time data synchronization
- Local storage integration

### Dashboard Component
- Participant statistics and analytics
- Skill level distribution visualization
- Recent participants display
- Navigation to other sections

### Participant List Component
- Advanced table with sorting and pagination
- Global search functionality
- Responsive design with mobile optimizations
- Action buttons for edit, view, delete operations

### Participant Form Component
- Reactive forms with validation
- Dynamic skill level selection
- Edit mode with pre-populated data
- Material modal confirmations

## 🎯 Usage

### Adding a New Participant
1. Click "Add Participant" from the dashboard or participant list
2. Fill in the participant details
3. Rate technical skills on a scale of 1-10
4. Click "Save Details" to add the participant

### Editing a Participant
1. Navigate to the participant list
2. Click the edit icon next to any participant
3. Modify the details as needed
4. Click "Update Details" to save changes

### Searching and Filtering
1. Use the search bar to find specific participants
2. Search works across all fields (name, email, skills, etc.)
3. Click column headers to sort data
4. Use pagination controls to navigate through results

### Auto-Refresh
1. Toggle the auto-refresh button in the participant list
2. Data will automatically refresh every 30 seconds
3. Manual refresh is always available with the refresh button

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Angular team for the amazing framework
- Material Design team for the beautiful UI components
- RxJS team for reactive programming capabilities

---

**Built with ❤️ using Angular and Material Design**

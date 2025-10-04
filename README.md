# 📊 Baseline Migration Planner

> A comprehensive web feature adoption visualization tool built for the Baseline Tooling Hackathon. Plan your migration timeline based on real browser compatibility data from MDN.


## 🚀 Features

- **Real-time Browser Compatibility Data**: Leverages MDN Browser Compatibility Data (@mdn/browser-compat-data)
- **Interactive Timeline Visualization**: Visual timeline showing when features become baseline
- **Feature Impact Analysis**: Categorizes features by adoption impact (high/medium/low)
- **Adoption Threshold Controls**: Customize analysis based on your target browser support
- **Performance Optimized**: Handles large datasets with efficient loading and rendering
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## 🛠 Tech Stack

- **Frontend**: React 19.2.0 + TypeScript
- **Data Visualization**: Recharts
- **Icons**: Lucide React
- **Data Source**: MDN Browser Compatibility Data
- **Styling**: Custom CSS with modern design patterns
- **Build Tool**: Create React App

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Hardik-S-003/baseline-migration-planner.git
   cd baseline-migration-planner
   ```

2. **Install dependencies**
   ```bash
   npm ci
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

### Timeline View
- Visualize when web features become baseline
- Adjust adoption threshold slider to see impact on timeline
- Filter features by baseline status (limited/newly/widely supported)

### Feature Details
- Browse comprehensive list of web platform features
- View detailed compatibility information
- Understand impact level and adoption recommendations

### Project Analysis
- Upload or analyze your project's feature usage
- Get personalized migration recommendations
- Plan your adoption timeline based on user base

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Runs the app in development mode on [http://localhost:3000](http://localhost:3000) |
| `npm test` | Launches the test runner in interactive watch mode |
| `npm run build` | Builds the app for production to the `build` folder |
| `npm run eject` | Ejects from Create React App (⚠️ one-way operation) |

## 🏗 Project Structure

```
baseline-migration-planner/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── ErrorBoundary.tsx
│   │   ├── FeatureCard.tsx
│   │   ├── LoadingState.tsx
│   │   ├── ProjectAnalyzer.tsx
│   │   └── Timeline.tsx
│   ├── data/              # Mock data and constants
│   │   └── mockData.ts
│   ├── styles/            # CSS stylesheets
│   │   └── components.css
│   ├── types/             # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/             # Utility functions
│   │   └── bcdTransform.ts
│   ├── App.tsx            # Main application component
│   └── index.tsx          # Application entry point
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
└── README.md              # Project documentation
```

## 🔧 Configuration

### Browser Support Targets
Update the market share calculations in `src/utils/bcdTransform.ts`:

```typescript
const marketShare = {
  chrome: 0.45,   // 45% market share
  firefox: 0.20,  // 20% market share
  safari: 0.25,   // 25% market share
  edge: 0.10      // 10% market share
};
```

### Feature Loading Limits
Adjust performance settings:

```typescript
const MAX_FEATURES = 100; // Maximum features to load initially
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📈 Performance Considerations

- **Feature Limiting**: Loads maximum 100 features initially to prevent browser freezing
- **Progressive Loading**: Uses setTimeout to prevent UI blocking during data processing
- **Error Boundaries**: Comprehensive error handling for graceful degradation
- **Optimized Rendering**: Efficient React patterns to minimize re-renders

## 🐛 Troubleshooting

### Common Issues

**Build fails with TypeScript errors**
```bash
npm run build
# Check console output for specific errors
```

**Features not loading**
- Check browser console for errors
- Verify MDN BCD data is accessible
- Try refreshing the page

**Performance issues**
- Reduce MAX_FEATURES constant
- Check browser developer tools for memory usage

## 🙏 Acknowledgments

- [MDN Browser Compatibility Data](https://github.com/mdn/browser-compat-data) for comprehensive compatibility information
- [Baseline Tooling Hackathon](https://github.com/web-platform-dx/baseline-tooling-hackathon) for the inspiration
- [Recharts](https://recharts.org/) for excellent visualization components
- [Lucide](https://lucide.dev/) for beautiful icons


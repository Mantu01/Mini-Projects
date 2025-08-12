# Trust-Predict - Premium Health Prediction Platform

Advanced AI-powered health prediction platform providing personalized health insights and recommendations.

## Features

### Health Dashboard
- **Comprehensive Health Assessment Form**: Collects detailed health metrics including:
  - Basic measurements (weight, height, BMI)
  - Vital signs (heart rate, temperature)
  - Lifestyle factors (sleep, exercise, water intake, stress level)
  - Medical history (conditions, medications)

### AI-Powered Health Analysis
- **Intelligent Health Assessment**: Analyzes all provided health data to generate personalized insights
- **Health Score Calculation**: Provides an overall health score (1-10) based on multiple factors
- **Personalized Recommendations**: Offers actionable advice based on individual health metrics
- **Risk Assessment**: Identifies potential health concerns and areas for improvement

### Key Health Metrics Analyzed

#### Basic Measurements
- **Weight** (kg): Analyzed for healthy weight ranges
- **Height** (cm): Used in BMI calculations
- **BMI**: Categorized as underweight, normal, overweight, or obese

#### Vital Signs
- **Heart Rate** (bpm): Evaluated for normal ranges (60-100 bpm)
- **Temperature** (°C): Checked against normal body temperature (36.1-37.2°C)

#### Lifestyle Factors
- **Sleep Hours**: Analyzed for optimal sleep duration (7-8 hours recommended)
- **Exercise Frequency**: Evaluated from never to daily exercise
- **Water Intake**: Assessed for proper hydration (6-8 glasses recommended)
- **Stress Level**: Monitored from very low to very high stress

#### Medical Information
- **Existing Medical Conditions**: Considered in overall health assessment
- **Current Medications**: Factored into health recommendations

## How It Works

### 1. Data Collection
Users fill out the comprehensive health assessment form in the dashboard, providing:
- Basic physical measurements
- Current vital signs
- Lifestyle information
- Medical history

### 2. AI Analysis
The system processes all health data through:
- **Local Analysis Engine**: Provides immediate health insights and scoring
- **AI-Powered Recommendations**: Generates personalized health advice
- **Risk Assessment**: Identifies potential health concerns

### 3. Results Display
Users receive a detailed health report including:
- **Health Score**: Overall health rating (1-10)
- **Category Analysis**: Breakdown by health metrics
- **Personalized Recommendations**: Actionable steps for improvement
- **Medical Disclaimer**: Professional medical advice reminder

## Technical Implementation

### Frontend Architecture
- **Vanilla JavaScript**: No framework dependencies
- **Modular Design**: Separate AI module (`ai.js`) and main app (`app.js`)
- **Responsive UI**: Tailwind CSS for modern, mobile-friendly design

### Health Analysis Engine
- **Data Validation**: Ensures all health inputs are valid
- **Scoring Algorithm**: Calculates health scores based on medical guidelines
- **Recommendation Engine**: Generates personalized health advice
- **Error Handling**: Graceful fallbacks for missing or invalid data

### Browser Compatibility
- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **No Build Process**: Direct browser execution
- **Local Storage**: User data persistence

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Trust-Predict
   ```

2. **Install dependencies** (for Tailwind CSS)
   ```bash
   npm install
   ```

3. **Build CSS** (development)
   ```bash
   npm run dev
   ```

4. **Serve the application**
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   ```

5. **Access the application**
   - Open `http://localhost:8000` in your browser
   - Navigate to the Dashboard to test health analysis

## Usage

### For Users
1. **Sign Up/Login**: Create an account or log in
2. **Access Dashboard**: Navigate to the health dashboard
3. **Fill Health Form**: Complete the comprehensive health assessment
4. **Submit for Analysis**: Click "Analyze Health Data"
5. **Review Results**: View personalized health insights and recommendations

### For Developers
- **AI Module**: Located in `js/ai.js`
- **Main App**: Located in `js/app.js`
- **Dashboard**: Located in `pages/dashboard.html`
- **Styling**: Tailwind CSS in `src/input.css`

## Health Analysis Features

### Real-time BMI Calculation
- Automatically calculates BMI as users enter weight and height
- Provides immediate feedback on weight status

### Comprehensive Health Scoring
- **Base Score**: 5/10 starting point
- **BMI Bonus**: +1 for normal weight, penalties for extremes
- **Vital Signs**: +1 for normal ranges, -0.5 for abnormal
- **Lifestyle**: Bonuses for healthy habits (sleep, exercise, hydration, stress management)

### Smart Recommendations
- **Personalized Advice**: Based on individual health metrics
- **Actionable Steps**: Specific, achievable health improvements
- **Risk Awareness**: Identifies areas needing attention
- **Positive Reinforcement**: Celebrates healthy habits

## Security & Privacy

- **Client-side Processing**: Health analysis runs locally in the browser
- **No External API Calls**: Protects user privacy
- **Local Storage**: User data stored locally
- **Medical Disclaimer**: Clear professional medical advice notice

## Future Enhancements

- **Server-side AI Integration**: Connect to external AI services for enhanced analysis
- **Health Trend Tracking**: Monitor health changes over time
- **Integration with Health Devices**: Connect to fitness trackers and medical devices
- **Professional Medical Review**: Partner with healthcare providers for validation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Email: info@trustpredict.com
- Phone: +1 (555) 123-4567

---

**Disclaimer**: This application provides health information for educational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare providers for medical concerns.

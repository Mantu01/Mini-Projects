// Health AI Module for Browser Environment with Gemini AI Integration
class HealthAI {

    constructor() {
        this.apiKey = 'AIzaSyD7y3Sfg6SMAmPUWIjsr-XKkPROprQUy78';
        this.isGeminiAvailable = true;
    }

    async generateAIResponse(healthData) {
        try {
            // Validate input data
            if (!healthData || typeof healthData !== 'object') {
                return this.generateErrorResponse("Invalid health data provided");
            }

            // Extract all health data fields from dashboard
            const {
                weight,
                height,
                bmi,
                'heart-rate': heartRate,
                temperature,
                'sleep-hours': sleepHours,
                'exercise-frequency': exerciseFrequency,
                'water-intake': waterIntake,
                'stress-level': stressLevel,
                'medical-conditions': medicalConditions,
                medications
            } = healthData;

            // Check if we have at least some basic data
            if (!weight && !height && !heartRate && !temperature) {
                return this.generateErrorResponse("Please provide at least some basic health measurements");
            }

            // Try Gemini AI first if available
            if (this.isGeminiAvailable) {
                try {
                    const aiResponse = await this.generateGeminiResponse(healthData);
                    if (aiResponse) {
                        return this.formatAIResponse(aiResponse, healthData);
                    }
                } catch (error) {
                    console.warn('Gemini AI failed, falling back to local analysis:', error);
                }
            }

            // Fallback to local analysis
            return this.generateLocalAnalysis(healthData);

        } catch (error) {
            console.error('AI Analysis Error:', error);
            // Fallback to local analysis if AI fails
            return this.generateLocalAnalysis(healthData);
        }
    }

    async generateGeminiResponse(healthData) {
        try {
            const {
                weight,
                height,
                bmi,
                'heart-rate': heartRate,
                temperature,
                'sleep-hours': sleepHours,
                'exercise-frequency': exerciseFrequency,
                'water-intake': waterIntake,
                'stress-level': stressLevel,
                'medical-conditions': medicalConditions,
                medications
            } = healthData;

            // Get the prompt template
            const promptTemplate = this.getHealthPredictionPrompt();
            
            // Process medical information more carefully
            const processMedicalInfo = (info) => {
                if (!info || info.trim() === '') return 'None reported';
                return info.trim();
            };

            // Replace placeholders with actual data
            const prompt = promptTemplate
                .replace('{{weight}}', weight || 'Not provided')
                .replace('{{height}}', height || 'Not provided')
                .replace('{{bmi}}', bmi || 'Not calculated')
                .replace('{{heartRate}}', heartRate || 'Not provided')
                .replace('{{temperature}}', temperature || 'Not provided')
                .replace('{{sleepHours}}', sleepHours || 'Not provided')
                .replace('{{exerciseFrequency}}', exerciseFrequency || 'Not provided')
                .replace('{{waterIntake}}', waterIntake || 'Not provided')
                .replace('{{stressLevel}}', stressLevel || 'Not provided')
                .replace('{{existingConditions}}', processMedicalInfo(medicalConditions))
                .replace('{{currentMedications}}', processMedicalInfo(medications));

            // Make API call to Gemini
            const response = await this.callGeminiAPI(prompt);
            return response;

        } catch (error) {
            console.error('Gemini API Error:', error);
            throw error;
        }
    }

    async callGeminiAPI(prompt) {
        try {
            // Using fetch to call Gemini API
            const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 3072
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`Gemini API error: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                return data.candidates[0].content.parts[0].text;
            } else {
                throw new Error('Invalid response format from Gemini API');
            }

        } catch (error) {
            console.error('Gemini API call failed:', error);
            throw error;
        }
    }

    getHealthPredictionPrompt() {
        return `
You are a medical health prediction AI. Analyze the user's health condition and provide comprehensive insights based on the following details:

**Basic Measurements:**
- Weight (kg): {{weight}}
- Height (cm): {{height}}
- BMI: {{bmi}}

**Vital Signs:**
- Heart Rate (bpm): {{heartRate}}
- Body Temperature (°C): {{temperature}}

**Lifestyle Factors:**
- Sleep Hours per Day: {{sleepHours}}
- Exercise Frequency: {{exerciseFrequency}}
- Water Intake: {{waterIntake}}
- Stress Level: {{stressLevel}}

**Medical Information:**
- Existing Medical Conditions: {{existingConditions}}
- Current Medications: {{currentMedications}}

**CRITICAL REQUIREMENT:** You MUST provide detailed analysis of the medical conditions and medications that the user has provided. If the user has entered specific medical conditions or medications, you MUST:

1. **Analyze Each Medical Condition** - For each condition mentioned, explain:
   - How it affects their overall health
   - What lifestyle modifications are recommended
   - Potential complications to watch for
   - How it impacts their health score

2. **Analyze Each Medication** - For each medication mentioned, explain:
   - What the medication is for
   - How it affects their health management
   - Potential side effects or interactions
   - Lifestyle considerations while taking this medication

3. **Provide Medical-Specific Recommendations** - Give specific advice based on their actual medical conditions and medications

Provide a comprehensive health analysis in this EXACT format:

## **Overall Health Summary**
[Include specific analysis of how their medical conditions and medications affect their health status]

## **Medical Conditions Analysis**
[If medical conditions are provided, analyze each one specifically. If none, state "No medical conditions reported."]

## **Medications Analysis**
[If medications are provided, analyze each one specifically. If none, state "No medications reported."]

## **Health Risk Assessment**
[Consider risks related to their specific medical conditions, medications, and potential interactions]

## **Personalized Recommendations**
[Provide specific advice that takes into account their actual medical conditions and medications]

## **Health Score (1-10)**
[Calculate a health score considering all factors including medical conditions and medications]

## **Medical Management Tips**
[If medical conditions or medications are reported, provide specific management advice]

**IMPORTANT:** If the user has provided specific medical conditions or medications, you MUST address them individually and provide meaningful insights about each one. Do not give generic responses - analyze their actual medical information.

**Note:** This analysis is for informational purposes only and should not replace professional medical advice. Always recommend consulting with healthcare providers for medical concerns.
`;
    }

    formatAIResponse(aiResponse, healthData) {
        return `
            <div class="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-8 shadow-lg">
                <div class="flex items-center mb-6">
                    <div class="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                        </svg>
                    </div>
                    <div>
                        <h3 class="text-2xl font-bold text-gray-900">AI Health Analysis</h3>
                        <p class="text-gray-600">Generated on ${new Date().toLocaleDateString()}</p>
                        <div class="flex items-center mt-1">
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                                </svg>
                                AI-Powered
                            </span>
                        </div>
                    </div>
                </div>

                <div class="prose prose-blue max-w-none">
                    <div class="whitespace-pre-wrap text-gray-800 leading-relaxed">
                        ${aiResponse}
                    </div>
                </div>

                <div class="mt-8 p-4 bg-blue-100 rounded-lg border border-blue-200">
                    <div class="flex items-center">
                        <svg class="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <p class="text-blue-800 font-medium">This analysis is for informational purposes only and should not replace professional medical advice.</p>
                    </div>
                </div>
            </div>
        `;
    }

    generateLocalAnalysis(healthData) {
        const {
            weight,
            height,
            bmi,
            'heart-rate': heartRate,
            temperature,
            'sleep-hours': sleepHours,
            'exercise-frequency': exerciseFrequency,
            'water-intake': waterIntake,
            'stress-level': stressLevel,
            'medical-conditions': medicalConditions,
            medications
        } = healthData;

        let analysis = '<div class="space-y-6">';
        
        // BMI Analysis
        if (bmi) {
            let bmiStatus = '';
            let bmiColor = '';
            if (bmi < 18.5) {
                bmiStatus = 'Underweight';
                bmiColor = 'text-yellow-600';
            } else if (bmi >= 18.5 && bmi < 25) {
                bmiStatus = 'Normal weight';
                bmiColor = 'text-green-600';
            } else if (bmi >= 25 && bmi < 30) {
                bmiStatus = 'Overweight';
                bmiColor = 'text-orange-600';
            } else {
                bmiStatus = 'Obese';
                bmiColor = 'text-red-600';
            }
            
            analysis += `
                <div class="bg-white rounded-lg p-6 shadow-md">
                    <h4 class="text-lg font-semibold text-gray-900 mb-3">BMI Analysis</h4>
                    <p class="text-gray-700">Your BMI is <span class="font-semibold">${bmi}</span> which indicates <span class="font-semibold ${bmiColor}">${bmiStatus}</span>.</p>
                </div>
            `;
        }

        // Vital Signs Analysis
        if (heartRate || temperature) {
            analysis += '<div class="bg-white rounded-lg p-6 shadow-md">';
            analysis += '<h4 class="text-lg font-semibold text-gray-900 mb-3">Vital Signs</h4>';
            
            if (heartRate) {
                let heartRateStatus = '';
                if (heartRate < 60) heartRateStatus = 'Bradycardia (slow heart rate)';
                else if (heartRate > 100) heartRateStatus = 'Tachycardia (fast heart rate)';
                else heartRateStatus = 'Normal heart rate';
                
                analysis += `<p class="text-gray-700 mb-2">Heart Rate: <span class="font-semibold">${heartRate} bpm</span> - ${heartRateStatus}</p>`;
            }
            
            if (temperature) {
                let tempStatus = '';
                if (temperature < 36.1) tempStatus = 'Below normal';
                else if (temperature > 37.2) tempStatus = 'Above normal';
                else tempStatus = 'Normal temperature';
                
                analysis += `<p class="text-gray-700">Temperature: <span class="font-semibold">${temperature}°C</span> - ${tempStatus}</p>`;
            }
            
            analysis += '</div>';
        }

        // Lifestyle Analysis
        if (sleepHours || exerciseFrequency || waterIntake || stressLevel) {
            analysis += '<div class="bg-white rounded-lg p-6 shadow-md">';
            analysis += '<h4 class="text-lg font-semibold text-gray-900 mb-3">Lifestyle Assessment</h4>';
            
            if (sleepHours) {
                let sleepAdvice = '';
                if (sleepHours === 'less-than-5') sleepAdvice = 'Consider increasing sleep duration for better health';
                else if (sleepHours === '7-8') sleepAdvice = 'Excellent sleep duration!';
                else if (sleepHours === 'more-than-9') sleepAdvice = 'Consider if this is affecting your daily activities';
                else sleepAdvice = 'Adequate sleep duration';
                
                analysis += `<p class="text-gray-700 mb-2">Sleep: <span class="font-semibold">${sleepHours}</span> - ${sleepAdvice}</p>`;
            }
            
            if (exerciseFrequency) {
                let exerciseAdvice = '';
                if (exerciseFrequency === 'never' || exerciseFrequency === 'rarely') {
                    exerciseAdvice = 'Consider starting with light activities like walking';
                } else if (exerciseFrequency === 'regularly' || exerciseFrequency === 'daily') {
                    exerciseAdvice = 'Great exercise routine!';
                } else {
                    exerciseAdvice = 'Good start, consider increasing frequency';
                }
                
                analysis += `<p class="text-gray-700 mb-2">Exercise: <span class="font-semibold">${exerciseFrequency}</span> - ${exerciseAdvice}</p>`;
            }
            
            if (waterIntake) {
                let waterAdvice = '';
                if (waterIntake === 'less-than-4') waterAdvice = 'Consider increasing water intake';
                else if (waterIntake === '6-8' || waterIntake === '8-10') waterAdvice = 'Good hydration habits!';
                else waterAdvice = 'Adequate water intake';
                
                analysis += `<p class="text-gray-700 mb-2">Water Intake: <span class="font-semibold">${waterIntake}</span> - ${waterAdvice}</p>`;
            }
            
            if (stressLevel) {
                let stressAdvice = '';
                if (stressLevel === 'high' || stressLevel === 'very-high') {
                    stressAdvice = 'Consider stress management techniques like meditation or exercise';
                } else if (stressLevel === 'very-low' || stressLevel === 'low') {
                    stressAdvice = 'Excellent stress management!';
                } else {
                    stressAdvice = 'Moderate stress levels, monitor if it increases';
                }
                
                analysis += `<p class="text-gray-700">Stress Level: <span class="font-semibold">${stressLevel}</span> - ${stressAdvice}</p>`;
            }
            
            analysis += '</div>';
        }

        // Overall Health Score
        let healthScore = this.calculateHealthScore(healthData);
        analysis += `
            <div class="bg-white rounded-lg p-6 shadow-md">
                <h4 class="text-lg font-semibold text-gray-900 mb-3">Overall Health Score</h4>
                <div class="text-center">
                    <div class="text-4xl font-bold text-blue-600 mb-2">${healthScore}/10</div>
                    <p class="text-gray-700">${this.getHealthScoreDescription(healthScore)}</p>
                </div>
            </div>
        `;

        // Recommendations
        analysis += `
            <div class="bg-white rounded-lg p-6 shadow-md">
                <h4 class="text-lg font-semibold text-gray-900 mb-3">Recommendations</h4>
                <ul class="space-y-2 text-gray-700">
                    ${this.generateRecommendations(healthData)}
                </ul>
            </div>
        `;

        analysis += '</div>';

        return `
            <div class="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-8 shadow-lg">
                <div class="flex items-center mb-6">
                    <div class="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <div>
                        <h3 class="text-2xl font-bold text-gray-900">Health Analysis</h3>
                        <p class="text-gray-600">Generated on ${new Date().toLocaleDateString()}</p>
                        <div class="flex items-center mt-1">
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                                </svg>
                                Local Analysis
                            </span>
                        </div>
                    </div>
                </div>

                ${analysis}

                <div class="mt-8 p-4 bg-blue-100 rounded-lg border border-blue-200">
                    <div class="flex items-center">
                        <svg class="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                </div>
            </div>
        `;
    }

    calculateHealthScore(healthData) {
        let score = 5; // Base score
        
        // BMI scoring
        if (healthData.bmi) {
            if (healthData.bmi >= 18.5 && healthData.bmi < 25) score += 1;
            else if (healthData.bmi >= 25 && healthData.bmi < 30) score -= 0.5;
            else if (healthData.bmi >= 30) score -= 1;
        }
        
        // Heart rate scoring
        if (healthData['heart-rate']) {
            const hr = parseInt(healthData['heart-rate']);
            if (hr >= 60 && hr <= 100) score += 1;
            else score -= 0.5;
        }
        
        // Temperature scoring
        if (healthData.temperature) {
            const temp = parseFloat(healthData.temperature);
            if (temp >= 36.1 && temp <= 37.2) score += 1;
            else score -= 0.5;
        }
        
        // Lifestyle scoring
        if (healthData['sleep-hours'] === '7-8') score += 1;
        if (healthData['exercise-frequency'] === 'regularly' || healthData['exercise-frequency'] === 'daily') score += 1;
        if (healthData['water-intake'] === '6-8' || healthData['water-intake'] === '8-10') score += 0.5;
        if (healthData['stress-level'] === 'low' || healthData['stress-level'] === 'very-low') score += 0.5;
        
        return Math.max(1, Math.min(10, Math.round(score)));
    }

    getHealthScoreDescription(score) {
        if (score >= 8) return 'Excellent health! Keep up the great work.';
        if (score >= 6) return 'Good health with room for improvement.';
        if (score >= 4) return 'Fair health - consider lifestyle changes.';
        return 'Health needs attention - consult a healthcare provider.';
    }

    generateRecommendations(healthData) {
        let recommendations = [];
        
        // BMI recommendations
        if (healthData.bmi) {
            if (healthData.bmi < 18.5) {
                recommendations.push('Consider increasing caloric intake with healthy foods');
            } else if (healthData.bmi >= 25) {
                recommendations.push('Focus on balanced diet and regular exercise for weight management');
            }
        }
        
        // Sleep recommendations
        if (healthData['sleep-hours'] === 'less-than-5') {
            recommendations.push('Aim for 7-8 hours of sleep per night for optimal health');
        }
        
        // Exercise recommendations
        if (healthData['exercise-frequency'] === 'never' || healthData['exercise-frequency'] === 'rarely') {
            recommendations.push('Start with 30 minutes of moderate exercise 3-4 times per week');
        }
        
        // Water intake recommendations
        if (healthData['water-intake'] === 'less-than-4') {
            recommendations.push('Increase water intake to 6-8 glasses per day');
        }
        
        // Stress management
        if (healthData['stress-level'] === 'high' || healthData['stress-level'] === 'very-high') {
            recommendations.push('Practice stress management techniques like meditation or deep breathing');
        }
        
        // Default recommendations
        if (recommendations.length === 0) {
            recommendations = [
                'Maintain your current healthy lifestyle',
                'Continue regular health check-ups',
                'Stay hydrated and get adequate sleep',
                'Keep up with regular exercise routine'
            ];
        }
        
        return recommendations.map(rec => `<li class="flex items-start"><span class="text-blue-600 mr-2">•</span>${rec}</li>`).join('');
    }

    generateErrorResponse(message) {
        return `
            <div class="bg-red-50 border border-red-200 rounded-lg p-6">
                <div class="flex items-center">
                    <svg class="w-6 h-6 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <h3 class="text-lg font-semibold text-red-800">Analysis Error</h3>
                </div>
                <p class="text-red-700 mt-2">${message}</p>
                <p class="text-red-600 text-sm mt-2">Please check your input data and try again.</p>
            </div>
        `;
    }
}

// Make HealthAI available globally for use in app.js
window.HealthAI = HealthAI;

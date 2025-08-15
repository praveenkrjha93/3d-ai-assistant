# 3D AI Assistant

A sophisticated browser-based 3D talking AI assistant built with Three.js, featuring realistic lip-sync animations, text-to-speech capabilities, and real-time conversation functionality. This project creates an immersive conversational experience with a 3D avatar that responds to user queries with synchronized mouth movements and natural speech.

![3D AI Assistant Demo](https://img.shields.io/badge/Status-Active-brightgreen) ![License](https://img.shields.io/badge/License-MIT-blue) ![Version](https://img.shields.io/badge/Version-1.0.0-orange)

## 📸 Preview

![3D AI Assistant Screenshot](../3d-bot.png)

*The 3D AI Assistant in action - featuring a modern glassmorphism UI with an interactive 3D avatar, real-time chat interface, and voice controls.*

## 🎯 Project Overview

The 3D AI Assistant is a cutting-edge web application that combines modern 3D graphics with artificial intelligence to create an interactive virtual assistant. The project demonstrates advanced web technologies including WebGL rendering, speech synthesis, phoneme-based lip synchronization, and real-time 3D animations.

### Key Features

- **🎭 3D Avatar Rendering**: Photorealistic 3D character using Three.js with GLTF/GLB model support
- **💬 Intelligent Conversations**: Configurable AI API integration for natural language processing
- **🗣️ Advanced Text-to-Speech**: Browser-native Web Speech API with voice selection and volume control
- **👄 Realistic Lip Sync**: Phoneme-based mouth animations using morph targets for natural speech visualization
- **🎨 Modern UI/UX**: Responsive glassmorphism design with smooth animations and transitions
- **📱 Cross-Platform**: Works seamlessly on desktop and mobile devices
- **⚙️ Highly Configurable**: Easy customization of 3D models, API endpoints, and visual settings
- **🎯 Real-time Interactions**: Live conversation history with timestamps and message threading

## 🛠️ Technologies Used

### Frontend Technologies
- **Three.js** (r128) - 3D graphics rendering and WebGL management
- **JavaScript ES6+** - Modern JavaScript features and async/await patterns
- **HTML5 Canvas** - 3D rendering surface and fallback avatar generation
- **CSS3** - Advanced styling with gradients, backdrop filters, and animations
- **Web Speech API** - Browser-native text-to-speech synthesis
- **WebGL** - Hardware-accelerated 3D graphics rendering

### 3D Graphics Stack
- **GLTF/GLB Loader** - 3D model loading and parsing
- **Morph Target Animation** - Facial expression and lip-sync control
- **PBR Materials** - Physically-based rendering for realistic lighting
- **Shadow Mapping** - Dynamic shadow casting and receiving
- **Particle Systems** - Environmental effects and visual enhancements

### Development Tools
- **Vanilla JavaScript** - No framework dependencies for maximum compatibility
- **Modular Architecture** - Clean separation of concerns and reusable components
- **Local Storage API** - Persistent configuration and user preferences
- **Responsive Design** - Mobile-first approach with flexible layouts

## 🔧 How It Works

### Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Input    │───▶│  AI Processing  │───▶│  3D Rendering   │
│                 │    │                 │    │                 │
│ • Text Input    │    │ • API Calls     │    │ • Avatar Model  │
│ • Voice Config  │    │ • Response Gen  │    │ • Lip Sync      │
│ • Settings      │    │ • History Mgmt  │    │ • Animations    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 ▼
                    ┌─────────────────┐
                    │ Speech Synthesis │
                    │                 │
                    │ • TTS Engine    │
                    │ • Phoneme Map   │
                    │ • Voice Control │
                    └─────────────────┘
```

### Core Components

1. **3D Scene Management**
   - Three.js scene initialization with optimized lighting
   - Camera positioning and responsive viewport handling
   - 3D model loading with fallback avatar generation
   - Real-time animation loops with performance optimization

2. **Lip Synchronization Engine**
   - Text-to-phoneme conversion using linguistic mapping
   - Morph target animation based on speech sounds
   - Timing synchronization between audio and visual
   - Fallback geometric mouth shapes for models without morph targets

3. **AI Integration Layer**
   - RESTful API communication with configurable endpoints
   - Conversation history management and context preservation
   - Error handling with graceful fallback responses
   - Asynchronous request processing with loading states

4. **Speech Synthesis System**
   - Web Speech API integration with voice selection
   - Volume and rate control with real-time adjustment
   - Cross-browser compatibility and fallback handling
   - Speech event management for animation synchronization

## 📸 Visuals

### User Interface Components

- **3D Avatar Viewport**: Interactive 3D scene with glassmorphism background effects
- **Chat Interface**: Modern messaging UI with bubble-style conversations
- **Control Panel**: Voice selection, volume control, and speech management
- **Settings Modal**: API configuration with secure endpoint management
- **Status Indicators**: Real-time feedback for loading, thinking, and speaking states

### Visual Effects

- **Particle Systems**: Ambient floating particles around the avatar
- **Breathing Animation**: Subtle chest movement for lifelike presence
- **Eye Blinking**: Randomized blinking patterns for natural behavior
- **Head Movement**: Gentle idle animations when not speaking
- **Glow Effects**: Ambient lighting and material enhancement

### Responsive Design

- **Desktop**: Side-by-side layout with full 3D viewport
- **Tablet**: Stacked layout with optimized touch controls
- **Mobile**: Compact design with gesture-friendly interface
- **Accessibility**: High contrast mode and reduced motion support

## 🚀 How to Get Started

### Prerequisites

- Modern web browser with WebGL support (Chrome, Firefox, Safari, Edge)
- Local web server (required for 3D model loading due to CORS restrictions)
- AI API endpoint (optional - includes fallback responses for demo)

### Quick Setup

1. **Download the Project**
   ```bash
   git clone <repository-url>
   cd 3d-ai-assistant
   ```

2. **Start a Local Server**
   
   Choose one of these methods:
   
   **Python 3:**
   ```bash
   python -m http.server 8000
   ```
   
   **Python 2:**
   ```bash
   python -m SimpleHTTPServer 8000
   ```
   
   **Node.js:**
   ```bash
   npx http-server -p 8000
   ```
   
   **PHP:**
   ```bash
   php -S localhost:8000
   ```

3. **Open in Browser**
   ```
   http://localhost:8000
   ```

4. **Configure Your AI API** (Optional)
   - Click the settings button (⚙️) in the top-right corner
   - Enter your AI API endpoint URL
   - Save configuration

### Advanced Setup

#### Custom 3D Avatar

1. **Prepare Your Model**
   - Format: GLTF (.gltf) or GLB (.glb)
   - Size: Under 10MB recommended
   - Include facial morph targets for lip sync

2. **Add Model to Project**
   ```bash
   mkdir -p models
   cp your-avatar.glb models/
   ```

3. **Update Configuration**
   ```javascript
   // In app.js or config.js
   AVATAR_MODEL_URL: './models/your-avatar.glb'
   ```

#### API Integration

**Expected API Format:**
```json
POST /your-endpoint
Content-Type: application/json

{
  "message": "User's question",
  "conversation_history": [
    {
      "sender": "user",
      "content": "Previous message",
      "timestamp": "2024-01-01T12:00:00Z"
    }
  ]
}
```

**Response Format:**
```
Plain text response from your AI service
```

### File Structure

```
3d-ai-assistant/
├── index.html              # Main application entry point
├── app.js                  # Core application logic and 3D rendering
├── config.js               # Configuration settings and customization
├── styles.css              # Responsive styling and animations
├── models/                 # 3D model directory
│   ├── README.md          # Model setup instructions
│   └── avatar.glb         # Your 3D avatar (add your own)
└── README.md              # This documentation
```

## 📋 Configuration Guide

### Basic Configuration

Edit `config.js` to customize your assistant:

```javascript
const CONFIG = {
    AVATAR: {
        MODEL_URL: './models/your-avatar.glb',
        POSITION: { x: 0, y: -1, z: 0 },
        SCALE: { x: 1, y: 1, z: 1 }
    },
    API: {
        ENDPOINT: 'https://your-api.com/chat',
        TIMEOUT: 30000
    },
    TTS: {
        RATE: 0.9,
        PITCH: 1.0,
        VOLUME: 0.8
    }
};
```

### Morph Target Mapping

For custom 3D models with different morph target names:

```javascript
MORPH_TARGETS: {
    'A': 'your_morph_name_for_A_sound',
    'E': 'your_morph_name_for_E_sound',
    'I': 'your_morph_name_for_I_sound',
    // ... continue for all phonemes
}
```

### Visual Customization

```javascript
UI: {
    COLORS: {
        primary: '#667eea',
        secondary: '#764ba2',
        accent: '#4CAF50'
    },
    CHAT: {
        max_history: 50,
        auto_scroll: true
    }
}
```

## 🔧 Troubleshooting

### Common Issues

**3D Model Not Loading**
- ✅ Ensure you're using HTTP/HTTPS (not file://)
- ✅ Check model file path and format (GLTF/GLB only)
- ✅ Verify file size is under 10MB
- ✅ Check browser console for detailed error messages

**Text-to-Speech Not Working**
- ✅ Use HTTPS for full Web Speech API support
- ✅ Test different voices in the voice selector
- ✅ Check browser compatibility (Chrome/Edge recommended)
- ✅ Verify audio permissions in browser settings

**API Connection Failing**
- ✅ Verify API endpoint URL format
- ✅ Check CORS headers on your API server
- ✅ Test API endpoint with curl or Postman
- ✅ Review network tab in browser developer tools

**Lip Sync Not Working**
- ✅ Confirm 3D model has facial morph targets
- ✅ Check morph target names match configuration
- ✅ Test with fallback avatar first
- ✅ Enable debug logging to see available morph targets

### Performance Optimization

- **Model Optimization**: Use Draco compression for GLTF files
- **Texture Compression**: Optimize texture sizes and formats
- **LOD Implementation**: Use level-of-detail for complex models
- **Animation Culling**: Disable animations when tab is not active

## 📄 License

This project is licensed under the MIT License - see below for details:

```
MIT License

Copyright (c) 2024 3D AI Assistant

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 🤝 Contributing

We welcome contributions to improve the 3D AI Assistant! Here are some areas where you can help:

### Priority Areas
- **Enhanced Lip-Sync Algorithms**: More accurate phoneme detection and timing
- **Additional 3D Model Formats**: Support for FBX, OBJ, and other formats
- **Voice Activity Detection**: Automatic speech recognition for two-way conversations
- **Mobile Gesture Controls**: Touch and swipe interactions for mobile devices
- **Performance Optimizations**: Better memory management and rendering efficiency

### How to Contribute
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style and conventions
- Add comments for complex algorithms
- Test on multiple browsers and devices
- Update documentation for new features
- Include performance considerations

## 📞 Support & Community

### Getting Help
- **Documentation**: Check this README and inline code comments
- **Browser Console**: Look for error messages and debug information
- **Network Tab**: Verify API requests and responses
- **Model Validation**: Test with the included fallback avatar first

### Reporting Issues
When reporting bugs, please include:
- Browser version and operating system
- Console error messages
- Steps to reproduce the issue
- Expected vs actual behavior
- Screenshots or screen recordings if applicable

### Feature Requests
We're always looking to improve! Suggest new features by:
- Describing the use case and benefits
- Providing mockups or examples if applicable
- Considering implementation complexity
- Discussing potential alternatives

## 🔮 Future Roadmap

### Planned Features
- **Multi-language Support**: Internationalization and localization
- **Voice Recognition**: Speech-to-text for hands-free interaction
- **Emotion Detection**: Facial expressions based on conversation sentiment
- **Custom Animations**: User-defined gestures and movements
- **WebXR Integration**: VR/AR support for immersive experiences
- **Real-time Collaboration**: Multi-user conversations and shared experiences

### Technical Improvements
- **WebAssembly Integration**: Performance-critical operations in WASM
- **Progressive Web App**: Offline functionality and app-like experience
- **Advanced Lighting**: IBL and HDR environment mapping
- **Physics Integration**: Realistic hair and clothing simulation
- **AI Model Integration**: Local AI processing with TensorFlow.js

---

**Built with ❤️ using Three.js, Web APIs, and modern JavaScript**

*For the latest updates and community discussions, visit our project repository.*

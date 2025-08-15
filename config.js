/**
 * Configuration file for 3D AI Assistant
 * 
 * This file contains all the customizable settings for the application.
 * Modify these values to customize your 3D AI assistant.
 */

const CONFIG = {
    // 3D Model Configuration
    AVATAR: {
        // Path to your 3D model file (GLTF/GLB format)
        MODEL_URL: './models/avatar.glb',
        
        // Initial position and scale of the avatar
        POSITION: { x: 0, y: -1, z: 0 },
        SCALE: { x: 1, y: 1, z: 1 },
        
        // Camera settings
        CAMERA_POSITION: { x: 0, y: 1.6, z: 3 },
        CAMERA_FOV: 50,
    },
    
    // API Configuration
    API: {
        // Your AI service endpoint
        ENDPOINT: 'https://api.example.com/chat',
        
        // Request configuration
        METHOD: 'POST',
        HEADERS: {
            'Content-Type': 'application/json',
        },
        
        // Timeout in milliseconds
        TIMEOUT: 30000,
    },
    
    // Morph Targets for Lip Sync
    // Adjust these names to match your 3D model's morph targets
    MORPH_TARGETS: {
        'A': 'viseme_aa',      // Open mouth (ah, aa)
        'E': 'viseme_E',       // Smile (ee, eh)
        'I': 'viseme_I',       // Small opening (ih, iy)
        'O': 'viseme_O',       // Round mouth (oh, ow)
        'U': 'viseme_U',       // Pucker (uw, uh)
        'M': 'viseme_PP',      // Closed lips (m, p, b)
        'L': 'viseme_DD',      // Tongue (l, d, t)
        'S': 'viseme_SS',      // Hiss (s, z, sh)
        'F': 'viseme_FF',      // Teeth on lip (f, v)
        'TH': 'viseme_TH',     // Tongue between teeth (th)
        'R': 'viseme_RR',      // R sound
        'rest': 'viseme_sil'   // Neutral/rest position
    },
    
    // Text-to-Speech Configuration
    TTS: {
        // Default voice settings
        RATE: 0.9,
        PITCH: 1.0,
        VOLUME: 0.8,
        
        // Voice preferences
        PREFERRED_VOICES: {
            female: ['female', 'woman', 'zira', 'hazel'],
            male: ['male', 'man', 'david', 'mark']
        }
    },
    
    // Animation Settings
    ANIMATION: {
        // Head movement when idle
        HEAD_MOVEMENT: {
            enabled: true,
            intensity: 0.1,
            speed: 0.5
        },
        
        // Blinking animation
        BLINKING: {
            enabled: true,
            interval: 3000, // milliseconds
            duration: 150   // milliseconds
        },
        
        // Lip sync timing
        LIP_SYNC: {
            phoneme_duration: 100, // milliseconds per phoneme
            word_pause: 100        // pause between words
        }
    },
    
    // UI Configuration
    UI: {
        // Theme colors
        COLORS: {
            primary: '#667eea',
            secondary: '#764ba2',
            accent: '#4CAF50',
            warning: '#FFC107',
            error: '#F44336'
        },
        
        // Chat settings
        CHAT: {
            max_history: 50,
            auto_scroll: true,
            show_timestamps: true
        },
        
        // Responsive breakpoints
        BREAKPOINTS: {
            mobile: 480,
            tablet: 768,
            desktop: 1024
        }
    },
    
    // Fallback Avatar Configuration
    FALLBACK: {
        enabled: true,
        colors: {
            head: 0xffdbac,
            body: 0x4169e1,
            eyes: 0x000000
        }
    },
    
    // Debug Settings
    DEBUG: {
        // Enable orbit controls for camera debugging
        orbit_controls: false,
        
        // Show performance stats
        show_stats: false,
        
        // Log morph targets to console
        log_morph_targets: true,
        
        // Enable verbose logging
        verbose_logging: false
    }
};

// Export configuration for use in main application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
} else {
    window.CONFIG = CONFIG;
}

/**
 * 3D AI Assistant Application
 * 
 * This application creates a 3D talking AI assistant with the following features:
 * - Three.js 3D avatar rendering with GLTF/GLB support
 * - Lip-sync animations using morph targets
 * - Text-to-Speech with Web Speech API
 * - API integration for AI responses
 * - Conversation history
 * - Responsive design
 * 
 * To customize:
 * 1. Replace AVATAR_MODEL_URL with your 3D model path
 * 2. Update API_ENDPOINT with your AI service URL
 * 3. Adjust morph target names in MORPH_TARGETS to match your model
 */

class AIAssistant3D {
    constructor() {
        // Configuration - CUSTOMIZE THESE VALUES
        this.AVATAR_MODEL_URL = './models/avatar.glb'; // Replace with your 3D model path
        this.API_ENDPOINT = 'https://api.example.com/chat'; // Replace with your API endpoint
        
        // Morph targets for lip sync - adjust these names to match your 3D model
        this.MORPH_TARGETS = {
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
        };
        
        // Initialize properties
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.avatar = null;
        this.mixer = null;
        this.morphTargets = {};
        this.isLoaded = false;
        this.isSpeaking = false;
        this.currentAudio = null;
        this.speechSynthesis = window.speechSynthesis;
        this.voices = [];
        this.currentVoice = null;
        this.animationId = null;
        
        // Conversation state
        this.conversationHistory = [];
        
        // Initialize the application
        this.init();
    }
    
    async init() {
        try {
            this.setupEventListeners();
            this.setupVoices();
            await this.initThreeJS();
            await this.loadAvatar();
            this.startRenderLoop();
            this.hideLoading();
            this.updateStatus('Ready');
        } catch (error) {
            console.error('Failed to initialize 3D AI Assistant:', error);
            this.showError('Failed to load 3D assistant. Please check the console for details.');
        }
    }
    
    setupEventListeners() {
        // Send button and input
        const sendButton = document.getElementById('send-button');
        const userInput = document.getElementById('user-input');
        
        sendButton.addEventListener('click', () => this.sendMessage());
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Enable/disable send button based on input
        userInput.addEventListener('input', () => {
            const hasText = userInput.value.trim().length > 0;
            sendButton.disabled = !hasText || this.isSpeaking;
        });
        
        // Voice controls
        const voiceSelect = document.getElementById('voice-select');
        voiceSelect.addEventListener('change', () => this.updateVoice());
        
        // Volume control
        const volumeSlider = document.getElementById('volume-slider');
        const volumeValue = document.getElementById('volume-value');
        volumeSlider.addEventListener('input', () => {
            const volume = Math.round(volumeSlider.value * 100);
            volumeValue.textContent = `${volume}%`;
        });
        
        // Stop speech button
        const stopButton = document.getElementById('stop-speech');
        stopButton.addEventListener('click', () => this.stopSpeech());
        
        // Settings modal
        const settingsButton = document.getElementById('settings-button');
        const configModal = document.getElementById('config-modal');
        const saveConfig = document.getElementById('save-config');
        const cancelConfig = document.getElementById('cancel-config');
        
        settingsButton.addEventListener('click', () => this.showConfigModal());
        saveConfig.addEventListener('click', () => this.saveConfig());
        cancelConfig.addEventListener('click', () => this.hideConfigModal());
        
        // Close modal on outside click
        configModal.addEventListener('click', (e) => {
            if (e.target === configModal) {
                this.hideConfigModal();
            }
        });
        
        // Load saved configuration
        this.loadConfig();
    }
    
    setupVoices() {
        const updateVoices = () => {
            this.voices = this.speechSynthesis.getVoices();
            const voiceSelect = document.getElementById('voice-select');
            
            // Clear existing options
            voiceSelect.innerHTML = '';
            
            // Add voice options
            const femaleVoices = this.voices.filter(voice => 
                voice.name.toLowerCase().includes('female') || 
                voice.name.toLowerCase().includes('woman') ||
                voice.name.toLowerCase().includes('zira') ||
                voice.name.toLowerCase().includes('hazel')
            );
            
            const maleVoices = this.voices.filter(voice => 
                voice.name.toLowerCase().includes('male') || 
                voice.name.toLowerCase().includes('man') ||
                voice.name.toLowerCase().includes('david') ||
                voice.name.toLowerCase().includes('mark')
            );
            
            // Add female option
            const femaleOption = document.createElement('option');
            femaleOption.value = 'female';
            femaleOption.textContent = 'Female';
            voiceSelect.appendChild(femaleOption);
            
            // Add male option
            const maleOption = document.createElement('option');
            maleOption.value = 'male';
            maleOption.textContent = 'Male';
            voiceSelect.appendChild(maleOption);
            
            // Set default voice
            this.updateVoice();
        };
        
        // Voices might not be loaded immediately
        if (this.voices.length === 0) {
            this.speechSynthesis.addEventListener('voiceschanged', updateVoices);
        } else {
            updateVoices();
        }
    }
    
    updateVoice() {
        const voiceSelect = document.getElementById('voice-select');
        const selectedGender = voiceSelect.value;
        
        if (selectedGender === 'female') {
            this.currentVoice = this.voices.find(voice => 
                voice.name.toLowerCase().includes('female') || 
                voice.name.toLowerCase().includes('woman') ||
                voice.name.toLowerCase().includes('zira') ||
                voice.name.toLowerCase().includes('hazel')
            ) || this.voices.find(voice => voice.gender === 'female') || this.voices[0];
        } else {
            this.currentVoice = this.voices.find(voice => 
                voice.name.toLowerCase().includes('male') || 
                voice.name.toLowerCase().includes('man') ||
                voice.name.toLowerCase().includes('david') ||
                voice.name.toLowerCase().includes('mark')
            ) || this.voices.find(voice => voice.gender === 'male') || this.voices[1] || this.voices[0];
        }
    }
    
    async initThreeJS() {
        const canvas = document.getElementById('avatar-canvas');
        const container = canvas.parentElement;
        
        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);
        this.scene.background = null; // Transparent background
        
        // Camera setup
        this.camera = new THREE.PerspectiveCamera(
            50,
            container.clientWidth / container.clientHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 1.6, 3);
        
        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: canvas, 
            alpha: true,
            antialias: true 
        });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1;
        
        // Lighting setup
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);
        
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
        fillLight.position.set(-5, 0, -5);
        this.scene.add(fillLight);
        
        // Controls (optional - for debugging)
        // Uncomment the next two lines if you want orbit controls for testing
        // this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        // this.controls.enableDamping = true;
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
    }
    
    async loadAvatar() {
        // Create a realistic photo-based avatar instead of 3D model
        this.createPhotoRealisticAvatar();
    }
    
    setupMorphTargets() {
        if (!this.avatar) return;
        
        this.avatar.traverse((child) => {
            if (child.isMesh && child.morphTargetDictionary) {
                // Store reference to mesh with morph targets
                this.morphTargets = child;
                console.log('Available morph targets:', Object.keys(child.morphTargetDictionary));
            }
        });
    }
    
    createPhotoRealisticAvatar() {
        // Create a sophisticated Meta-style 3D avatar
        const group = new THREE.Group();
        
        // Create the main avatar structure
        this.createMetaStyleAvatar(group);
        
        this.avatar = group;
        this.scene.add(this.avatar);
        this.isLoaded = true;
        this.updateStatus('Ready');
        
        console.log('Using Meta-style 3D avatar');
    }
    
    createMetaStyleAvatar(group) {
        // Create a modern, Meta-style avatar with geometric design
        
        // Head - Main sphere with modern materials
        const headGeometry = new THREE.SphereGeometry(0.8, 32, 32);
        const headMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xfdbcb4,
            roughness: 0.3,
            metalness: 0.1,
            clearcoat: 0.2,
            clearcoatRoughness: 0.1
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.set(0, 1.2, 0);
        head.castShadow = true;
        head.receiveShadow = true;
        group.add(head);
        
        // Eyes - Modern glowing orbs
        const eyeGeometry = new THREE.SphereGeometry(0.12, 16, 16);
        const eyeMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x4a90e2,
            emissive: 0x1a4a7a,
            emissiveIntensity: 0.3,
            roughness: 0.1,
            metalness: 0.8,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1
        });
        
        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.25, 1.35, 0.6);
        group.add(leftEye);
        
        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(0.25, 1.35, 0.6);
        group.add(rightEye);
        
        // Eye pupils - Dark centers
        const pupilGeometry = new THREE.SphereGeometry(0.06, 12, 12);
        const pupilMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
        
        const leftPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
        leftPupil.position.set(-0.25, 1.35, 0.65);
        group.add(leftPupil);
        
        const rightPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
        rightPupil.position.set(0.25, 1.35, 0.65);
        group.add(rightPupil);
        
        // Mouth - Dynamic shape that can animate (using SphereGeometry instead of CapsuleGeometry)
        const mouthGeometry = new THREE.SphereGeometry(0.15, 16, 8);
        const mouthMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x8b0000,
            roughness: 0.8,
            metalness: 0.1
        });
        this.mouth = new THREE.Mesh(mouthGeometry, mouthMaterial);
        this.mouth.position.set(0, 0.9, 0.6);
        this.mouth.scale.set(1, 0.6, 1); // Make it more mouth-like
        group.add(this.mouth);
        
        // Hair - Modern geometric style
        const hairGeometry = new THREE.SphereGeometry(0.85, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.6);
        const hairMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x4a3728,
            roughness: 0.9,
            metalness: 0.1,
            clearcoat: 0.3
        });
        const hair = new THREE.Mesh(hairGeometry, hairMaterial);
        hair.position.set(0, 1.6, -0.2);
        group.add(hair);
        
        // Body - Sleek geometric torso
        const bodyGeometry = new THREE.CylinderGeometry(0.6, 0.8, 1.5, 16);
        const bodyMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x4169e1,
            roughness: 0.2,
            metalness: 0.3,
            clearcoat: 0.5
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.set(0, 0, 0);
        body.castShadow = true;
        body.receiveShadow = true;
        group.add(body);
        
        // Shoulders - Modern design elements
        const shoulderGeometry = new THREE.SphereGeometry(0.3, 16, 16);
        const shoulderMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x2e4bc6,
            roughness: 0.3,
            metalness: 0.4
        });
        
        const leftShoulder = new THREE.Mesh(shoulderGeometry, shoulderMaterial);
        leftShoulder.position.set(-0.7, 0.5, 0);
        group.add(leftShoulder);
        
        const rightShoulder = new THREE.Mesh(shoulderGeometry, shoulderMaterial);
        rightShoulder.position.set(0.7, 0.5, 0);
        group.add(rightShoulder);
        
        // Add ambient glow effect
        const glowGeometry = new THREE.SphereGeometry(1.2, 32, 32);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0x667eea,
            transparent: true,
            opacity: 0.1,
            side: THREE.BackSide
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.set(0, 1.2, 0);
        group.add(glow);
        
        // Store references for animation
        this.avatarParts = {
            head: head,
            leftEye: leftEye,
            rightEye: rightEye,
            leftPupil: leftPupil,
            rightPupil: rightPupil,
            mouth: this.mouth,
            hair: hair,
            body: body,
            glow: glow
        };
        
        // Add particle system for extra visual flair
        this.createParticleSystem(group);
        
        // Initialize breathing animation
        this.breathingPhase = 0;
        this.blinkTimer = 0;
        this.nextBlinkTime = Math.random() * 3000 + 2000;
    }
    
    createParticleSystem(group) {
        // Create floating particles around the avatar
        const particleCount = 50;
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            // Random positions around the avatar
            positions[i3] = (Math.random() - 0.5) * 4;
            positions[i3 + 1] = Math.random() * 3;
            positions[i3 + 2] = (Math.random() - 0.5) * 4;
            
            // Gradient colors
            const color = new THREE.Color();
            color.setHSL(0.6 + Math.random() * 0.2, 0.7, 0.6);
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
        }
        
        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            size: 0.05,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });
        
        this.particleSystem = new THREE.Points(particles, particleMaterial);
        group.add(this.particleSystem);
    }
    
    drawRealisticAvatar(ctx, width, height) {
        // Create a realistic human avatar using canvas drawing
        const centerX = width / 2;
        const centerY = height / 2;
        
        // Background (transparent)
        ctx.clearRect(0, 0, width, height);
        
        // Face shape
        ctx.fillStyle = '#FDBCB4'; // Realistic skin tone
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, 120, 140, 0, 0, 2 * Math.PI);
        ctx.fill();
        
        // Face shading
        const gradient = ctx.createRadialGradient(centerX, centerY - 20, 0, centerX, centerY, 120);
        gradient.addColorStop(0, 'rgba(253, 188, 180, 0.8)');
        gradient.addColorStop(1, 'rgba(230, 160, 150, 0.3)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, 120, 140, 0, 0, 2 * Math.PI);
        ctx.fill();
        
        // Hair
        ctx.fillStyle = '#8B4513'; // Brown hair
        ctx.beginPath();
        ctx.ellipse(centerX, centerY - 80, 130, 80, 0, 0, Math.PI);
        ctx.fill();
        
        // Hair details
        ctx.fillStyle = '#654321';
        ctx.beginPath();
        ctx.ellipse(centerX - 40, centerY - 100, 20, 30, -0.3, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(centerX + 40, centerY - 100, 20, 30, 0.3, 0, 2 * Math.PI);
        ctx.fill();
        
        // Eyes
        // Left eye
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.ellipse(centerX - 35, centerY - 20, 20, 12, 0, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.fillStyle = '#4A90E2'; // Blue iris
        ctx.beginPath();
        ctx.ellipse(centerX - 35, centerY - 20, 8, 8, 0, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.fillStyle = 'black'; // Pupil
        ctx.beginPath();
        ctx.ellipse(centerX - 35, centerY - 20, 4, 4, 0, 0, 2 * Math.PI);
        ctx.fill();
        
        // Right eye
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.ellipse(centerX + 35, centerY - 20, 20, 12, 0, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.fillStyle = '#4A90E2'; // Blue iris
        ctx.beginPath();
        ctx.ellipse(centerX + 35, centerY - 20, 8, 8, 0, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.fillStyle = 'black'; // Pupil
        ctx.beginPath();
        ctx.ellipse(centerX + 35, centerY - 20, 4, 4, 0, 0, 2 * Math.PI);
        ctx.fill();
        
        // Eyebrows
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(centerX - 35, centerY - 40, 25, 0.2, Math.PI - 0.2);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(centerX + 35, centerY - 40, 25, 0.2, Math.PI - 0.2);
        ctx.stroke();
        
        // Nose
        ctx.fillStyle = '#F5A9A9';
        ctx.beginPath();
        ctx.ellipse(centerX, centerY + 10, 8, 15, 0, 0, 2 * Math.PI);
        ctx.fill();
        
        // Nose highlight
        ctx.fillStyle = '#FDBCB4';
        ctx.beginPath();
        ctx.ellipse(centerX - 2, centerY + 5, 3, 8, 0, 0, 2 * Math.PI);
        ctx.fill();
        
        // Mouth
        this.mouthCenterX = centerX;
        this.mouthCenterY = centerY + 50;
        this.drawMouth(ctx, this.mouthCenterX, this.mouthCenterY, 'neutral');
        
        // Cheeks
        ctx.fillStyle = 'rgba(255, 182, 193, 0.3)';
        ctx.beginPath();
        ctx.ellipse(centerX - 60, centerY + 20, 15, 10, 0, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.beginPath();
        ctx.ellipse(centerX + 60, centerY + 20, 15, 10, 0, 0, 2 * Math.PI);
        ctx.fill();
        
        // Neck
        ctx.fillStyle = '#FDBCB4';
        ctx.fillRect(centerX - 30, centerY + 140, 60, 60);
        
        // Clothing
        ctx.fillStyle = '#4169E1'; // Blue shirt
        ctx.fillRect(centerX - 80, centerY + 180, 160, 120);
        
        // Collar
        ctx.fillStyle = '#2E4BC6';
        ctx.beginPath();
        ctx.moveTo(centerX - 25, centerY + 180);
        ctx.lineTo(centerX, centerY + 200);
        ctx.lineTo(centerX + 25, centerY + 180);
        ctx.lineTo(centerX + 80, centerY + 180);
        ctx.lineTo(centerX + 80, centerY + 200);
        ctx.lineTo(centerX - 80, centerY + 200);
        ctx.lineTo(centerX - 80, centerY + 180);
        ctx.closePath();
        ctx.fill();
    }
    
    drawMouth(ctx, x, y, expression) {
        ctx.fillStyle = '#8B0000'; // Dark red for mouth
        
        switch(expression) {
            case 'open':
                // Open mouth (for A, O sounds)
                ctx.beginPath();
                ctx.ellipse(x, y, 12, 18, 0, 0, 2 * Math.PI);
                ctx.fill();
                break;
            case 'smile':
                // Smile (for E sounds)
                ctx.beginPath();
                ctx.arc(x, y - 5, 20, 0.2, Math.PI - 0.2);
                ctx.lineWidth = 6;
                ctx.strokeStyle = '#8B0000';
                ctx.stroke();
                break;
            case 'small':
                // Small opening (for I sounds)
                ctx.beginPath();
                ctx.ellipse(x, y, 8, 10, 0, 0, 2 * Math.PI);
                ctx.fill();
                break;
            case 'round':
                // Round mouth (for O, U sounds)
                ctx.beginPath();
                ctx.ellipse(x, y, 10, 15, 0, 0, 2 * Math.PI);
                ctx.fill();
                break;
            case 'closed':
                // Closed mouth (for M, P, B sounds)
                ctx.beginPath();
                ctx.ellipse(x, y, 15, 3, 0, 0, 2 * Math.PI);
                ctx.fill();
                break;
            default:
                // Neutral mouth
                ctx.beginPath();
                ctx.ellipse(x, y, 12, 4, 0, 0, 2 * Math.PI);
                ctx.fill();
        }
        
        // Teeth for open mouths
        if (expression === 'open' || expression === 'smile') {
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.ellipse(x, y - 3, 8, 3, 0, 0, 2 * Math.PI);
            ctx.fill();
        }
    }
    
    createAvatarAnimationElements(group) {
        // Add subtle breathing animation
        this.breathingOffset = 0;
        
        // Add eye blink elements
        this.blinkTimer = 0;
        this.nextBlinkTime = Math.random() * 3000 + 2000; // Random blink between 2-5 seconds
    }
    
    onWindowResize() {
        const canvas = document.getElementById('avatar-canvas');
        const container = canvas.parentElement;
        
        this.camera.aspect = container.clientWidth / container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(container.clientWidth, container.clientHeight);
    }
    
    startRenderLoop() {
        const animate = (time) => {
            this.animationId = requestAnimationFrame(animate);
            
            // Update animations
            if (this.mixer) {
                this.mixer.update(0.016); // ~60fps
            }
            
            // Animate the Meta-style avatar
            if (this.avatarParts && this.avatar) {
                const time_s = time * 0.001;
                
                // Breathing animation
                this.breathingPhase += 0.02;
                const breathingScale = 1 + Math.sin(this.breathingPhase) * 0.02;
                if (this.avatarParts.body) {
                    this.avatarParts.body.scale.y = breathingScale;
                }
                
                // Subtle head movement when not speaking
                if (!this.isSpeaking) {
                    this.avatar.rotation.y = Math.sin(time_s * 0.5) * 0.08;
                    this.avatar.rotation.x = Math.sin(time_s * 0.3) * 0.04;
                    
                    // Eye movement
                    if (this.avatarParts.leftPupil && this.avatarParts.rightPupil) {
                        const eyeMovement = Math.sin(time_s * 0.7) * 0.02;
                        this.avatarParts.leftPupil.position.x = -0.25 + eyeMovement;
                        this.avatarParts.rightPupil.position.x = 0.25 + eyeMovement;
                    }
                }
                
                // Blinking animation
                this.blinkTimer += 16; // ~60fps
                if (this.blinkTimer >= this.nextBlinkTime) {
                    this.performBlink();
                    this.blinkTimer = 0;
                    this.nextBlinkTime = Math.random() * 4000 + 2000; // 2-6 seconds
                }
                
                // Glow effect animation
                if (this.avatarParts.glow) {
                    this.avatarParts.glow.material.opacity = 0.05 + Math.sin(time_s * 2) * 0.03;
                }
                
                // Particle animation
                if (this.particleSystem) {
                    this.particleSystem.rotation.y += 0.002;
                    const positions = this.particleSystem.geometry.attributes.position.array;
                    for (let i = 1; i < positions.length; i += 3) {
                        positions[i] += Math.sin(time_s + i) * 0.001;
                    }
                    this.particleSystem.geometry.attributes.position.needsUpdate = true;
                }
            }
            
            // Update controls if enabled
            // if (this.controls) this.controls.update();
            
            this.renderer.render(this.scene, this.camera);
        };
        
        animate(0);
    }
    
    performBlink() {
        if (!this.avatarParts || !this.avatarParts.leftEye || !this.avatarParts.rightEye) return;
        
        // Quick blink animation
        const originalScaleY = this.avatarParts.leftEye.scale.y;
        
        // Close eyes
        this.avatarParts.leftEye.scale.y = 0.1;
        this.avatarParts.rightEye.scale.y = 0.1;
        
        // Open eyes after short delay
        setTimeout(() => {
            if (this.avatarParts.leftEye && this.avatarParts.rightEye) {
                this.avatarParts.leftEye.scale.y = originalScaleY;
                this.avatarParts.rightEye.scale.y = originalScaleY;
            }
        }, 150);
    }
    
    async sendMessage() {
        const userInput = document.getElementById('user-input');
        const message = userInput.value.trim();
        
        if (!message || this.isSpeaking) return;
        
        // Add user message to conversation
        this.addMessage(message, 'user');
        userInput.value = '';
        document.getElementById('send-button').disabled = true;
        
        try {
            this.updateStatus('Thinking...');
            
            // Call AI API
            const response = await this.callAI(message);
            
            // Add assistant response to conversation
            this.addMessage(response, 'assistant');
            
            // Speak the response
            await this.speakText(response);
            
        } catch (error) {
            console.error('Error processing message:', error);
            const errorMessage = 'Sorry, I encountered an error. Please try again.';
            this.addMessage(errorMessage, 'assistant');
            await this.speakText(errorMessage);
        }
        
        this.updateStatus('Ready');
    }
    
    async callAI(message) {
        try {
            const response = await fetch(this.API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    conversation_history: this.conversationHistory
                })
            });
            
            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }
            
            const data = await response.text();
            return data;
            
        } catch (error) {
            console.error('API call failed:', error);
            
            // Fallback responses for demo purposes
            const fallbackResponses = [
                "I'm sorry, I'm having trouble connecting to my AI service right now. This is a demo response.",
                "That's an interesting question! Unfortunately, I can't access my full capabilities at the moment.",
                "I'd love to help you with that. Please note that I'm currently running in demo mode.",
                "Thank you for your message. I'm currently using fallback responses since the API isn't configured."
            ];
            
            return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
        }
    }
    
    async speakText(text) {
        if (this.isSpeaking) {
            this.stopSpeech();
        }
        
        this.isSpeaking = true;
        this.updateStatus('Speaking...');
        document.getElementById('send-button').disabled = true;
        document.getElementById('stop-speech').disabled = false;
        
        try {
            // Use Web Speech API
            const utterance = new SpeechSynthesisUtterance(text);
            
            if (this.currentVoice) {
                utterance.voice = this.currentVoice;
            }
            
            const volumeSlider = document.getElementById('volume-slider');
            utterance.volume = parseFloat(volumeSlider.value);
            utterance.rate = 0.9;
            utterance.pitch = 1.0;
            
            // Setup lip sync
            utterance.onstart = () => {
                this.startLipSync(text);
            };
            
            utterance.onend = () => {
                this.stopLipSync();
                this.isSpeaking = false;
                this.updateStatus('Ready');
                document.getElementById('send-button').disabled = false;
                document.getElementById('stop-speech').disabled = true;
            };
            
            utterance.onerror = (event) => {
                console.error('Speech synthesis error:', event);
                this.stopLipSync();
                this.isSpeaking = false;
                this.updateStatus('Ready');
                document.getElementById('send-button').disabled = false;
                document.getElementById('stop-speech').disabled = true;
            };
            
            this.speechSynthesis.speak(utterance);
            this.currentUtterance = utterance;
            
        } catch (error) {
            console.error('Speech synthesis failed:', error);
            this.isSpeaking = false;
            this.updateStatus('Ready');
            document.getElementById('send-button').disabled = false;
            document.getElementById('stop-speech').disabled = true;
        }
    }
    
    stopSpeech() {
        if (this.speechSynthesis.speaking) {
            this.speechSynthesis.cancel();
        }
        
        this.stopLipSync();
        this.isSpeaking = false;
        this.updateStatus('Ready');
        document.getElementById('send-button').disabled = false;
        document.getElementById('stop-speech').disabled = true;
    }
    
    startLipSync(text) {
        if (!this.avatar) return;
        
        // Simple phoneme-based lip sync
        const words = text.toLowerCase().split(' ');
        let wordIndex = 0;
        
        const animateLips = () => {
            if (!this.isSpeaking || wordIndex >= words.length) {
                return;
            }
            
            const word = words[wordIndex];
            const phonemes = this.textToPhonemes(word);
            
            let phonemeIndex = 0;
            const phonemeInterval = setInterval(() => {
                if (!this.isSpeaking || phonemeIndex >= phonemes.length) {
                    clearInterval(phonemeInterval);
                    wordIndex++;
                    setTimeout(animateLips, 100); // Pause between words
                    return;
                }
                
                const phoneme = phonemes[phonemeIndex];
                this.setMouthShape(phoneme);
                phonemeIndex++;
            }, 100); // Adjust timing as needed
        };
        
        animateLips();
    }
    
    stopLipSync() {
        this.setMouthShape('rest');
    }
    
    textToPhonemes(word) {
        // Simple phoneme mapping - this is a basic implementation
        // For production, you'd want to use a proper phoneme library
        const phonemeMap = {
            'a': ['A'], 'e': ['E'], 'i': ['I'], 'o': ['O'], 'u': ['U'],
            'b': ['M'], 'p': ['M'], 'm': ['M'],
            'f': ['F'], 'v': ['F'],
            's': ['S'], 'z': ['S'], 'sh': ['S'],
            't': ['L'], 'd': ['L'], 'l': ['L'], 'n': ['L'],
            'th': ['TH'],
            'r': ['R'],
            'default': ['A']
        };
        
        const phonemes = [];
        for (let i = 0; i < word.length; i++) {
            const char = word[i];
            const phoneme = phonemeMap[char] || phonemeMap['default'];
            phonemes.push(...phoneme);
        }
        
        return phonemes.length > 0 ? phonemes : ['A'];
    }
    
    setMouthShape(phoneme) {
        // Animate the Meta-style 3D avatar mouth
        if (this.avatarParts && this.avatarParts.mouth) {
            // Reset mouth to default state
            this.avatarParts.mouth.scale.set(1, 1, 1);
            this.avatarParts.mouth.rotation.set(0, 0, Math.PI / 2);
            
            // Map phonemes to mouth animations
            switch(phoneme) {
                case 'A':
                case 'O':
                    // Open mouth wide
                    this.avatarParts.mouth.scale.set(1.5, 1.8, 1);
                    break;
                case 'E':
                    // Smile/wide mouth
                    this.avatarParts.mouth.scale.set(2, 0.8, 1);
                    break;
                case 'I':
                    // Small opening
                    this.avatarParts.mouth.scale.set(0.8, 1.2, 1);
                    break;
                case 'U':
                    // Round/pucker
                    this.avatarParts.mouth.scale.set(0.6, 1.4, 1);
                    break;
                case 'M':
                case 'P':
                case 'B':
                    // Closed mouth
                    this.avatarParts.mouth.scale.set(1.2, 0.3, 1);
                    break;
                case 'F':
                case 'V':
                    // Teeth on lip
                    this.avatarParts.mouth.scale.set(1.1, 0.6, 1);
                    break;
                case 'S':
                case 'Z':
                    // Hiss sound
                    this.avatarParts.mouth.scale.set(0.9, 0.8, 1);
                    break;
                case 'L':
                case 'D':
                case 'T':
                    // Tongue position
                    this.avatarParts.mouth.scale.set(1.1, 1.1, 1);
                    break;
                case 'R':
                    // R sound
                    this.avatarParts.mouth.scale.set(0.9, 1.3, 1);
                    break;
                default:
                    // Neutral/rest position
                    this.avatarParts.mouth.scale.set(1, 1, 1);
            }
            
            // Add subtle mouth movement animation during speech
            if (this.isSpeaking && phoneme !== 'rest') {
                const time = Date.now() * 0.01;
                const wobble = Math.sin(time) * 0.05;
                this.avatarParts.mouth.position.y = 0.9 + wobble;
            } else {
                this.avatarParts.mouth.position.y = 0.9;
            }
        }
        
        // Legacy support for 3D morph targets (if they exist)
        if (this.morphTargets && this.morphTargets.morphTargetDictionary) {
            // Reset all morph targets
            Object.values(this.MORPH_TARGETS).forEach(targetName => {
                const index = this.morphTargets.morphTargetDictionary[targetName];
                if (index !== undefined) {
                    this.morphTargets.morphTargetInfluences[index] = 0;
                }
            });
            
            // Set the target morph
            const targetName = this.MORPH_TARGETS[phoneme] || this.MORPH_TARGETS['rest'];
            const index = this.morphTargets.morphTargetDictionary[targetName];
            if (index !== undefined) {
                this.morphTargets.morphTargetInfluences[index] = 1;
            }
        }
    }
    
    addMessage(content, sender) {
        const conversationHistory = document.getElementById('conversation-history');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.innerHTML = `<p>${this.escapeHtml(content)}</p>`;
        
        const messageTime = document.createElement('div');
        messageTime.className = 'message-time';
        messageTime.textContent = new Date().toLocaleTimeString();
        
        messageDiv.appendChild(messageContent);
        messageDiv.appendChild(messageTime);
        conversationHistory.appendChild(messageDiv);
        
        // Scroll to bottom
        conversationHistory.scrollTop = conversationHistory.scrollHeight;
        
        // Store in conversation history
        this.conversationHistory.push({ sender, content, timestamp: new Date() });
        
        // Limit conversation history
        if (this.conversationHistory.length > 50) {
            this.conversationHistory = this.conversationHistory.slice(-50);
        }
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    updateStatus(status) {
        const statusElement = document.getElementById('status');
        statusElement.textContent = status;
        
        // Update status styling
        statusElement.className = 'status-indicator';
        if (status.toLowerCase().includes('speaking')) {
            statusElement.classList.add('speaking');
        } else if (status.toLowerCase().includes('thinking')) {
            statusElement.classList.add('thinking');
        }
    }
    
    hideLoading() {
        const loading = document.getElementById('loading');
        loading.classList.add('hidden');
    }
    
    showError(message) {
        const loading = document.getElementById('loading');
        loading.innerHTML = `
            <div style="color: #ff6b6b;">
                <p>⚠️ ${message}</p>
                <p style="font-size: 12px; margin-top: 10px;">
                    Check the browser console for more details.
                </p>
            </div>
        `;
    }
    
    showConfigModal() {
        const modal = document.getElementById('config-modal');
        const apiEndpoint = document.getElementById('api-endpoint');
        apiEndpoint.value = this.API_ENDPOINT;
        modal.classList.add('show');
    }
    
    hideConfigModal() {
        const modal = document.getElementById('config-modal');
        modal.classList.remove('show');
    }
    
    saveConfig() {
        const apiEndpoint = document.getElementById('api-endpoint');
        this.API_ENDPOINT = apiEndpoint.value.trim();
        
        // Save to localStorage
        localStorage.setItem('ai-assistant-api-endpoint', this.API_ENDPOINT);
        
        this.hideConfigModal();
        this.addMessage('API endpoint updated successfully!', 'assistant');
    }
    
    loadConfig() {
        const savedEndpoint = localStorage.getItem('ai-assistant-api-endpoint');
        if (savedEndpoint) {
            this.API_ENDPOINT = savedEndpoint;
        }
    }
    
    destroy() {
        // Cleanup
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        if (this.speechSynthesis.speaking) {
            this.speechSynthesis.cancel();
        }
        
        if (this.renderer) {
            this.renderer.dispose();
        }
    }
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.aiAssistant = new AIAssistant3D();
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (window.aiAssistant) {
        window.aiAssistant.destroy();
    }
});

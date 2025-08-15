# 3D Models Directory

Place your 3D avatar models in this directory.

## Supported Formats
- GLTF (.gltf)
- GLB (.glb)

## Recommended Model Specifications

### File Requirements
- **Format**: GLTF 2.0 or GLB
- **File Size**: Under 10MB for optimal loading
- **Textures**: Embedded or in same directory
- **Animations**: Optional (idle, breathing, etc.)

### Model Requirements
- **Type**: Humanoid character
- **Rigging**: Standard humanoid rig (optional)
- **Facial Features**: Clear mouth area for lip sync
- **Morph Targets**: Facial blend shapes for lip synchronization

### Required Morph Targets for Lip Sync

Your 3D model should include these morph targets (blend shapes) for optimal lip synchronization:

| Morph Target | Description | Sounds |
|--------------|-------------|---------|
| `viseme_aa` | Open mouth | A, Ah |
| `viseme_E` | Smile | E, Eh |
| `viseme_I` | Small opening | I, Ih |
| `viseme_O` | Round mouth | O, Oh |
| `viseme_U` | Pucker | U, Oo |
| `viseme_PP` | Closed lips | M, P, B |
| `viseme_DD` | Tongue | L, D, T, N |
| `viseme_SS` | Hiss | S, Z, Sh |
| `viseme_FF` | Teeth on lip | F, V |
| `viseme_TH` | Tongue between teeth | Th |
| `viseme_RR` | R sound | R |
| `viseme_sil` | Neutral/rest | Silence |

### Example Model Structure
```
models/
├── avatar.glb              # Your main avatar file
├── textures/               # Texture files (if using .gltf)
│   ├── diffuse.jpg
│   ├── normal.jpg
│   └── roughness.jpg
└── README.md              # This file
```

## Free 3D Model Resources

### Ready-to-Use Models
- **ReadyPlayerMe**: https://readyplayer.me/ (Free avatars with morph targets)
- **Mixamo**: https://www.mixamo.com/ (Free rigged characters)
- **Sketchfab**: https://sketchfab.com/ (Search for "avatar" or "character")

### Creating Custom Models
- **Blender**: Free 3D modeling software
- **Character Creator**: Professional character creation
- **MakeHuman**: Open source human generator

## Model Setup Instructions

1. **Download or create** your 3D model
2. **Ensure** it has the required morph targets
3. **Export** as GLTF/GLB format
4. **Place** the file in this directory
5. **Update** the `AVATAR_MODEL_URL` in `app.js` or `config.js`
6. **Test** the model by opening the application

## Troubleshooting

### Model Not Loading
- Check file path and name
- Verify GLTF/GLB format
- Ensure file size is reasonable
- Check browser console for errors

### Lip Sync Not Working
- Verify morph targets exist
- Check morph target names match configuration
- Test with fallback avatar first

### Performance Issues
- Reduce model complexity
- Optimize textures
- Use compressed formats
- Consider LOD (Level of Detail)

## Example Configuration

Update your `config.js` file:

```javascript
AVATAR: {
    MODEL_URL: './models/your-avatar.glb',
    POSITION: { x: 0, y: -1, z: 0 },
    SCALE: { x: 1, y: 1, z: 1 },
},

MORPH_TARGETS: {
    'A': 'your_morph_name_for_A',
    'E': 'your_morph_name_for_E',
    // ... etc
}

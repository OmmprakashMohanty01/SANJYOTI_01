# 3D Learning Platform

🚀 **Production-ready, accessible, highly-performant 3D web learning application**

A cutting-edge educational platform that combines WebGL/WebXR technology with AI-powered tutoring, real-time collaboration, and adaptive learning systems.

## ✨ Features

### 🎯 Core Learning Features
- **Adaptive 3D Lessons**: Content that morphs based on learner performance and engagement
- **AI-Powered Tutoring**: Explainable AI with step-by-step visual guidance
- **Real-time Collaboration**: Multi-user 3D scenes with <100ms latency
- **WebXR/AR Mode**: Immersive spatial learning experiences
- **Gamified Progression**: Micro-challenges and achievement systems

### ⚡ Performance & Technical Excellence
- **120fps Smooth Rendering**: GPU-accelerated with adaptive quality scaling
- **Energy-Aware Rendering**: Battery and device-responsive optimization
- **Progressive Asset Loading**: LOD meshes, Draco compression, KTX2 textures
- **Privacy-First Analytics**: On-device personalization and optional telemetry

### 🎨 Advanced UX Features
- **Dynamic Cursor Effects**: Color-changing cursor with smooth animations
- **Glassmorphism Design**: Modern, accessible UI with premium aesthetics
- **Spatial Audio & Haptics**: Immersive feedback systems
- **PWA Support**: Offline-capable with service worker caching

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   3D Engine     │    │   AI Services   │
│                 │    │                 │    │                 │
│ • Next.js 14    │◄──►│ • react-three-  │◄──►│ • LLM Inference │
│ • Framer Motion │    │   fiber (R3F)   │    │ • Embeddings    │
│ • Tailwind CSS  │    │ • Three.js      │    │ • ONNX/WASM     │
│ • Radix UI      │    │ • WebXR API     │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
         ┌─────────────────┐    │    ┌─────────────────┐
         │   State Mgmt    │    │    │   Collaboration │
         │                 │    │    │                 │
         │ • Zustand       │◄───┼───►│ • WebSocket/RTC │
         │ • TanStack      │    │    │ • CRDT Sync     │
         │   Query         │    │    │ • P2P Cursors   │
         └─────────────────┘    │    └─────────────────┘
                                │
                    ┌─────────────────┐
                    │   Asset Pipeline│
                    │                 │
                    │ • Draco/glTF    │
                    │ • KTX2 Textures │
                    │ • LOD Generation│
                    │ • GPU Instancing│
                    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- Modern browser with WebGL2 support

### Development Setup

```bash
# Clone and install
git clone https://github.com/your-org/nexus-3d-learning.git
cd nexus-3d-learning
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

### Production Build

```bash
# Build for production
npm run build
npm run start

# Or using Docker
docker build -t nexus-3d-learning .
docker run -p 3000:3000 nexus-3d-learning
```

## 📚 Usage Guide

### Creating 3D Lessons

1. **Navigate to Editor** (`/editor`)
2. **Design 3D Scene**: Add boxes, spheres, text elements
3. **Set Properties**: Configure colors, positions, interactions
4. **Export Lesson**: Download JSON + glTF assets

**Example Lesson JSON:**
```json
{
  "metadata": {
    "title": "Molecular Bonding",
    "difficulty": "Intermediate",
    "duration": 15
  },
  "scene": {
    "elements": [
      {
        "id": "atom1",
        "type": "sphere",
        "position": [-2, 0, 0],
        "properties": { "color": "#3B82F6", "radius": 0.8 }
      }
    ],
    "interactions": [
      {
        "trigger": "click",
        "target": "atom1",
        "action": "highlight",
        "aiHint": "This represents a hydrogen atom..."
      }
    ]
  }
}
```

### Real-time Collaboration

```javascript
// Join collaborative session
const session = await collaborationService.join('lesson-id')

// Subscribe to cursor movements
session.onCursorMove((userId, position) => {
  updateCollaboratorCursor(userId, position)
})

// Sync annotations
session.onAnnotation((annotation) => {
  addSceneAnnotation(annotation)
})
```

### Performance Optimization

```javascript
import { useRenderBudget } from '@/hooks/useRenderBudget'

function Scene() {
  const { shouldRender, adaptiveQuality } = useRenderBudget({
    targetFPS: 60,
    batteryThreshold: 0.2
  })
  
  return (
    <Canvas>
      {shouldRender && <ExpensiveScene quality={adaptiveQuality} />}
    </Canvas>
  )
}
```

## 🎨 Dynamic Cursor Implementation

The platform features a sophisticated custom cursor system:

```javascript
// Color calculation based on element luminance
const getContrastColor = (element) => {
  const luminance = getLuminance(element)
  return luminance > 0.5 ? darkColor : lightColor
}

// GPU-accelerated smooth interpolation
const animate = () => {
  cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`
  cursor.style.backgroundColor = interpolateColor(currentColor, targetColor)
  requestAnimationFrame(animate)
}
```

**Accessibility Features:**
- Honors `prefers-reduced-motion`
- Provides system cursor fallback
- Toggle in settings for screen readers

## 🔧 Configuration

### Asset Pipeline

Optimize 3D assets before deployment:

```bash
npm run optimize-assets
```

This script:
1. Compresses glTF models with Draco
2. Converts textures to KTX2/Basis Universal
3. Generates LOD meshes
4. Creates GPU instancing data

### Environment Variables

```bash
# .env.local
NEXT_PUBLIC_AI_API_URL=https://your-ai-service.com
NEXT_PUBLIC_COLLABORATION_WS=wss://your-websocket.com
NEXT_PUBLIC_ANALYTICS_ENDPOINT=https://your-analytics.com
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Component testing
npm run test:components

# Integration testing  
npm run test:integration

# Performance testing
npm run test:performance
```

## 📱 PWA Features

- **Offline Mode**: Cached lessons and assets
- **App-like Experience**: Install from browser
- **Background Sync**: Resume learning across sessions
- **Push Notifications**: Learning reminders and updates

## 🔒 Security & Privacy

### Content Security Policy
```javascript
// Hardened CSP for user-generated content
const CSP = {
  'script-src': "'self' 'unsafe-eval'", // Required for WebGL shaders
  'worker-src': "'self' blob:", // For WebWorkers
  'connect-src': "'self' wss: https:"
}
```

### Data Privacy
- **On-device ML**: Personalization without data collection
- **Optional Telemetry**: Explicit user consent required
- **Data Export**: Complete user data download
- **Right to Deletion**: One-click account removal

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Docker Container
```bash
# Build production image
docker build -t nexus-3d-learning .

# Run with environment
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  nexus-3d-learning
```

### Self-hosted
```bash
# Build static export
npm run build
npm run export

# Serve with any static host
```

## 📊 Performance Checklist

- [ ] **Asset Optimization**: Draco, KTX2, LOD meshes
- [ ] **Render Budget**: 16ms frame time maintained
- [ ] **Memory Management**: WebGL context cleanup
- [ ] **Network Efficiency**: Asset caching, compression
- [ ] **Battery Awareness**: Adaptive quality scaling
- [ ] **Accessibility**: WCAG 2.1 AA compliance

## 🤝 Contributing

1. **Fork** the repository
2. **Create** feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** changes (`git commit -m 'Add amazing feature'`)
4. **Push** to branch (`git push origin feature/amazing-feature`)
5. **Open** Pull Request

### Development Guidelines
- Follow TypeScript strict mode
- Maintain 90%+ test coverage
- Use semantic commit messages
- Document all public APIs

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Three.js Community** for foundational 3D technology
- **React Three Fiber** team for excellent React integration
- **WebXR Working Group** for immersive web standards
- **Open Source Contributors** across the ecosystem

---

**Built with ❤️ for the future of education**

For support: [support@nexus-learning.com](mailto:support@nexus-learning.com)
Documentation: [docs.nexus-learning.com](https://docs.nexus-learning.com)

# 🚀 Mars Rover Recycler Game

A comprehensive 3D Mars exploration and waste management simulation built with Three.js. Experience realistic Mars conditions while operating a sophisticated rover to collect and Recycle waste across the Martian landscape.

![Mars Rover Recycler](https://img.shields.io/badge/Mars-Rover%20Recycler-red?style=for-the-badge&logo=rocket)
[![GitHub](https://img.shields.io/github/license/redwings-ops/mars_project?style=for-the-badge)](LICENSE)
[![Three.js](https://img.shields.io/badge/Three.js-0.152.2-black?style=for-the-badge&logo=three.js)](https://threejs.org/)

## 🌟 Features

### 🤖 Advanced Rover Simulation
- **Realistic Physics**: Six-wheel rover with detailed mechanical design
- **Collision Detection**: Sophisticated obstacle avoidance system
- **Tire Tracks**: Dynamic tire track generation showing rover's path
- **Audio System**: Immersive rover movement sounds and environmental audio

### 🌍 Authentic Mars Environment
- **Dynamic Weather**: Real-time weather simulation with dust storms
- **Day/Night Cycle**: 24-hour Martian sol simulation with lighting changes
- **Temperature Variations**: Realistic temperature fluctuations (-125°C to 20°C)
- **Atmospheric Effects**: Thin CO2 atmosphere with dust particles
- **UV Radiation**: Environmental hazards affecting solar efficiency

### 🏔️ Geological Features
- **Impact Craters**: Realistic crater formations with ejected material
- **Lava Tubes**: Underground volcanic formations
- **Mars Caves**: Natural cave systems for exploration
- **Ice Deposits**: Seasonal frost and underground water indicators
- **Rock Formations**: Diverse geological structures and weathered boulders

### 🏗️ Mars Infrastructure
- **Space Rocket/Lander**: Detailed Mars lander with landing legs and engines
- **Habitat Complex**: Multi-module Mars colony with:
  - Main pressurized dome with geodesic framework
  - Laboratory module for scientific research
  - Greenhouse for food production
  - Power generation facility
  - Airlock system with safety protocols
- **Solar Panel Arrays**: Realistic power generation systems
- **Communication Dish**: Deep space communication equipment

### ♻️ Waste Management System
- **Three Waste Types**:
  - 🔵 **Plastic**: Bottles, containers, bags
  - ⚪ **Metal**: Cans, pipes, scrap metal
  - 🟢 **Organic**: Food scraps, biodegradable materials
- **Advanced Recycling Machine**: Convert waste into useful resources
- **Inventory Management**: Drag-and-drop interface for material handling

### 🎮 Interactive Systems
- **Mini-Map Navigation**: Real-time 200x200 pixel map showing:
  - Rover position and orientation
  - Waste locations
  - Geological features
  - Weather conditions
  - Dust devil tracking
- **Environmental Monitoring**: Live weather data and system status
- **Audio Controls**: Complete mute/unmute system for all sounds

### 🌪️ Dynamic Weather Events
- **Dust Devils**: Realistic tornado formations with:
  - Swirling particle effects
  - Audio feedback based on proximity
  - Physical rover interaction
- **Dust Storms**: Visibility reduction and solar efficiency impact
- **Wind Effects**: Environmental particle animation
- **Seasonal Changes**: Ice formation and atmospheric variations

## 🎯 Gameplay Objectives

1. **Exploration**: Navigate the vast Martian landscape (200x200 unit map)
2. **Collection**: Gather scattered waste materials across the terrain
3. **Recycling**: Process collected materials at the recycling facility
4. **Survival**: Adapt to harsh Mars environmental conditions
5. **Discovery**: Explore geological features and Mars infrastructure

## 🕹️ Controls

### Movement
- **W, A, S, D** or **Arrow Keys**: Move rover in all directions
- **Diagonal Movement**: Combine keys for 8-directional movement

### Actions
- **Space**: Collect nearby waste items
- **M**: Toggle between exploration and machine interface
- **U**: Toggle audio mute/unmute

### Interface
- **Drag & Drop**: Move items from inventory to recycling machine
- **Convert Button**: Process materials in the recycling machine
- **Mini-Map**: Click to view detailed area information

## 🛠️ Technical Specifications

### Technologies Used
- **Three.js 0.152.2**: 3D graphics rendering engine
- **WebGL**: Hardware-accelerated 3D graphics
- **Web Audio API**: Immersive audio experience
- **HTML5 Canvas**: Mini-map rendering
- **CSS3**: Responsive UI design

### Performance Features
- **LOD System**: Level-of-detail optimization for distant objects
- **Collision Optimization**: Efficient spatial partitioning
- **Audio Management**: Smart audio loading and playback
- **Memory Management**: Automatic cleanup of old tire tracks and effects

### File Structure
```
mars_project/
├── Run.html           # Main game file
├── styles.css         # Game styling
├── script.js          # Game logic (if separated)
├── mars_ground.jpg    # Mars terrain texture
├── music.mp3          # Background music
├── rover.mp3          # Rover movement sounds
├── tornado.mp3        # Dust devil audio effects
└── README.md          # This file
```

## 🚀 Quick Start

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/redwings-ops/mars_project.git
   cd mars_project
   ```

2. **Launch the Game**:
   - Open `Run.html` in a modern web browser
   - Or serve via local HTTP server for optimal performance:
   ```bash
   python -m http.server 8000
   # Navigate to http://localhost:8000/Run.html
   ```

3. **Start Playing**:
   - Click anywhere to initialize audio system
   - Use WASD keys to move the rover
   - Press Space to collect waste items
   - Press M to access the recycling machine

## 🌐 Browser Compatibility

- ✅ **Chrome 90+** (Recommended)
- ✅ **Firefox 88+**
- ✅ **Safari 14+**
- ✅ **Edge 90+**

**Requirements**: WebGL support, Web Audio API, ES6 support

## 🎨 Visual Features

### Lighting System
- **Hemisphere Lighting**: Mars atmospheric simulation
- **Directional UV Light**: Harsh solar radiation effects
- **Ambient Cold Lighting**: Thin atmosphere representation
- **Dynamic Shadows**: PCF soft shadow mapping

### Particle Systems
- **Atmospheric Dust**: 2000+ particles simulating Mars atmosphere
- **Dust Devils**: Realistic tornado particle effects
- **Weather Particles**: Dynamic storm simulation
- **Frost Effects**: Seasonal ice formation

### Materials & Textures
- **PBR Materials**: Physically-based rendering for realism
- **Mars Ground Texture**: High-resolution surface mapping
- **Metal/Plastic/Organic**: Distinct material properties
- **Environmental Wear**: Weathering effects on all objects

## 🔬 Scientific Accuracy

### Mars Environment
- **Atmospheric Composition**: 96% CO2, thin atmosphere simulation
- **Temperature Range**: Accurate Martian temperature variations
- **Solar Efficiency**: Realistic solar panel performance
- **Gravity Effects**: Subtle low-gravity simulation (38% of Earth)
- **Dust Storm Patterns**: Based on real Mars weather data

### Geological Features
- **Impact Crater Morphology**: Scientifically accurate crater structures
- **Lava Tube Formation**: Based on Mars volcanic activity
- **Ice Distribution**: Matches Mars polar and subsurface ice patterns
- **Rock Composition**: Realistic Mars mineralogy representation

## 🎵 Audio Design

### Environmental Audio
- **Background Music**: Atmospheric Mars exploration soundtrack
- **Rover Sounds**: Mechanical movement and operation audio
- **Weather Effects**: Dust devil and storm audio feedback
- **Proximity Audio**: Distance-based sound attenuation

### Audio Controls
- **Smart Loading**: Automatic audio initialization on user interaction
- **Volume Management**: Individual audio channel control
- **Mute System**: Complete audio on/off functionality
- **Browser Compatibility**: Fallback for autoplay restrictions

## 🏆 Achievements & Challenges

### Exploration Challenges
- **Cartographer**: Visit all geological features
- **Survivor**: Withstand multiple dust storms
- **Collector**: Gather 100+ waste items
- **Recycler**: Process materials of all three types

### Environmental Challenges
- **Storm Chaser**: Navigate during active dust storms
- **Ice Hunter**: Locate all ice deposits
- **Cave Explorer**: Investigate Mars cave systems
- **Base Visitor**: Approach all Mars infrastructure

## 🤝 Contributing

We welcome contributions to improve the Mars Rover Recycler experience!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **NASA**: Mars exploration inspiration and scientific data
- **Three.js Community**: Excellent 3D web development framework
- **Mars Research**: Scientific accuracy based on current Mars knowledge
- **Web Audio**: Immersive audio experience implementation

## 📞 Contact

**Developer**: redwings-ops  
**Email**: krupalraikar@gmail.com  
**GitHub**: [@redwings-ops](https://github.com/redwings-ops)  
**Project Link**: [https://github.com/redwings-ops/mars_project](https://github.com/redwings-ops/mars_project)

---

*Experience Mars like never before. Explore, collect, recycle, and survive on the Red Planet!* 🔴🚀

## 🔄 Version History

- **v1.0.0** (2025-10-04): Initial release with complete Mars simulation
  - Full 3D Mars environment with weather systems
  - Advanced rover mechanics and collision detection
  - Comprehensive waste management and recycling system
  - Interactive UI with mini-map navigation
  - Immersive audio system with environmental effects

---

**Ready to explore Mars? Launch the game and begin your mission!** 🌌

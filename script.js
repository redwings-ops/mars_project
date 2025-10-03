
  // ========== Scene setup ==========
  const canvas=document.getElementById('gameCanvas');
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true});renderer.setPixelRatio(window.devicePixelRatio);renderer.setSize(window.innerWidth,window.innerHeight);renderer.shadowMap.enabled = true;renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(60,window.innerWidth/window.innerHeight,0.1,1000);
  camera.position.set(0,8,12);
  camera.lookAt(0,0,0);

  // Enhanced Mars lighting - Cold, harsh UV environment
  const hemi=new THREE.HemisphereLight(0xffb380,0x5d2a0a,0.6);scene.add(hemi);
  
  // Harsh UV sunlight (no ozone protection)
  const dir=new THREE.DirectionalLight(0xffc899,1.8);dir.position.set(5,10,2);
  dir.castShadow = true;
  dir.shadow.mapSize.width = 2048;
  dir.shadow.mapSize.height = 2048;
  scene.add(dir);
  
  // Cold ambient lighting for thin atmosphere
  const ambientLight = new THREE.AmbientLight(0xffb380, 0.2);
  scene.add(ambientLight);
  
  // UV radiation glow effect
  const uvLight = new THREE.DirectionalLight(0xe6ccff, 0.3);
  uvLight.position.set(-3, 8, -5);
  scene.add(uvLight);

  // Enhanced Audio System
  const backgroundMusic = new Audio('music.mp3');
  backgroundMusic.loop = true;
  backgroundMusic.volume = 0.3;
  
  // Rover movement sound
  const roverSound = new Audio('rover.mp3');
  roverSound.loop = true;
  roverSound.volume = 0.4;
  
  // Tornado/Dust devil sound
  const tornadoSound = new Audio('tornado.mp3');
  tornadoSound.loop = true;
  tornadoSound.volume = 0.5;
  
  // Audio control variables
  let musicStarted = false;
  let roverMoving = false;
  let dustDevilNearby = false;
  
  // Start all audio when user interacts with the page
  function startMusic() {
    if (!musicStarted) {
      // Start background music
      backgroundMusic.play().catch(e => console.log('Music autoplay blocked'));
      musicStarted = true;
      console.log('Audio system initialized');
    }
  }
  
  // Rover movement audio control
  function playRoverSound() {
    if (musicStarted && !roverMoving) {
      roverSound.currentTime = 0;
      roverSound.play().catch(e => console.log('Rover sound blocked'));
      roverMoving = true;
    }
  }
  
  function stopRoverSound() {
    if (roverMoving) {
      roverSound.pause();
      roverSound.currentTime = 0;
      roverMoving = false;
    }
  }
  
  // Tornado audio control
  function playTornadoSound() {
    if (musicStarted && !dustDevilNearby) {
      tornadoSound.currentTime = 0;
      tornadoSound.play().catch(e => console.log('Tornado sound blocked'));
      dustDevilNearby = true;
    }
  }
  
  function stopTornadoSound() {
    if (dustDevilNearby) {
      tornadoSound.pause();
      tornadoSound.currentTime = 0;
      dustDevilNearby = false;
    }
  }
  
  // Start music on first user interaction
  window.addEventListener('keydown', startMusic, { once: true });
  window.addEventListener('click', startMusic, { once: true });
  window.addEventListener('touchstart', startMusic, { once: true });

  // Load textures
  const loader = new THREE.TextureLoader();
  const marsTexture = loader.load('mars_ground.jpg');
  const plasticTexture = loader.load('plastic.jpg');
  const metalTexture = loader.load('metal.jpg');
  const organicTexture = loader.load('organic.jpg');

  // Ground - Cold, dusty Mars desert
  const groundGeo=new THREE.PlaneGeometry(200,200,64,64);
  const groundMat=new THREE.MeshStandardMaterial({
    map:marsTexture,
    roughness:1,
    metalness:0.02,
    color: 0xcd853f // Cold, dusty surface tone
  });
  const ground=new THREE.Mesh(groundGeo,groundMat);
  ground.rotation.x=-Math.PI/2;
  ground.receiveShadow = true;
  scene.add(ground);
  
  // Add frost patches (seasonal ice)
  for(let i = 0; i < 8; i++) {
    const frostPatch = new THREE.Mesh(
      new THREE.PlaneGeometry(3 + Math.random() * 4, 2 + Math.random() * 3),
      new THREE.MeshStandardMaterial({
        color: 0xe6f3ff,
        transparent: true,
        opacity: 0.4,
        roughness: 0.9,
        metalness: 0.1
      })
    );
    frostPatch.rotation.x = -Math.PI/2;
    frostPatch.position.set(
      (Math.random() - 0.5) * 150,
      0.01,
      (Math.random() - 0.5) * 150
    );
    scene.add(frostPatch);
  }

  // Mars Sky and Atmosphere - Thin CO2 atmosphere with dust
  scene.background = new THREE.Color(0xd4a574); // Dusty, cold Mars sky
  scene.fog = new THREE.Fog(0xd4a574, 30, 120); // Shorter visibility due to dust

  // Starfield - More visible due to thin atmosphere
  const starGeometry = new THREE.BufferGeometry();
  const starVertices = [];
  for(let i = 0; i < 15000; i++) {
    const x = (Math.random() - 0.5) * 2000;
    const y = Math.random() * 1000 + 300;
    const z = (Math.random() - 0.5) * 2000;
    starVertices.push(x, y, z);
  }
  starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
  const starMaterial = new THREE.PointsMaterial({color: 0xffffff, size: 1.5});
  const stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);
  
  // Atmospheric dust particles - CO2 atmosphere effect
  const dustParticleGeometry = new THREE.BufferGeometry();
  const dustVertices = [];
  const dustColors = [];
  for(let i = 0; i < 2000; i++) {
    dustVertices.push(
      (Math.random() - 0.5) * 400,
      Math.random() * 50,
      (Math.random() - 0.5) * 400
    );
    
    // Mars dust colors
    const dustColor = new THREE.Color();
    dustColor.setHSL(0.08 + Math.random() * 0.03, 0.4, 0.3 + Math.random() * 0.2);
    dustColors.push(dustColor.r, dustColor.g, dustColor.b);
  }
  dustParticleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(dustVertices, 3));
  dustParticleGeometry.setAttribute('color', new THREE.Float32BufferAttribute(dustColors, 3));
  
  const atmosphericDust = new THREE.Points(dustParticleGeometry, new THREE.PointsMaterial({
    size: 0.8,
    vertexColors: true,
    transparent: true,
    opacity: 0.3,
    sizeAttenuation: true
  }));
  scene.add(atmosphericDust);
  
  // Polar ice cap simulation (distant white formations)
  for(let i = 0; i < 3; i++) {
    const iceCap = new THREE.Mesh(
      new THREE.SphereGeometry(15 + Math.random() * 10, 8, 6),
      new THREE.MeshStandardMaterial({
        color: 0xf0f8ff,
        metalness: 0.1,
        roughness: 0.8,
        transparent: true,
        opacity: 0.7
      })
    );
    iceCap.position.set(
      (Math.random() - 0.5) * 300,
      -5,
      180 + Math.random() * 50
    );
    iceCap.scale.y = 0.3;
    scene.add(iceCap);
  }

  // Mars Environmental System - Cold desert with harsh conditions
  const dustDevils = [];
  const MAX_DUST_DEVILS = 2;
  const DUST_DEVIL_SPAWN_CHANCE = 0.003; // Reduced spawn rate for realism
  const DUST_DEVIL_LIFETIME = 20000; // 20 seconds
  
  // Dynamic Weather System
  let marsTemperature = -80; // Starting temperature in Celsius
  let temperatureVariation = 0;
  let windIntensity = 0;
  let marsTime = 0; // Sol time in hours (0-24)
  let marsSol = 1; // Mars day counter
  let weatherState = 'clear'; // clear, dusty, storm
  let dustStormIntensity = 0;
  let solarEfficiency = 1.0;
  let visibility = 1.0;
  let isDayTime = true;
  
  // Weather transition timers
  let weatherChangeTimer = 0;
  let dustStormTimer = 0;
  const WEATHER_CHANGE_INTERVAL = 120; // 2 minutes between weather changes
  const DUST_STORM_DURATION = 60; // 1 minute dust storm duration
  
  // Mars environmental effects with dynamic weather
  function updateMarsEnvironment(dt) {
    // Update Mars time (1 Sol = 24 hours 37 minutes, simplified to 24 hours)
    marsTime += dt * 0.5; // Accelerated time for gameplay
    if(marsTime >= 24) {
      marsTime = 0;
      marsSol++;
    }
    
    // Day/night cycle
    isDayTime = marsTime >= 6 && marsTime < 18;
    const sunAngle = (marsTime / 24) * Math.PI * 2 - Math.PI / 2;
    
    // Adjust lighting based on time of day
    if(isDayTime) {
      dir.intensity = 1.8 * (0.5 + 0.5 * Math.sin(sunAngle));
      ambientLight.intensity = 0.2 * (0.3 + 0.7 * Math.sin(sunAngle));
      scene.background = new THREE.Color(0xd4a574); // Day sky
    } else {
      dir.intensity = 0.1; // Very dim at night
      ambientLight.intensity = 0.05;
      scene.background = new THREE.Color(0x2a1810); // Night sky
    }
    
    // Update sun position
    dir.position.set(
      Math.cos(sunAngle) * 10,
      Math.sin(sunAngle) * 10,
      2
    );
    
    // Weather system
    weatherChangeTimer += dt;
    if(weatherChangeTimer >= WEATHER_CHANGE_INTERVAL) {
      weatherChangeTimer = 0;
      // Random weather change
      const rand = Math.random();
      if(rand < 0.6) {
        weatherState = 'clear';
      } else if(rand < 0.85) {
        weatherState = 'dusty';
      } else {
        weatherState = 'storm';
        dustStormTimer = DUST_STORM_DURATION;
      }
    }
    
    // Dust storm management
    if(weatherState === 'storm') {
      dustStormTimer -= dt;
      if(dustStormTimer <= 0) {
        weatherState = 'dusty';
      }
    }
    
    // Update weather effects
    switch(weatherState) {
      case 'clear':
        dustStormIntensity = Math.max(0, dustStormIntensity - dt * 0.5);
        visibility = Math.min(1.0, visibility + dt * 0.3);
        solarEfficiency = Math.min(1.0, solarEfficiency + dt * 0.2);
        break;
      case 'dusty':
        dustStormIntensity = Math.min(0.3, dustStormIntensity + dt * 0.3);
        visibility = Math.max(0.7, visibility - dt * 0.2);
        solarEfficiency = Math.max(0.6, solarEfficiency - dt * 0.1);
        break;
      case 'storm':
        dustStormIntensity = Math.min(0.8, dustStormIntensity + dt * 0.7);
        visibility = Math.max(0.2, visibility - dt * 0.5);
        solarEfficiency = Math.max(0.2, solarEfficiency - dt * 0.3);
        break;
    }
    
    // Apply weather effects to environment
    scene.fog.far = 120 * visibility;
    scene.fog.near = 30 * visibility;
    
    // Temperature variations based on time and weather
    temperatureVariation += dt * 0.1;
    let baseTemp = isDayTime ? -40 : -80;
    marsTemperature = baseTemp + Math.sin(temperatureVariation) * 20 - (dustStormIntensity * 10);
    
    // Wind effects (stronger during storms)
    windIntensity = 0.3 + Math.sin(temperatureVariation * 2) * 0.2 + dustStormIntensity * 0.5;
    
    // Update displays
    updateWeatherDisplay();
    updateEnvironmentalDisplay();
    
    // Animate atmospheric dust with weather effects
    if(atmosphericDust) {
      atmosphericDust.rotation.y += dt * windIntensity * 0.05;
      const positions = atmosphericDust.geometry.attributes.position.array;
      
      // Increase dust particle density during storms
      atmosphericDust.material.opacity = 0.3 + dustStormIntensity * 0.4;
      atmosphericDust.material.size = 0.8 + dustStormIntensity * 0.7;
      
      for(let i = 0; i < positions.length; i += 3) {
        // More chaotic movement during storms
        const stormMultiplier = 1 + dustStormIntensity * 2;
        positions[i] += (Math.random() - 0.5) * windIntensity * dt * 0.5 * stormMultiplier;
        positions[i + 1] += (Math.random() - 0.5) * dustStormIntensity * dt * 2; // Vertical movement in storms
        positions[i + 2] += (Math.random() - 0.5) * windIntensity * dt * 0.5 * stormMultiplier;
        
        // Reset particles that drift too far
        if(Math.abs(positions[i]) > 200) positions[i] = (Math.random() - 0.5) * 400;
        if(Math.abs(positions[i + 2]) > 200) positions[i + 2] = (Math.random() - 0.5) * 400;
        if(positions[i + 1] > 60) positions[i + 1] = Math.random() * 10;
        if(positions[i + 1] < 0) positions[i + 1] = Math.random() * 50;
      }
      atmosphericDust.geometry.attributes.position.needsUpdate = true;
    }
    
    // UV radiation intensity variation
    if(uvLight) {
      uvLight.intensity = 0.2 + Math.sin(temperatureVariation * 1.5) * 0.1;
    }
    
    // Temperature-based visual effects on rover and environment
    const tempFactor = (marsTemperature + 125) / 145; // Normalize temperature (-125 to 20)
    
    // Simulate cold effects on rover systems
    if(marsTemperature < -100) {
      // Very cold - add slight blue tint to indicate system stress
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 0.8 + tempFactor * 0.4;
    } else {
      renderer.toneMappingExposure = 1.0;
    }
  }
  
  // Weather and environmental display functions
  function updateWeatherDisplay() {
    const weatherStatusEl = document.getElementById('weatherStatus');
    const visibilityEl = document.getElementById('visibilityLevel');
    const solarEfficiencyEl = document.getElementById('solarEfficiency');
    const marsTimeEl = document.getElementById('marsTime');
    
    if(weatherStatusEl) {
      let weatherText = weatherState;
      if(weatherState === 'storm') weatherText = 'Dust Storm';
      else if(weatherState === 'dusty') weatherText = 'Dusty';
      else weatherText = 'Clear';
      weatherStatusEl.textContent = weatherText;
      weatherStatusEl.style.color = weatherState === 'storm' ? '#ff4444' : 
                                   weatherState === 'dusty' ? '#ffaa44' : '#44ff44';
    }
    
    if(visibilityEl) {
      visibilityEl.textContent = Math.round(visibility * 100) + '%';
    }
    
    if(solarEfficiencyEl) {
      solarEfficiencyEl.textContent = Math.round(solarEfficiency * 100) + '%';
    }
    
    if(marsTimeEl) {
      const hour = Math.floor(marsTime);
      const minute = Math.floor((marsTime - hour) * 60);
      const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      marsTimeEl.textContent = `Sol ${marsSol} - ${timeStr}`;
    }
  }
  
  function updateEnvironmentalDisplay() {
    const tempDisplay = document.getElementById('tempDisplay');
    const windDisplay = document.getElementById('windDisplay'); 
    if(tempDisplay) {
      tempDisplay.textContent = Math.round(marsTemperature) + '°C';
    }
    if(windDisplay) {
      const windLevel = windIntensity > 0.6 ? 'Storm' : 
                       windIntensity > 0.4 ? 'High' : 
                       windIntensity > 0.25 ? 'Moderate' : 'Low';
      windDisplay.textContent = windLevel;
    }
  }
  
  function createDustDevil(x, z) {
    const dustDevilGroup = new THREE.Group();
    
    // Create swirling dust particles
    const particleCount = 200;
    const dustGeometry = new THREE.BufferGeometry();
    const dustPositions = [];
    const dustColors = [];
    
    for(let i = 0; i < particleCount; i++) {
      // Spiral pattern
      const height = Math.random() * 25; // Up to 25 units tall
      const radius = (1 - height/25) * 3 + Math.random() * 2; // Funnel shape
      const angle = (height * 0.5) + Math.random() * Math.PI * 2;
      
      dustPositions.push(
        Math.cos(angle) * radius + (Math.random() - 0.5) * 0.5,
        height,
        Math.sin(angle) * radius + (Math.random() - 0.5) * 0.5
      );
      
      // Mars dust colors (reddish-brown variations)
      const dustColor = new THREE.Color();
      dustColor.setHSL(0.08 + Math.random() * 0.05, 0.6 + Math.random() * 0.3, 0.3 + Math.random() * 0.4);
      dustColors.push(dustColor.r, dustColor.g, dustColor.b);
    }
    
    dustGeometry.setAttribute('position', new THREE.Float32BufferAttribute(dustPositions, 3));
    dustGeometry.setAttribute('color', new THREE.Float32BufferAttribute(dustColors, 3));
    
    const dustMaterial = new THREE.PointsMaterial({
      size: 1.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true
    });
    
    const dustParticles = new THREE.Points(dustGeometry, dustMaterial);
    dustDevilGroup.add(dustParticles);
    
    // Add visible dust column
    const dustColumn = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 3, 15, 12),
      new THREE.MeshStandardMaterial({
        color: 0xCD853F,
        transparent: true,
        opacity: 0.4,
        roughness: 1.0
      })
    );
    dustColumn.position.y = 7.5;
    dustDevilGroup.add(dustColumn);
    
    // Add base swirl effect
    const baseSwirl = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 3.5, 2, 8),
      new THREE.MeshStandardMaterial({
        color: 0xD2691E,
        transparent: true,
        opacity: 0.6,
        roughness: 1.0
      })
    );
    baseSwirl.position.y = 1;
    dustDevilGroup.add(baseSwirl);
    
    // Position the dust devil
    dustDevilGroup.position.set(x, 0, z);
    dustDevilGroup.userData = {
      createdTime: Date.now(),
      rotationSpeed: 0.1 + Math.random() * 0.15,
      moveSpeed: 0.5 + Math.random() * 1.0,
      direction: Math.random() * Math.PI * 2,
      height: 20 + Math.random() * 10
    };
    
    return dustDevilGroup;
  }
  
  function updateDustDevils(dt) {
    // Spawn new dust devils occasionally
    if(dustDevils.length < MAX_DUST_DEVILS && Math.random() < DUST_DEVIL_SPAWN_CHANCE) {
      const x = (Math.random() - 0.5) * 150;
      const z = (Math.random() - 0.5) * 150;
      
      // Don't spawn too close to rover or machine
      if(Math.sqrt(x*x + z*z) > 20 && Math.sqrt((x-12)*(x-12) + z*z) > 15) {
        const dustDevil = createDustDevil(x, z);
        scene.add(dustDevil);
        dustDevils.push(dustDevil);
        console.log(`Dust devil spawned at (${x.toFixed(1)}, ${z.toFixed(1)})`);
        
        // Play tornado sound when dust devil spawns
        playTornadoSound();
      }
    }
    
    // Check if any dust devils are nearby for audio control
    let nearbyDustDevil = false;
    const TORNADO_SOUND_DISTANCE = 15; // Distance within which tornado sound plays
    
    // Update existing dust devils
    for(let i = dustDevils.length - 1; i >= 0; i--) {
      const dustDevil = dustDevils[i];
      const userData = dustDevil.userData;
      const age = Date.now() - userData.createdTime;
      
      // Remove old dust devils
      if(age > DUST_DEVIL_LIFETIME) {
        scene.remove(dustDevil);
        dustDevils.splice(i, 1);
        continue;
      }
      
      // Rotate the dust devil
      dustDevil.rotation.y += userData.rotationSpeed * dt * 60;
      
      // Move the dust devil
      dustDevil.position.x += Math.cos(userData.direction) * userData.moveSpeed * dt;
      dustDevil.position.z += Math.sin(userData.direction) * userData.moveSpeed * dt;
      
      // Randomly change direction occasionally
      if(Math.random() < 0.01) {
        userData.direction += (Math.random() - 0.5) * 1.0;
      }
      
      // Fade out near end of lifetime
      const fadeRatio = Math.max(0, 1 - (age / DUST_DEVIL_LIFETIME));
      const particles = dustDevil.children[0];
      if(particles && particles.material) {
        particles.material.opacity = 0.7 * fadeRatio;
      }
      
      // Check collision with rover (push effect)
      const distanceToRover = dustDevil.position.distanceTo(rover.position);
      
      // Check if dust devil is nearby for tornado sound
      if(distanceToRover < TORNADO_SOUND_DISTANCE) {
        nearbyDustDevil = true;
        
        // Adjust tornado sound volume based on distance
        if(musicStarted && dustDevilNearby) {
          const volumeMultiplier = Math.max(0.1, 1 - (distanceToRover / TORNADO_SOUND_DISTANCE));
          tornadoSound.volume = 0.5 * volumeMultiplier;
        }
      }
      
      if(distanceToRover < 4) {
        // Create screen shake effect
        const shakeIntensity = (4 - distanceToRover) / 4;
        camera.position.x += (Math.random() - 0.5) * shakeIntensity * 0.3;
        camera.position.y += (Math.random() - 0.5) * shakeIntensity * 0.2;
        camera.position.z += (Math.random() - 0.5) * shakeIntensity * 0.3;
        
        // Push rover slightly
        const pushDirection = rover.position.clone().sub(dustDevil.position).normalize();
        rover.position.add(pushDirection.multiplyScalar(dt * 2));
      }
    }
    
    // Control tornado sound based on proximity
    if(nearbyDustDevil && !dustDevilNearby) {
      playTornadoSound();
    } else if(!nearbyDustDevil && dustDevilNearby) {
      stopTornadoSound();
    }
  }

  // Rock formations - Realistic geological features
  function createRockFormation(x, z, scale = 1) {
    const rockGroup = new THREE.Group();
    
    // Main rock base (irregular shape)
    const baseRock = new THREE.Mesh(
      new THREE.DodecahedronGeometry(2 * scale, 1),
      new THREE.MeshStandardMaterial({
        color: '#8B4513',
        roughness: 0.9,
        metalness: 0.1,
        map: marsTexture
      })
    );
    baseRock.scale.set(1, 0.6, 1.2);
    baseRock.position.y = 1.2 * scale;
    rockGroup.add(baseRock);
    
    // Secondary rocks
    for(let i = 0; i < 3 + Math.floor(Math.random() * 3); i++) {
      const size = (0.3 + Math.random() * 0.8) * scale;
      const secondaryRock = new THREE.Mesh(
        new THREE.DodecahedronGeometry(size, 0),
        new THREE.MeshStandardMaterial({
          color: new THREE.Color().setHSL(0.08, 0.3, 0.2 + Math.random() * 0.3),
          roughness: 0.8 + Math.random() * 0.2,
          metalness: 0.05
        })
      );
      
      const angle = (i / 3) * Math.PI * 2 + Math.random();
      const radius = 1.5 + Math.random() * 2;
      secondaryRock.position.set(
        Math.cos(angle) * radius * scale,
        size * 0.8,
        Math.sin(angle) * radius * scale
      );
      
      secondaryRock.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      
      rockGroup.add(secondaryRock);
    }
    
    // Organic unshaped rock elements
    if(Math.random() > 0.6) {
      const numElements = 2 + Math.floor(Math.random() * 3);
      for(let e = 0; e < numElements; e++) {
        // Create irregular, organic shapes
        const shapeType = Math.floor(Math.random() * 4);
        let unshapedRock;
        
        if(shapeType === 0) {
          // Weathered boulder (deformed sphere)
          const boulder = new THREE.Mesh(
            new THREE.SphereGeometry(1.2 * scale, 8, 6),
            new THREE.MeshStandardMaterial({
              color: new THREE.Color().setHSL(0.08, 0.2, 0.15 + Math.random() * 0.25),
              roughness: 0.95,
              metalness: 0.02
            })
          );
          boulder.scale.set(1 + Math.random() * 0.5, 0.6 + Math.random() * 0.8, 1.2 + Math.random() * 0.4);
          unshapedRock = boulder;
        }
        else if(shapeType === 1) {
          // Eroded spire (stretched and twisted)
          const spire = new THREE.Mesh(
            new THREE.ConeGeometry(0.8 * scale, 3 * scale, 6),
            new THREE.MeshStandardMaterial({
              color: '#8B4513',
              roughness: 0.9,
              metalness: 0.05
            })
          );
          spire.scale.set(0.7 + Math.random() * 0.6, 1 + Math.random() * 0.8, 0.9 + Math.random() * 0.4);
          spire.rotation.z = (Math.random() - 0.5) * 0.4;
          unshapedRock = spire;
        }
        else if(shapeType === 2) {
          // Layered sediment formation (stacked discs)
          const layerGroup = new THREE.Group();
          const layers = 3 + Math.floor(Math.random() * 3);
          for(let l = 0; l < layers; l++) {
            const layer = new THREE.Mesh(
              new THREE.CylinderGeometry(
                (1.5 - l * 0.2) * scale, 
                (1.8 - l * 0.2) * scale, 
                0.3 * scale, 
                8
              ),
              new THREE.MeshStandardMaterial({
                color: new THREE.Color().setHSL(0.08, 0.15, 0.2 + l * 0.05),
                roughness: 0.85 + Math.random() * 0.15,
                metalness: 0.03
              })
            );
            layer.position.y = l * 0.25 * scale;
            layer.rotation.y = l * 0.3;
            layerGroup.add(layer);
          }
          unshapedRock = layerGroup;
        }
        else {
          // Wind-carved arch or hole formation
          const archBase = new THREE.Mesh(
            new THREE.TorusGeometry(1.5 * scale, 0.8 * scale, 6, 12),
            new THREE.MeshStandardMaterial({
              color: '#A0522D',
              roughness: 0.9,
              metalness: 0.04
            })
          );
          archBase.rotation.x = Math.PI / 2;
          archBase.scale.set(1, 0.6 + Math.random() * 0.4, 1.2);
          unshapedRock = archBase;
        }
        
        // Position each unshaped element randomly around the formation
        const elementAngle = Math.random() * Math.PI * 2;
        const elementDistance = Math.random() * 3 * scale;
        unshapedRock.position.set(
          Math.cos(elementAngle) * elementDistance,
          unshapedRock.geometry ? (unshapedRock.geometry.boundingSphere?.radius || 1) * scale : scale,
          Math.sin(elementAngle) * elementDistance
        );
        
        // Add natural rotation and slight tilt
        unshapedRock.rotation.x += (Math.random() - 0.5) * 0.3;
        unshapedRock.rotation.y += Math.random() * Math.PI;
        unshapedRock.rotation.z += (Math.random() - 0.5) * 0.2;
        
        rockGroup.add(unshapedRock);
      }
    }
    
    rockGroup.position.set(x, 0, z);
    return rockGroup;
  }

  // Generate rock formations across the landscape with collision tracking
  const rockFormations = [];
  const geologicalFeatures = [];
  
  for(let i = 0; i < 25; i++) {
    const x = (Math.random() - 0.5) * 180;
    const z = (Math.random() - 0.5) * 180;
    const scale = 0.5 + Math.random() * 1.5;
    
    // Avoid spawning too close to rover start or machine
    if(Math.abs(x) > 10 && Math.abs(z) > 10 && 
       Math.sqrt((x-12)*(x-12) + z*z) > 8) {
      scene.add(createRockFormation(x, z, scale));
      // Store rock position and size for collision detection
      rockFormations.push({
        x: x,
        z: z,
        radius: 2.5 * scale, // Collision radius based on rock scale
        type: 'rock'
      });
    }
  }
  
  // Geological Features
  // Mars Caves
  function createCaveEntrance(x, z) {
    const caveGroup = new THREE.Group();
    
    // Cave opening
    const caveOpening = new THREE.Mesh(
      new THREE.SphereGeometry(3, 16, 8, 0, Math.PI, 0, Math.PI / 2),
      new THREE.MeshStandardMaterial({
        color: '#2F2F2F',
        roughness: 1.0,
        metalness: 0.0
      })
    );
    caveOpening.position.y = 1.5;
    caveOpening.rotation.x = Math.PI;
    caveGroup.add(caveOpening);
    
    // Cave entrance rocks
    for(let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const rock = new THREE.Mesh(
        new THREE.DodecahedronGeometry(0.5 + Math.random() * 0.8, 0),
        new THREE.MeshStandardMaterial({
          color: new THREE.Color().setHSL(0.08, 0.3, 0.2 + Math.random() * 0.2),
          roughness: 0.9,
          metalness: 0.0
        })
      );
      rock.position.set(
        Math.cos(angle) * (2.5 + Math.random()),
        Math.random() * 0.8,
        Math.sin(angle) * (2.5 + Math.random())
      );
      caveGroup.add(rock);
    }
    
    // Cave entrance marker
    const marker = new THREE.Mesh(
      new THREE.SphereGeometry(0.1),
      new THREE.MeshStandardMaterial({
        color: '#00ff00',
        emissive: '#00ff00',
        emissiveIntensity: 0.5
      })
    );
    marker.position.y = 3;
    caveGroup.add(marker);
    
    caveGroup.position.set(x, 0, z);
    return caveGroup;
  }
  
  // Lava Tubes
  function createLavaTube(x, z) {
    const tubeGroup = new THREE.Group();
    
    // Tube entrance (collapsed section)
    const tubeEntrance = new THREE.Mesh(
      new THREE.CylinderGeometry(2, 4, 1, 12),
      new THREE.MeshStandardMaterial({
        color: '#8B0000',
        roughness: 0.8,
        metalness: 0.1
      })
    );
    tubeEntrance.position.y = 0.5;
    tubeGroup.add(tubeEntrance);
    
    // Volcanic rock formations around tube
    for(let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const volcanicRock = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.8 + Math.random() * 0.5, 0),
        new THREE.MeshStandardMaterial({
          color: '#8B0000',
          roughness: 0.9,
          metalness: 0.05
        })
      );
      volcanicRock.position.set(
        Math.cos(angle) * (3 + Math.random()),
        0.4,
        Math.sin(angle) * (3 + Math.random())
      );
      tubeGroup.add(volcanicRock);
    }
    
    tubeGroup.position.set(x, 0, z);
    return tubeGroup;
  }
  
  // Impact Craters
  function createCrater(x, z, size) {
    const craterGroup = new THREE.Group();
    
    // Crater depression (inverted dome)
    const craterDepression = new THREE.Mesh(
      new THREE.SphereGeometry(size, 24, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2),
      new THREE.MeshStandardMaterial({
        color: '#A0522D',
        roughness: 1.0,
        metalness: 0.0
      })
    );
    craterDepression.position.y = -size * 0.3;
    craterDepression.rotation.x = Math.PI;
    craterGroup.add(craterDepression);
    
    // Crater rim
    const craterRim = new THREE.Mesh(
      new THREE.TorusGeometry(size * 1.2, size * 0.3, 8, 16),
      new THREE.MeshStandardMaterial({
        color: '#CD853F',
        roughness: 0.9,
        metalness: 0.0
      })
    );
    craterRim.position.y = size * 0.1;
    craterRim.rotation.x = Math.PI / 2;
    craterGroup.add(craterRim);
    
    // Ejected material around crater
    for(let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const distance = size * (1.5 + Math.random() * 2);
      const ejecta = new THREE.Mesh(
        new THREE.SphereGeometry(0.2 + Math.random() * 0.4, 6, 4),
        new THREE.MeshStandardMaterial({
          color: '#8B7355',
          roughness: 0.9,
          metalness: 0.0
        })
      );
      ejecta.position.set(
        Math.cos(angle) * distance,
        0.1,
        Math.sin(angle) * distance
      );
      craterGroup.add(ejecta);
    }
    
    craterGroup.position.set(x, 0, z);
    return craterGroup;
  }
  
  // Underground Water/Ice Deposits (surface indicators)
  function createIceDeposit(x, z) {
    const iceGroup = new THREE.Group();
    
    // Surface ice patch
    const icePatch = new THREE.Mesh(
      new THREE.PlaneGeometry(4, 4, 8, 8),
      new THREE.MeshStandardMaterial({
        color: '#E0FFFF',
        transparent: true,
        opacity: 0.8,
        roughness: 0.1,
        metalness: 0.3
      })
    );
    icePatch.rotation.x = -Math.PI / 2;
    icePatch.position.y = 0.02;
    iceGroup.add(icePatch);
    
    // Frost crystals
    for(let i = 0; i < 8; i++) {
      const crystal = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.1 + Math.random() * 0.1),
        new THREE.MeshStandardMaterial({
          color: '#F0F8FF',
          transparent: true,
          opacity: 0.9,
          roughness: 0.1,
          metalness: 0.2
        })
      );
      crystal.position.set(
        (Math.random() - 0.5) * 3,
        0.1,
        (Math.random() - 0.5) * 3
      );
      iceGroup.add(crystal);
    }
    
    iceGroup.position.set(x, 0, z);
    return iceGroup;
  }
  
  // Generate geological features
  // Caves (3-4 across the map)
  for(let i = 0; i < 4; i++) {
    const x = (Math.random() - 0.5) * 160;
    const z = (Math.random() - 0.5) * 160;
    if(Math.sqrt(x*x + z*z) > 20) {
      const cave = createCaveEntrance(x, z);
      scene.add(cave);
      geologicalFeatures.push({x, z, radius: 4, type: 'cave'});
    }
  }
  
  // Lava tubes (2-3 across the map)
  for(let i = 0; i < 3; i++) {
    const x = (Math.random() - 0.5) * 140;
    const z = (Math.random() - 0.5) * 140;
    if(Math.sqrt(x*x + z*z) > 25) {
      const tube = createLavaTube(x, z);
      scene.add(tube);
      geologicalFeatures.push({x, z, radius: 5, type: 'lava_tube'});
    }
  }
  
  // Impact craters (4-6 across the map)
  for(let i = 0; i < 5; i++) {
    const x = (Math.random() - 0.5) * 170;
    const z = (Math.random() - 0.5) * 170;
    const size = 3 + Math.random() * 4;
    if(Math.sqrt(x*x + z*z) > 15) {
      const crater = createCrater(x, z, size);
      scene.add(crater);
      geologicalFeatures.push({x, z, radius: size * 1.5, type: 'crater'});
    }
  }
  
  // Ice deposits (6-8 scattered around)
  for(let i = 0; i < 7; i++) {
    const x = (Math.random() - 0.5) * 150;
    const z = (Math.random() - 0.5) * 150;
    if(Math.sqrt(x*x + z*z) > 10) {
      const ice = createIceDeposit(x, z);
      scene.add(ice);
      geologicalFeatures.push({x, z, radius: 2.5, type: 'ice'});
    }
  }

  // Rover (player) - Enhanced Design
  const rover=new THREE.Group();
  
  // Main body (larger and more detailed)
  const body=new THREE.Mesh(new THREE.BoxGeometry(2,0.8,1.4),new THREE.MeshStandardMaterial({color:'#d15b3a',metalness:0.3,roughness:0.6}));
  body.position.y=0.6;
  rover.add(body);
  
  // Rover cabin/cockpit
  const cabin=new THREE.Mesh(new THREE.BoxGeometry(1.2,0.6,1),new THREE.MeshStandardMaterial({color:'#ff6b35',metalness:0.7,roughness:0.4}));
  cabin.position.set(0,1.1,0);
  rover.add(cabin);
  
  // Solar panels
  const solarPanel1=new THREE.Mesh(new THREE.BoxGeometry(0.1,1.5,0.8),new THREE.MeshStandardMaterial({color:'#1a1a2e',metalness:0.8,roughness:0.2}));
  solarPanel1.position.set(-1.2,1.2,0);
  rover.add(solarPanel1);
  
  const solarPanel2=new THREE.Mesh(new THREE.BoxGeometry(0.1,1.5,0.8),new THREE.MeshStandardMaterial({color:'#1a1a2e',metalness:0.8,roughness:0.2}));
  solarPanel2.position.set(1.2,1.2,0);
  rover.add(solarPanel2);
  
  // Robotic arm
  const arm1=new THREE.Mesh(new THREE.CylinderGeometry(0.08,0.08,0.8),new THREE.MeshStandardMaterial({color:'#666',metalness:0.9,roughness:0.3}));
  arm1.position.set(0.8,0.8,-0.5);
  arm1.rotation.z=-Math.PI/4;
  rover.add(arm1);
  
  const arm2=new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.06,0.6),new THREE.MeshStandardMaterial({color:'#666',metalness:0.9,roughness:0.3}));
  arm2.position.set(1.2,0.4,-0.5);
  arm2.rotation.z=-Math.PI/6;
  rover.add(arm2);
  
  // Enhanced wheels
  const wheelGeom=new THREE.CylinderGeometry(0.3,0.3,0.5,16);
  for(let i=-1;i<=1;i+=2){
    for(let j=-1;j<=1;j+=2){
      const w=new THREE.Mesh(wheelGeom,new THREE.MeshStandardMaterial({color:'#333',metalness:0.1,roughness:0.8}));
      w.rotation.z=Math.PI/2;
      w.position.set(0.8*i,0.3,0.6*j);
      rover.add(w);
      
      // Wheel treads
      const tread=new THREE.Mesh(new THREE.TorusGeometry(0.32,0.02,8,20),new THREE.MeshStandardMaterial({color:'#111'}));
      tread.rotation.y=Math.PI/2;
      tread.position.set(0.8*i,0.3,0.6*j);
      rover.add(tread);
    }
  }
  
  // Antenna
  const antenna=new THREE.Mesh(new THREE.CylinderGeometry(0.02,0.02,1.2),new THREE.MeshStandardMaterial({color:'#silver',metalness:0.9,roughness:0.1}));
  antenna.position.set(-0.3,1.8,0.3);
  rover.add(antenna);
  
  rover.position.set(0,0,0);scene.add(rover);

  // Tire Tracks System
  const tireTracksGroup = new THREE.Group();
  scene.add(tireTracksGroup);
  const tireTrackHistory = [];
  const MAX_TIRE_TRACKS = 500; // Maximum number of tire track segments
  let lastTrackPosition = {x: rover.position.x, z: rover.position.z};
  const TRACK_DISTANCE_THRESHOLD = 0.3; // Minimum distance before creating new track
  
  function createTireTrack(x, z, rotation) {
    // Create tire track marks (two parallel tracks for left and right wheels)
    const trackGroup = new THREE.Group();
    
    // Left tire track
    const leftTrack = new THREE.Mesh(
      new THREE.PlaneGeometry(0.2, 0.8),
      new THREE.MeshStandardMaterial({
        color: '#5D4037',
        transparent: true,
        opacity: 0.6,
        roughness: 1.0,
        metalness: 0.0
      })
    );
    leftTrack.rotation.x = -Math.PI / 2;
    leftTrack.position.set(-0.6, 0.01, 0); // Slightly above ground to avoid z-fighting
    
    // Right tire track
    const rightTrack = new THREE.Mesh(
      new THREE.PlaneGeometry(0.2, 0.8),
      new THREE.MeshStandardMaterial({
        color: '#5D4037',
        transparent: true,
        opacity: 0.6,
        roughness: 1.0,
        metalness: 0.0
      })
    );
    rightTrack.rotation.x = -Math.PI / 2;
    rightTrack.position.set(0.6, 0.01, 0);
    
    trackGroup.add(leftTrack);
    trackGroup.add(rightTrack);
    
    // Position and rotate the track group
    trackGroup.position.set(x, 0, z);
    trackGroup.rotation.y = rotation;
    
    return trackGroup;
  }
  
  function addTireTrack(x, z, rotation) {
    const track = createTireTrack(x, z, rotation);
    tireTracksGroup.add(track);
    tireTrackHistory.push(track);
    
    // Remove old tracks if we exceed the maximum
    if (tireTrackHistory.length > MAX_TIRE_TRACKS) {
      const oldTrack = tireTrackHistory.shift();
      tireTracksGroup.remove(oldTrack);
    }
  }
  
  function shouldCreateTrack(currentX, currentZ) {
    const distance = Math.sqrt(
      Math.pow(currentX - lastTrackPosition.x, 2) + 
      Math.pow(currentZ - lastTrackPosition.z, 2)
    );
    return distance >= TRACK_DISTANCE_THRESHOLD;
  }

  // Waste items - Enhanced Realistic Designs
  const wastes=[]; 
  const types=['plastic','metal','organic'];
  function spawnWaste(n=25){
    for(let i=0;i<n;i++){
      const t=types[Math.floor(Math.random()*types.length)];
      let mesh;
      
      if(t==='plastic'){
        // Create realistic plastic bottles and containers
        const bottleType = Math.floor(Math.random()*3);
        if(bottleType === 0) {
          // Water bottle
          const bottleGroup = new THREE.Group();
          const bottleBody = new THREE.Mesh(
            new THREE.CylinderGeometry(0.12, 0.15, 0.6, 12),
            new THREE.MeshStandardMaterial({map:plasticTexture, metalness:0.1, roughness:0.4, transparent:true, opacity:0.8})
          );
          const bottleNeck = new THREE.Mesh(
            new THREE.CylinderGeometry(0.05, 0.08, 0.15, 8),
            new THREE.MeshStandardMaterial({color:'#2980b9', metalness:0.2, roughness:0.5})
          );
          bottleNeck.position.y = 0.375;
          bottleGroup.add(bottleBody);
          bottleGroup.add(bottleNeck);
          mesh = bottleGroup;
        } else if(bottleType === 1) {
          // Plastic bag (flattened)
          mesh = new THREE.Mesh(
            new THREE.BoxGeometry(0.4, 0.05, 0.3),
            new THREE.MeshStandardMaterial({map:plasticTexture, metalness:0.0, roughness:0.8, transparent:true, opacity:0.7})
          );
        } else {
          // Food container
          mesh = new THREE.Mesh(
            new THREE.BoxGeometry(0.25, 0.15, 0.35),
            new THREE.MeshStandardMaterial({map:plasticTexture, metalness:0.1, roughness:0.6})
          );
        }
      }
      
      else if(t==='metal'){
        // Create realistic metal scraps and cans
        const metalType = Math.floor(Math.random()*3);
        if(metalType === 0) {
          // Crushed aluminum can
          mesh = new THREE.Mesh(
            new THREE.CylinderGeometry(0.15, 0.08, 0.25, 12),
            new THREE.MeshStandardMaterial({map:metalTexture, metalness:0.9, roughness:0.2})
          );
        } else if(metalType === 1) {
          // Metal pipe section
          mesh = new THREE.Mesh(
            new THREE.CylinderGeometry(0.08, 0.08, 0.5, 16),
            new THREE.MeshStandardMaterial({color:'#34495e', metalness:0.8, roughness:0.3})
          );
          mesh.rotation.z = Math.PI/2;
        } else {
          // Scrap metal piece (irregular)
          const metalGroup = new THREE.Group();
          const piece1 = new THREE.Mesh(
            new THREE.BoxGeometry(0.3, 0.05, 0.2),
            new THREE.MeshStandardMaterial({map:metalTexture, metalness:0.9, roughness:0.35})
          );
          const piece2 = new THREE.Mesh(
            new THREE.BoxGeometry(0.15, 0.03, 0.25),
            new THREE.MeshStandardMaterial({color:'#7f8c8d', metalness:0.8, roughness:0.4})
          );
          piece2.position.set(0.1, 0.04, 0.05);
          piece2.rotation.y = Math.PI/4;
          metalGroup.add(piece1);
          metalGroup.add(piece2);
          mesh = metalGroup;
        }
      }
      
      else { // organic
        // Create realistic organic waste
        const organicType = Math.floor(Math.random()*4);
        if(organicType === 0) {
          // Food scraps pile
          const organicGroup = new THREE.Group();
          const base = new THREE.Mesh(
            new THREE.SphereGeometry(0.2, 8, 6),
            new THREE.MeshStandardMaterial({map:organicTexture, metalness:0.0, roughness:1.0, color:'#8B4513'})
          );
          base.scale.y = 0.5;
          const piece1 = new THREE.Mesh(
            new THREE.SphereGeometry(0.08, 6, 4),
            new THREE.MeshStandardMaterial({color:'#228B22', metalness:0.0, roughness:0.9})
          );
          piece1.position.set(0.15, 0.08, 0.1);
          const piece2 = new THREE.Mesh(
            new THREE.SphereGeometry(0.06, 6, 4),
            new THREE.MeshStandardMaterial({color:'#FF6347', metalness:0.0, roughness:0.8})
          );
          piece2.position.set(-0.12, 0.05, -0.08);
          organicGroup.add(base);
          organicGroup.add(piece1);
          organicGroup.add(piece2);
          mesh = organicGroup;
        } else if(organicType === 1) {
          // Banana peel
          mesh = new THREE.Mesh(
            new THREE.RingGeometry(0.08, 0.25, 6),
            new THREE.MeshStandardMaterial({color:'#FFD700', metalness:0.0, roughness:0.9})
          );
          mesh.rotation.x = -Math.PI/2 + Math.PI/6;
        } else if(organicType === 2) {
          // Apple core
          mesh = new THREE.Mesh(
            new THREE.SphereGeometry(0.15, 8, 6),
            new THREE.MeshStandardMaterial({color:'#8B4513', metalness:0.0, roughness:0.8, map:organicTexture})
          );
          mesh.scale.set(1, 0.8, 1);
        } else {
          // Compost pile
          mesh = new THREE.Mesh(
            new THREE.DodecahedronGeometry(0.18, 0),
            new THREE.MeshStandardMaterial({map:organicTexture, metalness:0.0, roughness:1.0, color:'#654321'})
          );
          mesh.scale.y = 0.6;
        }
      }
      
      // Distribute waste across the entire Mars map (200x200)
      const x=(Math.random()-0.5)*190; 
      const z=(Math.random()-0.5)*190; 
      mesh.position.set(x, 0.2, z);
      
      // Add slight random rotation for more natural look
      mesh.rotation.x = (Math.random()-0.5) * 0.3;
      mesh.rotation.y = Math.random() * Math.PI * 2;
      mesh.rotation.z = (Math.random()-0.5) * 0.3;
      
      mesh.userData = {type:t, collected:false}; 
      scene.add(mesh); 
      wastes.push(mesh);
    } 
  }
  spawnWaste(80); // Spread more waste across the entire Mars surface
  
  // Add additional scattered clusters of waste in different areas
  function spawnWasteCluster(centerX, centerZ, count, radius) {
    for(let i = 0; i < count; i++) {
      const t = types[Math.floor(Math.random() * types.length)];
      let mesh;
      
      // Use the same waste generation logic but in clusters
      if(t==='plastic'){
        const bottleType = Math.floor(Math.random()*3);
        if(bottleType === 0) {
          const bottleGroup = new THREE.Group();
          const bottleBody = new THREE.Mesh(
            new THREE.CylinderGeometry(0.12, 0.15, 0.6, 12),
            new THREE.MeshStandardMaterial({map:plasticTexture, metalness:0.1, roughness:0.4, transparent:true, opacity:0.8})
          );
          const bottleNeck = new THREE.Mesh(
            new THREE.CylinderGeometry(0.05, 0.08, 0.15, 8),
            new THREE.MeshStandardMaterial({color:'#2980b9', metalness:0.2, roughness:0.5})
          );
          bottleNeck.position.y = 0.375;
          bottleGroup.add(bottleBody);
          bottleGroup.add(bottleNeck);
          mesh = bottleGroup;
        } else if(bottleType === 1) {
          mesh = new THREE.Mesh(
            new THREE.BoxGeometry(0.4, 0.05, 0.3),
            new THREE.MeshStandardMaterial({map:plasticTexture, metalness:0.0, roughness:0.8, transparent:true, opacity:0.7})
          );
        } else {
          mesh = new THREE.Mesh(
            new THREE.BoxGeometry(0.25, 0.15, 0.35),
            new THREE.MeshStandardMaterial({map:plasticTexture, metalness:0.1, roughness:0.6})
          );
        }
      }
      else if(t==='metal'){
        const metalType = Math.floor(Math.random()*3);
        if(metalType === 0) {
          mesh = new THREE.Mesh(
            new THREE.CylinderGeometry(0.15, 0.08, 0.25, 12),
            new THREE.MeshStandardMaterial({map:metalTexture, metalness:0.9, roughness:0.2})
          );
        } else if(metalType === 1) {
          mesh = new THREE.Mesh(
            new THREE.CylinderGeometry(0.08, 0.08, 0.5, 16),
            new THREE.MeshStandardMaterial({color:'#34495e', metalness:0.8, roughness:0.3})
          );
          mesh.rotation.z = Math.PI/2;
        } else {
          const metalGroup = new THREE.Group();
          const piece1 = new THREE.Mesh(
            new THREE.BoxGeometry(0.3, 0.05, 0.2),
            new THREE.MeshStandardMaterial({map:metalTexture, metalness:0.9, roughness:0.35})
          );
          const piece2 = new THREE.Mesh(
            new THREE.BoxGeometry(0.15, 0.03, 0.25),
            new THREE.MeshStandardMaterial({color:'#7f8c8d', metalness:0.8, roughness:0.4})
          );
          piece2.position.set(0.1, 0.04, 0.05);
          piece2.rotation.y = Math.PI/4;
          metalGroup.add(piece1);
          metalGroup.add(piece2);
          mesh = metalGroup;
        }
      }
      else {
        const organicType = Math.floor(Math.random()*4);
        if(organicType === 0) {
          const organicGroup = new THREE.Group();
          const base = new THREE.Mesh(
            new THREE.SphereGeometry(0.2, 8, 6),
            new THREE.MeshStandardMaterial({map:organicTexture, metalness:0.0, roughness:1.0, color:'#8B4513'})
          );
          base.scale.y = 0.5;
          const piece1 = new THREE.Mesh(
            new THREE.SphereGeometry(0.08, 6, 4),
            new THREE.MeshStandardMaterial({color:'#228B22', metalness:0.0, roughness:0.9})
          );
          piece1.position.set(0.15, 0.08, 0.1);
          const piece2 = new THREE.Mesh(
            new THREE.SphereGeometry(0.06, 6, 4),
            new THREE.MeshStandardMaterial({color:'#FF6347', metalness:0.0, roughness:0.8})
          );
          piece2.position.set(-0.12, 0.05, -0.08);
          organicGroup.add(base);
          organicGroup.add(piece1);
          organicGroup.add(piece2);
          mesh = organicGroup;
        } else if(organicType === 1) {
          mesh = new THREE.Mesh(
            new THREE.RingGeometry(0.08, 0.25, 6),
            new THREE.MeshStandardMaterial({color:'#FFD700', metalness:0.0, roughness:0.9})
          );
          mesh.rotation.x = -Math.PI/2 + Math.PI/6;
        } else if(organicType === 2) {
          mesh = new THREE.Mesh(
            new THREE.SphereGeometry(0.15, 8, 6),
            new THREE.MeshStandardMaterial({color:'#8B4513', metalness:0.0, roughness:0.8, map:organicTexture})
          );
          mesh.scale.set(1, 0.8, 1);
        } else {
          mesh = new THREE.Mesh(
            new THREE.DodecahedronGeometry(0.18, 0),
            new THREE.MeshStandardMaterial({map:organicTexture, metalness:0.0, roughness:1.0, color:'#654321'})
          );
          mesh.scale.y = 0.6;
        }
      }
      
      // Position within cluster radius
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * radius;
      const x = centerX + Math.cos(angle) * distance;
      const z = centerZ + Math.sin(angle) * distance;
      mesh.position.set(x, 0.2, z);
      
      mesh.rotation.x = (Math.random()-0.5) * 0.3;
      mesh.rotation.y = Math.random() * Math.PI * 2;
      mesh.rotation.z = (Math.random()-0.5) * 0.3;
      
      mesh.userData = {type:t, collected:false}; 
      scene.add(mesh); 
      wastes.push(mesh);
    }
  }
  
  // Create waste clusters in different areas of Mars
  spawnWasteCluster(-60, -60, 12, 15);  // Southwest cluster
  spawnWasteCluster(60, -60, 10, 12);   // Southeast cluster  
  spawnWasteCluster(-60, 60, 8, 10);    // Northwest cluster
  spawnWasteCluster(60, 60, 15, 18);    // Northeast cluster (larger)
  spawnWasteCluster(0, -80, 6, 8);      // South cluster
  spawnWasteCluster(-80, 0, 7, 10);     // West cluster
  spawnWasteCluster(80, 0, 9, 12);      // East cluster

  // simple UI inventory
  const inventory=[]; 
  const inventoryEl=document.getElementById('inventory');
  function refreshInventory(){inventoryEl.innerHTML=''; for(let i=0;i<6;i++){const s=document.createElement('div');s.className='slot'; if(inventory[i]){s.textContent=inventory[i].type; s.draggable=true; s.dataset.index=i; s.addEventListener('dragstart',e=>{e.dataTransfer.setData('text/plain',i)})}
      inventoryEl.appendChild(s)} }
  refreshInventory();

  // Machine UI
  const machineUI=document.getElementById('machineUI');
  const machineSlotsEl=document.getElementById('machineSlots');
  const machineLog=document.getElementById('machineLog');
  const machineSlots=[null,null, null]; 
  function refreshMachineSlots(){machineSlotsEl.innerHTML=''; for(let i=0;i<3;i++){const slot=document.createElement('div');slot.className='slot';slot.style.width='72px';slot.style.height='72px';slot.dataset.index=i; if(machineSlots[i]){slot.textContent=machineSlots[i].type}
      slot.addEventListener('dragover',e=>e.preventDefault()); slot.addEventListener('drop',e=>{e.preventDefault();const fromIdx=parseInt(e.dataTransfer.getData('text/plain')); if(!isNaN(fromIdx) && inventory[fromIdx]){machineSlots[i]=inventory[fromIdx]; inventory.splice(fromIdx,1); refreshInventory(); refreshMachineSlots()}});
      machineSlotsEl.appendChild(slot)} }
  refreshMachineSlots();

  document.getElementById('convertBtn').addEventListener('click',()=>{
    for(let i=0;i<machineSlots.length;i++){const it=machineSlots[i]; if(!it) continue; if(it.type==='plastic'){machineLog.innerHTML+=("Plastic → Filament created!<br>");}
      else if(it.type==='metal'){machineLog.innerHTML+=("Metal → Ingot formed!<br>");}
      else if(it.type==='organic'){machineLog.innerHTML+=("Organic → Fuel refined!<br>");}
      machineSlots[i]=null;}
    refreshMachineSlots();
  });
  document.getElementById('backBtn').addEventListener('click',()=>{setMode('explore')});

  // Machine - Enhanced Recycling Facility
  const machine=new THREE.Group();
  
  // Base platform
  const machineBase=new THREE.Mesh(new THREE.BoxGeometry(4,0.8,2.5),new THREE.MeshStandardMaterial({color:'#2c3e50',metalness:0.2,roughness:0.6}));
  machineBase.position.y=0.4;
  machine.add(machineBase);
  
  // Main processing unit
  const processingUnit=new THREE.Mesh(new THREE.BoxGeometry(2.8,2,1.8),new THREE.MeshStandardMaterial({color:'#34495e',metalness:0.4,roughness:0.5}));
  processingUnit.position.set(0,1.4,0);
  machine.add(processingUnit);
  
  // Control panel
  const controlPanel=new THREE.Mesh(new THREE.BoxGeometry(2.2,1.2,0.2),new THREE.MeshStandardMaterial({color:'#e74c3c',metalness:0.6,roughness:0.3}));
  controlPanel.position.set(0,1.8,0.9);
  machine.add(controlPanel);
  
  // Processing chamber (top)
  const chamber=new THREE.Mesh(new THREE.CylinderGeometry(0.8,1,1.2,8),new THREE.MeshStandardMaterial({color:'#3498db',metalness:0.7,roughness:0.3}));
  chamber.position.set(0,2.8,0);
  machine.add(chamber);
  
  // Intake pipes
  const pipe1=new THREE.Mesh(new THREE.CylinderGeometry(0.2,0.2,1.5),new THREE.MeshStandardMaterial({color:'#95a5a6',metalness:0.8,roughness:0.2}));
  pipe1.position.set(-1.2,2.2,-0.5);
  pipe1.rotation.x=Math.PI/4;
  machine.add(pipe1);
  
  const pipe2=new THREE.Mesh(new THREE.CylinderGeometry(0.2,0.2,1.5),new THREE.MeshStandardMaterial({color:'#95a5a6',metalness:0.8,roughness:0.2}));
  pipe2.position.set(1.2,2.2,-0.5);
  pipe2.rotation.x=Math.PI/4;
  machine.add(pipe2);
  
  // Output chute
  const chute=new THREE.Mesh(new THREE.BoxGeometry(0.6,0.4,1.2),new THREE.MeshStandardMaterial({color:'#f39c12',metalness:0.5,roughness:0.4}));
  chute.position.set(0,0.9,1.5);
  chute.rotation.x=-Math.PI/6;
  machine.add(chute);
  
  // Support legs
  for(let i=-1;i<=1;i+=2){
    for(let j=-1;j<=1;j+=2){
      const leg=new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.15,0.8),new THREE.MeshStandardMaterial({color:'#7f8c8d',metalness:0.3,roughness:0.7}));
      leg.position.set(1.5*i,0.4,1*j);
      machine.add(leg);
    }
  }
  
  // Status lights
  const light1=new THREE.Mesh(new THREE.SphereGeometry(0.08),new THREE.MeshStandardMaterial({color:'#2ecc71',emissive:'#2ecc71',emissiveIntensity:0.3}));
  light1.position.set(-0.8,2.2,0.95);
  machine.add(light1);
  
  const light2=new THREE.Mesh(new THREE.SphereGeometry(0.08),new THREE.MeshStandardMaterial({color:'#e67e22',emissive:'#e67e22',emissiveIntensity:0.3}));
  light2.position.set(0,2.2,0.95);
  machine.add(light2);
  
  const light3=new THREE.Mesh(new THREE.SphereGeometry(0.08),new THREE.MeshStandardMaterial({color:'#e74c3c',emissive:'#e74c3c',emissiveIntensity:0.3}));
  light3.position.set(0.8,2.2,0.95);
  machine.add(light3);
  
  machine.position.set(12,0,0);scene.add(machine);

  // Space Rocket/Lander - Similar to image
  const rocket = new THREE.Group();
  
  // Main rocket body (sleek cylindrical design)
  const rocketBody = new THREE.Mesh(
    new THREE.CylinderGeometry(1.5, 1.8, 12, 16),
    new THREE.MeshStandardMaterial({
      color: '#e8e8e8',
      metalness: 0.8,
      roughness: 0.2
    })
  );
  rocketBody.position.y = 6;
  rocket.add(rocketBody);
  
  // Rocket nose cone
  const noseCone = new THREE.Mesh(
    new THREE.ConeGeometry(1.5, 4, 16),
    new THREE.MeshStandardMaterial({
      color: '#f0f0f0',
      metalness: 0.9,
      roughness: 0.1
    })
  );
  noseCone.position.y = 14;
  rocket.add(noseCone);
  
  // Landing legs (4 legs like SpaceX lander)
  for(let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2;
    
    // Upper leg segment
    const upperLeg = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.12, 3),
      new THREE.MeshStandardMaterial({
        color: '#666',
        metalness: 0.7,
        roughness: 0.3
      })
    );
    upperLeg.position.set(
      Math.cos(angle) * 1.2,
      2.5,
      Math.sin(angle) * 1.2
    );
    upperLeg.rotation.z = Math.cos(angle) * 0.3;
    upperLeg.rotation.x = Math.sin(angle) * 0.3;
    rocket.add(upperLeg);
    
    // Lower leg segment
    const lowerLeg = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.08, 2.5),
      new THREE.MeshStandardMaterial({
        color: '#555',
        metalness: 0.6,
        roughness: 0.4
      })
    );
    lowerLeg.position.set(
      Math.cos(angle) * 2.2,
      0.5,
      Math.sin(angle) * 2.2
    );
    lowerLeg.rotation.z = Math.cos(angle) * 0.6;
    lowerLeg.rotation.x = Math.sin(angle) * 0.6;
    rocket.add(lowerLeg);
    
    // Landing pad
    const landingPad = new THREE.Mesh(
      new THREE.CylinderGeometry(0.4, 0.5, 0.2, 8),
      new THREE.MeshStandardMaterial({
        color: '#444',
        metalness: 0.5,
        roughness: 0.6
      })
    );
    landingPad.position.set(
      Math.cos(angle) * 2.8,
      0.1,
      Math.sin(angle) * 2.8
    );
    rocket.add(landingPad);
  }
  
  // Engine nozzles at bottom
  for(let i = 0; i < 3; i++) {
    const angle = (i / 3) * Math.PI * 2;
    const engine = new THREE.Mesh(
      new THREE.ConeGeometry(0.3, 1.5, 8),
      new THREE.MeshStandardMaterial({
        color: '#333',
        metalness: 0.9,
        roughness: 0.1
      })
    );
    engine.position.set(
      Math.cos(angle) * 0.6,
      -0.5,
      Math.sin(angle) * 0.6
    );
    rocket.add(engine);
  }
  
  // Command module windows
  for(let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const window = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.2, 0.1, 8),
      new THREE.MeshStandardMaterial({
        color: '#87CEEB',
        transparent: true,
        opacity: 0.8,
        emissive: '#4682B4',
        emissiveIntensity: 0.2
      })
    );
    window.position.set(
      Math.cos(angle) * 1.6,
      10,
      Math.sin(angle) * 1.6
    );
    window.rotation.z = Math.PI / 2;
    window.rotation.y = angle;
    rocket.add(window);
  }
  
  // Antenna array
  const antenna1 = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.02, 2),
    new THREE.MeshStandardMaterial({color: '#silver', metalness: 0.9})
  );
  antenna1.position.set(0.8, 13, 0);
  rocket.add(antenna1);
  
  const antenna2 = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.02, 1.5),
    new THREE.MeshStandardMaterial({color: '#silver', metalness: 0.9})
  );
  antenna2.position.set(-0.6, 12.5, 0.4);
  rocket.add(antenna2);
  
  rocket.position.set(-25, 0, -15);
  scene.add(rocket);
  
  // Habitat Modules - Realistic Mars colonization design
  const habitatComplex = new THREE.Group();
  
  // Main habitat foundation (reinforced concrete-like base)
  const foundation = new THREE.Mesh(
    new THREE.CylinderGeometry(5, 5.5, 0.8, 16),
    new THREE.MeshStandardMaterial({
      color: '#696969',
      roughness: 0.9,
      metalness: 0.1
    })
  );
  foundation.position.y = 0.4;
  habitatComplex.add(foundation);
  
  // Reinforcement rings around foundation
  for(let i = 0; i < 3; i++) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(4.8 + i * 0.3, 0.08, 8, 16),
      new THREE.MeshStandardMaterial({
        color: '#A0A0A0',
        metalness: 0.8,
        roughness: 0.2
      })
    );
    ring.position.y = 0.2 + i * 0.15;
    ring.rotation.x = Math.PI / 2;
    habitatComplex.add(ring);
  }
  
  // Main large habitat dome with realistic paneling
  const mainHabitat = new THREE.Mesh(
    new THREE.SphereGeometry(4, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshStandardMaterial({
      color: '#E6E6FA',
      metalness: 0.2,
      roughness: 0.4,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide
    })
  );
  mainHabitat.position.y = 2.5;
  habitatComplex.add(mainHabitat);
  
  // Dome structural framework (geodesic pattern)
  const frameGeometry = new THREE.EdgesGeometry(new THREE.SphereGeometry(4.05, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2));
  const frameMaterial = new THREE.LineBasicMaterial({color: '#2F4F4F', linewidth: 3});
  const domeFrame = new THREE.LineSegments(frameGeometry, frameMaterial);
  domeFrame.position.y = 2.5;
  habitatComplex.add(domeFrame);
  
  // Interior lighting visible through dome
  const interiorLight = new THREE.PointLight(0xFFE4B5, 0.6, 8);
  interiorLight.position.set(0, 3, 0);
  habitatComplex.add(interiorLight);
  
  // Environmental control unit on top
  const envControl = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 0.8, 1.5),
    new THREE.MeshStandardMaterial({
      color: '#708090',
      metalness: 0.7,
      roughness: 0.3
    })
  );
  envControl.position.y = 6.8;
  habitatComplex.add(envControl);
  
  // Ventilation fans on env control unit
  for(let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2;
    const fan = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.2, 0.1, 8),
      new THREE.MeshStandardMaterial({
        color: '#2F2F2F',
        metalness: 0.8,
        roughness: 0.2
      })
    );
    fan.position.set(
      Math.cos(angle) * 0.5,
      7.2,
      Math.sin(angle) * 0.5
    );
    habitatComplex.add(fan);
  }
  
  // Realistic airlock system
  const airlockChamber = new THREE.Mesh(
    new THREE.CylinderGeometry(1.2, 1.2, 3, 12),
    new THREE.MeshStandardMaterial({
      color: '#C0C0C0',
      metalness: 0.8,
      roughness: 0.2
    })
  );
  airlockChamber.position.set(5.2, 1.8, 0);
  habitatComplex.add(airlockChamber);
  
  // Airlock connection tunnel
  const airlockTunnel = new THREE.Mesh(
    new THREE.CylinderGeometry(1, 1, 2, 12),
    new THREE.MeshStandardMaterial({
      color: '#A0A0A0',
      metalness: 0.6,
      roughness: 0.4
    })
  );
  airlockTunnel.position.set(3.8, 1.5, 0);
  airlockTunnel.rotation.z = Math.PI / 2;
  habitatComplex.add(airlockTunnel);
  
  // Outer airlock door (heavy duty)
  const outerDoor = new THREE.Mesh(
    new THREE.CylinderGeometry(0.9, 0.9, 0.3, 12),
    new THREE.MeshStandardMaterial({
      color: '#2F4F4F',
      metalness: 0.9,
      roughness: 0.1
    })
  );
  outerDoor.position.set(6.5, 1.8, 0);
  outerDoor.rotation.z = Math.PI / 2;
  habitatComplex.add(outerDoor);
  
  // Door mechanisms and seals
  for(let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const seal = new THREE.Mesh(
      new THREE.TorusGeometry(0.95, 0.05, 4, 8),
      new THREE.MeshStandardMaterial({
        color: '#FF4500',
        roughness: 0.8,
        metalness: 0.1
      })
    );
    seal.position.set(6.5, 1.8, 0);
    seal.rotation.z = Math.PI / 2;
    habitatComplex.add(seal);
  }
  
  // Airlock control panel
  const airlockControlPanel = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.8, 0.15),
    new THREE.MeshStandardMaterial({
      color: '#1C1C1C',
      metalness: 0.7,
      roughness: 0.3
    })
  );
  airlockControlPanel.position.set(5.8, 2.5, 0.8);
  habitatComplex.add(airlockControlPanel);
  
  // Control panel lights
  for(let i = 0; i < 3; i++) {
    const light = new THREE.Mesh(
      new THREE.SphereGeometry(0.05),
      new THREE.MeshStandardMaterial({
        color: i === 0 ? '#00FF00' : i === 1 ? '#FFFF00' : '#FF0000',
        emissive: i === 0 ? '#00FF00' : i === 1 ? '#FFFF00' : '#FF0000',
        emissiveIntensity: 0.5
      })
    );
    light.position.set(5.8, 2.7 - i * 0.15, 0.9);
    habitatComplex.add(light);
  }
  
  // Laboratory module (specialized dome)
  const labBase = new THREE.Mesh(
    new THREE.CylinderGeometry(2.8, 3, 0.6, 16),
    new THREE.MeshStandardMaterial({
      color: '#696969',
      roughness: 0.9,
      metalness: 0.1
    })
  );
  labBase.position.set(-6, 0.3, -2);
  habitatComplex.add(labBase);
  
  const labDome = new THREE.Mesh(
    new THREE.SphereGeometry(2.5, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshStandardMaterial({
      color: '#E0E0E0',
      metalness: 0.4,
      roughness: 0.3,
      transparent: true,
      opacity: 0.8
    })
  );
  labDome.position.set(-6, 1.8, -2);
  habitatComplex.add(labDome);
  
  // Lab equipment visible inside
  const labEquipment = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1.5, 0.5),
    new THREE.MeshStandardMaterial({
      color: '#4682B4',
      metalness: 0.6,
      roughness: 0.4
    })
  );
  labEquipment.position.set(-6, 1.5, -2);
  habitatComplex.add(labEquipment);
  
  // Greenhouse module (more cylindrical)
  const greenhouseBase = new THREE.Mesh(
    new THREE.CylinderGeometry(2.2, 2.5, 0.5, 16),
    new THREE.MeshStandardMaterial({
      color: '#696969',
      roughness: 0.9,
      metalness: 0.1
    })
  );
  greenhouseBase.position.set(6, 0.25, -4);
  habitatComplex.add(greenhouseBase);
  
  const greenhouse = new THREE.Mesh(
    new THREE.SphereGeometry(2, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshStandardMaterial({
      color: '#98FB98',
      metalness: 0.1,
      roughness: 0.2,
      transparent: true,
      opacity: 0.7
    })
  );
  greenhouse.position.set(6, 1.5, -4);
  habitatComplex.add(greenhouse);
  
  // Growing beds inside greenhouse
  for(let i = 0; i < 4; i++) {
    const bed = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.2, 0.3),
      new THREE.MeshStandardMaterial({
        color: '#8B4513',
        roughness: 0.9,
        metalness: 0.0
      })
    );
    bed.position.set(6 + (i - 1.5) * 0.4, 0.9, -4);
    habitatComplex.add(bed);
    
    // Plants
    const plant = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 8, 4),
      new THREE.MeshStandardMaterial({
        color: '#228B22',
        roughness: 0.8,
        metalness: 0.0
      })
    );
    plant.position.set(6 + (i - 1.5) * 0.4, 1.2, -4);
    habitatComplex.add(plant);
  }
  
  // Power generation module (more industrial looking)
  const powerBase = new THREE.Mesh(
    new THREE.CylinderGeometry(1.8, 2, 1.2, 8),
    new THREE.MeshStandardMaterial({
      color: '#2F4F4F',
      metalness: 0.7,
      roughness: 0.4
    })
  );
  powerBase.position.set(-2, 0.6, 6);
  habitatComplex.add(powerBase);
  
  // Power module top with heat radiators
  for(let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const radiator = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 1.5, 0.8),
      new THREE.MeshStandardMaterial({
        color: '#696969',
        metalness: 0.8,
        roughness: 0.2
      })
    );
    radiator.position.set(
      -2 + Math.cos(angle) * 2.2,
      1.8,
      6 + Math.sin(angle) * 2.2
    );
    radiator.rotation.y = angle + Math.PI / 2;
    habitatComplex.add(radiator);
  }
  
  // Pressurized connecting corridors with realistic design
  const mainToLab = new THREE.Mesh(
    new THREE.CylinderGeometry(0.6, 0.6, 6.5, 12),
    new THREE.MeshStandardMaterial({
      color: '#C0C0C0',
      metalness: 0.7,
      roughness: 0.3
    })
  );
  mainToLab.position.set(-3, 1.2, -1);
  mainToLab.rotation.z = Math.PI / 2;
  habitatComplex.add(mainToLab);
  
  // Corridor support brackets
  for(let i = 0; i < 5; i++) {
    const bracket = new THREE.Mesh(
      new THREE.TorusGeometry(0.65, 0.05, 4, 8),
      new THREE.MeshStandardMaterial({
        color: '#708090',
        metalness: 0.8,
        roughness: 0.2
      })
    );
    bracket.position.set(-3 + (i - 2) * 1.2, 1.2, -1);
    bracket.rotation.z = Math.PI / 2;
    habitatComplex.add(bracket);
  }
  
  // Main to greenhouse corridor
  const mainToGreenhouse = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, 0.5, 7, 12),
    new THREE.MeshStandardMaterial({
      color: '#C0C0C0',
      metalness: 0.7,
      roughness: 0.3
    })
  );
  mainToGreenhouse.position.set(3, 1, -2);
  mainToGreenhouse.rotation.z = Math.PI / 4;
  habitatComplex.add(mainToGreenhouse);
  
  // Utility lines and cables
  for(let i = 0; i < 3; i++) {
    const cable = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 8, 6),
      new THREE.MeshStandardMaterial({
        color: i === 0 ? '#FF0000' : i === 1 ? '#0000FF' : '#FFFF00',
        metalness: 0.2,
        roughness: 0.8
      })
    );
    cable.position.set(-3 + i * 0.1, 1.8, -1);
    cable.rotation.z = Math.PI / 2;
    habitatComplex.add(cable);
  }
  
  // Water and waste management pipes
  const waterPipe = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.08, 15, 8),
    new THREE.MeshStandardMaterial({
      color: '#4682B4',
      metalness: 0.6,
      roughness: 0.4
    })
  );
  waterPipe.position.set(0, 0.3, 0);
  waterPipe.rotation.z = Math.PI / 2;
  habitatComplex.add(waterPipe);
  
  // Solar panel arrays for habitat
  for(let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2;
    const solarArray = new THREE.Mesh(
      new THREE.BoxGeometry(3, 0.1, 1.5),
      new THREE.MeshStandardMaterial({
        color: '#1a1a2e',
        metalness: 0.8,
        roughness: 0.2
      })
    );
    solarArray.position.set(
      Math.cos(angle) * 7,
      2.5,
      Math.sin(angle) * 7
    );
    solarArray.rotation.y = angle + Math.PI / 2;
    solarArray.rotation.x = -Math.PI / 6; // Tilt for optimal sun exposure
    habitatComplex.add(solarArray);
    
    // Solar panel support
    const support = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.08, 2.5),
      new THREE.MeshStandardMaterial({
        color: '#666',
        metalness: 0.7,
        roughness: 0.3
      })
    );
    support.position.set(
      Math.cos(angle) * 7,
      1.25,
      Math.sin(angle) * 7
    );
    habitatComplex.add(support);
  }
  
  // Communication dish
  const dishSupport = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.1, 4),
    new THREE.MeshStandardMaterial({color: '#666', metalness: 0.7})
  );
  dishSupport.position.set(0, 6, 0);
  habitatComplex.add(dishSupport);
  
  const commDish = new THREE.Mesh(
    new THREE.SphereGeometry(1.5, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshStandardMaterial({
      color: '#E0E0E0',
      metalness: 0.9,
      roughness: 0.1
    })
  );
  commDish.position.set(0, 8, 0);
  commDish.rotation.x = Math.PI;
  habitatComplex.add(commDish);
  
  habitatComplex.position.set(-25, 0, 5);
  scene.add(habitatComplex);
  
  // Add atmospheric lighting around structures  
  // Rocket spotlights
  const rocketLight1 = new THREE.SpotLight(0xffffff, 0.8, 30, Math.PI / 6, 0.5);
  rocketLight1.position.set(rocket.position.x - 5, 12, rocket.position.z);
  rocketLight1.target.position.set(rocket.position.x, 0, rocket.position.z);
  scene.add(rocketLight1);
  scene.add(rocketLight1.target);
  
  const rocketLight2 = new THREE.SpotLight(0xffffff, 0.8, 30, Math.PI / 6, 0.5);
  rocketLight2.position.set(rocket.position.x + 5, 12, rocket.position.z);
  rocketLight2.target.position.set(rocket.position.x, 0, rocket.position.z);
  scene.add(rocketLight2);
  scene.add(rocketLight2.target);
  
  // Habitat area lighting
  const habitatLight = new THREE.PointLight(0xffd4a3, 1.2, 25);
  habitatLight.position.set(-25, 8, 5);
  scene.add(habitatLight);
  
  // Landing area markers around rocket
  for(let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const marker = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.1, 0.5),
      new THREE.MeshStandardMaterial({
        color: '#ff4444',
        emissive: '#ff4444',
        emissiveIntensity: 0.3
      })
    );
    marker.position.set(
      rocket.position.x + Math.cos(angle) * 6,
      0.25,
      rocket.position.z + Math.sin(angle) * 6
    );
    scene.add(marker);
  }

  // modes
  let mode='explore';
  function setMode(m){mode=m; if(m==='machine'){camera.position.set(12,3.2,6); camera.lookAt(12,1,0); machineUI.style.display='block'; document.getElementById('prompt').style.display='none';} else {camera.position.set(rover.position.x,8,rover.position.z+12);camera.lookAt(rover.position.x,0,rover.position.z); machineUI.style.display='none'; document.getElementById('prompt').style.display='block'} }

  // movement
  // simple movement and audio controls
  const keys={}; 
  window.addEventListener('keydown',e=>{
    keys[e.key.toLowerCase()]=true; 
    if(e.key===' '){collectNearby()} 
    if(e.key.toLowerCase()==='m'){setMode(mode==='explore'?'machine':'explore')}
    // Mute/unmute with 'U' key
    if(e.key.toLowerCase()==='u'){toggleMute()}
  });
  window.addEventListener('keyup',e=>{keys[e.key.toLowerCase()]=false});
  
  // Audio mute/unmute functionality
  let isMuted = false;
  function toggleMute() {
    isMuted = !isMuted;
    const muteBtn = document.getElementById('muteBtn');
    
    if(isMuted) {
      // Mute all sounds
      backgroundMusic.volume = 0;
      roverSound.volume = 0;
      tornadoSound.volume = 0;
      muteBtn.textContent = '🔇 OFF';
      muteBtn.style.color = '#ff4444';
    } else {
      // Restore volumes
      backgroundMusic.volume = 0.3;
      roverSound.volume = 0.4;
      tornadoSound.volume = 0.5;
      muteBtn.textContent = '🔊 ON';
      muteBtn.style.color = '#44ff44';
    }
  }
  
  // Mute button event listener
  document.addEventListener('DOMContentLoaded', function() {
    const muteBtn = document.getElementById('muteBtn');
    if(muteBtn) {
      muteBtn.addEventListener('click', toggleMute);
    }
  });

  function collectNearby(){// pick any waste within 1.2m and add to inventory
    for(let i=0;i<wastes.length;i++){const w=wastes[i]; if(w.userData.collected) continue; const d=w.position.distanceTo(rover.position); if(d<1.5){w.userData.collected=true; scene.remove(w); inventory.push({type:w.userData.type}); refreshInventory(); break}} }

  // Collision detection system
  const obstacles = [];
  
  // Add rocket collision area (larger radius for realistic collision)
  obstacles.push({
    x: rocket.position.x,
    z: rocket.position.z,
    radius: 5, // Increased collision radius around rocket
    type: 'rocket'
  });
  
  // Add machine collision area
  obstacles.push({
    x: machine.position.x,
    z: machine.position.z,
    radius: 4, // Increased collision radius around recycling machine
    type: 'machine'
  });
  
  // Add habitat collision areas (more realistic sizes)
  obstacles.push({
    x: habitatComplex.position.x,
    z: habitatComplex.position.z,
    radius: 6, // Main habitat collision radius
    type: 'habitat'
  });
  
  // Add habitat modules collision areas
  obstacles.push({
    x: habitatComplex.position.x - 6, // Lab module
    z: habitatComplex.position.z - 2,
    radius: 3.5,
    type: 'habitat-lab'
  });
  
  obstacles.push({
    x: habitatComplex.position.x + 6, // Greenhouse module
    z: habitatComplex.position.z - 4,
    radius: 3,
    type: 'habitat-greenhouse'
  });
  
  obstacles.push({
    x: habitatComplex.position.x - 2, // Power module
    z: habitatComplex.position.z + 6,
    radius: 3,
    type: 'habitat-power'
  });
  
  // Add all rock formations to obstacles
  for(let rock of rockFormations) {
    obstacles.push(rock);
  }
  
  // Add geological features to obstacles for realistic collision
  for(let feature of geologicalFeatures) {
    obstacles.push({
      x: feature.x,
      z: feature.z,
      radius: feature.radius,
      type: feature.type
    });
  }
  
  // Debug: Add invisible collision area visualizers (optional - for testing)
  const debugCollision = false; // Set to true to see collision boundaries
  if(debugCollision) {
    obstacles.forEach(obstacle => {
      const collisionIndicator = new THREE.Mesh(
        new THREE.RingGeometry(obstacle.radius + 1.5, obstacle.radius + 2.5, 16),
        new THREE.MeshBasicMaterial({
          color: 0xff0000,
          transparent: true,
          opacity: 0.3,
          side: THREE.DoubleSide
        })
      );
      collisionIndicator.position.set(obstacle.x, 0.1, obstacle.z);
      collisionIndicator.rotation.x = -Math.PI / 2;
      scene.add(collisionIndicator);
    });
  }
  
  function checkCollision(newX, newZ) {
    // Check map boundaries (200x200 map with some margin)
    if(Math.abs(newX) > 95 || Math.abs(newZ) > 95) {
      return true;
    }
    
    // Check obstacles
    for(let obstacle of obstacles) {
      const distance = Math.sqrt(
        Math.pow(newX - obstacle.x, 2) + 
        Math.pow(newZ - obstacle.z, 2)
      );
      if(distance < obstacle.radius + 2.0) { // 2.0 is rover collision radius for better collision detection
        // Add collision feedback - camera shake
        camera.position.x += (Math.random() - 0.5) * 0.15;
        camera.position.y += (Math.random() - 0.5) * 0.08;
        camera.position.z += (Math.random() - 0.5) * 0.15;
        
        // Provide collision feedback message
        if(obstacle.type === 'rocket') {
          document.getElementById('prompt').innerHTML = 'COLLISION: Cannot pass through Mars Lander!';
          document.getElementById('prompt').style.color = '#ff4444';
        } else if(obstacle.type === 'habitat' || obstacle.type.includes('habitat')) {
          document.getElementById('prompt').innerHTML = 'COLLISION: Cannot pass through habitat structure!';
          document.getElementById('prompt').style.color = '#ff4444';
        } else if(obstacle.type === 'machine') {
          document.getElementById('prompt').innerHTML = 'COLLISION: Cannot pass through recycling machine!';
          document.getElementById('prompt').style.color = '#ff4444';
        } else if(obstacle.type === 'rock') {
          document.getElementById('prompt').innerHTML = 'COLLISION: Rock formation blocking path!';
          document.getElementById('prompt').style.color = '#ff4444';
        } else if(obstacle.type === 'cave' || obstacle.type === 'lava_tube' || obstacle.type === 'crater') {
          document.getElementById('prompt').innerHTML = 'COLLISION: Geological formation blocking path!';
          document.getElementById('prompt').style.color = '#ff4444';
        }
        
        // Clear collision message after 2 seconds
        setTimeout(() => {
          if(document.getElementById('prompt').style.color === 'rgb(255, 68, 68)') {
            document.getElementById('prompt').innerHTML = 'Collect wastes across the Martian plain — plastic, metal, organic. Convert at the machine into filament, ingots and fuel.';
            document.getElementById('prompt').style.color = '#fff';
          }
        }, 2000);
        
        return true;
      }
    }
    return false;
  }

  // Enhanced movement with tire tracks and collision detection
  function update(dt){
    // Adjust speed based on weather conditions
    let speedMultiplier = 1.0;
    if(weatherState === 'dusty') speedMultiplier = 0.8;
    else if(weatherState === 'storm') speedMultiplier = 0.5;
    
    const speed = dt * 4 * speedMultiplier; 
    let moved=false;
    const oldX = rover.position.x;
    const oldZ = rover.position.z;
    let roverRotation = rover.rotation.y;
    
    // Calculate movement and rotation with collision detection
    let newX = rover.position.x;
    let newZ = rover.position.z;
    
    if(keys['arrowup']||keys['w']){
      newZ = rover.position.z - speed;
      if(!checkCollision(rover.position.x, newZ)) {
        rover.position.z = newZ;
        roverRotation = 0;
        moved=true;
      }
    } 
    if(keys['arrowdown']||keys['s']){
      newZ = rover.position.z + speed;
      if(!checkCollision(rover.position.x, newZ)) {
        rover.position.z = newZ;
        roverRotation = Math.PI;
        moved=true;
      }
    } 
    if(keys['arrowleft']||keys['a']){
      newX = rover.position.x - speed;
      if(!checkCollision(newX, rover.position.z)) {
        rover.position.x = newX;
        roverRotation = Math.PI/2;
        moved=true;
      }
    } 
    if(keys['arrowright']||keys['d']){
      newX = rover.position.x + speed;
      if(!checkCollision(newX, rover.position.z)) {
        rover.position.x = newX;
        roverRotation = -Math.PI/2;
        moved=true;
      }
    }
    
    // Handle diagonal movement rotation with collision detection
    if((keys['arrowup']||keys['w']) && (keys['arrowleft']||keys['a'])){
      newX = rover.position.x - speed * 0.707; // Diagonal speed adjustment
      newZ = rover.position.z - speed * 0.707;
      if(!checkCollision(newX, newZ)) {
        rover.position.x = newX;
        rover.position.z = newZ;
        roverRotation = Math.PI/4;
        moved = true;
      }
    }
    else if((keys['arrowup']||keys['w']) && (keys['arrowright']||keys['d'])){
      newX = rover.position.x + speed * 0.707;
      newZ = rover.position.z - speed * 0.707;
      if(!checkCollision(newX, newZ)) {
        rover.position.x = newX;
        rover.position.z = newZ;
        roverRotation = -Math.PI/4;
        moved = true;
      }
    }
    else if((keys['arrowdown']||keys['s']) && (keys['arrowleft']||keys['a'])){
      newX = rover.position.x - speed * 0.707;
      newZ = rover.position.z + speed * 0.707;
      if(!checkCollision(newX, newZ)) {
        rover.position.x = newX;
        rover.position.z = newZ;
        roverRotation = 3*Math.PI/4;
        moved = true;
      }
    }
    else if((keys['arrowdown']||keys['s']) && (keys['arrowright']||keys['d'])){
      newX = rover.position.x + speed * 0.707;
      newZ = rover.position.z + speed * 0.707;
      if(!checkCollision(newX, newZ)) {
        rover.position.x = newX;
        rover.position.z = newZ;
        roverRotation = -3*Math.PI/4;
        moved = true;
      }
    }
    
    // Smoothly rotate rover to face movement direction
    if(moved) {
      rover.rotation.y = roverRotation;
    }
    
    // Rover movement audio control
    const isMovementKeyPressed = keys['arrowup'] || keys['w'] || keys['arrowdown'] || keys['s'] || 
                                keys['arrowleft'] || keys['a'] || keys['arrowright'] || keys['d'];
    
    if(isMovementKeyPressed && moved) {
      playRoverSound();
    } else {
      stopRoverSound();
    }
    
    if(moved){
      camera.position.x=rover.position.x;
      camera.position.z=rover.position.z+12; 
      camera.lookAt(rover.position.x,0,rover.position.z);
      
      // Create tire tracks if rover has moved enough distance
      if(shouldCreateTrack(rover.position.x, rover.position.z)) {
        addTireTrack(lastTrackPosition.x, lastTrackPosition.z, roverRotation);
        lastTrackPosition.x = rover.position.x;
        lastTrackPosition.z = rover.position.z;
      }
    }
    
    // Update rover name position to follow the rover
    if(mode === 'explore') {
      const roverVector = new THREE.Vector3(rover.position.x, rover.position.y + 1.5, rover.position.z);
      roverVector.project(camera);
      const roverNameEl = document.getElementById('roverName');
      roverNameEl.style.left = (roverVector.x * 0.5 + 0.5) * window.innerWidth + 'px';
      roverNameEl.style.top = (-roverVector.y * 0.5 + 0.5) * window.innerHeight + 'px';
      roverNameEl.style.display = 'block';
      
      // Update machine name position
      const machineVector = new THREE.Vector3(machine.position.x, machine.position.y + 2.5, machine.position.z);
      machineVector.project(camera);
      const machineNameEl = document.getElementById('machineName');
      machineNameEl.style.left = (machineVector.x * 0.5 + 0.5) * window.innerWidth + 'px';
      machineNameEl.style.top = (-machineVector.y * 0.5 + 0.5) * window.innerHeight + 'px';
      machineNameEl.style.display = 'block';
      
      // Update rocket name position
      const rocketVector = new THREE.Vector3(rocket.position.x, rocket.position.y + 16, rocket.position.z);
      rocketVector.project(camera);
      const rocketNameEl = document.getElementById('rocketName');
      rocketNameEl.style.left = (rocketVector.x * 0.5 + 0.5) * window.innerWidth + 'px';
      rocketNameEl.style.top = (-rocketVector.y * 0.5 + 0.5) * window.innerHeight + 'px';
      rocketNameEl.style.display = 'block';
      
      // Update habitat name position
      const habitatVector = new THREE.Vector3(habitatComplex.position.x, habitatComplex.position.y + 5, habitatComplex.position.z);
      habitatVector.project(camera);
      const habitatNameEl = document.getElementById('habitatName');
      habitatNameEl.style.left = (habitatVector.x * 0.5 + 0.5) * window.innerWidth + 'px';
      habitatNameEl.style.top = (-habitatVector.y * 0.5 + 0.5) * window.innerHeight + 'px';
      habitatNameEl.style.display = 'block';
    } else {
      // Hide names when in machine mode
      document.getElementById('roverName').style.display = 'none';
      document.getElementById('machineName').style.display = 'none';
      document.getElementById('rocketName').style.display = 'none';
      document.getElementById('habitatName').style.display = 'none';
    }
    
    // Update Mars environmental effects
    updateMarsEnvironment(dt);
    
    // Update dust devils
    updateDustDevils(dt);
    
    // Check proximity to structures
    if(mode === 'explore') {
      checkProximity();
    }
  }

  // Mini-map system
  const miniMapCanvas = document.getElementById('miniMap');
  const miniMapCtx = miniMapCanvas.getContext('2d');
  miniMapCanvas.width = 200;
  miniMapCanvas.height = 200;
  
  function drawMiniMap() {
    const mapSize = 200; // Map bounds (-100 to 100)
    const scale = miniMapCanvas.width / mapSize;
    
    // Clear canvas
    miniMapCtx.fillStyle = '#8B4513'; // Mars ground color
    miniMapCtx.fillRect(0, 0, miniMapCanvas.width, miniMapCanvas.height);
    
    // Add weather overlay
    if(weatherState === 'dusty' || weatherState === 'storm') {
      miniMapCtx.fillStyle = `rgba(205, 133, 63, ${dustStormIntensity * 0.5})`;
      miniMapCtx.fillRect(0, 0, miniMapCanvas.width, miniMapCanvas.height);
    }
    
    // Draw geological features
    geologicalFeatures.forEach(feature => {
      const x = (feature.x + 100) * scale;
      const y = (feature.z + 100) * scale;
      const radius = feature.radius * scale * 0.3;
      
      miniMapCtx.beginPath();
      miniMapCtx.arc(x, y, radius, 0, Math.PI * 2);
      
      switch(feature.type) {
        case 'cave':
          miniMapCtx.fillStyle = '#2F2F2F';
          break;
        case 'lava_tube':
          miniMapCtx.fillStyle = '#8B0000';
          break;
        case 'crater':
          miniMapCtx.fillStyle = '#A0522D';
          break;
        case 'ice':
          miniMapCtx.fillStyle = '#E0FFFF';
          break;
      }
      miniMapCtx.fill();
    });
    
    // Draw rock formations
    rockFormations.forEach(rock => {
      const x = (rock.x + 100) * scale;
      const y = (rock.z + 100) * scale;
      const radius = rock.radius * scale * 0.2;
      
      miniMapCtx.beginPath();
      miniMapCtx.arc(x, y, radius, 0, Math.PI * 2);
      miniMapCtx.fillStyle = '#654321';
      miniMapCtx.fill();
    });
    
    // Draw structures
    // Habitat
    const habitatX = (habitatComplex.position.x + 100) * scale;
    const habitatY = (habitatComplex.position.z + 100) * scale;
    miniMapCtx.beginPath();
    miniMapCtx.arc(habitatX, habitatY, 6 * scale, 0, Math.PI * 2);
    miniMapCtx.fillStyle = '#d4c5a0';
    miniMapCtx.fill();
    
    // Rocket
    const rocketX = (rocket.position.x + 100) * scale;
    const rocketY = (rocket.position.z + 100) * scale;
    miniMapCtx.beginPath();
    miniMapCtx.arc(rocketX, rocketY, 4 * scale, 0, Math.PI * 2);
    miniMapCtx.fillStyle = '#87CEEB';
    miniMapCtx.fill();
    
    // Machine
    const machineX = (machine.position.x + 100) * scale;
    const machineY = (machine.position.z + 100) * scale;
    miniMapCtx.beginPath();
    miniMapCtx.arc(machineX, machineY, 3 * scale, 0, Math.PI * 2);
    miniMapCtx.fillStyle = '#ff6600';
    miniMapCtx.fill();
    
    // Draw waste items
    wastes.forEach(waste => {
      if(!waste.userData.collected) {
        const x = (waste.position.x + 100) * scale;
        const y = (waste.position.z + 100) * scale;
        
        miniMapCtx.beginPath();
        miniMapCtx.arc(x, y, 1, 0, Math.PI * 2);
        
        switch(waste.userData.type) {
          case 'plastic':
            miniMapCtx.fillStyle = '#4169E1';
            break;
          case 'metal':
            miniMapCtx.fillStyle = '#C0C0C0';
            break;
          case 'organic':
            miniMapCtx.fillStyle = '#228B22';
            break;
        }
        miniMapCtx.fill();
      }
    });
    
    // Draw dust devils
    dustDevils.forEach(dustDevil => {
      const x = (dustDevil.position.x + 100) * scale;
      const y = (dustDevil.position.z + 100) * scale;
      
      miniMapCtx.beginPath();
      miniMapCtx.arc(x, y, 3, 0, Math.PI * 2);
      miniMapCtx.fillStyle = '#CD853F';
      miniMapCtx.fill();
    });
    
    // Draw rover (always on top)
    const roverX = (rover.position.x + 100) * scale;
    const roverY = (rover.position.z + 100) * scale;
    
    // Rover body
    miniMapCtx.beginPath();
    miniMapCtx.arc(roverX, roverY, 3, 0, Math.PI * 2);
    miniMapCtx.fillStyle = '#00ff88';
    miniMapCtx.fill();
    
    // Rover direction indicator
    const dirX = roverX + Math.sin(rover.rotation.y) * 5;
    const dirY = roverY - Math.cos(rover.rotation.y) * 5;
    miniMapCtx.beginPath();
    miniMapCtx.moveTo(roverX, roverY);
    miniMapCtx.lineTo(dirX, dirY);
    miniMapCtx.strokeStyle = '#00ff88';
    miniMapCtx.lineWidth = 2;
    miniMapCtx.stroke();
    
    // Map border
    miniMapCtx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    miniMapCtx.lineWidth = 2;
    miniMapCtx.strokeRect(0, 0, miniMapCanvas.width, miniMapCanvas.height);
    
    // Compass
    miniMapCtx.fillStyle = 'white';
    miniMapCtx.font = '10px monospace';
    miniMapCtx.fillText('N', miniMapCanvas.width - 15, 15);
  }

  // drag support from inventory to machine UI (already uses HTML drag)

  // animate loop
  let last=performance.now();
  function loop(t){
    const dt=(t-last)/1000; 
    last=t; 
    update(dt); 
    renderer.render(scene,camera); 
    drawMiniMap(); // Update mini-map
    requestAnimationFrame(loop);
  } 
  requestAnimationFrame(loop);

  // resize
  window.addEventListener('resize',()=>{renderer.setSize(window.innerWidth,window.innerHeight);camera.aspect=window.innerWidth/window.innerHeight;camera.updateProjectionMatrix()});

  // touch: show simple on-screen joystick for mobile (tiny)
  // (Not full joystick implementation — tap space area to collect on mobile)
  canvas.addEventListener('touchstart',e=>{if(e.touches.length===1){collectNearby()}});

  // Proximity warning system
  function checkProximity() {
    for(let obstacle of obstacles) {
      const distance = Math.sqrt(
        Math.pow(rover.position.x - obstacle.x, 2) + 
        Math.pow(rover.position.z - obstacle.z, 2)
      );
      
      // Show proximity warning when close but not colliding
      if(distance < obstacle.radius + 3 && distance > obstacle.radius + 1.5) {
        if(obstacle.type === 'rocket') {
          document.getElementById('prompt').innerHTML = 'Approaching Mars Lander - Maintain safe distance!';
          document.getElementById('prompt').style.color = '#87CEEB';
        } else if(obstacle.type === 'habitat') {
          document.getElementById('prompt').innerHTML = 'Approaching Mars Habitat - Restricted area!';
          document.getElementById('prompt').style.color = '#d4c5a0';
        } else if(obstacle.type === 'machine') {
          document.getElementById('prompt').innerHTML = 'Near Recycling Machine - Press M to access!';
          document.getElementById('prompt').style.color = '#ff6600';
        } else if(obstacle.type === 'rock') {
          document.getElementById('prompt').innerHTML = 'Rock formation detected - Navigate carefully!';
          document.getElementById('prompt').style.color = '#CD853F';
        }
        return;
      }
    }
    
    // Check proximity to geological features
    for(let feature of geologicalFeatures) {
      const distance = Math.sqrt(
        Math.pow(rover.position.x - feature.x, 2) + 
        Math.pow(rover.position.z - feature.z, 2)
      );
      
      if(distance < feature.radius + 2) {
        if(feature.type === 'cave') {
          document.getElementById('prompt').innerHTML = 'Mars Cave detected - Potential underground exploration site!';
          document.getElementById('prompt').style.color = '#808080';
        } else if(feature.type === 'lava_tube') {
          document.getElementById('prompt').innerHTML = 'Lava Tube entrance - Protected underground environment!';
          document.getElementById('prompt').style.color = '#ff4444';
        } else if(feature.type === 'crater') {
          document.getElementById('prompt').innerHTML = 'Impact Crater - Unique geological formation detected!';
          document.getElementById('prompt').style.color = '#daa520';
        } else if(feature.type === 'ice') {
          document.getElementById('prompt').innerHTML = 'Ice Deposit detected - Water resource available!';
          document.getElementById('prompt').style.color = '#87ceeb';
        }
        return;
      }
    }
    
    // Default message when not near anything
    document.getElementById('prompt').innerHTML = 'Collect wastes across the Martian plain — plastic, metal, organic. Convert at the machine into filament, ingots and fuel.';
    document.getElementById('prompt').style.color = '#fff';
  }

  // quick tips in console
  console.log('Mars Rover Recycler demo loaded. Controls: WASD/arrows to move, Space to collect, M to open machine, U to toggle audio.');
  console.log('Mars Environment: Cold desert with thin CO2 atmosphere, UV radiation, temperature variations (-125°C to 20°C), and seasonal ice.');
  console.log('Collision system active: Rover cannot pass through rocks, structures, or map boundaries.');
  console.log('Audio System: Background music, rover movement sounds, and tornado effects. Use U key or button to mute/unmute.');
  
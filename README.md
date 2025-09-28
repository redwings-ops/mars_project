<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>SpaceTrash 3D Simulation</title>
  <style>
    body { margin: 0; overflow: hidden; background: black; }
    canvas { display: block; }
    #score {
      position: absolute;
      top: 10px;
      left: 10px;
      color: white;
      font-family: Arial, sans-serif;
      font-size: 20px;
    }
  </style>
</head>
<body>
  <div id="score">Score: 0</div>
  <script src="https://cdn.jsdelivr.net/npm/three@0.155.0/build/three.min.js"></script>
  <script>
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Lighting
    const light = new THREE.AmbientLight(0xffffff, 1);
    scene.add(light);

    // Bins (plastic, metal, organic)
    const binGeometry = new THREE.BoxGeometry(2, 1, 2);
    const bins = [
      {mesh: new THREE.Mesh(binGeometry, new THREE.MeshStandardMaterial({color: "blue"})), type: "plastic"},
      {mesh: new THREE.Mesh(binGeometry, new THREE.MeshStandardMaterial({color: "silver"})), type: "metal"},
      {mesh: new THREE.Mesh(binGeometry, new THREE.MeshStandardMaterial({color: "green"})), type: "organic"}
    ];

    bins[0].mesh.position.set(-4, -3, 0);
    bins[1].mesh.position.set(0, -3, 0);
    bins[2].mesh.position.set(4, -3, 0);
    bins.forEach(b => scene.add(b.mesh));

    // Trash items
    const trashTypes = ["plastic", "metal", "organic"];
    let trashItems = [];
    let score = 0;

    function spawnTrash() {
      const type = trashTypes[Math.floor(Math.random() * trashTypes.length)];
      const color = type === "plastic" ? "blue" : type === "metal" ? "silver" : "green";
      const material = new THREE.MeshStandardMaterial({color: color});
      const geometry = new THREE.SphereGeometry(0.5, 16, 16);
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set((Math.random() - 0.5) * 10, 6, 0);
      scene.add(mesh);
      trashItems.push({mesh, type});
    }

    // Camera position
    camera.position.z = 10;
    camera.position.y = 2;

    // Game loop
    function animate() {
      requestAnimationFrame(animate);

      trashItems.forEach((item, index) => {
        item.mesh.position.y -= 0.05;

        if (item.mesh.position.y < -2.5) {
          // Check which bin it landed in
          bins.forEach(bin => {
            if (Math.abs(item.mesh.position.x - bin.mesh.position.x) < 1.5) {
              if (bin.type === item.type) {
                score += 10;
              } else {
                score -= 5;
              }
              document.getElementById("score").innerText = "Score: " + score;
              scene.remove(item.mesh);
              trashItems.splice(index, 1);
            }
          });
        }
      });

      if (Math.random() < 0.01) spawnTrash();

      renderer.render(scene, camera);
    }

    animate();
  </script>
</body>
</html>

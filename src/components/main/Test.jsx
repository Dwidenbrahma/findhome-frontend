import React, { useState, useEffect, useRef } from "react";
import { Canvas, useLoader, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { gsap } from "gsap";

function CameraAnimation() {
  const { camera } = useThree();
  const cameraRef = useRef(camera);

  useEffect(() => {
    // Animation to move the camera to position closer to the sphere
    gsap.fromTo(
      camera.position,
      { z: 10 },
      { z: 0, duration: 3, ease: "power3.out" }
    );
  }, [camera]);

  return null;
}

function PanoramicSphere({ texture }) {
  return (
    <mesh>
      <sphereGeometry args={[500, 60, 40]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}

const TestCompo = () => {
  const [image, setImage] = useState(null);
  const [texture, setTexture] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImage(url);
    }
  };

  useEffect(() => {
    if (image) {
      const loader = new THREE.TextureLoader();
      loader.load(
        image,
        (loadedTexture) => {
          setTexture(loadedTexture);
        },
        undefined,
        (error) => {
          console.error("Error loading texture:", error);
        }
      );
    }
  }, [image]);

  return (
    <div style={{ height: "100vh", background: "#111", position: "relative" }}>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        style={{
          position: "absolute",
          zIndex: 1,
          margin: "10px",
          padding: "10px",
          backgroundColor: "#fff",
          color: "#000",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      />
      {texture ? (
        <Canvas>
          <ambientLight intensity={1} />
          <PanoramicSphere texture={texture} />
          <OrbitControls enableZoom={false} enablePan={false} />
          <CameraAnimation />
        </Canvas>
      ) : (
        <div style={{ color: "white", padding: "20px", textAlign: "center" }}>
          Please upload a 360° panoramic image to view the room.
        </div>
      )}
    </div>
  );
};

export default TestCompo;

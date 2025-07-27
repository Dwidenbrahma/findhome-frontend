import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { gsap } from "gsap";
import url from "../../url";

function CameraAnimation() {
  const { camera } = useThree();

  useEffect(() => {
    // Smoother animation with better easing
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

const PanoramicViewer = () => {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [homeData, setHomeData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noImagesFound, setNoImagesFound] = useState(false);
  const { id } = useParams();
  const [image, setImage] = useState(null);
  const [texture, setTexture] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHome = async () => {
      try {
        const res = await axios.get(`${url}info/${id}`);

        // Check if panoramic images exist
        if (!res.data.panoramic || res.data.panoramic.length === 0) {
          setNoImagesFound(true);
          setIsLoading(false);
          return;
        }

        const grouped = groupByRoom(res.data.panoramic);

        // Check if grouping resulted in any rooms
        if (Object.keys(grouped).length === 0) {
          setNoImagesFound(true);
        } else {
          setHomeData(grouped);
        }
      } catch (err) {
        setError("Failed to fetch panoramic images.");
        console.error("Error fetching panoramic data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHome();
  }, [id]);

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

  const groupByRoom = (images) => {
    const result = {};
    if (!images || images.length === 0) return result;

    images.forEach((img) => {
      const match = img.match(/room\d+/i);
      const filename = img.replace(/\\/g, "/").split("/").pop();

      const room = match ? match[0].toUpperCase() : `${filename}`;
      if (!result[room]) result[room] = [];
      result[room].push(img);
    });
    return result;
  };

  const handleRoomSelection = (room) => {
    setSelectedRoom(room);
    if (homeData[room]) {
      const firstImage = homeData[room][0];
      setSelectedImage(firstImage);
      setImage(getSafeImageUrl(firstImage)); // ✅ fixed here
    }
  };

  const handleImageSelection = (img) => {
    setSelectedImage(img);
    setImage(getSafeImageUrl(img)); // ✅ fixed here
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  // Loading state
  if (isLoading)
    return (
      <div
        className="loading-container"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          background: "#f9f9f9",
        }}>
        <div
          className="spinner"
          style={{
            width: "50px",
            height: "50px",
            border: "5px solid rgba(0, 123, 255, 0.2)",
            borderRadius: "50%",
            borderTop: "5px solid #007bff",
            animation: "spin 1s linear infinite",
          }}></div>
        <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
        <p style={{ marginTop: "20px", color: "#333", fontSize: "18px" }}>
          Loading panoramic views...
        </p>
      </div>
    );

  // Error state
  if (error)
    return (
      <div
        style={{
          textAlign: "center",
          padding: "50px",
          background: "#fff4f4",
          borderRadius: "8px",
          margin: "50px auto",
          maxWidth: "600px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}>
        <h2 style={{ color: "#d32f2f" }}>Error</h2>
        <p style={{ fontSize: "18px", color: "#333" }}>{error}</p>
        <button
          onClick={handleGoBack}
          style={{
            background: "#2196f3",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "4px",
            cursor: "pointer",
            marginTop: "20px",
            fontSize: "16px",
            transition: "background 0.3s",
          }}>
          ← Go Back
        </button>
      </div>
    );

  // No images found state
  if (noImagesFound)
    return (
      <div
        style={{
          textAlign: "center",
          padding: "50px",
          background: "white",
          borderRadius: "8px",
          margin: "50px auto",
          maxWidth: "600px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}>
        <div
          style={{
            fontSize: "64px",
            marginBottom: "20px",
            color: "#9e9e9e",
          }}>
          📷
        </div>
        <h2 style={{ color: "#555", marginBottom: "20px" }}>
          No Panoramic Images Found
        </h2>
        <p style={{ fontSize: "18px", color: "#666", marginBottom: "30px" }}>
          There are no panoramic images available for this property.
        </p>
        <button
          onClick={handleGoBack}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto",
            background: "#2196f3",
            color: "white",
            border: "none",
            padding: "12px 25px",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
            transition: "background 0.3s",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = "#1976d2";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "#2196f3";
          }}>
          <span style={{ marginRight: "8px" }}>←</span> Go Back
        </button>
      </div>
    );

  // Normal view with images
  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "30px",
        fontFamily: "Arial, sans-serif",
        background: "#f9f9f9",
        borderRadius: "10px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
      }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}>
        <h1 style={{ color: "#333", margin: 0 }}>Panoramic Tour</h1>
        <button
          onClick={handleGoBack}
          style={{
            display: "flex",
            alignItems: "center",
            background: "#2196f3",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
            transition: "background 0.3s",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = "#1976d2";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "#2196f3";
          }}>
          <span style={{ marginRight: "8px" }}>←</span> Go Back
        </button>
      </div>

      <div
        style={{
          background: "white",
          padding: "25px",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          marginBottom: "30px",
        }}>
        <h2 style={{ color: "#333", marginTop: 0 }}>Select a Room</h2>
        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            margin: "20px 0",
          }}>
          {Object.entries(homeData).map(([room, imgs]) => (
            <button
              key={room}
              onClick={() => handleRoomSelection(room)}
              style={{
                padding: "12px 22px",
                backgroundColor: selectedRoom === room ? "#007bff" : "#f0f0f0",
                color: selectedRoom === room ? "#fff" : "#333",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "all 0.2s ease",
                fontSize: "16px",
                boxShadow:
                  selectedRoom === room
                    ? "0 4px 8px rgba(0,123,255,0.3)"
                    : "0 2px 5px rgba(0,0,0,0.1)",
                fontWeight: selectedRoom === room ? "600" : "normal",
              }}
              onMouseOver={(e) => {
                if (selectedRoom !== room) {
                  e.currentTarget.style.backgroundColor = "#e3e3e3";
                }
              }}
              onMouseOut={(e) => {
                if (selectedRoom !== room) {
                  e.currentTarget.style.backgroundColor = "#f0f0f0";
                }
              }}>
              {room}{" "}
              <span
                style={{
                  background:
                    selectedRoom === room ? "rgba(255,255,255,0.3)" : "#e0e0e0",
                  padding: "2px 8px",
                  borderRadius: "12px",
                  fontSize: "14px",
                  marginLeft: "8px",
                }}>
                {imgs.length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {selectedRoom && (
        <div
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "8px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            marginBottom: "30px",
          }}>
          <h3 style={{ color: "#333", marginTop: 0 }}>
            Images for {selectedRoom}
          </h3>
          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              margin: "20px 0",
            }}>
            {homeData[selectedRoom].map((img, index) => (
              <button
                key={index}
                onClick={() => handleImageSelection(img)}
                style={{
                  padding: "10px 18px",
                  backgroundColor:
                    selectedImage === img ? "#007bff" : "#f0f0f0",
                  color: selectedImage === img ? "#fff" : "#333",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  fontSize: "15px",
                  boxShadow:
                    selectedImage === img
                      ? "0 4px 8px rgba(0,123,255,0.3)"
                      : "0 2px 5px rgba(0,0,0,0.1)",
                }}
                onMouseOver={(e) => {
                  if (selectedImage !== img) {
                    e.currentTarget.style.backgroundColor = "#e3e3e3";
                  }
                }}
                onMouseOut={(e) => {
                  if (selectedImage !== img) {
                    e.currentTarget.style.backgroundColor = "#f0f0f0";
                  }
                }}>
                View {index + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedImage && texture && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 1000,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.95)",
            overflowY: "auto",
            padding: "40px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}>
          <div
            style={{
              width: "100%",
              maxWidth: "1400px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}>
            <h2
              style={{
                color: "#fff",
                margin: 0,
                textShadow: "0 2px 4px rgba(0,0,0,0.5)",
              }}>
              {selectedRoom}
            </h2>

            <div>
              <button
                onClick={handleGoBack}
                style={{
                  background: "rgba(255,255,255,0.2)",
                  color: "#fff",
                  padding: "8px 15px",
                  borderRadius: "5px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "bold",
                  marginRight: "10px",
                  backdropFilter: "blur(5px)",
                  transition: "background 0.3s",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.3)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.2)";
                }}>
                ← Go Back
              </button>

              <button
                onClick={() => {
                  setSelectedRoom(null);
                  setSelectedImage(null);
                  setTexture(null);
                  setImage(null);
                }}
                style={{
                  background: "#d32f2f",
                  color: "#fff",
                  padding: "8px 15px",
                  borderRadius: "5px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "bold",
                  transition: "background 0.3s",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "#e53935";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "#d32f2f";
                }}>
                ✕ Close
              </button>
            </div>
          </div>

          <div
            style={{
              width: "100%",
              height: "82vh",
              borderRadius: "10px",
              overflow: "hidden",
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            }}>
            <Canvas style={{ height: "100%", width: "100%" }}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[10, 10, 10]} />
              <PanoramicSphere texture={texture} />
              <OrbitControls
                enableZoom={true}
                enablePan={true}
                enableRotate={true}
                zoomSpeed={0.8}
                panSpeed={0.5}
                rotateSpeed={0.5}
              />
              <CameraAnimation />
            </Canvas>
          </div>

          <div
            style={{
              marginTop: "15px",
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              justifyContent: "center",
            }}>
            {homeData[selectedRoom].map((img, index) => (
              <button
                key={index}
                onClick={() => handleImageSelection(img)}
                style={{
                  padding: "8px 15px",
                  backgroundColor:
                    selectedImage === img
                      ? "rgba(0,123,255,0.8)"
                      : "rgba(255,255,255,0.2)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "20px",
                  cursor: "pointer",
                  fontSize: "14px",
                  backdropFilter: "blur(5px)",
                  transition: "all 0.2s ease",
                }}>
                View {index + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PanoramicViewer;

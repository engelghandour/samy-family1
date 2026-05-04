import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import BookingHeader from "../components/BookingHeader";

const C = {
  skin: "#dbb5a0",
  skinLight: "#eacebf",
  skinDark: "#c4957a",
  skinWarm: "#f0d5c4",

  selected: "#4fc3f7",
};

// ---- TORSO ----
function TorsoMesh({ isSelected, isHovered }) {
  const points = useMemo(() => {
    const p = [];
    const profile = [
      [0.22, 0.58],
      [0.26, 0.52],
      [0.3, 0.45],
      [0.35, 0.38],
      [0.38, 0.3],
      [0.4, 0.22],
      [0.41, 0.14],
      [0.38, 0.06],
      [0.36, -0.02],
      [0.35, -0.1],
      [0.36, -0.18],
      [0.38, -0.26],
      [0.37, -0.34],
      [0.34, -0.42],
      [0.3, -0.5],
      [0.25, -0.55],
    ];
    profile.forEach(([r, y]) => p.push(new THREE.Vector2(r, y)));
    return p;
  }, []);

  return (
    <group position={[0, 1.25, 0]}>
      <mesh position={[0, 0, 0]} castShadow>
        <latheGeometry args={[points, 32]} />
        <meshPhysicalMaterial
          color={isSelected || isHovered ? C.selected : C.skin}
          roughness={0.35}
          metalness={0.0}
          clearcoat={0.08}
          clearcoatRoughness={0.3}
          emissive={isSelected ? C.selected : "#000000"}
          emissiveIntensity={isSelected ? 0.5 : 0}
        />
      </mesh>
    </group>
  );
}

// ---- HEAD ----
function HeadMesh({ isSelected, isHovered }) {
  return (
    <group position={[0, 2.1, 0]}>
      <mesh castShadow scale={[0.32, 0.38, 0.3]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshPhysicalMaterial
          color={isSelected || isHovered ? C.selected : C.skin}
          roughness={0.25}
          metalness={0.0}
          clearcoat={0.12}
          emissive={isSelected ? C.selected : "#000000"}
          emissiveIntensity={isSelected ? 0.5 : 0}
        />
      </mesh>
      {/* Nose */}
      <mesh position={[0, 0.02, 0.32]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshPhysicalMaterial color={C.skinWarm} roughness={0.5} />
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.12, 0.1, 0.3]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshPhysicalMaterial color="#3a281f" roughness={0.1} />
      </mesh>
      <mesh position={[0.12, 0.1, 0.3]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshPhysicalMaterial color="#3a281f" roughness={0.1} />
      </mesh>
      {/* Eyebrows */}
      <mesh position={[-0.12, 0.15, 0.22]}>
        <boxGeometry args={[0.05, 0.008, 0.02]} />
        <meshPhysicalMaterial color="#5a3d2b" roughness={0.8} />
      </mesh>
      <mesh position={[0.12, 0.15, 0.22]}>
        <boxGeometry args={[0.05, 0.008, 0.02]} />
        <meshPhysicalMaterial color="#5a3d2b" roughness={0.8} />
      </mesh>
      {/* Mouth */}
      <mesh position={[0, -0.1, 0.3]}>
        <boxGeometry args={[0.07, 0.012, 0.02]} />
        <meshPhysicalMaterial color="#8a5a4a" roughness={0.6} />
      </mesh>
      {/* Hair */}
      <mesh position={[0, 0.26, 0.03]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshPhysicalMaterial color="#3a281f" roughness={0.9} />
      </mesh>
    </group>
  );
}

// ---- NECK ----
function NeckMesh({ isSelected, isHovered }) {
  return (
    <mesh position={[0, 1.82, 0]} castShadow>
      <cylinderGeometry args={[0.22, 0.26, 0.2, 16]} />
      <meshPhysicalMaterial
        color={isSelected || isHovered ? C.selected : C.skinLight}
        roughness={0.35}
        metalness={0.0}
        emissive={isSelected ? C.selected : "#000000"}
        emissiveIntensity={isSelected ? 0.5 : 0}
      />
    </mesh>
  );
}

// ---- LIMBS ----
function Limb({
  position,
  scale,
  isSelected,
  isHovered,
  color = C.skin,
  rot = [0, 0, 0],
}) {
  return (
    <mesh position={position} scale={scale} rotation={rot} castShadow>
      <capsuleGeometry args={[0.25, 0.45, 8, 12]} />
      <meshPhysicalMaterial
        color={isSelected || isHovered ? C.selected : color}
        roughness={0.35}
        metalness={0.0}
        emissive={isSelected ? C.selected : "#000000"}
        emissiveIntensity={isSelected ? 0.5 : 0}
      />
    </mesh>
  );
}

// ---- SHOULDER ----
function Shoulder({ position, isSelected, isHovered }) {
  return (
    <mesh position={position} castShadow>
      <sphereGeometry args={[0.16, 12, 12]} />
      <meshPhysicalMaterial
        color={isSelected || isHovered ? C.selected : C.skinLight}
        roughness={0.3}
        metalness={0.0}
        emissive={isSelected ? C.selected : "#000000"}
        emissiveIntensity={isSelected ? 0.5 : 0}
      />
    </mesh>
  );
}

// ---- HAND ----
function Hand({ position }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshPhysicalMaterial color={C.skinLight} roughness={0.4} />
      </mesh>
      {[-0.03, 0, 0.03].map((x, i) => (
        <mesh key={i} position={[x, -0.08, 0]} scale={[0.012, 0.035, 0.012]}>
          <capsuleGeometry args={[1, 0.2, 6, 6]} />
          <meshPhysicalMaterial color={C.skinLight} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

// ---- FOOT ----
function Foot({ position }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[0.1, 0.05, 0.2]} />
        <meshPhysicalMaterial color={C.skinDark} roughness={0.6} />
      </mesh>
    </group>
  );
}

// ---- CHEST DETAIL ----
function ChestDetail() {
  return (
    <group>
      <mesh position={[-0.14, 1.5, 0.3]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshPhysicalMaterial color={C.skinWarm} roughness={0.3} />
      </mesh>
      <mesh position={[0.14, 1.5, 0.3]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshPhysicalMaterial color={C.skinWarm} roughness={0.3} />
      </mesh>
    </group>
  );
}

// ---- ABDOMEN ----
function Abdomen({ isSelected, isHovered }) {
  return (
    <mesh position={[0, 0.98, 0]} castShadow>
      <sphereGeometry args={[0.28, 20, 20]} />
      <meshPhysicalMaterial
        color={isSelected || isHovered ? C.selected : C.skinLight}
        roughness={0.3}
        metalness={0.0}
        emissive={isSelected ? C.selected : "#000000"}
        emissiveIntensity={isSelected ? 0.5 : 0}
      />
    </mesh>
  );
}

// ---- PELVIS ----
function Pelvis({ isSelected, isHovered }) {
  return (
    <mesh position={[0, 0.65, 0]} castShadow>
      <sphereGeometry args={[0.3, 20, 20]} />
      <meshPhysicalMaterial
        color={isSelected || isHovered ? C.selected : C.skinDark}
        roughness={0.4}
        metalness={0.0}
        emissive={isSelected ? C.selected : "#000000"}
        emissiveIntensity={isSelected ? 0.5 : 0}
      />
    </mesh>
  );
}

// ---- GROIN ----
function Groin({ isSelected, isHovered }) {
  return (
    <mesh position={[0, 0.48, 0.08]} castShadow>
      <sphereGeometry args={[0.08, 8, 8]} />
      <meshPhysicalMaterial
        color={isSelected || isHovered ? C.selected : C.skinDark}
        roughness={0.6}
        metalness={0.0}
        emissive={isSelected ? C.selected : "#000000"}
        emissiveIntensity={isSelected ? 0.5 : 0}
      />
    </mesh>
  );
}

// ---- BODY REGIONS ----
const bodyRegions = [
  { id: "head", name: "Head", Comp: HeadMesh },
  { id: "neck", name: "Neck", Comp: NeckMesh },
  { id: "chest", name: "Chest / Upper Body", Comp: TorsoMesh },
  { id: "chest_detail", name: "Chest Area", Comp: ChestDetail },
  {
    id: "left_shoulder",
    name: "Left Shoulder",
    Comp: Shoulder,
    p: { position: [-0.48, 1.62, 0] },
  },
  {
    id: "right_shoulder",
    name: "Right Shoulder",
    Comp: Shoulder,
    p: { position: [0.48, 1.62, 0] },
  },
  {
    id: "left_arm",
    name: "Left Arm",
    Comp: Limb,
    p: { position: [-0.72, 1.35, 0], scale: [0.3, 0.9, 0.3] },
  },
  {
    id: "right_arm",
    name: "Right Arm",
    Comp: Limb,
    p: { position: [0.72, 1.35, 0], scale: [0.3, 0.9, 0.3] },
  },
  {
    id: "left_hand",
    name: "Left Hand",
    Comp: Hand,
    p: { position: [-0.72, 0.5, 0] },
  },
  {
    id: "right_hand",
    name: "Right Hand",
    Comp: Hand,
    p: { position: [0.72, 0.5, 0] },
  },
  { id: "abdomen", name: "Abdomen", Comp: Abdomen },
  { id: "pelvis", name: "Pelvis", Comp: Pelvis },
  {
    id: "left_leg",
    name: "Left Leg",
    Comp: Limb,
    p: {
      position: [-0.2, 0.35, 0],
      scale: [0.32, 0.8, 0.32],
      color: C.skinDark,
    },
  },
  {
    id: "right_leg",
    name: "Right Leg",
    Comp: Limb,
    p: {
      position: [0.2, 0.35, 0],
      scale: [0.32, 0.8, 0.32],
      color: C.skinDark,
    },
  },
  {
    id: "left_foot",
    name: "Left Foot",
    Comp: Foot,
    p: { position: [-0.2, -0.45, 0.04] },
  },
  {
    id: "right_foot",
    name: "Right Foot",
    Comp: Foot,
    p: { position: [0.2, -0.45, 0.04] },
  },
  { id: "genitals", name: "Groin Area", Comp: Groin },
];

// ---- BREATHING ----
function BreathingGroup({ children }) {
  const ref = useRef(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.elapsedTime;
      ref.current.position.y = Math.sin(t * 1.0) * 0.003;
      ref.current.scale.y = 1 + Math.sin(t * 1.0) * 0.002;
    }
  });
  return <group ref={ref}>{children}</group>;
}

// ---- INTERACTIVE PART ----
function InteractivePart({ region, sel, hov, onClick, onHover }) {
  const { id, name, Comp, p = {} } = region;
  return (
    <group
      onClick={(e) => {
        e.stopPropagation();
        onClick(id, name);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(id, name);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        onHover(null, null);
        document.body.style.cursor = "default";
      }}
    >
      <Comp isSelected={sel === id} isHovered={hov === id} {...p} />
    </group>
  );
}

// ---- ENVIRONMENT ----
function SceneEnv() {
  return (
    <>
      <color attach="background" args={["#0a1628"]} />
      <ambientLight intensity={0.5} color="#8899cc" />
      <directionalLight
        position={[3, 6, 4]}
        intensity={1.8}
        castShadow
        shadow-mapSize={[512, 512]}
      />
      <directionalLight
        position={[-3, 2, -2]}
        intensity={0.4}
        color="#6688ff"
      />
      <pointLight position={[0, 3, -3]} intensity={0.4} color="#88ddff" />
      <pointLight position={[-2, 1, 3]} intensity={0.3} color="#ff8866" />
      <pointLight position={[2, 1, 3]} intensity={0.3} color="#6688ff" />
      <ContactShadows
        position={[0, -1.55, 0]}
        opacity={0.5}
        scale={8}
        blur={2.5}
        far={4}
      />
    </>
  );
}

// ---- 3D SCENE ----
function BodyScene({
  selectedPart,
  hoveredPart,
  onPartClick,
  onPartHover,
  controlsRef,
}) {
  return (
    <>
      <SceneEnv />
      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.08}
        enableZoom
        enablePan={false}
        minDistance={2}
        maxDistance={7}
        rotateSpeed={0.7}
        target={[0, 0.75, 0]}
        autoRotate
        autoRotateSpeed={0.5}
      />
      <BreathingGroup>
        {bodyRegions.map((r) => (
          <InteractivePart
            key={r.id}
            region={r}
            sel={selectedPart}
            hov={hoveredPart}
            onClick={onPartClick}
            onHover={onPartHover}
          />
        ))}
      </BreathingGroup>
      {hoveredPart && (
        <Html position={[0, -1.7, 0]} center style={{ pointerEvents: "none" }}>
          <div
            style={{
              background: "rgba(0,0,0,0.85)",
              color: "#fff",
              padding: "6px 16px",
              borderRadius: 16,
              fontSize: 13,
              whiteSpace: "nowrap",
              border: "1px solid rgba(79,195,247,0.3)",
            }}
          >
            <i
              className="fas fa-hand-pointer"
              style={{ marginRight: 6, color: "#4fc3f7" }}
            />{" "}
            {hoveredPart}
          </div>
        </Html>
      )}
    </>
  );
}

// ---- MAIN PAGE ----
export default function BodyMap() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const controlsRef = useRef(null);

  const [selectedPart, setSelectedPart] = useState(state.bodyPart || null);
  const [selectedPartName, setSelectedPartName] = useState(
    state.bodyPartName || null,
  );
  const [hoveredPart, setHoveredPart] = useState(null);
  const [duration, setDuration] = useState(state.duration || "");
  const [sex, setSex] = useState(state.sex || "");
  const [age, setAge] = useState(state.age || "");
  const [onsetDate, setOnsetDate] = useState(state.onsetDate || "");

  const updateTimeDisplay = useCallback(() => {
    const el = document.getElementById("timeDisplay");
    if (el) {
      const now = new Date();
      el.innerHTML = `<i class="far fa-calendar-alt"></i> ${now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}`;
    }
  }, []);

  useEffect(() => {
    updateTimeDisplay();
    const interval = setInterval(updateTimeDisplay, 60000);
    return () => clearInterval(interval);
  }, [updateTimeDisplay]);

  const handlePartClick = useCallback(
    (id, name) => {
      setSelectedPart(id);
      setSelectedPartName(name);
      dispatch({ type: "SET_BODY_PART", payload: { id, name } });
      if (window.showToast) window.showToast(`${name} selected`, "success");
    },
    [dispatch],
  );

  const handlePartHover = useCallback((_id, name) => {
    setHoveredPart(name);
  }, []);

  const clearLocation = () => {
    setSelectedPart(null);
    setSelectedPartName(null);
    if (window.showToast) window.showToast("Location cleared", "info");
  };

  const handleNext = () => {
    if (!selectedPart || !duration || !sex || !age) {
      if (window.showToast)
        window.showToast("Please complete all required fields", "warning");
      return;
    }
    dispatch({ type: "SET_DURATION", payload: duration });
    dispatch({ type: "SET_SEX", payload: sex });
    dispatch({ type: "SET_AGE", payload: age });
    dispatch({ type: "SET_ONSET_DATE", payload: onsetDate });
    navigate("/symptoms");
  };

  const handlePrev = () => navigate("/");

  const resetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0.75, 0);
      controlsRef.current.object.position.set(3, 1.5, 4);
      controlsRef.current.update();
    }
  };

  const toggleAutoRotate = () => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = !controlsRef.current.autoRotate;
      controlsRef.current.update();
    }
  };

  const isValid =
    selectedPart && duration && sex && age && age > 0 && age <= 120;

  return (
    <div className="app-wrapper">
      <div className="main-container">
        
        <BookingHeader
          icon="fa-cube"
          subtitle={
            <>
              <i className="fas fa-cube"></i> 3D Body Map Assessment
            </>
          }
        >
          <div className="time-display" id="timeDisplay">
            <i className="far fa-clock"></i> Loading...
          </div>
        </BookingHeader>

        <main className="main-content">
          <div className="progress-tracker">
            <div className="progress-bar">
              <div className="progress-step completed"><div className="progress-circle">1</div><div className="progress-label">Visit Type</div></div>
              <div className="progress-line filled"></div>
              <div className="progress-step active"><div className="progress-circle">2</div><div className="progress-label">Body Map</div></div>
              <div className="progress-line"></div>
              <div className="progress-step"><div className="progress-circle">3</div><div className="progress-label">Symptoms</div></div>
              <div className="progress-line"></div>
              <div className="progress-step"><div className="progress-circle">4</div><div className="progress-label">Emergency</div></div>
              <div className="progress-line"></div>
              <div className="progress-step"><div className="progress-circle">5</div><div className="progress-label">Details</div></div>
            </div>
            <div className="progress-title">
              <i className="fas fa-cube"></i> Step 2 of 5: Click on a body area to select symptom location
            </div>
          </div>
          <div className="two-column-layout">
            <div className="canvas-container" style={{ background: "#0a1628" }}>
              <Canvas
                camera={{
                  position: [3, 1.5, 4],
                  fov: 40,
                  near: 0.1,
                  far: 1000,
                }}
                style={{ width: "100%", height: 550 }}
                gl={{ antialias: true }}
                shadows
              >
                <BodyScene
                  selectedPart={selectedPart}
                  hoveredPart={hoveredPart}
                  onPartClick={handlePartClick}
                  onPartHover={handlePartHover}
                  controlsRef={controlsRef}
                />
              </Canvas>
              <div className="canvas-controls">
                <button
                  className="ctrl-btn"
                  onClick={resetCamera}
                  title="Reset Camera"
                >
                  <i className="fas fa-sync-alt"></i>
                </button>
                <button
                  className="ctrl-btn"
                  onClick={toggleAutoRotate}
                  title="Toggle Auto-Rotate"
                >
                  <i className="fas fa-sync"></i>
                </button>
              </div>
              <div
                className="location-indicator"
                style={{ background: "rgba(0,0,0,0.8)" }}
              >
                {hoveredPart ? (
                  <>
                    <i
                      className="fas fa-hand-pointer"
                      style={{ color: "#4fc3f7" }}
                    ></i>{" "}
                    {hoveredPart}
                  </>
                ) : (
                  <>
                    <i className="fas fa-mouse-pointer"></i> Hover over any body
                    area
                  </>
                )}
              </div>
            </div>

            <div className="form-container">
              <div className="form-header">
                <h3>
                  <i className="fas fa-clipboard-list"></i> Symptom Information
                </h3>
                <p>Please provide details about your symptoms</p>
              </div>
              <div className="form-body">
                <div className="selected-info-card">
                  <h4>
                    <i className="fas fa-map-pin"></i> Selected Location
                  </h4>
                  <div className="selected-info-value">
                    <i className="fas fa-dot-circle"></i>
                    <span>
                      {selectedPartName ? (
                        <>
                          <i
                            className="fas fa-check-circle"
                            style={{ color: "#10b981" }}
                          ></i>{" "}
                          {selectedPartName}
                        </>
                      ) : (
                        <>
                          <i
                            className="fas fa-times-circle"
                            style={{ color: "#ef4444" }}
                          ></i>{" "}
                          Not selected
                        </>
                      )}
                    </span>
                  </div>
                  <button className="clear-selection" onClick={clearLocation}>
                    <i className="fas fa-trash-alt"></i> Clear
                  </button>
                </div>

                <div className="form-group">
                  <label>
                    <i className="fas fa-calendar-alt"></i> Duration{" "}
                    <span className="required-star">*</span>
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  >
                    <option value="">Select...</option>
                    <option value="less_than_24h">Less than 24 hours</option>
                    <option value="1_to_3_days">1 - 3 days</option>
                    <option value="4_to_7_days">4 - 7 days</option>
                    <option value="8_to_14_days">8 - 14 days</option>
                    <option value="2_to_4_weeks">2 - 4 weeks</option>
                    <option value="1_to_3_months">1 - 3 months</option>
                    <option value="more_than_3_months">
                      More than 3 months
                    </option>
                  </select>
                </div>

                <div className="row-two">
                  <div className="form-group">
                    <label>
                      <i className="fas fa-venus-mars"></i> Sex{" "}
                      <span className="required-star">*</span>
                    </label>
                    <select
                      value={sex}
                      onChange={(e) => setSex(e.target.value)}
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>
                      <i className="fas fa-birthday-cake"></i> Age{" "}
                      <span className="required-star">*</span>
                    </label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="Age"
                      min="0"
                      max="120"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>
                    <i className="fas fa-calendar-plus"></i> Onset date
                    (optional)
                  </label>
                  <input
                    type="date"
                    value={onsetDate}
                    onChange={(e) => setOnsetDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="btn-group">
                <button className="btn btn-secondary" onClick={handlePrev}>
                  <i className="fas fa-arrow-left"></i> Previous
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleNext}
                  disabled={!isValid}
                >
                  Next <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
          </div>
        </main>

        <footer className="main-footer">
          <div className="footer-links">
            <a href="#">
              <i className="fas fa-file-contract"></i> Terms
            </a>
            <a href="#">
              <i className="fas fa-lock"></i> Privacy
            </a>
            <a href="#">
              <i className="fas fa-universal-access"></i> Accessibility
            </a>
          </div>
          <p>© 2026 Collins Medical Practice. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

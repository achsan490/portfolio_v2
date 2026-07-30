import React, { useRef, useState, useMemo, useEffect, Suspense } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { useTexture, Environment } from '@react-three/drei'
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier'
import * as THREE from 'three'
import { Move, Sparkles } from 'lucide-react'

// ── Solid Luxury Black Lanyard Texture ───────────────────────────────────────
function makeBlackLanyardTex() {
  const W = 256, H = 1024
  const canvas = document.createElement('canvas')
  canvas.width = W; canvas.height = H
  const ctx = canvas.getContext('2d')

  // Deep luxury charcoal black base
  ctx.fillStyle = '#090d16'
  ctx.fillRect(0, 0, W, H)

  // Micro woven fabric pattern
  ctx.fillStyle = 'rgba(255, 255, 255, 0.04)'
  for (let y = 0; y < H; y += 4) {
    for (let x = 0; x < W; x += 4) {
      if ((x + y) % 8 === 0) {
        ctx.fillRect(x, y, 2, 2)
      }
    }
  }

  // Dual metallic blue & cyan edge stripes (left & right)
  ctx.fillStyle = '#2563eb'
  ctx.fillRect(6, 0, 4, H)
  ctx.fillRect(W - 10, 0, 4, H)

  ctx.fillStyle = '#38bdf8'
  ctx.fillRect(10, 0, 2, H)
  ctx.fillRect(W - 12, 0, 2, H)

  // Center subtle dark blue glow line
  const grad = ctx.createLinearGradient(0, 0, 0, H)
  grad.addColorStop(0, 'rgba(37, 99, 235, 0.15)')
  grad.addColorStop(0.5, 'rgba(56, 189, 248, 0.25)')
  grad.addColorStop(1, 'rgba(37, 99, 235, 0.15)')
  ctx.fillStyle = grad
  ctx.fillRect(W / 2 - 20, 0, 40, H)

  // Edge depth shadows
  const eL = ctx.createLinearGradient(0, 0, 16, 0)
  eL.addColorStop(0, 'rgba(0,0,0,0.85)')
  eL.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = eL
  ctx.fillRect(0, 0, 16, H)

  const eR = ctx.createLinearGradient(W - 16, 0, W, 0)
  eR.addColorStop(0, 'rgba(0,0,0,0)')
  eR.addColorStop(1, 'rgba(0,0,0,0.85)')
  ctx.fillStyle = eR
  ctx.fillRect(W - 16, 0, 16, H)

  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.RepeatWrapping
  tex.needsUpdate = true
  return tex
}

// ── Ribbon Geometry (Flat 3D Strap that follows physics curve) ─────────────
function updateRibbon(geo, points, halfW = 0.22) {
  const n = points.length
  const pos = new Float32Array(n * 2 * 3)
  const uvs = new Float32Array(n * 2 * 2)
  const idx = []

  const up = new THREE.Vector3(0, 0, 1)
  const tan = new THREE.Vector3()
  const perp = new THREE.Vector3()

  for (let i = 0; i < n; i++) {
    const t = i / (n - 1)
    const p = points[i]

    if (i === 0) tan.subVectors(points[1], points[0])
    else if (i === n - 1) tan.subVectors(points[n - 1], points[n - 2])
    else tan.subVectors(points[i + 1], points[i - 1])
    tan.normalize()
    perp.crossVectors(tan, up).normalize()

    const b = i * 6
    pos[b + 0] = p.x - perp.x * halfW
    pos[b + 1] = p.y - perp.y * halfW
    pos[b + 2] = p.z - perp.z * halfW

    pos[b + 3] = p.x + perp.x * halfW
    pos[b + 4] = p.y + perp.y * halfW
    pos[b + 5] = p.z + perp.z * halfW

    const u = i * 4
    uvs[u + 0] = 0; uvs[u + 1] = t * 4
    uvs[u + 2] = 1; uvs[u + 3] = t * 4

    if (i < n - 1) {
      const base = i * 2
      idx.push(base, base + 1, base + 2, base + 1, base + 3, base + 2)
    }
  }

  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
  geo.setIndex(idx)
  geo.computeVertexNormals()
  geo.attributes.position.needsUpdate = true
  if (geo.index) geo.index.needsUpdate = true
}

// ── Rounded Corner Card Geometry Helper ─────────────────────────────────────
function createRoundedCardGeometry(w = 1.6, h = 2.25, r = 0.12, depth = 0.04) {
  const shape = new THREE.Shape()
  const x = -w / 2, y = -h / 2
  shape.moveTo(x + r, y)
  shape.lineTo(x + w - r, y)
  shape.quadraticCurveTo(x + w, y, x + w, y + r)
  shape.lineTo(x + w, y + h - r)
  shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  shape.lineTo(x + r, y + h)
  shape.quadraticCurveTo(x, y + h, x, y + h - r)
  shape.lineTo(x, y + r)
  shape.quadraticCurveTo(x, y, x + r, y)

  const extrudeSettings = {
    depth: depth,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 1,
    bevelSize: 0.012,
    bevelThickness: 0.008
  }

  const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings)
  geo.center()
  return geo
}

// ── Rounded Plane Geometry for Card Front/Back Textures ──────────────────────
function createRoundedPlaneGeometry(w = 1.57, h = 2.22, r = 0.11) {
  const shape = new THREE.Shape()
  const x = -w / 2, y = -h / 2
  shape.moveTo(x + r, y)
  shape.lineTo(x + w - r, y)
  shape.quadraticCurveTo(x + w, y, x + w, y + r)
  shape.lineTo(x + w, y + h - r)
  shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  shape.lineTo(x + r, y + h)
  shape.quadraticCurveTo(x, y + h, x, y + h - r)
  shape.lineTo(x, y + r)
  shape.quadraticCurveTo(x, y, x + r, y)

  const geo = new THREE.ShapeGeometry(shape)
  geo.center()

  const pos = geo.attributes.position
  const uvs = new Float32Array(pos.count * 2)
  for (let i = 0; i < pos.count; i++) {
    uvs[i * 2] = (pos.getX(i) + w / 2) / w
    uvs[i * 2 + 1] = (pos.getY(i) + h / 2) / h
  }
  geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
  return geo
}

function Band() {
  const ribbonRef = useRef()
  const ribbonGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6), 3))
    geo.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(4), 2))
    return geo
  }, [])

  const [ribbonReady, setRibbonReady] = useState(false)
  const lanyardTex = useMemo(() => makeBlackLanyardTex(), [])

  const fixed = useRef()
  const j1 = useRef()
  const j2 = useRef()
  const j3 = useRef()
  const card = useRef()

  const vec = useMemo(() => new THREE.Vector3(), [])
  const ang = useMemo(() => new THREE.Vector3(), [])
  const rot = useMemo(() => new THREE.Vector3(), [])
  const dir = useMemo(() => new THREE.Vector3(), [])

  const { gl } = useThree()

  const [curve] = useState(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(), new THREE.Vector3(),
    new THREE.Vector3(), new THREE.Vector3()
  ]))

  const [dragged, drag] = useState(false)
  const [hovered, hover] = useState(false)

  // Load textures
  const [frontTex, backTex] = useTexture(['/badge-front.jpg', '/badge-back.jpg'])

  useMemo(() => {
    const maxAniso = gl.capabilities.getMaxAnisotropy ? gl.capabilities.getMaxAnisotropy() : 4
    for (const t of [frontTex, backTex]) {
      if (!t) return
      t.colorSpace = THREE.SRGBColorSpace
      t.anisotropy = maxAniso
      t.minFilter = THREE.LinearMipmapLinearFilter
      t.magFilter = THREE.LinearFilter
      t.needsUpdate = true
    }
  }, [frontTex, backTex, gl])

  // Geometries for rounded card body and front/back faces
  const cardBodyGeo = useMemo(() => createRoundedCardGeometry(1.6, 2.25, 0.12, 0.04), [])
  const cardFaceGeo = useMemo(() => createRoundedPlaneGeometry(1.57, 2.22, 0.11), [])

  // Materials
  const bodyMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#080d1a',
    roughness: 0.25,
    metalness: 0.8,
    clearcoat: 0.8,
    clearcoatRoughness: 0.1
  }), [])

  const frontMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    map: frontTex,
    roughness: 0.08,
    metalness: 0.02,
    clearcoat: 1.0,
    clearcoatRoughness: 0.03,
    reflectivity: 0.95
  }), [frontTex])

  const backMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    map: backTex,
    roughness: 0.08,
    metalness: 0.02,
    clearcoat: 1.0,
    clearcoatRoughness: 0.03,
    reflectivity: 0.95
  }), [backTex])

  const strapMat = useMemo(() => new THREE.MeshStandardMaterial({
    map: lanyardTex,
    side: THREE.DoubleSide,
    roughness: 0.55,
    metalness: 0.05,
    transparent: false,
    opacity: 1.0
  }), [lanyardTex])

  // Physics joints
  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1])
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1])
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1])
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.45, 0]])

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab'
      return () => void (document.body.style.cursor = 'auto')
    }
  }, [hovered, dragged])

  useFrame((state) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera)
      dir.copy(vec).sub(state.camera.position).normalize()
      vec.add(dir.multiplyScalar(state.camera.position.length()))
      ;[card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp())
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z
      })
    }

    if (fixed.current && card.current && j1.current && j2.current && j3.current) {
      curve.points[0].copy(j3.current.translation())
      curve.points[1].copy(j2.current.translation())
      curve.points[2].copy(j1.current.translation())
      curve.points[3].copy(fixed.current.translation())

      updateRibbon(ribbonGeo, curve.getPoints(48), 0.22)
      if (!ribbonReady) setRibbonReady(true)

      ang.copy(card.current.angvel())
      rot.copy(card.current.rotation())
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z })
    }
  })

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} angularDamping={2} linearDamping={2} type="fixed" />

        <RigidBody position={[0, -0.8, 0]} ref={j1} angularDamping={2} linearDamping={2}>
          <BallCollider args={[0.1]} />
        </RigidBody>

        <RigidBody position={[0, -1.6, 0]} ref={j2} angularDamping={2} linearDamping={2}>
          <BallCollider args={[0.1]} />
        </RigidBody>

        <RigidBody position={[0, -2.4, 0]} ref={j3} angularDamping={2} linearDamping={2}>
          <BallCollider args={[0.1]} />
        </RigidBody>

        {/* ID Card Rigid Body */}
        <RigidBody
          position={[0, -3.8, 0]}
          ref={card}
          angularDamping={2}
          linearDamping={2}
          type={dragged ? 'kinematicPosition' : 'dynamic'}
        >
          <CuboidCollider args={[0.8, 1.125, 0.02]} />

          {/* Interactive Card Group */}
          <group
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e) => (
              e.stopPropagation(),
              e.target.releasePointerCapture(e.pointerId),
              drag(false)
            )}
            onPointerDown={(e) => (
              e.stopPropagation(),
              e.target.setPointerCapture(e.pointerId),
              drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())))
            )}
          >
            {/* Rounded Plastic Card Frame Body */}
            <mesh geometry={cardBodyGeo} material={bodyMat} />

            {/* Front Card Face Photo (positioned in front of bevel at z = +0.029) */}
            <mesh position={[0, 0, 0.029]} geometry={cardFaceGeo} material={frontMat} />

            {/* Back Card Face Photo (positioned in back of bevel at z = -0.029) */}
            <mesh position={[0, 0, -0.029]} rotation={[0, Math.PI, 0]} geometry={cardFaceGeo} material={backMat} />
          </group>

          {/* Metallic Top Swivel Clip */}
          <group position={[0, 1.22, 0]}>
            <mesh>
              <boxGeometry args={[0.3, 0.1, 0.06]} />
              <meshStandardMaterial color="#1a2560" metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh position={[0, 0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.09, 0.025, 16, 32]} />
              <meshStandardMaterial color="#c0c8d8" metalness={0.98} roughness={0.05} />
            </mesh>
          </group>
        </RigidBody>
      </group>

      {/* Solid Black Fabric Lanyard Strap */}
      <mesh
        ref={ribbonRef}
        geometry={ribbonGeo}
        material={strapMat}
        visible={ribbonReady}
        frustumCulled={false}
      />
    </>
  )
}

function Loader() {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full gap-3">
      <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      <span className="text-xs text-gray-400">Loading 3D ID Badge...</span>
    </div>
  )
}

export default function Badge3D() {
  return (
    <div className="relative w-full h-[500px] sm:h-[600px] flex items-center justify-center rounded-3xl bg-gradient-to-b from-[#080f24]/70 via-black/60 to-[#020712]/90 border border-blue-500/20 backdrop-blur-xl overflow-hidden shadow-[0_0_60px_rgba(37,99,235,0.2)] group">
      
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.18),transparent_70%)] pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />

      {/* Drag Hint Overlay */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 border border-blue-500/30 backdrop-blur-md text-[0.7rem] text-blue-300 shadow-lg group-hover:scale-105 transition-transform duration-300">
        <Move className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
        <span>Tarik &amp; ayunkan ID Badge 3D ini!</span>
      </div>

      <Suspense fallback={<Loader />}>
        <Canvas
          camera={{ position: [0, 0, 13], fov: 25 }}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          gl={{ alpha: true, antialias: true }}
        >
          <ambientLight intensity={1.8} />
          <directionalLight position={[5, 5, 5]} intensity={2.5} />
          <directionalLight position={[-5, 5, -5]} intensity={1.5} color="#60a5fa" />
          <pointLight position={[0, -2, 3]} intensity={2} color="#3b82f6" />
          <Environment preset="city" />

          <Physics debug={false} gravity={[0, -40, 0]} timeStep={1 / 60}>
            <Band />
          </Physics>
        </Canvas>
      </Suspense>

      {/* Bottom Subtitle Label */}
      <div className="absolute bottom-3 left-0 right-0 z-10 pointer-events-none text-center">
        <span className="inline-flex items-center gap-1.5 text-[0.65rem] uppercase tracking-widest text-gray-400 bg-black/40 px-3 py-1 rounded-full border border-white/5 backdrop-blur-sm">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          SAN PROJECT • ID Badge 3D
        </span>
      </div>
    </div>
  )
}

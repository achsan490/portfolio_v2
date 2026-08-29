import React, { useRef, useState, useMemo, useEffect, Suspense } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { useTexture, Environment } from '@react-three/drei'
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier'
import * as THREE from 'three'

// ── Ultra High-Definition Woven Lanyard Texture ─────────────────────────────
function makeLanyardTexture() {
  const W = 512, H = 2048
  const canvas = document.createElement('canvas')
  canvas.width = W; canvas.height = H
  const ctx = canvas.getContext('2d')

  // ── Base: deep premium matte black strap ──
  ctx.fillStyle = '#08090c'
  ctx.fillRect(0, 0, W, H)

  // ── Realistic woven twill pattern ──
  const patternCanvas = document.createElement('canvas')
  patternCanvas.width = 16; patternCanvas.height = 16
  const pctx = patternCanvas.getContext('2d')
  pctx.fillStyle = '#08090c'
  pctx.fillRect(0, 0, 16, 16)
  pctx.strokeStyle = 'rgba(255, 255, 255, 0.035)'
  pctx.lineWidth = 1.5
  pctx.beginPath()
  pctx.moveTo(0, 0); pctx.lineTo(16, 16)
  pctx.moveTo(0, 8); pctx.lineTo(8, 16)
  pctx.moveTo(8, 0); pctx.lineTo(16, 8)
  pctx.stroke()
  
  const weavePattern = ctx.createPattern(patternCanvas, 'repeat')
  ctx.fillStyle = weavePattern
  ctx.fillRect(0, 0, W, H)

  // ── Bold Electric Blue Graphic Geometry ──
  // Main dynamic slash
  ctx.save()
  ctx.beginPath()
  ctx.moveTo(-40, H * 0.12)
  ctx.lineTo(W * 0.60, H * 0.04)
  ctx.lineTo(W * 0.48, H * 0.46)
  ctx.lineTo(-40, H * 0.54)
  ctx.closePath()
  const grad1 = ctx.createLinearGradient(0, H * 0.04, W * 0.6, H * 0.46)
  grad1.addColorStop(0, '#1d4ed8')
  grad1.addColorStop(0.5, '#2563eb')
  grad1.addColorStop(1, '#1e40af')
  ctx.fillStyle = grad1
  ctx.fill()

  // Crisp cyan-blue inner accent slash
  ctx.beginPath()
  ctx.moveTo(-40, H * 0.15)
  ctx.lineTo(W * 0.44, H * 0.07)
  ctx.lineTo(W * 0.35, H * 0.38)
  ctx.lineTo(-40, H * 0.45)
  ctx.closePath()
  ctx.fillStyle = 'rgba(56, 189, 248, 0.85)'
  ctx.fill()

  // Secondary slash lower section
  ctx.beginPath()
  ctx.moveTo(-40, H * 0.60)
  ctx.lineTo(W * 0.55, H * 0.52)
  ctx.lineTo(W * 0.45, H * 0.74)
  ctx.lineTo(-40, H * 0.80)
  ctx.closePath()
  ctx.fillStyle = '#2563eb'
  ctx.fill()

  // Pure White Racing Accent Ribbon
  ctx.beginPath()
  ctx.moveTo(W * 0.32, H * 0.03)
  ctx.lineTo(W * 0.54, H * 0.03)
  ctx.lineTo(W * 0.40, H * 0.48)
  ctx.lineTo(W * 0.18, H * 0.48)
  ctx.closePath()
  ctx.fillStyle = '#ffffff'
  ctx.fill()
  ctx.restore()

  // ── Realistic Edge Stitching (Stitch Lines on both borders) ──
  ctx.save()
  ctx.strokeStyle = 'rgba(255,255,255,0.45)'
  ctx.lineWidth = 2.5
  ctx.setLineDash([8, 6])
  // Left stitch
  ctx.beginPath()
  ctx.moveTo(12, 0); ctx.lineTo(12, H)
  ctx.stroke()
  // Right stitch
  ctx.beginPath()
  ctx.moveTo(W - 12, 0); ctx.lineTo(W - 12, H)
  ctx.stroke()
  ctx.restore()

  // ── Ultra-crisp High-Res Typography on Strap ──
  ctx.save()
  ctx.translate(W * 0.72, H * 0.34)
  ctx.rotate(-Math.PI / 2)
  ctx.font = '900 68px "Inter", "Arial Black", sans-serif'
  ctx.fillStyle = '#ffffff'
  ctx.shadowColor = 'rgba(0,0,0,0.5)'
  ctx.shadowBlur = 8
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('sann.my.id', 0, 0)
  ctx.restore()

  // Tagline below main text
  ctx.save()
  ctx.translate(W * 0.72, H * 0.48)
  ctx.rotate(-Math.PI / 2)
  ctx.font = 'bold 22px "Inter", sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.7)'
  ctx.letterSpacing = '6px'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('BEYOND THE FUTURE', 0, 0)
  ctx.restore()

  // Circular Emblem Emblem on Lanyard
  const emblemX = W * 0.62, emblemY = H * 0.67, emblemR = 52
  ctx.save()
  ctx.beginPath()
  ctx.arc(emblemX, emblemY, emblemR, 0, Math.PI * 2)
  ctx.fillStyle = '#0f172a'
  ctx.fill()
  ctx.lineWidth = 4
  ctx.strokeStyle = '#3b82f6'
  ctx.stroke()

  ctx.beginPath()
  ctx.arc(emblemX, emblemY, emblemR - 8, 0, Math.PI * 2)
  ctx.strokeStyle = 'rgba(255,255,255,0.2)'
  ctx.lineWidth = 2
  ctx.stroke()

  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 18px "Inter", sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('SAN', emblemX, emblemY - 10)
  ctx.font = 'bold 13px "Inter", sans-serif'
  ctx.fillStyle = '#60a5fa'
  ctx.fillText('PROJECT', emblemX, emblemY + 12)
  ctx.restore()

  // Top Plastic Breakaway Buckle graphic
  ctx.fillStyle = '#1e3a8a'
  ctx.fillRect(0, 0, W, 100)
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 22px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('sann.my.id', W / 2, 45)
  ctx.font = '16px sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.6)'
  ctx.fillText('OFFICIAL BADGE', W / 2, 75)

  // Bottom Metal Clip Sleeve
  ctx.fillStyle = '#111827'
  ctx.fillRect(0, H - 120, W, 120)
  ctx.fillStyle = 'rgba(255,255,255,0.15)'
  ctx.fillRect(W * 0.25, H - 120, W * 0.5, 8)
  ctx.fillRect(W * 0.25, H - 20, W * 0.5, 8)

  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = THREE.ClampToEdgeWrapping
  tex.wrapT = THREE.ClampToEdgeWrapping
  tex.needsUpdate = true
  return tex
}

// ── Ribbon Geometry (Strap following physics spine) ──────────────────────────
function updateRibbon(geo, points, halfW = 0.17) {
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
    uvs[u + 0] = 0; uvs[u + 1] = t
    uvs[u + 2] = 1; uvs[u + 3] = t

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

// ── Realistic 3D PVC Card Geometry with Chamfer Bevel & Slot Hole ──────────
function createCardWithSlotHole(w = 1.54, h = 2.18, r = 0.12, slotW = 0.22, slotH = 0.055, depth = 0.04) {
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

  // Top Punch Slot Hole (horizontal rounded pill shape)
  const holeY = h / 2 - 0.18
  const holePath = new THREE.Path()
  const hw = slotW / 2, hr = slotH / 2
  holePath.moveTo(-hw + hr, holeY - hr)
  holePath.lineTo(hw - hr, holeY - hr)
  holePath.absarc(hw - hr, holeY, hr, -Math.PI / 2, Math.PI / 2, false)
  holePath.lineTo(-hw + hr, holeY + hr)
  holePath.absarc(-hw + hr, holeY, hr, Math.PI / 2, (3 * Math.PI) / 2, false)
  shape.holes.push(holePath)

  const extrudeSettings = {
    depth,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 1,
    bevelSize: 0.008,
    bevelThickness: 0.006
  }

  const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings)
  geo.center()
  return geo
}

// ── Rounded Plane Geometry for Card Face Texture Mapping ───────────────────
function createRoundedPlaneGeometry(w = 1.52, h = 2.15, r = 0.11) {
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

// ── Realistic Chrome Lobster Claw Hook Assembly ────────────────────────────
function LobsterClaw({ position = [0, 0, 0] }) {
  const polishedChrome = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#edf2f7',
    metalness: 0.98,
    roughness: 0.06,
    clearcoat: 1.0,
    clearcoatRoughness: 0.03,
    reflectivity: 1.0,
  }), [])

  const brushedSteel = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#94a3b8',
    metalness: 0.92,
    roughness: 0.16,
    clearcoat: 0.7,
    clearcoatRoughness: 0.08,
  }), [])

  return (
    <group position={position}>
      {/* ── Top Swivel Barrel & Flat Strap Collar ── */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.046, 0.046, 0.24, 32]} />
        <primitive object={polishedChrome} />
      </mesh>
      
      {/* Swivel Collar Rings */}
      <mesh position={[-0.12, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.055, 0.055, 0.018, 24]} />
        <primitive object={brushedSteel} />
      </mesh>
      <mesh position={[0.12, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.055, 0.055, 0.018, 24]} />
        <primitive object={brushedSteel} />
      </mesh>

      {/* Decorative knurled center bands */}
      {[-0.06, 0.06].map((x, i) => (
        <mesh key={i} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.049, 0.049, 0.01, 24]} />
          <primitive object={brushedSteel} />
        </mesh>
      ))}

      {/* ── Main Snap Hook Body ── */}
      <group position={[0, -0.24, 0]}>
        {/* Hook neck */}
        <mesh position={[0, 0.13, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.12, 24]} />
          <primitive object={polishedChrome} />
        </mesh>

        {/* Hook side spine */}
        <mesh position={[-0.09, 0.03, 0]}>
          <cylinderGeometry args={[0.036, 0.036, 0.24, 24]} />
          <primitive object={polishedChrome} />
        </mesh>
        
        {/* Hook right spine */}
        <mesh position={[0.09, 0.03, 0]}>
          <cylinderGeometry args={[0.036, 0.036, 0.24, 24]} />
          <primitive object={polishedChrome} />
        </mesh>

        {/* Hook bottom curved loop */}
        <mesh position={[0, -0.09, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.09, 0.036, 24, 36, Math.PI]} />
          <primitive object={polishedChrome} />
        </mesh>

        {/* Top clasp bar */}
        <mesh position={[0, 0.16, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.036, 0.036, 0.20, 20]} />
          <primitive object={polishedChrome} />
        </mesh>

        {/* Spring latch lever on side */}
        <group position={[0.09, 0.18, 0]}>
          <mesh rotation={[0, 0, -0.25]}>
            <cylinderGeometry args={[0.026, 0.026, 0.16, 18]} />
            <primitive object={brushedSteel} />
          </mesh>
          <mesh position={[0.02, 0.08, 0]}>
            <sphereGeometry args={[0.026, 16, 16]} />
            <primitive object={brushedSteel} />
          </mesh>
        </group>
      </group>
    </group>
  )
}

// ── Realistic Slotted Chrome Grommet ────────────────────────────────────────
function SlottedGrommet({ position = [0, 0, 0] }) {
  const chromeMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#e2e8f0',
    metalness: 0.98,
    roughness: 0.08,
    clearcoat: 1.0,
    clearcoatRoughness: 0.04,
  }), [])

  return (
    <group position={position}>
      {/* Front eyelet rim */}
      <mesh position={[0, 0, 0.022]}>
        <ringGeometry args={[0.04, 0.085, 32]} />
        <primitive object={chromeMat} />
      </mesh>
      {/* Back eyelet rim */}
      <mesh position={[0, 0, -0.022]} rotation={[0, Math.PI, 0]}>
        <ringGeometry args={[0.04, 0.085, 32]} />
        <primitive object={chromeMat} />
      </mesh>
      {/* Inner metal sleeve */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.042, 0.042, 0.048, 32, 1, true]} />
        <primitive object={chromeMat} />
      </mesh>
    </group>
  )
}

// ── Main Band + Physics ID Card Component ──────────────────────────────────
function Band() {
  const ribbonRef = useRef()
  const ribbonGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6), 3))
    geo.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(4), 2))
    return geo
  }, [])

  const [ribbonReady, setRibbonReady] = useState(false)
  const lanyardTex = useMemo(() => makeLanyardTexture(), [])

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

  // Load badge front & back high quality textures
  const [frontTex, backTex] = useTexture(['/badge-front.jpg', '/badge-back.jpg'])

  useMemo(() => {
    const maxAniso = gl.capabilities.getMaxAnisotropy ? gl.capabilities.getMaxAnisotropy() : 8
    for (const t of [frontTex, backTex]) {
      if (!t) return
      t.colorSpace = THREE.SRGBColorSpace
      t.anisotropy = maxAniso
      t.minFilter = THREE.LinearMipmapLinearFilter
      t.magFilter = THREE.LinearFilter
      t.needsUpdate = true
    }
  }, [frontTex, backTex, gl])

  // Card 3D Body & Face Geometry
  const cardBodyGeo = useMemo(() => createCardWithSlotHole(1.54, 2.18, 0.12, 0.22, 0.055, 0.04), [])
  const cardFaceGeo = useMemo(() => createRoundedPlaneGeometry(1.51, 2.15, 0.11), [])

  // ── Hyper-Realistic PVC Laminated Card Materials ──
  // Card core bevel
  const bodyMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#0e1015',
    roughness: 0.35,
    metalness: 0.15,
    clearcoat: 0.8,
    clearcoatRoughness: 0.1,
  }), [])

  // Front PVC Laminated Face with Holographic Sheen
  const frontMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    map: frontTex,
    roughness: 0.12,
    metalness: 0.02,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    ior: 1.52,
    specularIntensity: 1.3,
    specularColor: '#ffffff',
    iridescence: 0.38,
    iridescenceIOR: 1.35,
    iridescenceThicknessRange: [120, 380],
    reflectivity: 0.95
  }), [frontTex])

  // Back PVC Face
  const backMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    map: backTex,
    roughness: 0.12,
    metalness: 0.02,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    ior: 1.52,
    specularIntensity: 1.3,
    specularColor: '#ffffff',
    iridescence: 0.38,
    iridescenceIOR: 1.35,
    iridescenceThicknessRange: [120, 380],
    reflectivity: 0.95
  }), [backTex])

  // Woven Ribbon Strap Material
  const strapMat = useMemo(() => new THREE.MeshStandardMaterial({
    map: lanyardTex,
    side: THREE.DoubleSide,
    roughness: 0.72,
    metalness: 0.05,
  }), [lanyardTex])

  // Rope joints setup for authentic cloth-like physics
  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1])
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1])
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1])
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.34, 0]])

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab'
      return () => void (document.body.style.cursor = 'auto')
    }
  }, [hovered, dragged])

  useFrame((state) => {
    const time = state.clock.elapsedTime

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
    } else {
      // Gentle ambient breathing sway when idle for realistic physical presence
      if (card.current && !dragged) {
        const swayX = Math.sin(time * 1.3) * 0.008
        const swayY = Math.cos(time * 0.9) * 0.006
        const mouseParallax = hovered ? state.pointer.x * 0.35 : 0

        ang.copy(card.current.angvel())
        rot.copy(card.current.rotation())
        
        // Restorative torque facing user + organic breathing
        card.current.setAngvel({
          x: ang.x * 0.95 + swayX,
          y: ang.y - (rot.y - mouseParallax) * 0.28 + swayY,
          z: ang.z * 0.95
        })
      }
    }

    if (fixed.current && card.current && j1.current && j2.current && j3.current) {
      curve.points[0].copy(j3.current.translation())
      curve.points[1].copy(j2.current.translation())
      curve.points[2].copy(j1.current.translation())
      curve.points[3].copy(fixed.current.translation())

      updateRibbon(ribbonGeo, curve.getPoints(60), 0.17)
      if (!ribbonReady) setRibbonReady(true)
    }
  })

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} angularDamping={2.2} linearDamping={2.2} type="fixed" />

        <RigidBody position={[0, -0.8, 0]} ref={j1} angularDamping={1.8} linearDamping={1.8}>
          <BallCollider args={[0.1]} />
        </RigidBody>

        <RigidBody position={[0, -1.6, 0]} ref={j2} angularDamping={1.8} linearDamping={1.8}>
          <BallCollider args={[0.1]} />
        </RigidBody>

        <RigidBody position={[0, -2.4, 0]} ref={j3} angularDamping={1.8} linearDamping={1.8}>
          <BallCollider args={[0.1]} />
        </RigidBody>

        {/* ── 3D ID Card Rigid Body ── */}
        <RigidBody
          position={[0, -3.8, 0]}
          ref={card}
          angularDamping={2.0}
          linearDamping={2.0}
          type={dragged ? 'kinematicPosition' : 'dynamic'}
        >
          <CuboidCollider args={[0.77, 1.09, 0.02]} />

          {/* Interactive Card Group */}
          <group
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e) => {
              e.stopPropagation()
              e.target.releasePointerCapture(e.pointerId)
              drag(false)
            }}
            onPointerDown={(e) => {
              e.stopPropagation()
              e.target.setPointerCapture(e.pointerId)
              drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())))
            }}
          >
            {/* Beveled Card Solid Core */}
            <mesh geometry={cardBodyGeo} material={bodyMat} castShadow receiveShadow />

            {/* Front PVC Holographic Face */}
            <mesh position={[0, 0, 0.026]} geometry={cardFaceGeo} material={frontMat} castShadow />

            {/* Back PVC Face */}
            <mesh position={[0, 0, -0.026]} rotation={[0, Math.PI, 0]} geometry={cardFaceGeo} material={backMat} />

            {/* Chrome Eyelet Grommet */}
            <SlottedGrommet position={[0, 0.91, 0]} />
          </group>

          {/* Detailed Chrome Lobster Snap Hook */}
          <LobsterClaw position={[0, 1.10, 0]} />
        </RigidBody>
      </group>

      {/* Branded Woven Ribbon Strap */}
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

// ── Loading Fallback ────────────────────────────────────────────────────────
function Loader() {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full gap-3">
      <div className="w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
      <span className="text-xs text-white/40 tracking-widest uppercase">Rendering 3D Badge</span>
    </div>
  )
}

// ── Main Badge3D Container ──────────────────────────────────────────────────
export default function Badge3D() {
  return (
    <div
      className="relative w-full h-[520px] sm:h-[640px] flex items-center justify-center rounded-2xl overflow-hidden shadow-2xl border border-white/5"
      style={{
        background: 'radial-gradient(circle at center, #111827 0%, #08090d 60%, #030407 100%)'
      }}
    >
      {/* Subtle glowing backdrop highlight behind badge */}
      <div
        className="absolute w-72 h-72 rounded-full pointer-events-none blur-[100px] opacity-30"
        style={{
          background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)',
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      />

      {/* Interactive Drag Hint */}
      <div
        className="absolute top-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[0.68rem] tracking-widest uppercase backdrop-blur-md bg-white/[0.04] border border-white/10 text-slate-300 shadow-lg"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
        <span>Drag & Interact with Badge</span>
      </div>

      <Suspense fallback={<Loader />}>
        <Canvas
          camera={{ position: [0, 0, 13], fov: 22 }}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          gl={{ alpha: true, antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
        >
          {/* Studio 3-Point Cinematic Lighting for Realistic Specular & Sheen */}
          <ambientLight intensity={0.55} />
          
          {/* Main Key Light */}
          <directionalLight position={[3, 8, 6]} intensity={2.8} color="#ffffff" />
          
          {/* Cool Rim / Edge Highlight */}
          <directionalLight position={[-6, 4, -4]} intensity={1.4} color="#93c5fd" />
          
          {/* Soft Fill Light */}
          <pointLight position={[-4, -2, 5]} intensity={1.2} color="#e2e8f0" />
          <pointLight position={[4, 2, 4]} intensity={1.5} color="#60a5fa" />
          
          {/* Bottom subtle uplight */}
          <pointLight position={[0, -5, 3]} intensity={0.6} color="#3b82f6" />

          {/* HDR Studio Environment */}
          <Environment preset="city" />

          <Physics debug={false} gravity={[0, -20, 0]} timeStep={1 / 60}>
            <Band />
          </Physics>
        </Canvas>
      </Suspense>

      {/* Bottom Subtitle Label */}
      <div className="absolute bottom-3 left-0 right-0 z-10 pointer-events-none text-center">
        <span
          className="text-[0.62rem] uppercase tracking-[0.22em] text-slate-500 font-medium"
        >
          San Project • 3D Interactive ID Badge
        </span>
      </div>
    </div>
  )
}

import React, { useRef, useState, useMemo, useEffect, Suspense } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { useTexture, Environment } from '@react-three/drei'
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier'
import * as THREE from 'three'

// ── Branded Lanyard Texture matching reference image ─────────────────────────
function makeLanyardTexture() {
  const W = 256, H = 1536
  const canvas = document.createElement('canvas')
  canvas.width = W; canvas.height = H
  const ctx = canvas.getContext('2d')

  // ── Base: deep black ──
  ctx.fillStyle = '#0a0a0c'
  ctx.fillRect(0, 0, W, H)

  // ── Subtle woven horizontal texture lines ──
  for (let y = 0; y < H; y += 2) {
    ctx.fillStyle = `rgba(255,255,255,${y % 4 === 0 ? 0.018 : 0.006})`
    ctx.fillRect(0, y, W, 1)
  }

  // ── Large diagonal blue shape (left side, like reference) ──
  ctx.save()
  ctx.beginPath()
  // Big parallelogram-ish blue slash, top-left to bottom
  ctx.moveTo(-20, H * 0.15)
  ctx.lineTo(W * 0.55, H * 0.05)
  ctx.lineTo(W * 0.45, H * 0.45)
  ctx.lineTo(-20, H * 0.52)
  ctx.closePath()
  ctx.fillStyle = '#1a3ccc'
  ctx.fill()

  // Slightly lighter blue inner highlight
  ctx.beginPath()
  ctx.moveTo(-20, H * 0.17)
  ctx.lineTo(W * 0.40, H * 0.07)
  ctx.lineTo(W * 0.32, H * 0.38)
  ctx.lineTo(-20, H * 0.44)
  ctx.closePath()
  ctx.fillStyle = '#2255ee'
  ctx.fill()
  ctx.restore()

  // ── Second smaller diagonal blue shape (bottom half) ──
  ctx.save()
  ctx.beginPath()
  ctx.moveTo(-20, H * 0.62)
  ctx.lineTo(W * 0.50, H * 0.54)
  ctx.lineTo(W * 0.42, H * 0.72)
  ctx.lineTo(-20, H * 0.78)
  ctx.closePath()
  ctx.fillStyle = '#1540d0'
  ctx.fill()
  ctx.restore()

  // ── White diagonal stripe crossing the blue ──
  ctx.save()
  ctx.beginPath()
  ctx.moveTo(W * 0.30, H * 0.04)
  ctx.lineTo(W * 0.52, H * 0.04)
  ctx.lineTo(W * 0.38, H * 0.47)
  ctx.lineTo(W * 0.16, H * 0.47)
  ctx.closePath()
  ctx.fillStyle = 'rgba(255,255,255,0.88)'
  ctx.fill()
  ctx.restore()

  // ── Edge detail lines (fabric stitch) ──
  ctx.fillStyle = 'rgba(255,255,255,0.15)'
  ctx.fillRect(0, 0, 3, H)
  ctx.fillRect(W - 3, 0, 3, H)
  ctx.fillStyle = 'rgba(255,255,255,0.06)'
  ctx.fillRect(3, 0, 2, H)
  ctx.fillRect(W - 5, 0, 2, H)

  // ── Large "sann.my.id" text — printed vertically on strap ──
  ctx.save()
  ctx.translate(W * 0.72, H * 0.35)
  ctx.rotate(-Math.PI / 2)
  ctx.font = 'bold 38px Arial'
  ctx.fillStyle = 'rgba(255,255,255,0.92)'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('sann.my.id', 0, 0)
  ctx.restore()

  // ── "BEYOND THE FUTURE" tagline below main text ──
  ctx.save()
  ctx.translate(W * 0.72, H * 0.47)
  ctx.rotate(-Math.PI / 2)
  ctx.font = 'bold 13px Arial'
  ctx.fillStyle = 'rgba(255,255,255,0.55)'
  ctx.letterSpacing = '3px'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('BEYOND THE FUTURE', 0, 0)
  ctx.restore()

  // ── San Project circular logo badge in center-bottom ──
  const logoX = W * 0.62, logoY = H * 0.65
  const logoR = 28
  // Outer ring
  ctx.beginPath()
  ctx.arc(logoX, logoY, logoR, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(0,0,0,0.55)'
  ctx.fill()
  ctx.strokeStyle = 'rgba(255,255,255,0.35)'
  ctx.lineWidth = 2
  ctx.stroke()
  // Inner text "SAN\nPROJECT"
  ctx.fillStyle = 'rgba(255,255,255,0.90)'
  ctx.font = 'bold 9px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('SAN', logoX, logoY - 6)
  ctx.fillText('PROJECT', logoX, logoY + 6)

  // ── Blue safety clasp band at top ──
  ctx.fillStyle = '#1e40d4'
  ctx.fillRect(0, 0, W, 60)
  ctx.fillStyle = 'rgba(255,255,255,0.80)'
  ctx.font = 'bold 12px Arial'
  ctx.textAlign = 'center'
  ctx.fillText('sann.my.id', W / 2, 24)
  ctx.font = '9px Arial'
  ctx.fillStyle = 'rgba(255,255,255,0.50)'
  ctx.fillText('SAN PROJECT', W / 2, 42)

  // Bottom connector sleeve (dark fabric fold)
  ctx.fillStyle = '#181818'
  ctx.fillRect(0, H - 80, W, 80)
  ctx.fillStyle = 'rgba(255,255,255,0.10)'
  ctx.fillRect(W * 0.3, H - 80, W * 0.4, 4)
  ctx.fillRect(W * 0.3, H - 8, W * 0.4, 4)

  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = THREE.ClampToEdgeWrapping
  tex.wrapT = THREE.ClampToEdgeWrapping
  tex.needsUpdate = true
  return tex
}

// ── Ribbon Geometry (flat strap following physics curve) ──────────────────────
function updateRibbon(geo, points, halfW = 0.18) {
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

    // UV: u maps 0→1 across width, v maps 0→1 along full length (no repeat = single texture display)
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

// ── Card Geometry with Punch Hole ─────────────────────────────────────────────
function createCardWithHole(w = 1.55, h = 2.15, r = 0.10, holeR = 0.065, depth = 0.035) {
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

  // Punch hole near top center
  const holePath = new THREE.Path()
  const holeY = h / 2 - 0.18
  holePath.absarc(0, holeY, holeR, 0, Math.PI * 2, true)
  shape.holes.push(holePath)

  const extrudeSettings = {
    depth,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.008,
    bevelThickness: 0.006
  }

  const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings)
  geo.center()
  return geo
}

// ── Rounded Plane Geometry for Card Face Textures ─────────────────────────────
function createRoundedPlaneGeometry(w = 1.52, h = 2.12, r = 0.09) {
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

// ── Lobster Claw Snap Hook (matches reference image silver hook at bottom) ─────
function LobsterClaw({ position = [0, 0, 0] }) {
  const chromeMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#c8d0dc',
    metalness: 1.0,
    roughness: 0.05,
    clearcoat: 1.0,
    clearcoatRoughness: 0.03,
  }), [])

  const darkChromeMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#8a9aaa',
    metalness: 0.98,
    roughness: 0.12,
    clearcoat: 0.8,
    clearcoatRoughness: 0.06,
  }), [])

  return (
    <group position={position}>

      {/* ─── SWIVEL BARREL at top (where strap end attaches) ─── */}
      {/* Main barrel cylinder — horizontal axis */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.045, 0.045, 0.22, 28]} />
        <primitive object={chromeMat} />
      </mesh>
      {/* Barrel left cap */}
      <mesh position={[-0.112, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.054, 0.054, 0.016, 24]} />
        <primitive object={darkChromeMat} />
      </mesh>
      {/* Barrel right cap */}
      <mesh position={[0.112, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.054, 0.054, 0.016, 24]} />
        <primitive object={darkChromeMat} />
      </mesh>
      {/* Knurled groove rings */}
      {[-0.055, 0, 0.055].map((x, i) => (
        <mesh key={i} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.048, 0.048, 0.008, 24]} />
          <primitive object={darkChromeMat} />
        </mesh>
      ))}
      {/* Swivel pivot pin through barrel center */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.014, 0.014, 0.30, 16]} />
        <primitive object={chromeMat} />
      </mesh>

      {/* ─── CLAW BODY below swivel barrel ─── */}
      <group position={[0, -0.25, 0]}>
        {/* Top neck (connects barrel to claw body) */}
        <mesh position={[0, 0.14, 0]}>
          <cylinderGeometry args={[0.038, 0.038, 0.12, 24]} />
          <primitive object={chromeMat} />
        </mesh>

        {/* Claw oval body — right side straight wall */}
        <mesh position={[0.095, 0.04, 0]}>
          <cylinderGeometry args={[0.036, 0.036, 0.26, 22]} />
          <primitive object={chromeMat} />
        </mesh>

        {/* Claw oval body — left side straight wall */}
        <mesh position={[-0.095, 0.04, 0]}>
          <cylinderGeometry args={[0.036, 0.036, 0.26, 22]} />
          <primitive object={chromeMat} />
        </mesh>

        {/* Bottom curved jaw (D-arc) */}
        <mesh position={[0, -0.09, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.095, 0.036, 22, 36, Math.PI]} />
          <primitive object={chromeMat} />
        </mesh>

        {/* Top closing bar */}
        <mesh position={[0, 0.18, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.036, 0.036, 0.22, 20]} />
          <primitive object={chromeMat} />
        </mesh>

        {/* ─── Spring gate (plunger tongue on right side) ─── */}
        <group position={[0.095, 0.20, 0]}>
          {/* Gate body */}
          <mesh rotation={[0, 0, -0.22]}>
            <cylinderGeometry args={[0.026, 0.026, 0.18, 18]} />
            <primitive object={darkChromeMat} />
          </mesh>
          {/* Gate pivot ball at top */}
          <mesh position={[0.020, 0.095, 0]}>
            <sphereGeometry args={[0.026, 16, 16]} />
            <primitive object={darkChromeMat} />
          </mesh>
        </group>

        {/* ─── Inner keyring bar (passes through grommet hole) ─── */}
        <mesh position={[0, 0.18, 0.01]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.018, 0.018, 0.15, 14]} />
          <primitive object={darkChromeMat} />
        </mesh>
      </group>
    </group>
  )
}

// ── Chrome Grommet (eyelet around the punch hole) ─────────────────────────────
function Grommet({ position = [0, 0, 0] }) {
  const chromeMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#b0bec5',
    metalness: 1.0,
    roughness: 0.05,
    clearcoat: 1.0,
    clearcoatRoughness: 0.03,
  }), [])

  return (
    <group position={position}>
      {/* Outer ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.065, 0.018, 16, 32]} />
        <primitive object={chromeMat} />
      </mesh>
      {/* Inner lip front */}
      <mesh position={[0, 0, 0.022]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.052, 0.01, 12, 28]} />
        <primitive object={chromeMat} />
      </mesh>
      {/* Inner lip back */}
      <mesh position={[0, 0, -0.022]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.052, 0.01, 12, 28]} />
        <primitive object={chromeMat} />
      </mesh>
    </group>
  )
}

// ── Main Band + Card Component ────────────────────────────────────────────────
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

  // Load textures
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

  // Card body with hole + face planes
  const cardBodyGeo = useMemo(() => createCardWithHole(1.55, 2.15, 0.10, 0.065, 0.035), [])
  const cardFaceGeo = useMemo(() => createRoundedPlaneGeometry(1.52, 2.12, 0.09), [])

  // Materials
  const bodyMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#111114',
    roughness: 0.30,
    metalness: 0.5,
    clearcoat: 0.6,
    clearcoatRoughness: 0.15,
  }), [])

  const frontMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    map: frontTex,
    roughness: 0.18,
    metalness: 0.0,
    clearcoat: 0.6,
    clearcoatRoughness: 0.08,
    reflectivity: 0.6
  }), [frontTex])

  const backMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    map: backTex,
    roughness: 0.18,
    metalness: 0.0,
    clearcoat: 0.6,
    clearcoatRoughness: 0.08,
    reflectivity: 0.6
  }), [backTex])

  const strapMat = useMemo(() => new THREE.MeshStandardMaterial({
    map: lanyardTex,
    side: THREE.DoubleSide,
    roughness: 0.75,
    metalness: 0.0,
  }), [lanyardTex])

  // Physics joints
  // j3 connects to the swivel barrel top of the lobster claw → card joint anchor at top of card
  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1])
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1])
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1])
  // Anchor: j3 bottom [0,0,0] → card top at grommet level [0, 1.32, 0]
  // The 1.32 matches: card half-height 1.075 + grommet offset 0.88 re-centered ≈ card top
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.32, 0]])

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

      updateRibbon(ribbonGeo, curve.getPoints(60), 0.18)
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

        <RigidBody position={[0, -0.8, 0]} ref={j1} angularDamping={1.5} linearDamping={1.5}>
          <BallCollider args={[0.1]} />
        </RigidBody>

        <RigidBody position={[0, -1.6, 0]} ref={j2} angularDamping={1.5} linearDamping={1.5}>
          <BallCollider args={[0.1]} />
        </RigidBody>

        <RigidBody position={[0, -2.4, 0]} ref={j3} angularDamping={1.5} linearDamping={1.5}>
          <BallCollider args={[0.1]} />
        </RigidBody>

        {/* ── ID Card Rigid Body ── */}
        <RigidBody
          position={[0, -3.8, 0]}
          ref={card}
          angularDamping={2}
          linearDamping={2}
          type={dragged ? 'kinematicPosition' : 'dynamic'}
        >
          <CuboidCollider args={[0.78, 1.08, 0.018]} />

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
            {/* Dark card body with punch hole */}
            <mesh geometry={cardBodyGeo} material={bodyMat} />

            {/* Front face texture */}
            <mesh position={[0, 0, 0.024]} geometry={cardFaceGeo} material={frontMat} />

            {/* Back face texture */}
            <mesh position={[0, 0, -0.024]} rotation={[0, Math.PI, 0]} geometry={cardFaceGeo} material={backMat} />

            {/* Chrome grommet around punch hole */}
            <Grommet position={[0, 0.88, 0]} />
          </group>

          {/* Lobster claw — swivel barrel sits at card top, claw body hangs below the strap end */}
          {/* position Y: card half-height (1.075) + a bit above grommet = 1.08 */}
          <LobsterClaw position={[0, 1.08, 0]} />
        </RigidBody>
      </group>

      {/* Narrow branded lanyard strap */}
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

// ── Loading Fallback ──────────────────────────────────────────────────────────
function Loader() {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full gap-3">
      <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
      <span className="text-xs text-white/30 tracking-widest uppercase">Loading</span>
    </div>
  )
}

// ── Main Export ───────────────────────────────────────────────────────────────
export default function Badge3D() {
  return (
    <div className="relative w-full h-[520px] sm:h-[640px] flex items-center justify-center rounded-2xl overflow-hidden"
      style={{ background: '#080808' }}
    >
      {/* Very subtle vignette */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.7) 100%)'
        }}
      />

      {/* Drag hint */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none flex items-center gap-2 px-3 py-1.5 rounded-full text-[0.65rem] tracking-widest uppercase"
        style={{ color: 'rgba(255,255,255,0.35)' }}
      >
        <span>Drag the badge</span>
      </div>

      <Suspense fallback={<Loader />}>
        <Canvas
          camera={{ position: [0, 0, 13], fov: 22 }}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          gl={{ alpha: true, antialias: true }}
        >
          {/* Clean, balanced studio lighting for clear, vibrant card & realistic reflections */}
          <ambientLight intensity={0.9} />
          <directionalLight position={[0, 3, 10]} intensity={2.0} color="#ffffff" />
          <directionalLight position={[6, 8, 6]} intensity={1.5} color="#ffffff" />
          <directionalLight position={[-6, 4, 4]} intensity={1.0} color="#f1f5f9" />
          <pointLight position={[0, -4, 6]} intensity={0.8} color="#ffffff" />
          <Environment preset="studio" />

          <Physics debug={false} gravity={[0, -20, 0]} timeStep={1 / 60}>
            <Band />
          </Physics>
        </Canvas>
      </Suspense>

      {/* Bottom label */}
      <div className="absolute bottom-3 left-0 right-0 z-10 pointer-events-none text-center">
        <span className="text-[0.6rem] uppercase tracking-[0.2em]"
          style={{ color: 'rgba(255,255,255,0.18)' }}>
          San Project • ID Badge
        </span>
      </div>
    </div>
  )
}

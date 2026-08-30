import * as THREE from 'three'
import { useEffect, useRef, useState, Suspense, useMemo } from 'react'
import { Canvas, extend, useThree, useFrame } from '@react-three/fiber'
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei'
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier'
import { MeshLineGeometry, MeshLineMaterial } from 'meshline'

extend({ MeshLineGeometry, MeshLineMaterial })

const GLTF_URL = 'https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/5huRVDzcoDwnbgrKUo1Lzs/53b6dd7d6b4ffcdbd338fa60265949e1/tag.glb'
const BAND_URL = 'https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/SOT1hmCesOHxEYxL7vkoZ/c57b29c85912047c414311723320c16b/band.jpg'

useGLTF.preload(GLTF_URL)
useTexture.preload(BAND_URL)
useTexture.preload('/badge-front.jpg')
useTexture.preload('/badge-back.jpg')

// ── Mathematically precise texture atlas for tag.glb UV layout ──────────────
function useBadgeTexture() {
  const [frontTex, backTex] = useTexture(['/badge-front.jpg', '/badge-back.jpg'])

  const atlasTexture = useMemo(() => {
    if (!frontTex?.image) return frontTex

    const canvas = document.createElement('canvas')
    const size = 2048
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')

    // Clean dark background
    ctx.fillStyle = '#060913'
    ctx.fillRect(0, 0, size, size)

    // tag.glb UV specifications:
    // Front face (normal +Z): U ∈ [0.0, 0.50], V ∈ [0.0, 0.755]
    // Back face (normal -Z):  U ∈ [0.50, 1.0], V ∈ [0.0, 0.755]
    const cardW = size * 0.50      // 1024 px
    const cardH = size * 0.755     // 1546 px

    // Draw Front Face (left quadrant)
    if (frontTex?.image) {
      ctx.drawImage(frontTex.image, 0, 0, cardW, cardH)
    }

    // Draw Back Face (right quadrant)
    if (backTex?.image) {
      ctx.drawImage(backTex.image, cardW, 0, cardW, cardH)
    } else if (frontTex?.image) {
      ctx.drawImage(frontTex.image, cardW, 0, cardW, cardH)
    }

    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 16
    tex.flipY = false
    tex.minFilter = THREE.LinearMipmapLinearFilter
    tex.magFilter = THREE.LinearFilter
    tex.needsUpdate = true
    return tex
  }, [frontTex, backTex])

  return atlasTexture
}

function Band({ maxSpeed = 50, minSpeed = 10 }) {
  const band = useRef()
  const fixed = useRef()
  const j1 = useRef()
  const j2 = useRef()
  const j3 = useRef()
  const card = useRef()

  const vec = useMemo(() => new THREE.Vector3(), [])
  const ang = useMemo(() => new THREE.Vector3(), [])
  const rot = useMemo(() => new THREE.Vector3(), [])
  const dir = useMemo(() => new THREE.Vector3(), [])

  const segmentProps = {
    type: 'dynamic',
    canSleep: true,
    colliders: false,
    angularDamping: 2,
    linearDamping: 2
  }

  const { nodes, materials } = useGLTF(GLTF_URL)
  const texture = useTexture(BAND_URL)
  const badgeTexture = useBadgeTexture()
  const { width, height } = useThree((state) => state.size)

  const [curve] = useState(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(),
    new THREE.Vector3(),
    new THREE.Vector3(),
    new THREE.Vector3()
  ]))

  const [dragged, drag] = useState(false)
  const [hovered, hover] = useState(false)

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

  useFrame((state, delta) => {
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

    if (fixed.current && card.current && j1.current && j2.current && j3.current && band.current) {
      // Fix jitter when over-pulling the card
      ;[j1, j2].forEach((ref) => {
        if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation())
        const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())))
        ref.current.lerped.lerp(ref.current.translation(), delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)))
      })

      // Calculate catmull curve
      curve.points[0].copy(j3.current.translation())
      curve.points[1].copy(j2.current.lerped || j2.current.translation())
      curve.points[2].copy(j1.current.lerped || j1.current.translation())
      curve.points[3].copy(fixed.current.translation())

      band.current.geometry.setPoints(curve.getPoints(32))

      // Tilt it back towards the screen
      ang.copy(card.current.angvel())
      rot.copy(card.current.rotation())
      card.current.setAngvel({
        x: ang.x,
        y: ang.y - rot.y * 0.25,
        z: ang.z
      })
    }
  })

  curve.curveType = 'chordal'
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />

        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>

        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>

        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>

        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? 'kinematicPosition' : 'dynamic'}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />

          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e) => {
              e.target.releasePointerCapture(e.pointerId)
              drag(false)
            }}
            onPointerDown={(e) => {
              e.target.setPointerCapture(e.pointerId)
              drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())))
            }}
          >
            {/* Card with 100% complete, uncropped texture atlas matching tag.glb */}
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                map={badgeTexture || materials.base.map}
                map-anisotropy={16}
                clearcoat={1}
                clearcoatRoughness={0.15}
                roughness={0.3}
                metalness={0.5}
              />
            </mesh>

            {/* Original Clip & Clamp */}
            <mesh
              geometry={nodes.clip.geometry}
              material={materials.metal}
              material-roughness={0.3}
            />
            <mesh
              geometry={nodes.clamp.geometry}
              material={materials.metal}
            />
          </group>
        </RigidBody>
      </group>

      {/* Ribbon band */}
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={[width, height]}
          useMap
          map={texture}
          repeat={[-3, 1]}
          lineWidth={1}
        />
      </mesh>
    </>
  )
}

function Loader() {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full gap-3">
      <div className="w-7 h-7 border-2 border-white/15 border-t-white rounded-full animate-spin" />
      <span className="text-[0.68rem] text-zinc-500 tracking-widest uppercase font-mono">Rendering 3D Badge</span>
    </div>
  )
}

export default function Badge3D() {
  return (
    <div
      className="relative w-full h-[460px] sm:h-[520px] lg:h-[580px] flex items-center justify-center rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-white/[0.06]"
      style={{
        background: 'radial-gradient(circle at 0% 0%, #202026 0%, #0f0f13 35%, #07070a 65%, #000000 100%)'
      }}
    >
      {/* Corner ambient light glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 0% 0%, rgba(255,255,255,0.05) 0%, transparent 55%)'
        }}
      />

      {/* Minimalist Top Drag Hint */}
      <div
        className="absolute top-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none flex items-center gap-2 px-3.5 py-1 rounded-full text-[0.62rem] tracking-[0.2em] uppercase text-zinc-400 backdrop-blur-md bg-white/[0.04] border border-white/[0.08] shadow-lg"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span>Drag & Interact with Badge</span>
      </div>

      <Suspense fallback={<Loader />}>
        <Canvas
          camera={{ position: [0, 0, 13], fov: 25 }}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          gl={{ alpha: true, antialias: true }}
        >
          <ambientLight intensity={Math.PI} />

          <Physics debug={false} interpolate gravity={[0, -40, 0]} timeStep={1 / 60}>
            <Band />
          </Physics>

          <Environment background={false} blur={0.75}>
            <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
            <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
            <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
            <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
          </Environment>
        </Canvas>
      </Suspense>

      {/* Bottom Minimalist Subtitle */}
      <div className="absolute bottom-3.5 left-0 right-0 z-10 pointer-events-none text-center">
        <span
          className="text-[0.62rem] uppercase tracking-[0.25em] text-white/20 font-medium"
        >
          San Project • 3D Interactive ID Badge
        </span>
      </div>
    </div>
  )
}

import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// A slowly rotating 3D "community network": each glowing dot is a mom,
// each line a connection, and the larger pulsing spheres are community hubs.
// It follows the mouse slightly for a parallax effect.

const PALETTE = ['#7a3b7d', '#e8735a', '#d9a23a', '#4f8a6e', '#b0577a']

const mouse = { x: 0, y: 0 }
if (typeof window !== 'undefined') {
  window.addEventListener('pointermove', e => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1
    mouse.y = -((e.clientY / window.innerHeight) * 2 - 1)
  })
}

// Seeded random so the network looks the same on every load.
function rng(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function dotTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const g = c.getContext('2d')
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32)
  grd.addColorStop(0, 'rgba(255,255,255,1)')
  grd.addColorStop(0.45, 'rgba(255,255,255,0.9)')
  grd.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = grd
  g.fillRect(0, 0, 64, 64)
  return new THREE.CanvasTexture(c)
}

function Network({ count, radius, size, linkDist, lineOpacity, speed, hubCount }) {
  const group = useRef()
  const hubs = useRef([])
  const tex = useMemo(dotTexture, [])

  const data = useMemo(() => {
    const r = rng(7)
    const pos = new Float32Array(count * 3), col = new Float32Array(count * 3), pts = []
    const c = new THREE.Color()
    for (let i = 0; i < count; i++) {
      const u = r() * 2 - 1, th = r() * Math.PI * 2, rr = radius * (0.55 + 0.45 * Math.cbrt(r()))
      const s = Math.sqrt(1 - u * u)
      const p = new THREE.Vector3(rr * s * Math.cos(th), rr * u * 0.75, rr * s * Math.sin(th))
      pts.push(p)
      pos.set([p.x, p.y, p.z], i * 3)
      c.set(PALETTE[Math.floor(r() * PALETTE.length)])
      col.set([c.r, c.g, c.b], i * 3)
    }
    const lines = []
    for (let i = 0; i < count; i++)
      for (let j = i + 1; j < count; j++)
        if (pts[i].distanceTo(pts[j]) < linkDist) lines.push(pts[i].x, pts[i].y, pts[i].z, pts[j].x, pts[j].y, pts[j].z)
    const step = Math.floor(count / hubCount)
    const hubList = Array.from({ length: hubCount }, (_, k) => ({ p: pts[k * step], color: PALETTE[k % PALETTE.length] }))
    return { pos, col, lines: new Float32Array(lines), hubs: hubList }
  }, [count, radius, linkDist, hubCount])

  useFrame((state, dt) => {
    const g = group.current
    g.rotation.y += dt * speed
    g.rotation.x += (mouse.y * 0.25 - g.rotation.x) * 0.04
    g.position.x += (mouse.x * 0.3 - g.position.x) * 0.03
    const t = state.clock.elapsedTime
    hubs.current.forEach((m, i) => m && m.scale.setScalar(1 + Math.sin(t * 1.6 + i) * 0.18))
  })

  return (
    <group ref={group}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[data.pos, 3]} />
          <bufferAttribute attach="attributes-color" args={[data.col, 3]} />
        </bufferGeometry>
        <pointsMaterial size={size} map={tex} vertexColors transparent depthWrite={false} sizeAttenuation />
      </points>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[data.lines, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#7a3b7d" transparent opacity={lineOpacity} depthWrite={false} />
      </lineSegments>
      {data.hubs.map((h, i) => (
        <mesh key={i} position={h.p} ref={el => (hubs.current[i] = el)}>
          <sphereGeometry args={[size * 0.85, 24, 24]} />
          <meshStandardMaterial color={h.color} emissive={h.color} emissiveIntensity={0.55} roughness={0.35} />
        </mesh>
      ))}
    </group>
  )
}

const VARIANTS = {
  hero: { count: 70, radius: 2.6, size: 0.17, linkDist: 1.05, lineOpacity: 0.3, speed: 0.12, hubCount: 6, z: 6 },
  background: { count: 130, radius: 6, size: 0.13, linkDist: 1.5, lineOpacity: 0.15, speed: 0.04, hubCount: 8, z: 8 }
}

export default function Constellation({ variant = 'hero' }) {
  const { z, ...cfg } = VARIANTS[variant]
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 0, z], fov: 50 }} gl={{ antialias: true, alpha: true }} style={{ pointerEvents: 'none' }}>
      <ambientLight intensity={0.9} />
      <pointLight position={[4, 4, 6]} intensity={40} />
      <Network {...cfg} />
    </Canvas>
  )
}

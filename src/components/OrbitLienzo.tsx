import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

interface PropiedadesLienzo {
  alCargar?: () => void
  referenciaBurbuja: React.RefObject<HTMLDivElement | null>
}

export const OrbitLienzo: React.FC<PropiedadesLienzo> = ({ alCargar, referenciaBurbuja }) => {
  const referenciaContenedor = useRef<HTMLDivElement>(null)
  // Ref para el callback — evita stale closure sin incluir en deps
  const alCargarRef = useRef(alCargar)
  alCargarRef.current = alCargar

  useEffect(() => {
    if (!referenciaContenedor.current) return
    const contenedorDOM = referenciaContenedor.current

    // ─── Crear instancias Three.js DENTRO del effect ───────────────────────────
    // (Esto corrige el doble-canvas en React.StrictMode que monta efectos 2 veces)
    const escena = new THREE.Scene()
    const camara = new THREE.PerspectiveCamera(35, 1, 0.1, 100)
    const renderizador = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })

    // Estado mutable local al effect
    const st = {
      objetoPrincipal: null as THREE.Group | null,
      satelites: null as THREE.Points | null,
      luzMouse: null as THREE.PointLight | null,
      mouseNDC: new THREE.Vector2(0, 0),
      mouseGlobal: new THREE.Vector3(0, 0, 0),
      reloj: new THREE.Clock(),
      idRaf: 0,
      raycaster: new THREE.Raycaster(),
      plano: new THREE.Plane(new THREE.Vector3(0, 0, 1), 0),
      uniformesMat: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector3(99, 99, 99) },
      },
    }

    const _v3 = new THREE.Vector3()

    // ─── Renderer ─────────────────────────────────────────────────────────────
    renderizador.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderizador.toneMapping = THREE.ACESFilmicToneMapping
    renderizador.toneMappingExposure = 1.8
    contenedorDOM.appendChild(renderizador.domElement)
    camara.position.z = 10

    // ─── Iluminación (alta luminosidad) ───────────────────────────────────────
    escena.add(new THREE.AmbientLight(0xffffff, 1.4))
    const luzDir = new THREE.DirectionalLight(0xffffff, 2.8)
    luzDir.position.set(5, 5, 8)
    escena.add(luzDir)
    const luzDir2 = new THREE.DirectionalLight(0xaaddff, 1.2)
    luzDir2.position.set(-4, -2, 6)
    escena.add(luzDir2)

    const luzPunto = new THREE.PointLight(0x00e5ff, 45, 12, 2)
    escena.add(luzPunto)
    st.luzMouse = luzPunto

    const luzContorno = new THREE.SpotLight(0x7c4dff, 80)
    luzContorno.position.set(-5, 5, -5)
    escena.add(luzContorno)

    // ─── Carga del modelo GLTF ────────────────────────────────────────────────
    new GLTFLoader().load('/models/orbit-head.glb', (gltf) => {
      const caja   = new THREE.Box3().setFromObject(gltf.scene)
      const centro = caja.getCenter(new THREE.Vector3())
      const tamano = caja.getSize(new THREE.Vector3())
      const dimMax = Math.max(tamano.x, tamano.y, tamano.z)

      gltf.scene.position.sub(centro)
      gltf.scene.scale.set(1 / dimMax, 1 / dimMax, 1 / dimMax)

      const contenedor = new THREE.Group()
      contenedor.add(gltf.scene)
      contenedor.scale.set(5.5, 5.5, 5.5)
      contenedor.rotation.y = -Math.PI / 2
      escena.add(contenedor)
      st.objetoPrincipal = contenedor

      // Inyección de shaders
      gltf.scene.traverse((hijo) => {
        if ((hijo as THREE.Mesh).isMesh) {
          const malla = hijo as THREE.Mesh
          if (malla.material) {
            const mats = Array.isArray(malla.material) ? malla.material : [malla.material]
            mats.forEach((mat) => {
              mat.onBeforeCompile = (shader) => {
                shader.uniforms.uTime  = st.uniformesMat.uTime
                shader.uniforms.uMouse = st.uniformesMat.uMouse
                shader.vertexShader = `
                  uniform float uTime;
                  uniform vec3 uMouse;
                  varying float vDist;
                  ${shader.vertexShader}
                `
                shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', `
                  #include <begin_vertex>
                  vec4 pGlobal = modelMatrix * vec4(position, 1.0);
                  vDist = distance(pGlobal.xyz, uMouse);
                  float d = smoothstep(2.5, 0.0, vDist);
                  transformed += normal * (sin(uTime * 15.0 + vDist * 10.0) * 0.04 * d);
                  transformed += (uMouse - pGlobal.xyz) * 0.1 * d;
                `)
                shader.fragmentShader = `
                  varying float vDist;
                  ${shader.fragmentShader}
                `
                shader.fragmentShader = shader.fragmentShader.replace('#include <dithering_fragment>', `
                  #include <dithering_fragment>
                  float gBrillo = smoothstep(1.5, 0.0, vDist);
                  gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.0, 0.7, 1.0) * 2.5, gBrillo * 0.6);
                `)
              }
            })
          }
        }
      })

      if (alCargarRef.current) alCargarRef.current()
    })

    // ─── Satélites / partículas ───────────────────────────────────────────────
    const cantSat = 400
    const arrPosSat = new Float32Array(cantSat * 3)
    for (let i = 0; i < cantSat; i++) {
      const radio = 4 + Math.random() * 3
      const theta = Math.random() * Math.PI * 2
      const phi   = Math.acos(2 * Math.random() - 1)
      arrPosSat[i * 3]     = radio * Math.sin(phi) * Math.cos(theta)
      arrPosSat[i * 3 + 1] = radio * Math.sin(phi) * Math.sin(theta)
      arrPosSat[i * 3 + 2] = radio * Math.cos(phi)
    }
    const geoSat = new THREE.BufferGeometry()
    geoSat.setAttribute('position', new THREE.BufferAttribute(arrPosSat, 3))
    const satelites = new THREE.Points(
      geoSat,
      new THREE.PointsMaterial({ color: 0x66ccff, size: 0.03, transparent: true, opacity: 0.6 })
    )
    escena.add(satelites)
    st.satelites = satelites

    // ─── ResizeObserver ───────────────────────────────────────────────────────
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        if (width === 0 || height === 0) continue
        camara.aspect = width / height
        camara.updateProjectionMatrix()
        renderizador.setSize(width, height)
      }
    })
    resizeObserver.observe(contenedorDOM)

    // ─── Eventos de mouse / touch ─────────────────────────────────────────────
    const actualizarMouseNDC = (clientX: number, clientY: number) => {
      const rect = contenedorDOM.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return
      st.mouseNDC.x =  ((clientX - rect.left) / rect.width)  * 2 - 1
      st.mouseNDC.y = -((clientY - rect.top)  / rect.height) * 2 + 1
    }
    const onMouseMove = (ev: MouseEvent) => actualizarMouseNDC(ev.clientX, ev.clientY)
    const onTouch     = (ev: TouchEvent) => {
      if (ev.touches.length > 0) actualizarMouseNDC(ev.touches[0].clientX, ev.touches[0].clientY)
    }
    const onTouchEnd  = () => st.mouseNDC.set(0, 0)

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('touchstart', onTouch)
    window.addEventListener('touchmove', onTouch)
    window.addEventListener('touchend', onTouchEnd)

    // ─── Loop de animación ────────────────────────────────────────────────────
    const animar = () => {
      st.idRaf = requestAnimationFrame(animar)
      const t = st.reloj.getElapsedTime()
      st.uniformesMat.uTime.value = t

      st.raycaster.setFromCamera(st.mouseNDC, camara)
      if (st.raycaster.ray.intersectPlane(st.plano, _v3)) {
        st.mouseGlobal.lerp(_v3, 0.1)
        st.uniformesMat.uMouse.value.copy(st.mouseGlobal)
        if (st.luzMouse) {
          st.luzMouse.position.copy(st.mouseGlobal)
          st.luzMouse.position.z = 2
          st.luzMouse.intensity  = 15 + Math.sin(t * 10) * 5
        }
      }

      const rotY = st.mouseNDC.x * 0.3 + Math.sin(t * 0.5) * 0.05
      const rotX = -st.mouseNDC.y * 0.2 + Math.cos(t * 0.8) * 0.02

      if (st.objetoPrincipal) {
        st.objetoPrincipal.rotation.y += (-Math.PI / 2 + rotY - st.objetoPrincipal.rotation.y) * 0.05
        st.objetoPrincipal.rotation.x += (rotX - st.objetoPrincipal.rotation.x) * 0.05
        st.objetoPrincipal.position.y  = Math.sin(t * 1.5) * 0.1
      }
      if (st.satelites) {
        st.satelites.rotation.y += (rotY * 0.8 - st.satelites.rotation.y) * 0.02
        st.satelites.rotation.x += (rotX * 0.8 - st.satelites.rotation.x) * 0.02
      }

      // Posición de la burbuja
      if (st.objetoPrincipal && referenciaBurbuja.current) {
        st.objetoPrincipal.getWorldPosition(_v3)
        _v3.y -= 2.8
        _v3.project(camara)
        const rect = contenedorDOM.getBoundingClientRect()
        if (rect.width > 0 && rect.height > 0) {
          const x = (_v3.x * 0.5 + 0.5) * rect.width
          const y = (-_v3.y * 0.5 + 0.5) * rect.height
          referenciaBurbuja.current.style.transform = `translate(${x}px, ${y}px) translate(-50%, 0%)`
        }
      }

      renderizador.render(escena, camara)
    }
    animar()

    // ─── Cleanup (también corre en StrictMode al desmontar el 1er mount) ──────
    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('touchstart', onTouch)
      window.removeEventListener('touchmove', onTouch)
      window.removeEventListener('touchend', onTouchEnd)
      cancelAnimationFrame(st.idRaf)

      // Dispose renderer + scene
      renderizador.dispose()
      if (contenedorDOM.contains(renderizador.domElement)) {
        contenedorDOM.removeChild(renderizador.domElement)
      }
      escena.traverse((obj: any) => {
        if (obj.geometry) obj.geometry.dispose()
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m: any) => m.dispose())
          else obj.material.dispose()
        }
      })
      escena.clear()
    }
  // referenciaBurbuja es un ref estable; alCargar se lee via alCargarRef
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const alHacerClick = () => window.open('https://wa.me/573000000000', '_blank')

  return (
    <div
      ref={referenciaContenedor}
      onClick={alHacerClick}
      style={{ width: '100%', height: '100%', position: 'relative', cursor: 'pointer' }}
      className="orbit-container"
    />
  )
}

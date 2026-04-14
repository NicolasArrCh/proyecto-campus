import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

interface PropiedadesLienzo {
  alCargar?: () => void
  referenciaBurbuja: React.RefObject<HTMLDivElement | null>
}

export const OrbitLienzo: React.FC<PropiedadesLienzo> = ({ alCargar, referenciaBurbuja }) => {
  const referenciaContenedor = useRef<HTMLDivElement>(null)

  // Referencias internas de THREE
  const e = useRef({
    escena: new THREE.Scene(),
    camara: new THREE.PerspectiveCamera(35, 1, 0.1, 100),
    renderizador: new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' }),
    objetoPrincipal: null as THREE.Group | null,
    satelites: null as THREE.Points | null,
    luzMouse: null as THREE.PointLight | null,
    mouseNDC: new THREE.Vector2(0, 0),
    mouseGlobal: new THREE.Vector3(0, 0, 0),
    reloj: new THREE.Clock(),
    idRaf: 0,
    raycaster: new THREE.Raycaster(),
    plano: new THREE.Plane(new THREE.Vector3(0, 0, 1), 0),
    interaccionActiva: false,
    uniformesMat: {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector3(99, 99, 99) }
    }
  })

  const _v3 = new THREE.Vector3()

  useEffect(() => {
    if (!referenciaContenedor.current) return
    const contenedorDOM = referenciaContenedor.current
    const { escena, camara, renderizador } = e.current

    renderizador.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    contenedorDOM.appendChild(renderizador.domElement)
    camara.position.z = 10

    // Configuración de Iluminación
    escena.add(new THREE.AmbientLight(0xffffff, 0.4))
    const luzDir = new THREE.DirectionalLight(0xffffff, 1.2)
    luzDir.position.set(5, 5, 8)
    escena.add(luzDir)

    const luzPunto = new THREE.PointLight(0x00e5ff, 20, 10, 2)
    escena.add(luzPunto)
    e.current.luzMouse = luzPunto

    const luzContorno = new THREE.SpotLight(0x7c4dff, 50)
    luzContorno.position.set(-5, 5, -5)
    escena.add(luzContorno)

    escena.fog = new THREE.FogExp2(0x000000, 0.08)

    // Carga del Modelo 3D
    new GLTFLoader().load('/models/orbit-head.glb', (gltf) => {
      const caja = new THREE.Box3().setFromObject(gltf.scene)
      const centro = caja.getCenter(new THREE.Vector3())
      const tamano = caja.getSize(new THREE.Vector3())
      const dimMax = Math.max(tamano.x, tamano.y, tamano.z)

      gltf.scene.position.sub(centro)
      gltf.scene.scale.set(1.0 / dimMax, 1.0 / dimMax, 1.0 / dimMax)

      const contenedor = new THREE.Group()
      contenedor.add(gltf.scene)

      // Escala responsiva ajustada al contenedor 
      const escalaFinal = 5.5
      contenedor.scale.set(escalaFinal, escalaFinal, escalaFinal)
      contenedor.rotation.y = -Math.PI / 2

      escena.add(contenedor)
      e.current.objetoPrincipal = contenedor

      // Inyección de Shaders
      gltf.scene.traverse((hijo) => {
        if ((hijo as THREE.Mesh).isMesh) {
          const malla = hijo as THREE.Mesh
          if (malla.material) {
            const materiales = Array.isArray(malla.material) ? malla.material : [malla.material]
            materiales.forEach((mat) => {
              mat.onBeforeCompile = (shader) => {
                shader.uniforms.uTime = e.current.uniformesMat.uTime
                shader.uniforms.uMouse = e.current.uniformesMat.uMouse
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

      if (alCargar) alCargar()
    })
    
    const cantSat = 400
    const arrPosSat = new Float32Array(cantSat * 3)
    for (let i = 0; i < cantSat; i++) {
      const radio = 4.0 + Math.random() * 3.0
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      arrPosSat[i * 3] = radio * Math.sin(phi) * Math.cos(theta)
      arrPosSat[i * 3 + 1] = radio * Math.sin(phi) * Math.sin(theta)
      arrPosSat[i * 3 + 2] = radio * Math.cos(phi)
    }
    const geoSat = new THREE.BufferGeometry()
    geoSat.setAttribute('position', new THREE.BufferAttribute(arrPosSat, 3))
    const satelites = new THREE.Points(geoSat, new THREE.PointsMaterial({ color: 0x66ccff, size: 0.03, transparent: true, opacity: 0.6 }))
    escena.add(satelites)
    e.current.satelites = satelites

    // Redimensionar usando ResizeObserver para ajustarse al placeholder
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        if(width === 0 || height === 0) continue
        camara.aspect = width / height
        camara.updateProjectionMatrix()
        renderizador.setSize(width, height)
      }
    })
    resizeObserver.observe(contenedorDOM)

    // Eventos interactivos locales al bounding box
    const actualizarMouseNDC = (clientX: number, clientY: number) => {
      const rect = contenedorDOM.getBoundingClientRect()
      const x = clientX - rect.left
      const y = clientY - rect.top
      e.current.mouseNDC.x = (x / rect.width) * 2 - 1
      e.current.mouseNDC.y = -(y / rect.height) * 2 + 1
    }

    const alMoverMouse = (evento: MouseEvent) => {
      actualizarMouseNDC(evento.clientX, evento.clientY)
    }

    const alTocar = (evento: TouchEvent) => {
      e.current.interaccionActiva = true
      if (evento.touches.length > 0) {
        actualizarMouseNDC(evento.touches[0].clientX, evento.touches[0].clientY)
      }
    }

    const alSoltarToque = () => {
      e.current.interaccionActiva = false
      e.current.mouseNDC.set(0, 0)
    }

    // Agregar eventos al DOCUMENT global para que atrape movimientos aunque salgan un poco del borde,
    // pero calculando en base al bouding box. O agregar al contenedor. Agregaremos al window pero limitaremos si no interactúa? 
    // Lo más seguro es window, pasándola a local:
    window.addEventListener('mousemove', alMoverMouse)
    window.addEventListener('touchstart', alTocar)
    window.addEventListener('touchmove', alTocar)
    window.addEventListener('touchend', alSoltarToque)

    const animar = () => {
      e.current.idRaf = requestAnimationFrame(animar)
      const t = e.current.reloj.getElapsedTime()
      e.current.uniformesMat.uTime.value = t

      const interactuando = e.current.interaccionActiva || true // podemos mantenerlo activo si es desktop interact

      e.current.raycaster.setFromCamera(e.current.mouseNDC, camara)
      if (e.current.raycaster.ray.intersectPlane(e.current.plano, _v3)) {
        e.current.mouseGlobal.lerp(_v3, 0.1)
        
        e.current.uniformesMat.uMouse.value.copy(e.current.mouseGlobal)
        
        if (e.current.luzMouse) {
          e.current.luzMouse.position.copy(e.current.mouseGlobal)
          e.current.luzMouse.position.z = 2
          e.current.luzMouse.intensity = (15 + Math.sin(t * 10) * 5)
        }
      }

      const rotY = e.current.mouseNDC.x * 0.3 + Math.sin(t * 0.5) * 0.05
      const rotX = -e.current.mouseNDC.y * 0.2 + Math.cos(t * 0.8) * 0.02

      if (e.current.objetoPrincipal) {
        e.current.objetoPrincipal.rotation.y += (-Math.PI / 2 + rotY - e.current.objetoPrincipal.rotation.y) * 0.05
        e.current.objetoPrincipal.rotation.x += (rotX - e.current.objetoPrincipal.rotation.x) * 0.05

        const offsetFlotacion = Math.sin(t * 1.5) * 0.1
        e.current.objetoPrincipal.position.y = offsetFlotacion
      }
      if (e.current.satelites) {
        e.current.satelites.rotation.y += (rotY * 0.8 - e.current.satelites.rotation.y) * 0.02
        e.current.satelites.rotation.x += (rotX * 0.8 - e.current.satelites.rotation.x) * 0.02
      }

      if (e.current.objetoPrincipal && referenciaBurbuja.current) {
        e.current.objetoPrincipal.getWorldPosition(_v3)

        // Adjust so bubble floats above the 3D head within the bounds
        _v3.y += 1.6 
        _v3.x += 0 

        _v3.project(camara)
        
        const rect = contenedorDOM.getBoundingClientRect()

        const x = (_v3.x * 0.5 + 0.5) * rect.width
        const y = (-_v3.y * 0.5 + 0.5) * rect.height

        // Make it relative to the container for standard absolutely positioned child
        referenciaBurbuja.current.style.transform = `translate(${x}px, ${y}px) translate(-50%, -100%)`
      }

      renderizador.render(escena, camara)
    }

    animar()

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('mousemove', alMoverMouse)
      window.removeEventListener('touchstart', alTocar)
      window.removeEventListener('touchmove', alTocar)
      window.removeEventListener('touchend', alSoltarToque)
      cancelAnimationFrame(e.current.idRaf)
      renderizador.dispose()
      if(contenedorDOM.contains(renderizador.domElement)) {
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
  }, [alCargar, referenciaBurbuja])

  const alHacerClick = () => {
    window.open('https://wa.me/573000000000', '_blank')
  }

  return <div ref={referenciaContenedor} onClick={alHacerClick} style={{ width: '100%', height: '100%', position: 'relative', cursor: 'pointer' }} className="orbit-container" />
}

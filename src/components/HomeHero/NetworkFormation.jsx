import { useEffect, useRef } from 'react'
import { AOT8_AFRICA_REFERENCE_GEOMETRY } from '../NetworkPrototype/africaReferenceGeometry'
import { AOT8_NODE_REFERENCE_GEOMETRY } from '../NetworkPrototype/nodeReferenceGeometry'
import { ethicsGeometry } from '../NetworkPrototype/ethicsReferenceGeometry'
import { governanceGeometry } from '../NetworkPrototype/governanceReferenceGeometry'
import { innovationGeometry } from '../NetworkPrototype/innovationBrainGeometry'
import { technologyGeometry } from '../NetworkPrototype/technologyReferenceGeometry'

const MAX_PIXEL_RATIO = 1.5
const CURSOR_RADIUS = 190
const NETWORK_HIT_RADIUS = 44
const CONNECTION_DISTANCE = 118
const FORMATION_SPRING = 0.00145
const VELOCITY_DAMPING = 0.925
const SETTLE_DISTANCE = 14
const SETTLE_SPEED = 0.38
const SETTLE_STABILITY_WINDOW = 90
const TECHNOLOGY_TRANSITION_SPRING = 0.00155
const TECHNOLOGY_TRANSITION_DAMPING = 0.92
const TECHNOLOGY_SETTLE_DISTANCE = 15
const TECHNOLOGY_SETTLE_SPEED = 0.42
const TECHNOLOGY_SETTLE_STABILITY_WINDOW = 75
const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

const referenceFormations = Object.fromEntries(
  Object.entries(AOT8_NODE_REFERENCE_GEOMETRY.states)
    .filter(([form]) => !['soundWave', 'africa', 'technology', 'innovation', 'governance', 'ethics'].includes(form))
    .map(([form, state]) => [form, [...state.points, ...(state.boundaryAnchors?.flatMap((anchor) => anchor.points) ?? [])]]),
)
const africaNodes = AOT8_AFRICA_REFERENCE_GEOMETRY.nodes
const africaEdges = new Map(AOT8_AFRICA_REFERENCE_GEOMETRY.edges.map((edge) => [`${edge.a}:${edge.b}`, edge.evidence]))
const technologyNodeIndex = new Map(technologyGeometry.nodes.map((node, index) => [node.id, index]))
const technologyEdges = new Map(technologyGeometry.edges.map((edge) => {
  const from = technologyNodeIndex.get(edge.from)
  const to = technologyNodeIndex.get(edge.to)
  return [from < to ? `${from}:${to}` : `${to}:${from}`, 1]
}))
const innovationEdges = new Map(innovationGeometry.edges.map((edge) => [edge.key, edge.weight]))
const governanceEdges = new Map(governanceGeometry.edges.map((edge) => [edge.key, edge.weight]))
const ethicsEdges = new Map(ethicsGeometry.edges.map((edge) => [edge.key, edge.weight]))
const innovationSignalEdges = new Set(innovationGeometry.signalPaths.flatMap((path) => path.slice(1).map((node, index) => {
  const previous = path[index]
  return previous < node ? `${previous}:${node}` : `${node}:${previous}`
})))
const aboutFramePaths = [
  [[0.98, 0.07], [0.92, 0.11], [0.86, 0.16], [0.81, 0.23], [0.74, 0.27]],
  [[0.99, 0.18], [0.93, 0.21], [0.87, 0.27], [0.82, 0.32], [0.76, 0.35]],
  [[0.91, 0.05], [0.87, 0.11], [0.82, 0.16], [0.76, 0.18]],
  [[0.94, 0.3], [0.89, 0.34], [0.83, 0.39], [0.78, 0.43]],
  [[0.82, 0.08], [0.78, 0.13], [0.72, 0.19], [0.68, 0.24]],
  [[0.99, 0.36], [0.94, 0.4], [0.9, 0.45]],
  [[0.02, 0.93], [0.09, 0.89], [0.16, 0.85], [0.23, 0.82]],
  [[0.04, 0.81], [0.1, 0.77], [0.18, 0.74], [0.27, 0.7]],
  [[0.01, 0.7], [0.08, 0.67], [0.15, 0.64], [0.22, 0.6]],
  [[0.12, 0.96], [0.17, 0.9], [0.23, 0.86], [0.3, 0.83]],
  [[0.03, 0.59], [0.09, 0.57], [0.16, 0.54], [0.23, 0.51]],
  [[0.28, 0.94], [0.31, 0.89], [0.36, 0.85]],
]
const aboutFrameGeometry = (() => {
  const nodes = []
  const edges = new Map()
  aboutFramePaths.forEach((path) => {
    let previousIndex
    path.forEach((point, pointIndex) => {
      if (pointIndex > 0) {
        const previous = path[pointIndex - 1]
        const midpointIndex = nodes.length
        nodes.push({ x: (previous[0] + point[0]) / 2, y: (previous[1] + point[1]) / 2, major: false })
        edges.set(`${previousIndex}:${midpointIndex}`, 1)
        previousIndex = midpointIndex
      }
      const nodeIndex = nodes.length
      nodes.push({ x: point[0], y: point[1], major: pointIndex === 0 || pointIndex === path.length - 1 })
      if (previousIndex !== undefined) edges.set(`${previousIndex}:${nodeIndex}`, 1)
      previousIndex = nodeIndex
    })
  })
  return { nodes, edges }
})()
const eventFieldGeometry = (() => {
  const nodes = []
  const edges = new Map()
  const addPath = (path) => {
    let previousIndex
    path.forEach(([x, y], pointIndex) => {
      const nodeIndex = nodes.length
      nodes.push({ x, y, major: pointIndex === 0 || pointIndex === path.length - 1 })
      if (previousIndex !== undefined) edges.set(`${previousIndex}:${nodeIndex}`, 1)
      previousIndex = nodeIndex
    })
  }

  Array.from({ length: 17 }, (_, pathIndex) => {
    const y = 0.08 + pathIndex * 0.055
    const depth = 0.17 + (pathIndex % 5) * 0.034
    addPath(Array.from({ length: 7 }, (_, pointIndex) => {
      const ratio = pointIndex / 6
      return [depth * ratio, y + Math.sin(ratio * Math.PI + pathIndex * 0.44) * 0.115 * (1 - ratio * 0.25)]
    }))
  })

  Array.from({ length: 6 }, (_, pathIndex) => {
    const y = 0.18 + pathIndex * 0.12
    addPath(Array.from({ length: 5 }, (_, pointIndex) => {
      const ratio = pointIndex / 4
      return [0.79 + ratio * 0.2, y + Math.sin(pathIndex * 0.81 + ratio * 2.1) * 0.055]
    }))
  })

  return { nodes, edges }
})()

function createNode(width, height, index, total) {
  return {
    x: width * (0.47 + Math.random() * 0.46),
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.22,
    vy: (Math.random() - 0.5) * 0.22,
    anchorX: width * 0.72,
    anchorY: height * 0.49,
    phase: (index / total) * Math.PI * 2,
    opacity: 1,
  }
}

function aboutFrameTarget(index, total, width, height) {
  if (index >= aboutFrameGeometry.nodes.length) return { x: width * 0.5, y: height * 0.5, visible: false }
  const node = aboutFrameGeometry.nodes[index]
  return { x: width * node.x, y: height * node.y, geometryIndex: index, major: node.major, visible: true }
}

function targetForFormation(formation, index, total, width, height) {
  if (formation === 'africa') {
    const geometryIndex = total === africaNodes.length ? index : Math.floor((index / total) * africaNodes.length)
    const [x, y] = africaNodes[geometryIndex].xy
    const scale = Math.min(width * 0.21, height * 0.33)
    return { x: width * 0.72 + x * scale, y: height * 0.49 - y * scale, geometryIndex, visible: true }
  }

  if (formation === 'soundWave') {
    const ratio = index / total
    return { x: width * (0.47 + ratio * 0.47), y: height * (0.5 + Math.sin(ratio * Math.PI * 7) * (0.07 + Math.sin(ratio * Math.PI) * 0.2)), visible: true }
  }

  if (formation === 'technology') {
    const geometryIndex = Math.floor((index / total) * technologyGeometry.nodes.length)
    const node = technologyGeometry.nodes[geometryIndex]
    return { x: width * (0.5 + node.nx * 0.42), y: height * (0.13 + node.ny * 0.66), geometryIndex, visible: true }
  }

  if (formation === 'innovation') {
    const geometryIndex = Math.floor((index / total) * innovationGeometry.nodes.length)
    const node = innovationGeometry.nodes[geometryIndex]
    return {
      x: width * (0.5 + node.nx * 0.42),
      y: height * (0.13 + node.ny * 0.66),
      geometryIndex,
      major: node.role === 'core' || node.role === 'hub',
      core: node.role === 'core',
      coreRadius: node.radius,
      layer: node.layer,
      visible: true,
    }
  }

  if (formation === 'governance') {
    const geometryIndex = Math.floor((index / total) * governanceGeometry.nodes.length)
    const node = governanceGeometry.nodes[geometryIndex]
    return {
      x: width * (0.5 + node.x * 0.42),
      y: height * (0.13 + node.y * 0.66),
      geometryIndex,
      major: node.level <= 2,
      core: node.level === 1,
      visible: true,
    }
  }

  if (formation === 'ethics') {
    const geometryIndex = Math.floor((index / total) * ethicsGeometry.nodes.length)
    const node = ethicsGeometry.nodes[geometryIndex]
    return {
      x: width * (0.5 + node.x * 0.42),
      y: height * (0.13 + node.y * 0.66),
      geometryIndex,
      major: node.role === 'core' || node.role === 'trust',
      core: node.role === 'core',
      visible: true,
    }
  }

  if (formation === 'aboutFrame') return aboutFrameTarget(index, total, width, height)

  if (formation === 'eventField') {
    if (index >= eventFieldGeometry.nodes.length) return { x: width * 0.5, y: height * 0.5, visible: false }
    const node = eventFieldGeometry.nodes[index]
    return { x: width * node.x, y: height * node.y, geometryIndex: index, major: node.major, visible: true }
  }

  const points = referenceFormations[formation]
  const [x, y] = points[Math.floor((index / total) * points.length)]
  return { x: width * (0.72 + x * 0.21), y: height * (0.49 - y * 0.33), visible: true }
}

export function NetworkFormation({ formation, reducedMotion, onInteractionStart, onInteractionEnd, onFormationSettled }) {
  const canvasRef = useRef(null)
  const formationRef = useRef(formation)
  const onFormationSettledRef = useRef(onFormationSettled)
  const onInteractionStartRef = useRef(onInteractionStart)
  const onInteractionEndRef = useRef(onInteractionEnd)

  useEffect(() => { formationRef.current = formation }, [formation])
  useEffect(() => { onFormationSettledRef.current = onFormationSettled }, [onFormationSettled])
  useEffect(() => { onInteractionStartRef.current = onInteractionStart }, [onInteractionStart])
  useEffect(() => { onInteractionEndRef.current = onInteractionEnd }, [onInteractionEnd])

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    const pointer = { x: -1000, y: -1000, active: false }
    let frameId
    let width = 0
    let height = 0
    let nodes = []
    let appliedFormation = ''
    let previousFormation = ''
    let transitionProgress = 1
    let stableSince = null
    let hasReportedSettlement = false
    let isNetworkHovering = false

    const applyFormation = () => {
      previousFormation = appliedFormation
      appliedFormation = formationRef.current
      stableSince = null
      hasReportedSettlement = false
      nodes.forEach((node, index) => {
        const target = targetForFormation(appliedFormation, index, nodes.length, width, height)
        const transitionDistance = Math.hypot(target.x - node.x, target.y - node.y)
        Object.assign(node, { anchorX: target.x, anchorY: target.y, geometryIndex: target.geometryIndex, major: target.major, core: target.core, coreRadius: target.coreRadius, layer: target.layer, visible: target.visible, transitionDistance })
      })
      transitionProgress = previousFormation && previousFormation !== appliedFormation ? 0 : 1
    }

    const resize = () => {
      const bounds = canvas.getBoundingClientRect()
      const pixelRatio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO)
      width = bounds.width
      height = bounds.height
      canvas.width = Math.floor(width * pixelRatio)
      canvas.height = Math.floor(height * pixelRatio)
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
      const count = width > 820 ? africaNodes.length : clamp(Math.round((width * height) / 9000), 78, 158)
      nodes = Array.from({ length: count }, (_, index) => createNode(width, height, index, count))
      applyFormation()
      if (reducedMotion) nodes.forEach((node) => { node.x = node.anchorX; node.y = node.anchorY })
    }

    const setNetworkHover = (nextIsHovering) => {
      if (isNetworkHovering === nextIsHovering) return
      isNetworkHovering = nextIsHovering
      pointer.active = nextIsHovering
      canvas.style.cursor = nextIsHovering ? 'crosshair' : 'default'
      if (nextIsHovering) onInteractionStartRef.current('network')
      else onInteractionEndRef.current('network')
    }

    const movePointer = (event) => {
      const bounds = canvas.getBoundingClientRect()
      pointer.x = event.clientX - bounds.left
      pointer.y = event.clientY - bounds.top
      const isWithinNetwork = nodes.some((node) => node.visible && Math.hypot(node.x - pointer.x, node.y - pointer.y) <= NETWORK_HIT_RADIUS)
      setNetworkHover(isWithinNetwork)
    }
    const leavePointer = () => setNetworkHover(false)

    const render = (time) => {
      if (formationRef.current !== appliedFormation) applyFormation()
      context.clearRect(0, 0, width, height)
      const seconds = time * 0.001
      const isAfrica = appliedFormation === 'africa'
      const isTechnology = appliedFormation === 'technology'
      const isInnovation = appliedFormation === 'innovation'
      const isGovernance = appliedFormation === 'governance'
      const isEthics = appliedFormation === 'ethics'
      const isSoundWave = appliedFormation === 'soundWave'
      const isAboutFrame = appliedFormation === 'aboutFrame'
      const isEventField = appliedFormation === 'eventField'
      const isSoundWaveToTechnology = isTechnology && previousFormation === 'soundWave' && transitionProgress < 1
      const spring = isSoundWaveToTechnology ? TECHNOLOGY_TRANSITION_SPRING : FORMATION_SPRING
      const damping = isSoundWaveToTechnology ? TECHNOLOGY_TRANSITION_DAMPING : VELOCITY_DAMPING

      nodes.forEach((node) => {
        if (reducedMotion) {
          node.x = node.anchorX
          node.y = node.anchorY
          node.opacity = node.visible ? 1 : 0
          return
        }
        node.vx += (node.anchorX - node.x) * spring + Math.cos(seconds * 0.2 + node.phase) * 0.0015
        node.vy += (node.anchorY - node.y) * spring + Math.sin(seconds * 0.28 + node.phase) * 0.0015
        if (pointer.active) {
          const dx = node.x - pointer.x
          const dy = node.y - pointer.y
          const distance = Math.hypot(dx, dy) || 1
          if (distance < CURSOR_RADIUS) {
            const force = (1 - distance / CURSOR_RADIUS) ** 2
            node.vx += (dx / distance) * force * 0.5 - (dy / distance) * force * 0.09
            node.vy += (dy / distance) * force * 0.5 + (dx / distance) * force * 0.09
          }
        }
        node.vx *= damping
        node.vy *= damping
        node.x += node.vx
        node.y += node.vy
        node.opacity += ((node.visible ? 1 : 0) - node.opacity) * 0.08
      })

      if (transitionProgress < 1) {
        const movingNodes = nodes.filter((node) => node.visible && node.transitionDistance > 1)
        const remainingDistance = movingNodes.reduce((total, node) => total + Math.min(Math.hypot(node.anchorX - node.x, node.anchorY - node.y) / node.transitionDistance, 1), 0)
        transitionProgress = movingNodes.length ? clamp(1 - remainingDistance / movingNodes.length, 0, 1) : 1
      }

      context.lineWidth = isSoundWave ? 0.75 : 0.68
      for (let first = 0; first < nodes.length; first += 1) {
        for (let second = first + 1; second < nodes.length; second += 1) {
          const node = nodes[first]
          const neighbour = nodes[second]
          if (node.opacity < 0.03 || neighbour.opacity < 0.03) continue
          const edgeKey = node.geometryIndex < neighbour.geometryIndex ? `${node.geometryIndex}:${neighbour.geometryIndex}` : `${neighbour.geometryIndex}:${node.geometryIndex}`
          const explicitEdge = isAfrica ? africaEdges.get(edgeKey) : isTechnology ? technologyEdges.get(edgeKey) : isInnovation ? innovationEdges.get(edgeKey) : isGovernance ? governanceEdges.get(edgeKey) : isEthics ? ethicsEdges.get(edgeKey) : isAboutFrame ? aboutFrameGeometry.edges.get(edgeKey) : isEventField ? eventFieldGeometry.edges.get(edgeKey) : null
          const dx = neighbour.x - node.x
          const dy = neighbour.y - node.y
          const distance = Math.hypot(dx, dy)
          const sourceWaveIntensity = isSoundWaveToTechnology && distance < CONNECTION_DISTANCE
            ? (1 - distance / CONNECTION_DISTANCE) * 0.56 * (1 - transitionProgress)
            : 0
          const targetTechnologyIntensity = isTechnology && explicitEdge
            ? explicitEdge * 0.52 * (isSoundWaveToTechnology ? transitionProgress : 1)
            : 0
          if (isTechnology) {
            if (!sourceWaveIntensity && !targetTechnologyIntensity) continue
          } else if (((isAfrica || isInnovation || isGovernance || isEthics || isAboutFrame || isEventField) && !explicitEdge) || (!isAfrica && !isInnovation && !isGovernance && !isEthics && !isAboutFrame && !isEventField && distance >= CONNECTION_DISTANCE)) continue
          const innovationPulse = isInnovation ? 0.82 + Math.sin(seconds * 1.9 + (node.layer ?? 0) * 0.7 + (neighbour.layer ?? 0) * 0.41) * 0.18 : 1
          const signalIntensity = isInnovation && innovationSignalEdges.has(edgeKey) ? 0.13 + Math.max(0, Math.sin(seconds * 2.1 + node.geometryIndex * 0.5)) * 0.18 : 0
          const intensity = (isTechnology ? sourceWaveIntensity + targetTechnologyIntensity : isAfrica ? explicitEdge * 0.58 : isInnovation ? (explicitEdge * 0.5 * innovationPulse + signalIntensity) * (pointer.active ? 1.18 : 1) : isGovernance || isEthics ? explicitEdge * 0.5 : isAboutFrame ? explicitEdge * 0.42 : isEventField ? explicitEdge * 0.22 : (1 - distance / CONNECTION_DISTANCE) * (isSoundWave ? 0.56 : 0.42)) * Math.min(node.opacity, neighbour.opacity)
          const bend = pointer.active ? clamp(1 - Math.hypot((node.x + neighbour.x) / 2 - pointer.x, (node.y + neighbour.y) / 2 - pointer.y) / CURSOR_RADIUS, 0, 1) * 16 : 0
          context.strokeStyle = `rgba(${isSoundWave ? '193, 224, 218' : '201, 232, 224'}, ${intensity})`
          context.beginPath()
          context.moveTo(node.x, node.y)
          context.quadraticCurveTo((node.x + neighbour.x) / 2 - (dy / distance) * bend, (node.y + neighbour.y) / 2 + (dx / distance) * bend, neighbour.x, neighbour.y)
          context.stroke()
        }
      }

      if (isInnovation) {
        const nodesByGeometryIndex = new Map()
        nodes.forEach((node) => {
          if (node.opacity >= 0.03 && !nodesByGeometryIndex.has(node.geometryIndex)) nodesByGeometryIndex.set(node.geometryIndex, node)
        })
        const coreNode = nodes.find((node) => node.core && node.opacity >= 0.03)
        if (coreNode) {
          const expansion = (seconds * 0.34) % 1
          context.strokeStyle = `rgba(126, 214, 176, ${(1 - expansion) * 0.18 * coreNode.opacity})`
          context.lineWidth = 0.8
          context.beginPath()
          context.arc(coreNode.x, coreNode.y, (coreNode.coreRadius ?? 28) * 0.35 + expansion * 42, 0, Math.PI * 2)
          context.stroke()
        }
        innovationGeometry.signalPaths.forEach((path, pathIndex) => {
          const progress = (seconds * 0.28 + pathIndex * 0.23) % 1
          const segmentProgress = progress * (path.length - 1)
          const segmentIndex = Math.min(Math.floor(segmentProgress), path.length - 2)
          const from = nodesByGeometryIndex.get(path[segmentIndex])
          const to = nodesByGeometryIndex.get(path[segmentIndex + 1])
          if (!from || !to) return
          const ratio = segmentProgress - segmentIndex
          context.fillStyle = `rgba(171, 239, 211, ${(pointer.active ? 0.9 : 0.68) * Math.min(from.opacity, to.opacity)})`
          context.beginPath()
          context.arc(from.x + (to.x - from.x) * ratio, from.y + (to.y - from.y) * ratio, 2, 0, Math.PI * 2)
          context.fill()
        })
      }

      nodes.forEach((node) => {
        if (node.opacity < 0.03) return
        const opacity = (isSoundWave ? 0.61 + Math.sin(seconds * 1.7 + node.phase) * 0.14 : isTechnology ? 0.84 + Math.sin(seconds * 1.7 + node.phase) * 0.1 : isInnovation ? 0.72 + Math.sin(seconds * 1.9 + node.phase + (node.layer ?? 0) * 0.45) * 0.16 : 0.67 + Math.sin(seconds * 1.7 + node.phase) * 0.12) * node.opacity
        if (isTechnology) {
          context.fillStyle = `rgba(237, 250, 244, ${opacity * 0.24})`
          context.beginPath()
          context.arc(node.x, node.y, node.major ? 4.1 : 3.2, 0, Math.PI * 2)
          context.fill()
        }
        if (isInnovation && node.core) {
          const pulse = 0.75 + Math.sin(seconds * 2.2) * 0.25
          context.fillStyle = `rgba(126, 214, 176, ${opacity * 0.18 * pulse})`
          context.beginPath()
          context.arc(node.x, node.y, (node.coreRadius ?? 28) * 0.3 + pulse * 6, 0, Math.PI * 2)
          context.fill()
        }
        context.fillStyle = `rgba(${isSoundWave ? '234, 247, 242' : '237, 250, 244'}, ${opacity})`
        context.beginPath()
        context.arc(node.x, node.y, node.core ? 2.35 : node.major ? 1.8 : isTechnology ? 1.55 : isSoundWave ? 1.2 : isInnovation ? 1.36 : 1.16, 0, Math.PI * 2)
        context.fill()
      })

      if (!pointer.active && !hasReportedSettlement) {
        const visibleNodes = nodes.filter((node) => node.visible)
        const settledNodes = visibleNodes.filter((node) => (
          Math.hypot(node.anchorX - node.x, node.anchorY - node.y) < (isSoundWaveToTechnology ? TECHNOLOGY_SETTLE_DISTANCE : SETTLE_DISTANCE)
          && Math.hypot(node.vx, node.vy) < (isSoundWaveToTechnology ? TECHNOLOGY_SETTLE_SPEED : SETTLE_SPEED)
        ))
        const isVisuallySettled = visibleNodes.length > 0 && settledNodes.length / visibleNodes.length >= 0.95

        if (isVisuallySettled) {
          stableSince ??= time
          if (time - stableSince >= (isSoundWaveToTechnology ? TECHNOLOGY_SETTLE_STABILITY_WINDOW : SETTLE_STABILITY_WINDOW)) {
            hasReportedSettlement = true
            onFormationSettledRef.current(appliedFormation)
          }
        } else {
          stableSince = null
        }
      }
      frameId = window.requestAnimationFrame(render)
    }

    resize()
    window.addEventListener('resize', resize)
    canvas.addEventListener('pointermove', movePointer)
    canvas.addEventListener('pointerleave', leavePointer)
    frameId = window.requestAnimationFrame(render)
    return () => {
      window.cancelAnimationFrame(frameId)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('pointermove', movePointer)
      canvas.removeEventListener('pointerleave', leavePointer)
      canvas.style.cursor = ''
    }
  }, [reducedMotion])

  return (
    <canvas
      ref={canvasRef}
      className="network-prototype__canvas"
      aria-hidden="true"
    />
  )
}

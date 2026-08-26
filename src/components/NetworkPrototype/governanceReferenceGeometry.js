// Governance lightbulb geometry: a pure bulb silhouette adapted to the renderer's data contract.
import outline from './governanceOutline.json'
import points from './governanceNodes.json'
import connections from './governanceConnections.json'
import core from './governanceCore.json'
import signalPathsData from './governanceSignalPaths.json'

const nodeId = (index) => `governance-${index}`
const coreIndex = points.findIndex(({ x, y }) => x === core.x && y === core.y)
const nodes = points.map((point, index) => ({
  id: nodeId(index),
  ...point,
  level: index === coreIndex ? 1 : index >= 15 ? 2 : 3,
  radius: index === coreIndex ? core.radius : undefined,
}))

export const governanceReferenceGeometry = {
  outline,
  nodes,
  connections: connections.map(({ source, target }) => ({ from: nodeId(source), to: nodeId(target) })),
  core,
  signalPaths: signalPathsData.signalPaths,
}

const edgeKey = (from, to) => (from < to ? `${from}:${to}` : `${to}:${from}`)
const nodeIndex = new Map(nodes.map((node, index) => [node.id, index]))

export const governanceGeometry = {
  nodes,
  edges: governanceReferenceGeometry.connections.map(({ from, to }) => {
    const first = nodeIndex.get(from)
    const second = nodeIndex.get(to)
    return { from: first, to: second, weight: 1, key: edgeKey(first, second) }
  }),
  core,
  signalPaths: governanceReferenceGeometry.signalPaths,
}

export default governanceReferenceGeometry

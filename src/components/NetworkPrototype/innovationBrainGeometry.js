// AOT 8.0 Innovation — Neural Brain Network.
// Fixed side-profile brain geometry derived from the approved visual direction.

const canvas = { width: 1000, height: 800 }
const edgeKey = (from, to) => (from < to ? `${from}:${to}` : `${to}:${from}`)

const brainOutline = [
  [485, 748], [470, 715], [470, 680], [435, 655], [390, 646], [342, 655], [300, 648], [260, 628], [225, 600], [198, 560], [180, 520], [172, 475], [176, 425], [190, 380], [215, 338], [250, 300], [292, 265], [340, 235], [395, 212], [450, 195], [510, 188], [570, 194], [625, 210], [680, 235], [730, 268], [770, 310], [800, 355], [818, 402], [822, 448], [812, 490], [790, 525], [760, 550], [724, 568], [690, 584], [670, 615], [640, 640], [600, 650], [560, 646], [530, 662], [520, 700], [520, 748],
]

const neuralNodes = [
  { id: 'CORE', x: 510, y: 420, role: 'core', radius: 42, layer: 0 },
  { id: 'H1', x: 445, y: 340, role: 'hub', layer: 1 }, { id: 'H2', x: 575, y: 340, role: 'hub', layer: 1 }, { id: 'H3', x: 430, y: 480, role: 'hub', layer: 1 }, { id: 'H4', x: 600, y: 480, role: 'hub', layer: 1 },
  { id: 'R1', x: 270, y: 330, role: 'rear-lobe', layer: 2 }, { id: 'R2', x: 320, y: 300, role: 'rear-lobe', layer: 2 }, { id: 'R3', x: 350, y: 380, role: 'rear-lobe', layer: 2 }, { id: 'R4', x: 285, y: 445, role: 'rear-lobe', layer: 2 }, { id: 'R5', x: 335, y: 510, role: 'rear-lobe', layer: 2 },
  { id: 'M1', x: 405, y: 265, role: 'central-mass', layer: 2 }, { id: 'M2', x: 480, y: 245, role: 'central-mass', layer: 2 }, { id: 'M3', x: 550, y: 260, role: 'central-mass', layer: 2 }, { id: 'M4', x: 420, y: 410, role: 'central-mass', layer: 2 }, { id: 'M5', x: 500, y: 345, role: 'central-mass', layer: 2 }, { id: 'M6', x: 575, y: 405, role: 'central-mass', layer: 2 }, { id: 'M7', x: 495, y: 525, role: 'central-mass', layer: 2 },
  { id: 'F1', x: 630, y: 280, role: 'frontal-lobe', layer: 2 }, { id: 'F2', x: 690, y: 320, role: 'frontal-lobe', layer: 2 }, { id: 'F3', x: 730, y: 380, role: 'frontal-lobe', layer: 2 }, { id: 'F4', x: 720, y: 445, role: 'frontal-lobe', layer: 2 }, { id: 'F5', x: 675, y: 500, role: 'frontal-lobe', layer: 2 }, { id: 'F6', x: 615, y: 535, role: 'frontal-lobe', layer: 2 },
  { id: 'C1', x: 255, y: 565, role: 'cerebellum', layer: 3 }, { id: 'C2', x: 305, y: 585, role: 'cerebellum', layer: 3 }, { id: 'C3', x: 355, y: 590, role: 'cerebellum', layer: 3 }, { id: 'C4', x: 405, y: 575, role: 'cerebellum', layer: 3 }, { id: 'C5', x: 445, y: 600, role: 'cerebellum', layer: 3 },
  { id: 'S1', x: 505, y: 610, role: 'brain-stem', layer: 3 }, { id: 'S2', x: 495, y: 665, role: 'brain-stem', layer: 3 }, { id: 'S3', x: 500, y: 715, role: 'brain-stem', layer: 3 },
]

const outlineNodes = brainOutline.map(([x, y], index) => ({ id: `O${index + 1}`, x, y, role: 'outline', layer: 4 }))
const nodes = [...outlineNodes, ...neuralNodes].map((node) => ({ ...node, nx: node.x / canvas.width, ny: node.y / canvas.height }))
const nodeIndex = new Map(nodes.map((node, index) => [node.id, index]))

const connectionPairs = [
  ...outlineNodes.slice(0, -1).map((node, index) => [node.id, outlineNodes[index + 1].id, 0.78]),
  ['H1', 'CORE', 1], ['H2', 'CORE', 1], ['H3', 'CORE', 1], ['H4', 'CORE', 1], ['H1', 'M1', 0.78], ['H1', 'M4', 0.78], ['H2', 'M3', 0.78], ['H2', 'M6', 0.78], ['H3', 'M4', 0.78], ['H3', 'M7', 0.78], ['H4', 'M6', 0.78], ['H4', 'M7', 0.78],
  ['R1', 'R2', 0.7], ['R2', 'R3', 0.72], ['R3', 'R4', 0.72], ['R4', 'R5', 0.72], ['R1', 'M1', 0.7], ['R3', 'H1', 0.8], ['R4', 'H3', 0.8], ['R5', 'M7', 0.7],
  ['M1', 'M2', 0.74], ['M2', 'M3', 0.74], ['M1', 'H1', 0.78], ['M2', 'M5', 0.8], ['M3', 'H2', 0.78], ['M4', 'M5', 0.72], ['M5', 'M6', 0.72], ['M4', 'H3', 0.76], ['M6', 'H4', 0.76], ['M5', 'CORE', 0.9], ['M7', 'CORE', 0.86],
  ['F1', 'F2', 0.72], ['F2', 'F3', 0.72], ['F3', 'F4', 0.72], ['F4', 'F5', 0.72], ['F5', 'F6', 0.72], ['F1', 'M3', 0.72], ['F2', 'H2', 0.78], ['F3', 'M6', 0.74], ['F4', 'H4', 0.8], ['F5', 'H4', 0.78], ['F6', 'M7', 0.74],
  ['C1', 'C2', 0.7], ['C2', 'C3', 0.7], ['C3', 'C4', 0.7], ['C4', 'C5', 0.7], ['C2', 'R5', 0.7], ['C4', 'H3', 0.74], ['C5', 'S1', 0.76], ['S1', 'S2', 0.82], ['S2', 'S3', 0.82], ['S1', 'M7', 0.72],
]

export const innovationBrainGeometry = {
  canvas,
  outline: brainOutline,
  nodes,
  connections: connectionPairs.map(([from, to, weight]) => ({ from, to, weight })),
  intelligenceHubs: ['CORE', 'H1', 'H2', 'H3', 'H4'],
  signalPaths: [
    ['CORE', 'H1', 'R3', 'R1'],
    ['CORE', 'H2', 'F2', 'F4'],
    ['CORE', 'H3', 'C4', 'C1'],
    ['CORE', 'M7', 'S1', 'S3'],
  ],
}

export const innovationGeometry = {
  nodes,
  edges: innovationBrainGeometry.connections.map(({ from, to, weight }) => {
    const first = nodeIndex.get(from)
    const second = nodeIndex.get(to)
    return { from: first, to: second, weight, key: edgeKey(first, second) }
  }),
  signalPaths: innovationBrainGeometry.signalPaths.map((path) => path.map((id) => nodeIndex.get(id))),
}

export default innovationBrainGeometry

// Ethics — Trust Shield. Traced as a sparse double-outline network from the approved reference.
const nodes = [
  { id: 'outer_top', x: 0.5, y: 0.1, role: 'outline' },
  { id: 'outer_l1', x: 0.41, y: 0.14, role: 'outline' }, { id: 'outer_l2', x: 0.31, y: 0.15, role: 'outline' }, { id: 'outer_l3', x: 0.27, y: 0.25, role: 'outline' }, { id: 'outer_l4', x: 0.275, y: 0.43, role: 'outline' }, { id: 'outer_l5', x: 0.31, y: 0.58, role: 'outline' }, { id: 'outer_l6', x: 0.365, y: 0.7, role: 'outline' }, { id: 'outer_l7', x: 0.43, y: 0.8, role: 'outline' },
  { id: 'outer_tip', x: 0.5, y: 0.9, role: 'outline' },
  { id: 'outer_r7', x: 0.57, y: 0.8, role: 'outline' }, { id: 'outer_r6', x: 0.635, y: 0.7, role: 'outline' }, { id: 'outer_r5', x: 0.69, y: 0.58, role: 'outline' }, { id: 'outer_r4', x: 0.725, y: 0.43, role: 'outline' }, { id: 'outer_r3', x: 0.73, y: 0.25, role: 'outline' }, { id: 'outer_r2', x: 0.69, y: 0.15, role: 'outline' }, { id: 'outer_r1', x: 0.59, y: 0.14, role: 'outline' },
  { id: 'inner_top', x: 0.5, y: 0.19, role: 'framework' },
  { id: 'inner_l1', x: 0.41, y: 0.23, role: 'framework' }, { id: 'inner_l2', x: 0.34, y: 0.24, role: 'framework' }, { id: 'inner_l3', x: 0.32, y: 0.33, role: 'framework' }, { id: 'inner_l4', x: 0.32, y: 0.47, role: 'framework' }, { id: 'inner_l5', x: 0.355, y: 0.6, role: 'framework' }, { id: 'inner_l6', x: 0.415, y: 0.71, role: 'framework' },
  { id: 'inner_tip', x: 0.5, y: 0.81, role: 'framework' },
  { id: 'inner_r6', x: 0.585, y: 0.71, role: 'framework' }, { id: 'inner_r5', x: 0.645, y: 0.6, role: 'framework' }, { id: 'inner_r4', x: 0.68, y: 0.47, role: 'framework' }, { id: 'inner_r3', x: 0.68, y: 0.33, role: 'framework' }, { id: 'inner_r2', x: 0.66, y: 0.24, role: 'framework' }, { id: 'inner_r1', x: 0.59, y: 0.23, role: 'framework' },
  { id: 'core', x: 0.5, y: 0.46, role: 'core' }, { id: 'trust_left', x: 0.43, y: 0.46, role: 'trust' }, { id: 'trust_right', x: 0.57, y: 0.46, role: 'trust' }, { id: 'trust_low', x: 0.5, y: 0.61, role: 'trust' },
]

const pairs = [
  ['outer_top', 'outer_l1'], ['outer_l1', 'outer_l2'], ['outer_l2', 'outer_l3'], ['outer_l3', 'outer_l4'], ['outer_l4', 'outer_l5'], ['outer_l5', 'outer_l6'], ['outer_l6', 'outer_l7'], ['outer_l7', 'outer_tip'],
  ['outer_top', 'outer_r1'], ['outer_r1', 'outer_r2'], ['outer_r2', 'outer_r3'], ['outer_r3', 'outer_r4'], ['outer_r4', 'outer_r5'], ['outer_r5', 'outer_r6'], ['outer_r6', 'outer_r7'], ['outer_r7', 'outer_tip'],
  ['inner_top', 'inner_l1'], ['inner_l1', 'inner_l2'], ['inner_l2', 'inner_l3'], ['inner_l3', 'inner_l4'], ['inner_l4', 'inner_l5'], ['inner_l5', 'inner_l6'], ['inner_l6', 'inner_tip'],
  ['inner_top', 'inner_r1'], ['inner_r1', 'inner_r2'], ['inner_r2', 'inner_r3'], ['inner_r3', 'inner_r4'], ['inner_r4', 'inner_r5'], ['inner_r5', 'inner_r6'], ['inner_r6', 'inner_tip'],
  ['inner_top', 'core'], ['core', 'trust_left'], ['core', 'trust_right'], ['core', 'trust_low'], ['trust_left', 'inner_l4'], ['trust_right', 'inner_r4'], ['trust_low', 'inner_tip'],
]

const nodeIndex = new Map(nodes.map((node, index) => [node.id, index]))
const edgeKey = (from, to) => (from < to ? `${from}:${to}` : `${to}:${from}`)

export const ethicsGeometry = {
  nodes,
  edges: pairs.map(([fromId, toId]) => {
    const from = nodeIndex.get(fromId)
    const to = nodeIndex.get(toId)
    return { from, to, weight: 1, key: edgeKey(from, to) }
  }),
}

export default ethicsGeometry

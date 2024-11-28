var nodes = new vis.DataSet([])
var edges = new vis.DataSet([])
var container = document.getElementById('mynetwork')
var data = {
    nodes: nodes,
    edges: edges,
}
var options = {
    layout: {
        hierarchical: {
            direction: 'UD',
            sortMethod: 'directed',
        },
    },
    edges: {
        arrows: 'to',
        color: {
            color: 'rgb(250, 250, 250)',
            highlight: 'rgb(0, 0, 0)',
        },
    },
}
var network = new vis.Network(container, data, options)
function addNode() {
    var label = document.getElementById('nodeLabel').value
    var existingNode = nodes.get({
        filter: function (item) {
            return item.label === label
        },
    })

    if (existingNode.length > 0) {
        alert('Ya existe un nodo con este label.')
        return
    }

    var id = nodes.length + 1
    nodes.add({ id: id, label: label })
    updateNodeColors()
    updateTreeInfo()
}

function addEdge() {
    var fromLabel = document.getElementById('fromNode').value
    var toLabel = document.getElementById('toNode').value

    var fromNode = nodes.get({
        filter: function (item) {
            return item.label === fromLabel
        },
    })[0]

    var toNode = nodes.get({
        filter: function (item) {
            return item.label === toLabel
        },
    })[0]

    if (fromNode && toNode) {
        if (fromNode.id === toNode.id) {
            alert('No se puede conectar un nodo consigo mismo.')
            return
        }
        edges.add({ from: fromNode.id, to: toNode.id })
        updateNodeColors()
        updateTreeInfo()
    } else {
        alert('Ambos nodos deben existir para crear una conexión.')
    }
}

function updateNodeColors() {
    var nodeIds = nodes.getIds()
    var nodeTypes = determineNodeTypes(nodeIds)
    nodeIds.forEach(function (id) {
        var color = getNodeColor(nodeTypes[id])
        nodes.update({ id: id, color: { background: color } })
    })
}

function determineNodeTypes(nodeIds) {
    var nodeTypes = {}
    nodeIds.forEach(function (id) {
        nodeTypes[id] = 'hoja'
    })
    edges.forEach(function (edge) {
        nodeTypes[edge.from] = 'rama'
        if (!nodeTypes[edge.to]) {
            nodeTypes[edge.to] = 'hoja'
        }
    })
    if (nodeIds.length > 0) {
        nodeTypes[nodeIds[0]] = 'raiz'
    }
    return nodeTypes
}

function getNodeColor(type) {
    switch (type) {
        case 'raiz':
            return 'rgb(255, 180, 0)'
        case 'rama':
            return 'rgb(0, 900, 255)'
        case 'hoja':
            return 'rgb(0, 230, 10)'
        default:
            return 'rgb(200, 200, 200)'
    }
}

function updateTreeInfo() {
    var nodeIds = nodes.getIds()
    var nodeTypes = determineNodeTypes(nodeIds)
    var info = {
        raiz: [],
        rama: [],
        hoja: [],
    }
    nodeIds.forEach(function (id) {
        var node = nodes.get(id)
        info[nodeTypes[id]].push(node.label)
    })
    document.getElementById('treeInfo').innerHTML = `
    <p><strong>Raíz:</strong> ${info.raiz.join(', ')}</p>
    <p><strong>Ramas:</strong> ${info.rama.join(', ')}</p>
    <p><strong>Hojas:</strong> ${info.hoja.join(', ')}</p>
`
}
function clearTree() {
    nodes.clear()
    edges.clear()
    updateTreeInfo()
}

// script.js
class ShapeVisualizer {
  constructor() {
    this.jsonDataElement = document.getElementById('jsonData');
    this.statsElement    = document.getElementById('stats');
    this.currentShapes   = null;
    this.currentResponseData = null;

    document.getElementById('generateBtn').addEventListener('click', () => this.generateShapes());
    document.getElementById('showJsonBtn').addEventListener('click', () => this.toggleJsonModal(true));
    document.getElementById('closeJsonBtn').addEventListener('click', () => this.toggleJsonModal(false));
    window.addEventListener('resize', () => this.updateSvgSize());

    document.getElementById('jsonModal').addEventListener('click', e => {
      if (e.target.id === 'jsonModal') this.closeJsonModal();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') this.closeJsonModal();
    });

    this.updateSvgSize();
  }

  updateSvgSize() {
    const container = document.getElementById('canvas-container');
    const rect      = container.getBoundingClientRect();
    const width     = Math.floor(rect.width);
    const height    = Math.floor(rect.height);
    const svg       = document.getElementById('shapeSvg');
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    if (this.currentShapes) this.drawShapesSVG(this.currentShapes);
  }

  async generateShapes() {
    const svg = document.getElementById('shapeSvg');
    svg.style.opacity = 0;
    const radius = document.getElementById('radius').value;
    const count  = document.getElementById('count').value;
    const edges  = document.getElementById('edges').value;

    const params = new URLSearchParams({
      Action:     'ShapesOverlaps',
      Width:      document.getElementById('shapeSvg').getAttribute('width'),
      Height:     document.getElementById('shapeSvg').getAttribute('height'),
      RadiusMax:  radius,
      HowMany:    count,
      MaxEdges:   edges
    });

    try {
      const res  = await fetch(`/api?${params}`);
      const data = await res.json();
      if (data.RES.STATUS === 200) {
        this.currentShapes       = data.RES.RESULT;
        this.currentResponseData = data;
        this.drawShapesSVG(this.currentShapes);
        svg.style.opacity = 1;
        this.updateStats(this.currentShapes);
        this.jsonDataElement.textContent = JSON.stringify(data, null, 2);
      } else {
        alert('오류 발생: ' + data.RES.STATUS_MSG);
      }
    } catch (e) {
      console.error(e);
      alert('서버 통신 중 오류가 발생했습니다.');
    }
  }

  drawShapesSVG(shapesData) {
    const svg = document.getElementById('shapeSvg');
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    shapesData.shapes.forEach(shape => {
      let el;
      if (shape.type === 'circle') {
        el = document.createElementNS(svg.namespaceURI, 'circle');
        el.setAttribute('cx', shape.center.x);
        el.setAttribute('cy', shape.center.y);
        el.setAttribute('r', shape.radius);
      } else {
        el = document.createElementNS(svg.namespaceURI, 'polygon');
        const pts = shape.vertices.map(v => `${v.x},${v.y}`).join(' ');
        el.setAttribute('points', pts);
      }
      el.setAttribute('fill', shape.color);
      el.setAttribute('stroke', '#2c3e50');
      el.setAttribute('stroke-width', 2);
      svg.appendChild(el);
    });
    this.updateStats(shapesData);
  }

  updateStats(shapesData) {
    const { shapes, totalCount, overlapGroups } = shapesData;
    const typeCount = { circle:0, regularPolygon:0, irregularPolygon:0 };
    shapes.forEach(s => typeCount[s.type]++);
    const overlapping = new Set();
    overlapGroups.forEach(g => g.shapeIds.forEach(id => overlapping.add(id)));

    this.statsElement.innerHTML = `
      <div class="stat-item"><strong>Total:</strong> ${totalCount}</div>
      <div class="stat-item"><strong>Circles:</strong> ${typeCount.circle}</div>
      <div class="stat-item"><strong>Reg. Poly:</strong> ${typeCount.regularPolygon}</div>
      <div class="stat-item"><strong>Irreg. Poly:</strong> ${typeCount.irregularPolygon}</div>
      <div class="stat-item"><strong>Groups:</strong> ${overlapGroups.length}</div>
      <div class="stat-item"><strong>Overlaps:</strong> ${overlapping.size}</div>
    `;
  }

  toggleJsonModal(show) {
    if (show && !this.currentResponseData) {
      alert('먼저 도형을 생성해주세요.');
      return;
    }
    document.getElementById('jsonModal').classList.toggle('show', show);
  }

  closeJsonModal() {
    document.getElementById('jsonModal').classList.remove('show');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const visualizer = new ShapeVisualizer();
  visualizer.generateShapes();
});
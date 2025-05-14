class ShapeVisualizer {
    constructor() {
        this.jsonDataElement = document.getElementById('jsonData');
        this.statsElement = document.getElementById('stats');
        this.currentShapes = null;
        this.currentResponseData = null;

        // 이벤트 리스너 설정
        document.getElementById('generateBtn').addEventListener('click', () => this.generateShapes());
        document.getElementById('showJsonBtn').addEventListener('click', () => this.showJsonModal());
        window.addEventListener('resize', () => this.updateSvgSize());

        // 모달 외부 클릭 시 닫기
        document.getElementById('jsonModal').addEventListener('click', (e) => {
            if (e.target.id === 'jsonModal') {
                this.closeJsonModal();
            }
        });

        // ESC 키로 모달 닫기
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeJsonModal();
            }
        });

        // 초기 SVG 크기 설정
        this.updateSvgSize();
    }

    updateSvgSize() {
        const container = document.getElementById('canvas-container');
        const rect = container.getBoundingClientRect();
        const width = Math.floor(rect.width);
        const height = Math.floor(rect.height);
        const svg = document.getElementById('shapeSvg');
        svg.setAttribute('width', width);
        svg.setAttribute('height', height);
        svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
        if (this.currentShapes) this.drawShapesSVG(this.currentShapes);
    }

    async generateShapes() {
        const radius = document.getElementById('radius').value;
        const count = document.getElementById('count').value;
        const edges = document.getElementById('edges').value;

        // API 요청 URL 생성
        const params = new URLSearchParams({
            Action: 'ShapesOverlaps',
            Width: document.getElementById('shapeSvg').getAttribute('width'),
            Height: document.getElementById('shapeSvg').getAttribute('height'),
            RadiusMax: radius,
            HowMany: count,
            MaxEdges: edges
        });

        try {
            // API 호출
            const response = await fetch(`/api?${params.toString()}`);
            const data = await response.json();

            if (data.RES.STATUS === 200) {
                // 응답에서 도형 데이터 추출
                this.currentShapes = data.RES.RESULT;
                this.currentResponseData = data;

                // 도형들 그리기
                this.drawShapesSVG(this.currentShapes);

                // 통계 정보 업데이트
                this.updateStats(this.currentShapes);

                // JSON 데이터 저장
                this.jsonDataElement.textContent = JSON.stringify(data, null, 2);
            } else {
                alert('오류 발생: ' + data.RES.STATUS_MSG);
                console.error(data);
            }
        } catch (error) {
            console.error('API 호출 오류:', error);
            alert('서버와 통신 중 오류가 발생했습니다.');
        }
    }

    drawShapesSVG(shapesData) {
      const svg = document.getElementById('shapeSvg');
      // Clear existing shapes
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      // Draw each shape
      shapesData.shapes.forEach(shape => {
        let el;
        if (shape.type === 'circle') {
          el = document.createElementNS(svg.namespaceURI, 'circle');
          el.setAttribute('cx', shape.center.x);
          el.setAttribute('cy', shape.center.y);
          el.setAttribute('r', shape.radius);
        } else {
          el = document.createElementNS(svg.namespaceURI, 'polygon');
          const points = shape.vertices.map(v => `${v.x},${v.y}`).join(' ');
          el.setAttribute('points', points);
        }
        el.setAttribute('fill', shape.color);
        el.setAttribute('stroke', '#2c3e50');
        el.setAttribute('stroke-width', 2);
        svg.appendChild(el);
      });
      // Update stats panel (HTML)
      this.updateStats(shapesData);
    }

    updateStats(shapesData) {
        const { shapes, totalCount, overlapGroups } = shapesData;

        // 도형 타입별 개수 계산
        const typeCount = {
            circle: 0,
            regularPolygon: 0,
            irregularPolygon: 0
        };

        shapes.forEach(shape => {
            typeCount[shape.type]++;
        });

        // 겹치는 도형 개수 계산
        const overlappingShapes = new Set();
        overlapGroups.forEach(group => {
            group.shapeIds.forEach(id => overlappingShapes.add(id));
        });

        // 통계 HTML 생성
        const statsHtml = `
            <div class="stat-item">
                <strong>Total Shapes:</strong> ${totalCount}
            </div>
            <div class="stat-item">
                <strong>Circles:</strong> ${typeCount.circle} (${(typeCount.circle/totalCount*100).toFixed(1)}%)
            </div>
            <div class="stat-item">
                <strong>Regular Polygons:</strong> ${typeCount.regularPolygon} (${(typeCount.regularPolygon/totalCount*100).toFixed(1)}%)
            </div>
            <div class="stat-item">
                <strong>Irregular Polygons:</strong> ${typeCount.irregularPolygon} (${(typeCount.irregularPolygon/totalCount*100).toFixed(1)}%)
            </div>
            <div class="stat-item">
                <strong>Overlap Groups:</strong> ${overlapGroups.length}
            </div>
            <div class="stat-item">
                <strong>Overlapping Shapes:</strong> ${overlappingShapes.size}
            </div>
        `;

        this.statsElement.innerHTML = statsHtml;
    }

    showJsonModal() {
        if (!this.currentResponseData) {
            alert('먼저 도형을 생성해주세요.');
            return;
        }

        document.getElementById('jsonModal').style.display = 'block';
    }

    closeJsonModal() {
        document.getElementById('jsonModal').style.display = 'none';
    }
}

// 전역 함수로 모달 닫기 함수 정의
function closeJsonModal() {
    document.getElementById('jsonModal').style.display = 'none';
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    const visualizer = new ShapeVisualizer();
    // 첫 번째 도형 자동 생성
    visualizer.generateShapes();
});
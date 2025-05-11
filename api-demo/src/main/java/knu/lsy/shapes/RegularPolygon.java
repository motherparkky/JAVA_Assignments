package knu.lsy.shapes;

import org.json.JSONArray;
import org.json.JSONObject;
import java.util.List;
import java.util.ArrayList;

public class RegularPolygon extends Shape {
    private int sides;
    private double rotationAngle;
    private List<Point> vertices;

    public RegularPolygon(Point center, double radius, int sides, double rotationAngle) {
        super(center, radius);
        this.sides = sides;
        this.rotationAngle = rotationAngle;
        this.vertices = generateVertices();
    }

    private List<Point> generateVertices() {
        List<Point> points = new ArrayList<>();
        double angleStep = 2 * Math.PI / sides;

        for (int i = 0; i < sides; i++) {
            double angle = angleStep * i + rotationAngle;
            double x = center.getX() + radius * Math.cos(angle);
            double y = center.getY() + radius * Math.sin(angle);
            points.add(new Point(x, y));
        }

        return points;
    }

    // TODO: 학생 과제 - 정다각형의 겹침 감지 알고리즘 구현
    @Override
    public boolean overlaps(Shape other) {
        // 임시 구현: 랜덤하게 true/false 반환
        return Math.random() < 0.3;

        // 힌트:
        // 1. SAT(Separating Axis Theorem) 알고리즘 사용 권장
        // 2. 각 다각형의 모든 변에 대한 법선벡터를 계산
        // 3. 각 법선에 두 도형을 투영하여 겹치는지 확인
        // 4. 모든 법선에서 겹치면 두 도형이 겹침
    }

    @Override
    public JSONObject toJSON() {
        JSONObject json = new JSONObject();
        json.put("type", "regularPolygon");
        json.put("id", id);
        json.put("center", center.toJSON());
        json.put("radius", radius);
        json.put("sides", sides);
        json.put("rotationAngle", rotationAngle);
        json.put("color", color);

        JSONArray verticesArray = new JSONArray();
        for (Point vertex : vertices) {
            verticesArray.put(vertex.toJSON());
        }
        json.put("vertices", verticesArray);

        return json;
    }

    @Override
    public String getShapeType() {
        return "regularPolygon";
    }

    @Override
    public List<Point> getVertices() {
        return new ArrayList<>(vertices);
    }
}
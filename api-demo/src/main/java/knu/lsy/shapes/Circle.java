package knu.lsy.shapes;

import org.json.JSONArray;
import org.json.JSONObject;
import java.util.List;
import java.util.ArrayList;

public class Circle extends Shape {

    public Circle(Point center, double radius) {
        super(center, radius);
    }

    // TODO: 학생 과제 - 원의 겹침 감지 알고리즘 구현
    @Override
    public boolean overlaps(Shape other) {
        if (other instanceof Circle) {
            double dx = this.center.getX() - other.center.getX();
            double dy = this.center.getY() - other.center.getY();
            double distance = Math.sqrt(dx * dx + dy * dy);
            return distance < (this.radius + other.radius);
        }
        for (Point p : other.getVertices()) {
            double dx = p.getX() - this.center.getX();
            double dy = p.getY() - this.center.getY();
            double distance = Math.sqrt(dx * dx + dy * dy);
            if (distance <= this.radius) return true;
        }
        return false;
    }

    @Override
    public JSONObject toJSON() {
        JSONObject json = new JSONObject();
        json.put("type", "circle");
        json.put("id", id);
        json.put("center", center.toJSON());
        json.put("radius", radius);
        json.put("color", color);
        return json;
    }

    @Override
    public String getShapeType() {
        return "circle";
    }

    @Override
    public List<Point> getVertices() {
        // 원의 경계를 근사하는 점들 생성
        List<Point> vertices = new ArrayList<>();
        int numPoints = 32;
        for (int i = 0; i < numPoints; i++) {
            double angle = 2 * Math.PI * i / numPoints;
            double x = center.getX() + radius * Math.cos(angle);
            double y = center.getY() + radius * Math.sin(angle);
            vertices.add(new Point(x, y));
        }
        return vertices;
    }
}
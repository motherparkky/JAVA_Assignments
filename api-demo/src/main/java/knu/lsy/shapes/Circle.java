// Circle.java
package knu.lsy.shapes;

import org.json.JSONObject;
import java.util.List;
import java.util.ArrayList;

public class Circle extends Shape {
    private List<Point> cachedVertices;
    private static final int APPROX_STEPS = 32;

    public Circle(Point center, double radius) {
        super(center, radius);
    }

    @Override
    public boolean overlaps(Shape other) {
        if (quickReject(other)) {
            return false;
        }
        if (other instanceof Circle) {
            // bounding circle 겹침이면 true
            return true;
        }
        // 다각형인 경우: 다각형의 정점이 원 안에 있는지 검사
        for (Point p : other.getVertices()) {
            if (center.distanceSquared(p) <= radius * radius) {
                return true;
            }
        }
        return false;
    }

    @Override
    public List<Point> getVertices() {
        if (cachedVertices != null) {
            return cachedVertices;
        }
        List<Point> verts = new ArrayList<>();
        for (int i = 0; i < APPROX_STEPS; i++) {
            double theta = 2 * Math.PI * i / APPROX_STEPS;
            double x = center.getX() + radius * Math.cos(theta);
            double y = center.getY() + radius * Math.sin(theta);
            verts.add(new Point(x, y));
        }
        cachedVertices = verts;
        return verts;
    }

    @Override
    public JSONObject toJSON() {
        JSONObject json = new JSONObject();
        json.put("type", getShapeType());
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
}
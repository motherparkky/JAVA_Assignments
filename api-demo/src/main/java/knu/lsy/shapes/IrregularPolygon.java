// IrregularPolygon.java
package knu.lsy.shapes;

import org.json.JSONObject;
import org.json.JSONArray;
import java.util.List;
import java.util.ArrayList;

public class IrregularPolygon extends Shape {
    private final List<Point> baseVertices;
    private List<Point> cachedVertices;

    public IrregularPolygon(Point center, double radius, List<Point> vertices) {
        super(center, radius);
        this.baseVertices = new ArrayList<>(vertices);
    }

    // SAT 분리 축 테스트 (중복 코드)
    private boolean isSeparated(double nx, double ny, List<Point> A, List<Point> B) {
        double minA = Double.POSITIVE_INFINITY, maxA = Double.NEGATIVE_INFINITY;
        for (Point p : A) {
            double proj = p.getX() * nx + p.getY() * ny;
            minA = Math.min(minA, proj);
            maxA = Math.max(maxA, proj);
        }
        double minB = Double.POSITIVE_INFINITY, maxB = Double.NEGATIVE_INFINITY;
        for (Point p : B) {
            double proj = p.getX() * nx + p.getY() * ny;
            minB = Math.min(minB, proj);
            maxB = Math.max(maxB, proj);
        }
        return maxA < minB || maxB < minA;
    }

    @Override
    public boolean overlaps(Shape other) {
        if (quickReject(other)) {
            return false;
        }
        List<Point> vertsA = getVertices();
        List<Point> vertsB = other.getVertices();
        int nA = vertsA.size();
        int nB = vertsB.size();
        for (int i = 0; i < nA; i++) {
            Point p1 = vertsA.get(i);
            Point p2 = vertsA.get((i + 1) % nA);
            double nx = -(p2.getY() - p1.getY());
            double ny =  (p2.getX() - p1.getX());
            if (isSeparated(nx, ny, vertsA, vertsB)) {
                return false;
            }
        }
        for (int i = 0; i < nB; i++) {
            Point p1 = vertsB.get(i);
            Point p2 = vertsB.get((i + 1) % nB);
            double nx = -(p2.getY() - p1.getY());
            double ny =  (p2.getX() - p1.getX());
            if (isSeparated(nx, ny, vertsA, vertsB)) {
                return false;
            }
        }
        return true;
    }

    @Override
    public List<Point> getVertices() {
        if (cachedVertices != null) {
            return cachedVertices;
        }
        cachedVertices = new ArrayList<>(baseVertices);
        return cachedVertices;
    }

    @Override
    public JSONObject toJSON() {
        JSONObject json = new JSONObject();
        json.put("type", getShapeType());
        json.put("id", id);
        json.put("center", center.toJSON());
        json.put("radius", radius);
        JSONArray arr = new JSONArray();
        for (Point p : getVertices()) arr.put(p.toJSON());
        json.put("vertices", arr);
        json.put("color", color);
        return json;
    }

    @Override
    public String getShapeType() {
        return "irregularPolygon";
    }
}

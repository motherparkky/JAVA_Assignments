package knu.lsy.shapes;

import org.json.JSONObject;
import java.util.List;

public abstract class Shape {
    protected final Point center;
    protected final double radius;
    protected final String id;
    protected String color;

    protected Shape(Point center, double radius) {
        this.center = center;
        this.radius = radius;
        this.id = "shape_" + System.currentTimeMillis() + "_" + (int)(Math.random() * 1000);
        int r = (int)(Math.random() * 256), g = (int)(Math.random() * 256), b = (int)(Math.random() * 256);
        this.color = String.format("#%02x%02x%02x", r, g, b);
    }

    public Point getCenter() {
        return center;
    }

    public double getRadius() {
        return radius;
    }

    public String getId() {
        return id;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    // 빠른 배제 검사: bounding circle 간의 거리 비교
    public boolean quickReject(Shape other) {
        double sumR = this.radius + other.radius;
        return center.distanceSquared(other.center) > sumR * sumR;
    }

    public abstract boolean overlaps(Shape other);
    public abstract JSONObject toJSON();
    public abstract String getShapeType();
    public abstract List<Point> getVertices();
}
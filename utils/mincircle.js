// 计算两点之间的距离
function distance(a, b) {
    return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
}

// 计算三个点组成的外接圆
function circumcircle(a, b, c) {
    const A = b[0] - a[0];
    const B = b[1] - a[1];
    const C = c[0] - a[0];
    const D = c[1] - a[1];

    const E = A * (a[0] + b[0]) + B * (a[1] + b[1]);
    const F = C * (a[0] + c[0]) + D * (a[1] + c[1]);

    const G = 2 * (A * (c[1] - a[1]) - B * (c[0] - a[0]));

    if (G === 0) return null; // 三点共线，无法形成外接圆

    const centerX = (D * E - B * F) / G;
    const centerY = (A * F - C * E) / G;

    const radius = distance([centerX, centerY], a);

    return {
        center: [centerX, centerY],
        radius: radius
    };
}

// 计算最小外接圆
function minimumBoundingCircle(points) {
    let circle = null;

    // 遍历所有点对
    for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
            // 以当前点对为直径的圆
            const center = [
                (points[i][0] + points[j][0]) / 2,
                (points[i][1] + points[j][1]) / 2
            ];
            const radius = distance(center, points[i]);

            // 检查是否所有点都在这个圆内
            let allInside = true;
            for (const point of points) {
                if (distance(center, point) > radius) {
                    allInside = false;
                    break;
                }
            }

            if (allInside && (!circle || radius < circle.radius)) {
                circle = { center, radius };
            }
        }
    }

    // 遍历所有三点组合
    for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
            for (let k = j + 1; k < points.length; k++) {
                const circum = circumcircle(points[i], points[j], points[k]);
                if (circum) {
                    // 检查是否所有点都在这个圆内
                    let allInside = true;
                    for (const point of points) {
                        if (distance(circum.center, point) > circum.radius) {
                            allInside = false;
                            break;
                        }
                    }

                    if (allInside && (!circle || circum.radius < circle.radius)) {
                        circle = circum;
                    }
                }
            }
        }
    }

    return circle;
}

// 主函数
export function calculateBoundingCircle(geojson) {
    const points = [];

    // 提取所有点的坐标
    geojson.features.forEach(feature => {
        if (feature.geometry.type === 'Point') {
            points.push(feature.geometry.coordinates);
        } else if (feature.geometry.type === 'LineString' || feature.geometry.type === 'MultiPoint') {
            points.push(...feature.geometry.coordinates);
        } else if (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiLineString') {
            feature.geometry.coordinates.forEach(ring => {
                points.push(...ring);
            });
        } else if (feature.geometry.type === 'MultiPolygon') {
            feature.geometry.coordinates.forEach(polygon => {
                polygon.forEach(ring => {
                    points.push(...ring);
                });
            });
        }
    });

    // 计算最小外接圆
    return minimumBoundingCircle(points);
}


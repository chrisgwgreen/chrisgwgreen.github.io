import Delaunay from './delaunay';

/**
 * Defines the Flat Surface Shader namespace for all the awesomeness to exist upon.
 * @author Matthew Wagerfield
 */
let FSS = {
    FRONT: 0,
    BACK: 1,
    DOUBLE: 2
};

/**
 * @class Array
 * @author Matthew Wagerfield
 */
FSS.Array = typeof Float32Array === 'function' ? Float32Array : Array;

/**
 * @class Utils
 * @author Matthew Wagerfield
 */
FSS.Utils = {
    isNumber: function(value) {
        return !isNaN(parseFloat(value)) && isFinite(value);
    }
};

/**
 * @object Vector3
 * @author Matthew Wagerfield
 */
FSS.Vector3 = {
    create: function(x, y, z) {
        let vector = new FSS.Array(3);
        this.set(vector, x, y, z);
        return vector;
    },
    clone: function(a) {
        let vector = this.create();
        this.copy(vector, a);
        return vector;
    },
    set: function(target, x, y, z) {
        target[0] = x || 0;
        target[1] = y || 0;
        target[2] = z || 0;
        return this;
    },
    setX: function(target, x) {
        target[0] = x || 0;
        return this;
    },
    setY: function(target, y) {
        target[1] = y || 0;
        return this;
    },
    setZ: function(target, z) {
        target[2] = z || 0;
        return this;
    },
    copy: function(target, a) {
        target[0] = a[0];
        target[1] = a[1];
        target[2] = a[2];
        return this;
    },
    add: function(target, a) {
        target[0] += a[0];
        target[1] += a[1];
        target[2] += a[2];
        return this;
    },
    addVectors: function(target, a, b) {
        target[0] = a[0] + b[0];
        target[1] = a[1] + b[1];
        target[2] = a[2] + b[2];
        return this;
    },
    addScalar: function(target, s) {
        target[0] += s;
        target[1] += s;
        target[2] += s;
        return this;
    },
    subtract: function(target, a) {
        target[0] -= a[0];
        target[1] -= a[1];
        target[2] -= a[2];
        return this;
    },
    subtractVectors: function(target, a, b) {
        target[0] = a[0] - b[0];
        target[1] = a[1] - b[1];
        target[2] = a[2] - b[2];
        return this;
    },
    subtractScalar: function(target, s) {
        target[0] -= s;
        target[1] -= s;
        target[2] -= s;
        return this;
    },
    multiply: function(target, a) {
        target[0] *= a[0];
        target[1] *= a[1];
        target[2] *= a[2];
        return this;
    },
    multiplyVectors: function(target, a, b) {
        target[0] = a[0] * b[0];
        target[1] = a[1] * b[1];
        target[2] = a[2] * b[2];
        return this;
    },
    multiplyScalar: function(target, s) {
        target[0] *= s;
        target[1] *= s;
        target[2] *= s;
        return this;
    },
    divide: function(target, a) {
        target[0] /= a[0];
        target[1] /= a[1];
        target[2] /= a[2];
        return this;
    },
    divideVectors: function(target, a, b) {
        target[0] = a[0] / b[0];
        target[1] = a[1] / b[1];
        target[2] = a[2] / b[2];
        return this;
    },
    divideScalar: function(target, s) {
        if (s !== 0) {
            target[0] /= s;
            target[1] /= s;
            target[2] /= s;
        } else {
            target[0] = 0;
            target[1] = 0;
            target[2] = 0;
        }
        return this;
    },
    cross: function(target, a) {
        let x = target[0],
            y = target[1],
            z = target[2];

        target[0] = y * a[2] - z * a[1];
        target[1] = z * a[0] - x * a[2];
        target[2] = x * a[1] - y * a[0];

        return this;
    },
    crossVectors: function(target, a, b) {
        target[0] = a[1] * b[2] - a[2] * b[1];
        target[1] = a[2] * b[0] - a[0] * b[2];
        target[2] = a[0] * b[1] - a[1] * b[0];
        return this;
    },
    min: function(target, value) {
        if (target[0] < value) {
            target[0] = value;
        }
        if (target[1] < value) {
            target[1] = value;
        }
        if (target[2] < value) {
            target[2] = value;
        }
        return this;
    },
    max: function(target, value) {
        if (target[0] > value) {
            target[0] = value;
        }
        if (target[1] > value) {
            target[1] = value;
        }
        if (target[2] > value) {
            target[2] = value;
        }
        return this;
    },
    clamp: function(target, min, max) {
        this.min(target, min);
        this.max(target, max);
        return this;
    },
    limit: function(target, min, max) {
        let length = this.length(target);
        if (min !== null && length < min) {
            this.setLength(target, min);
        } else if (max !== null && length > max) {
            this.setLength(target, max);
        }
        return this;
    },
    dot: function(a, b) {
        return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    },
    normalise: function(target) {
        return this.divideScalar(target, this.length(target));
    },
    negate: function(target) {
        return this.multiplyScalar(target, -1);
    },
    distanceSquared: function(a, b) {
        let dx = a[0] - b[0],
            dy = a[1] - b[1],
            dz = a[2] - b[2];

        return dx * dx + dy * dy + dz * dz;
    },
    distance: function(a, b) {
        return Math.sqrt(this.distanceSquared(a, b));
    },
    lengthSquared: function(a) {
        return a[0] * a[0] + a[1] * a[1] + a[2] * a[2];
    },
    length: function(a) {
        return Math.sqrt(this.lengthSquared(a));
    },
    setLength: function(target, l) {
        let length = this.length(target);
        if (length !== 0 && l !== length) {
            this.multiplyScalar(target, l / length);
        }
        return this;
    }
};

/**
 * @object Vector4
 * @author Matthew Wagerfield
 */
FSS.Vector4 = {
    create: function(x, y, z) {
        let vector = new FSS.Array(4);
        this.set(vector, x, y, z);
        return vector;
    },
    set: function(target, x, y, z, w) {
        target[0] = x || 0;
        target[1] = y || 0;
        target[2] = z || 0;
        target[3] = w || 0;
        return this;
    },
    setX: function(target, x) {
        target[0] = x || 0;
        return this;
    },
    setY: function(target, y) {
        target[1] = y || 0;
        return this;
    },
    setZ: function(target, z) {
        target[2] = z || 0;
        return this;
    },
    setW: function(target, w) {
        target[3] = w || 0;
        return this;
    },
    add: function(target, a) {
        target[0] += a[0];
        target[1] += a[1];
        target[2] += a[2];
        target[3] += a[3];
        return this;
    },
    multiplyVectors: function(target, a, b) {
        target[0] = a[0] * b[0];
        target[1] = a[1] * b[1];
        target[2] = a[2] * b[2];
        target[3] = a[3] * b[3];
        return this;
    },
    multiplyScalar: function(target, s) {
        target[0] *= s;
        target[1] *= s;
        target[2] *= s;
        target[3] *= s;
        return this;
    },
    min: function(target, value) {
        if (target[0] < value) {
            target[0] = value;
        }
        if (target[1] < value) {
            target[1] = value;
        }
        if (target[2] < value) {
            target[2] = value;
        }
        if (target[3] < value) {
            target[3] = value;
        }
        return this;
    },
    max: function(target, value) {
        if (target[0] > value) {
            target[0] = value;
        }
        if (target[1] > value) {
            target[1] = value;
        }
        if (target[2] > value) {
            target[2] = value;
        }
        if (target[3] > value) {
            target[3] = value;
        }
        return this;
    },
    clamp: function(target, min, max) {
        this.min(target, min);
        this.max(target, max);
        return this;
    }
};

/**
 * @class Color
 * @author Matthew Wagerfield
 */
FSS.Color = function(hex, opacity) {
    this.rgba = FSS.Vector4.create();
    this.hex = hex || '#000000';
    this.opacity = FSS.Utils.isNumber(opacity) ? opacity : 1;
    this.set(this.hex, this.opacity);
};

FSS.Color.prototype = {
    set: function(hex, opacity) {
        hex = hex.replace('#', '');

        let size = hex.length / 3;

        this.rgba[0] = parseInt(hex.substring(0, size), 16) / 255;
        this.rgba[1] = parseInt(hex.substring(size, size * 2), 16) / 255;
        this.rgba[2] = parseInt(hex.substring(size * 2, size * 3), 16) / 255;
        this.rgba[3] = FSS.Utils.isNumber(opacity) ? opacity : this.rgba[3];

        return this;
    },
    hexify: function(channel) {
        let hex = Math.ceil(channel * 255).toString(16);
        if (hex.length === 1) {
            hex = '0' + hex;
        }
        return hex;
    },
    format: function() {
        let r = this.hexify(this.rgba[0]),
            g = this.hexify(this.rgba[1]),
            b = this.hexify(this.rgba[2]);

        this.hex = '#' + r + g + b;

        return this.hex;
    }
};

/**
 * @class Object
 * @author Matthew Wagerfield
 */
FSS.Object = function() {
    this.position = FSS.Vector3.create();
};

FSS.Object.prototype = {
    setPosition: function(x, y, z) {
        FSS.Vector3.set(this.position, x, y, z);
        return this;
    }
};

/**
 * @class Light
 * @author Matthew Wagerfield
 */
FSS.Light = function(ambient, diffuse) {
    FSS.Object.call(this);
    this.ambient = new FSS.Color(ambient || '#FFFFFF');
    this.diffuse = new FSS.Color(diffuse || '#FFFFFF');
    this.ray = FSS.Vector3.create();
};

FSS.Light.prototype = Object.create(FSS.Object.prototype);

/**
 * @class Vertex
 * @author Matthew Wagerfield
 */
FSS.Vertex = function(x, y, z) {
    this.position = FSS.Vector3.create(x, y, z);
};

FSS.Vertex.prototype = {
    setPosition: function(x, y, z) {
        FSS.Vector3.set(this.position, x, y, z);
        return this;
    }
};

/**
 * @class Triangle
 * @author Matthew Wagerfield
 */
FSS.Triangle = function(a, b, c) {
    this.a = a || new FSS.Vertex();
    this.b = b || new FSS.Vertex();
    this.c = c || new FSS.Vertex();
    this.vertices = [this.a, this.b, this.c];
    this.u = FSS.Vector3.create();
    this.v = FSS.Vector3.create();
    this.centroid = FSS.Vector3.create();
    this.normal = FSS.Vector3.create();
    this.color = new FSS.Color();
    this.polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    this.polygon.setAttributeNS(null, 'stroke-linejoin', 'round');
    this.polygon.setAttributeNS(null, 'stroke-miterlimit', '1');
    this.polygon.setAttributeNS(null, 'stroke-width', '1');
    this.computeCentroid();
    this.computeNormal();
};

FSS.Triangle.prototype = {
    computeCentroid: function() {
        this.centroid[0] = this.a.position[0] + this.b.position[0] + this.c.position[0];
        this.centroid[1] = this.a.position[1] + this.b.position[1] + this.c.position[1];
        this.centroid[2] = this.a.position[2] + this.b.position[2] + this.c.position[2];
        FSS.Vector3.divideScalar(this.centroid, 3);
        return this;
    },
    computeNormal: function() {
        FSS.Vector3.subtractVectors(this.u, this.b.position, this.a.position);
        FSS.Vector3.subtractVectors(this.v, this.c.position, this.a.position);
        FSS.Vector3.crossVectors(this.normal, this.u, this.v);
        FSS.Vector3.normalise(this.normal);
        return this;
    }
};

/**
 * @class Geometry
 * @author Matthew Wagerfield
 */
FSS.Geometry = function() {
    this.vertices = [];
    this.triangles = [];
    this.dirty = false;
};

FSS.Geometry.prototype = {
    update: function() {

        let t = this.triangles.length - 1,
            triangle;

        if (this.dirty) {

            for (t; t >= 0; t -= 1) {
                triangle = this.triangles[t];
                triangle.computeCentroid();
                triangle.computeNormal();
            }

            this.dirty = false;
        }
        return this;
    }
};

/**
 * @class Plane
 * @author Matthew Wagerfield, modified by Maksim Surguy to implement Delaunay triangulation
 */
FSS.Plane = function(width, height, howmany) {
    this.render(width, height, howmany);
};

FSS.Plane.prototype = Object.create(FSS.Geometry.prototype);

FSS.Plane.prototype.render = function(width, height, howmany) {

    FSS.Geometry.call(this);
    this.width = width || 100;
    this.height = height || 100;

    // Cache letiables
    let x,
        y,
        vertices = new Array(howmany),
        offsetX = this.width * -0.5,
        offsetY = this.height * 0.5,
        i = vertices.length - 1,
        triangles,
        v1,
        v2,
        v3,
        t1;

    for (i; i >= 0; i -= 1) {
        x = offsetX + Math.random() * width;
        y = offsetY - Math.random() * height;
        vertices[i] = [x, y];
    }

    // Generate additional points on the perimeter so that there are no holes in the pattern
    vertices.push([offsetX, offsetY]);
    vertices.push([offsetX + width / 2, offsetY]);
    vertices.push([offsetX + width, offsetY]);
    vertices.push([offsetX + width, offsetY - height / 2]);
    vertices.push([offsetX + width, offsetY - height]);
    vertices.push([offsetX + width / 2, offsetY - height]);
    vertices.push([offsetX, offsetY - height]);
    vertices.push([offsetX, offsetY - height / 2]);

    // Generate additional randomly placed points on the perimeter
    i = 6;
    for (i; i >= 0; i -= 1) {
        vertices.push([offsetX + Math.random() * width, offsetY]);
        vertices.push([offsetX, offsetY - Math.random() * height]);
        vertices.push([offsetX + width, offsetY - Math.random() * height]);
        vertices.push([offsetX + Math.random() * width, offsetY - height]);
    }

    // Create an array of triangulated coordinates from our vertices
    triangles = Delaunay.triangulate(vertices);
    i = triangles.length - 1;

    for (i; i >= 0; i -= 1) {

        v1 = new FSS.Vertex(Math.ceil(vertices[triangles[i]][0]), Math.ceil(vertices[triangles[i]][1]));
        i -= 1;
        v2 = new FSS.Vertex(Math.ceil(vertices[triangles[i]][0]), Math.ceil(vertices[triangles[i]][1]));
        i -= 1;
        v3 = new FSS.Vertex(Math.ceil(vertices[triangles[i]][0]), Math.ceil(vertices[triangles[i]][1]));
        t1 = new FSS.Triangle(v1, v2, v3);

        this.triangles.push(t1);
        this.vertices.push(v1);
        this.vertices.push(v2);
        this.vertices.push(v3);

    }
}

/**
 * @class Material
 * @author Matthew Wagerfield
 */
FSS.Material = function(ambient, diffuse) {
    this.ambient = new FSS.Color(ambient || '#444444');
    this.diffuse = new FSS.Color(diffuse || '#FFFFFF');
    this.slave = new FSS.Color();
};

/**
 * @class Mesh
 * @author Matthew Wagerfield
 */
FSS.Mesh = function(geometry, material) {
    FSS.Object.call(this);
    this.geometry = geometry || new FSS.Geometry();
    this.material = material || new FSS.Material();
    this.side = FSS.FRONT;
    this.visible = true;
};

FSS.Mesh.prototype = Object.create(FSS.Object.prototype);

FSS.Mesh.prototype.update = function(lights, calculate) {
    let t, triangle, l, light, illuminance;

    // Update Geometry
    this.geometry.update();

    // Calculate the triangle colors
    if (calculate) {

        // Iterate through Triangles
        t = this.geometry.triangles.length - 1;
        for (t; t >= 0; t -= 1) {
            triangle = this.geometry.triangles[t];

            // Reset Triangle Color
            FSS.Vector4.set(triangle.color.rgba);

            // Iterate through Lights
            l = lights.length - 1;
            for (l; l >= 0; l -= 1) {

                light = lights[l];

                // Calculate Illuminance
                FSS.Vector3.subtractVectors(light.ray, light.position, triangle.centroid);
                FSS.Vector3.normalise(light.ray);

                illuminance = Math.max(FSS.Vector3.dot(triangle.normal, light.ray), 0);

                // Calculate Ambient Light
                FSS.Vector4.multiplyVectors(this.material.slave.rgba, this.material.ambient.rgba, light.ambient.rgba);
                FSS.Vector4.add(triangle.color.rgba, this.material.slave.rgba);

                // Calculate Diffuse Light
                FSS.Vector4.multiplyVectors(this.material.slave.rgba, this.material.diffuse.rgba, light.diffuse.rgba);
                FSS.Vector4.multiplyScalar(this.material.slave.rgba, illuminance);
                FSS.Vector4.add(triangle.color.rgba, this.material.slave.rgba);
            }

            // Clamp & Format Color
            FSS.Vector4.clamp(triangle.color.rgba, 0, 1);
        }
    }
    return this;
};

/**
 * @class Scene
 * @author Matthew Wagerfield
 */
FSS.Scene = function() {
    this.meshes = [];
    this.lights = [];
};

FSS.Scene.prototype = {
    add: function(object) {
        if (object instanceof FSS.Mesh && !~this.meshes.indexOf(object)) {
            this.meshes.push(object);
        } else if (object instanceof FSS.Light && !~this.lights.indexOf(object)) {
            this.lights.push(object);
        }
        return this;
    }
};

/**
 * @class Renderer
 * @author Matthew Wagerfield
 */
FSS.Renderer = function() {
    this.width = 0;
    this.height = 0;
    this.halfWidth = 0;
    this.halfHeight = 0;
};

FSS.Renderer.prototype = {
    setSize: function(width, height) {
        if (this.width === width && this.height === height) {
            return;
        }
        this.width = width;
        this.height = height;
        this.halfWidth = this.width * 0.5;
        this.halfHeight = this.height * 0.5;
        return this;
    },
    clear: function() {
        return this;
    },
    render: function() {
        return this;
    }
};

/**
 * @class Canvas Renderer
 * @author Matthew Wagerfield
 */
FSS.CanvasRenderer = function() {
    FSS.Renderer.call(this);
    this.element = document.createElement('canvas');
    this.element.style.display = 'block';
    this.context = this.element.getContext('2d');

    this.context.lineJoin = 'round';
    this.context.lineWidth = 1;

    this.setSize(this.element.width, this.element.height);
};

FSS.CanvasRenderer.prototype = Object.create(FSS.Renderer.prototype);

FSS.CanvasRenderer.prototype.setSize = function(width, height) {
    FSS.Renderer.prototype.setSize.call(this, width, height);
    this.element.width = width;
    this.element.height = height;
    this.context.setTransform(1, 0, 0, -1, this.halfWidth, this.halfHeight);
    return this;
};

FSS.CanvasRenderer.prototype.clear = function() {
    FSS.Renderer.prototype.clear.call(this);
    this.context.clearRect(-this.halfWidth, -this.halfHeight, this.width, this.height);
    return this;
};

FSS.CanvasRenderer.prototype.render = function(scene, callback) {

    FSS.Renderer.prototype.render.call(this, scene);

    let m, mesh, t, triangle, color;

    // Clear Context
    this.clear();

    // Update Meshes
    m = scene.meshes.length - 1;

    for (m; m >= 0; m -= 1) {

        mesh = scene.meshes[m];

        mesh.update(scene.lights, true);

        // Render Triangles
        t = mesh.geometry.triangles.length - 1;

        for (t; t >= 0; t -= 1) {
            triangle = mesh.geometry.triangles[t];
            color = triangle.color.format();
            this.context.beginPath();
            this.context.moveTo(triangle.a.position[0], triangle.a.position[1]);
            this.context.lineTo(triangle.b.position[0], triangle.b.position[1]);
            this.context.lineTo(triangle.c.position[0], triangle.c.position[1]);
            this.context.strokeStyle = color;
            this.context.fillStyle = color;
            this.context.stroke();
            this.context.fill();
            this.context.closePath();
        }

    }

    if (callback !== undefined) {
        callback();
    }

    return this;
};

export default FSS;

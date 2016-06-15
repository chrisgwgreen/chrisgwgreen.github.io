let epsilon = 9.5367431640625e-7;

let Delaunay = {

  supertriangle: vertices => {

    let xmin = Number.POSITIVE_INFINITY;
    let ymin = Number.POSITIVE_INFINITY;
    let xmax = Number.NEGATIVE_INFINITY;
    let ymax = Number.NEGATIVE_INFINITY;
    let i = vertices.length - 1;
    let dx;
    let dy;
    let dmax;
    let xmid;
    let ymid;

    for (i; i >= 0; i -= 1) {

      if (vertices[i][0] < xmin) {
        xmin = vertices[i][0];
      }

      if (vertices[i][0] > xmax) {
        xmax = vertices[i][0];
      }

      if (vertices[i][1] < ymin) {
        ymin = vertices[i][1];
      }

      if (vertices[i][1] > ymax) {
        ymax = vertices[i][1];
      }

    }

    dx = xmax - xmin;
    dy = ymax - ymin;
    dmax = Math.max(dx, dy);
    xmid = xmin + dx * 0.5;
    ymid = ymin + dy * 0.5;

    return [
      [xmid - 20 * dmax, ymid - dmax],
      [xmid, ymid + 20 * dmax],
      [xmid + 20 * dmax, ymid - dmax]
    ];

  },

  circumcircle: (vertices, i, j, k) => {

    let x1 = vertices[i][0];
    let y1 = vertices[i][1];
    let x2 = vertices[j][0];
    let y2 = vertices[j][1];
    let x3 = vertices[k][0];
    let y3 = vertices[k][1];
    let fabsy1y2 = Math.abs(y1 - y2);
    let fabsy2y3 = Math.abs(y2 - y3);
    let xc;
    let yc;
    let m1;
    let m2;
    let mx1;
    let mx2;
    let my1;
    let my2;
    let dx;
    let dy;

    if (fabsy1y2 < epsilon) {
      m2 = -((x3 - x2) / (y3 - y2));
      mx2 = (x2 + x3) / 2.0;
      my2 = (y2 + y3) / 2.0;
      xc = (x2 + x1) / 2.0;
      yc = m2 * (xc - mx2) + my2;
    } else if (fabsy2y3 < epsilon) {
      m1 = -((x2 - x1) / (y2 - y1));
      mx1 = (x1 + x2) / 2.0;
      my1 = (y1 + y2) / 2.0;
      xc = (x3 + x2) / 2.0;
      yc = m1 * (xc - mx1) + my1;
    } else {
      m1 = -((x2 - x1) / (y2 - y1));
      m2 = -((x3 - x2) / (y3 - y2));
      mx1 = (x1 + x2) / 2.0;
      mx2 = (x2 + x3) / 2.0;
      my1 = (y1 + y2) / 2.0;
      my2 = (y2 + y3) / 2.0;
      xc = (m1 * mx1 - m2 * mx2 + my2 - my1) / (m1 - m2);
      yc = (fabsy1y2 > fabsy2y3) ? m1 * (xc - mx1) + my1 : m2 * (xc - mx2) + my2;
    }

    dx = x2 - xc;
    dy = y2 - yc;

    return {
      i: i,
      j: j,
      k: k,
      x: xc,
      y: yc,
      r: dx * dx + dy * dy
    };
  },

  dedup: edges => {

    let i;
    let j = edges.length - 1;
    let a;
    let b;
    let m;
    let n;

    for (j; j > 0; j -= 1) {

      b = edges[j];
      j -= 1;
      a = edges[j];
      i = j - 1;

      for (i; i > 0; i -= 1) {
        n = edges[i];
        i -= 1;
        m = edges[i];

        if ((a === m && b === n) || (a === n && b === m)) {
          edges.splice(j, 2);
          edges.splice(i, 2);
          break;
        }
      }
    }
  },

  triangulate: vertices => {

    let n = vertices.length;
    let i;
    let j;
    let indices;
    let st;
    let open;
    let closed;
    let edges;
    let dx;
    let dy;
    let a;
    let b;
    let c;

    vertices = vertices.slice(0);
    indices = [];
    i = n - 1;

    for (i; i >= 0; i -= 1) {
      indices[i] = i;
    }

    indices.sort((i, j) => {
      return vertices[j][0] - vertices[i][0];
    });

    st = Delaunay.supertriangle(vertices);
    vertices.push(st[0], st[1], st[2]);
    open = [Delaunay.circumcircle(vertices, n, n + 1, n + 2)];
    closed = [];
    edges = [];
    i = indices.length - 1;

    for (i; i >= 0; i -= 1) {

      edges.length = 0;
      c = indices[i];
      j = open.length - 1;

      for (j; j >= 0; j -= 1) {

        dx = vertices[c][0] - open[j].x;
        if (dx > 0.0 && dx * dx > open[j].r) {
          closed.push(open[j]);
          open.splice(j, 1);
        } else {
          dy = vertices[c][1] - open[j].y;
          if (dx * dx + dy * dy - open[j].r <= epsilon) {
            edges.push(
              open[j].i,
              open[j].j,
              open[j].j,
              open[j].k,
              open[j].k,
              open[j].i
            );

            open.splice(j, 1);
          }
        }
      }

      Delaunay.dedup(edges);

      j = edges.length - 1;
      for (j; j >= 0; j -= 1) {
        b = edges[j];
        j -= 1;
        a = edges[j];
        open.push(Delaunay.circumcircle(vertices, a, b, c));
      }
    }

    i = open.length - 1;

    for (i; i >= 0; i -= 1) {
      closed.push(open[i]);
    }

    open.length = 0;
    i = closed.length - 1;

    for (i; i >= 0; i -= 1) {
      if (closed[i].i < n && closed[i].j < n && closed[i].k < n) {
        open.push(closed[i].i, closed[i].j, closed[i].k);
      }
    }

    return open;
  },

  contains: (tri, p) => {

    if ((p[0] < tri[0][0] && p[0] < tri[1][0] && p[0] < tri[2][0]) ||
      (p[0] > tri[0][0] && p[0] > tri[1][0] && p[0] > tri[2][0]) ||
      (p[1] < tri[0][1] && p[1] < tri[1][1] && p[1] < tri[2][1]) ||
      (p[1] > tri[0][1] && p[1] > tri[1][1] && p[1] > tri[2][1])) {
      return null;
    }

    let a = tri[1][0] - tri[0][0];
    let b = tri[2][0] - tri[0][0];
    let c = tri[1][1] - tri[0][1];
    let d = tri[2][1] - tri[0][1];
    let i = a * d - b * c;
    let u;
    let v;

    if (i === 0.0) {
      return null;
    }

    u = (d * (p[0] - tri[0][0]) - b * (p[1] - tri[0][1])) / i;
    v = (a * (p[1] - tri[0][1]) - c * (p[0] - tri[0][0])) / i;

    if (u < 0.0 || v < 0.0 || (u + v) > 1.0) {
      return null;
    }

    return [u, v];
  }

};

export default Delaunay;
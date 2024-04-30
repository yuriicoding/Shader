import { Mat4 } from './math.js';
import { Parser } from './parser.js';
import { Scene } from './scene.js';
import { Renderer } from './renderer.js';
import { TriangleMesh } from './trianglemesh.js';
// DO NOT CHANGE ANYTHING ABOVE HERE

////////////////////////////////////////////////////////////////////////////////
// TODO: Implement createCube, createSphere, computeTransformation, and shaders
////////////////////////////////////////////////////////////////////////////////

// Example two triangle quad
const quad = {
  positions: [-1, -1, -1, 1, -1, -1, 1, 1, -1, -1, -1, -1, 1,  1, -1, -1,  1, -1],
  normals: [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
  uvCoords: [0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1]
}

TriangleMesh.prototype.createCube = function() {
  // TODO: populate unit cube vertex positions, normals, and uv coordinates
  // this.positions = quad.positions;
  // this.normals = quad.normals;
  // this.uvCoords = quad.uvCoords;

  // Vertex positions
  this.positions = [
    //Front
    -1, -1,  1, -1,  1,  1,  1,  1,  1,  
    -1, -1,  1,  1,  1,  1,  1, -1,  1,
    //Back
    -1, -1, -1, -1,  1, -1,  1,  1, -1, 
    -1, -1, -1,  1,  1, -1,  1, -1, -1,
    //Top
    -1,  1,  1, -1,  1, -1,  1,  1, -1, 
    -1,  1,  1,  1,  1, -1,  1,  1,  1,
    //Bottom
    -1, -1,  1, -1, -1, -1,  1, -1, -1,  
    -1, -1,  1,  1, -1, -1,  1, -1,  1,
    //Right
     1, -1,  1,  1,  1,  1,  1,  1, -1,  
     1, -1,  1,  1,  1, -1,  1, -1, -1,
    //Left
    -1, -1,  1, -1,  1,  1, -1,  1, -1,  
    -1, -1,  1, -1,  1, -1, -1, -1, -1
  ];

  // Normals
  this.normals = [
    // Front
    0, 0, 1,  0, 0, 1,  0, 0, 1,
    0, 0, 1,  0, 0, 1,  0, 0, 1,
    // Back
    0, 0, -1, 0, 0, -1, 0, 0, -1,
    0, 0, -1, 0, 0, -1, 0, 0, -1,
    // Top
    0, 1, 0,  0, 1, 0,  0, 1, 0,
    0, 1, 0,  0, 1, 0,  0, 1, 0,
    // Bottom
    0, -1, 0, 0, -1, 0, 0, -1, 0,
    0, -1, 0, 0, -1, 0, 0, -1, 0,
    // Right
    1, 0, 0, 1, 0, 0, 1, 0, 0,
    1, 0, 0, 1, 0, 0, 1, 0, 0,
    // Left
    -1, 0, 0,  -1, 0, 0,  -1, 0, 0,
    -1, 0, 0,  -1, 0, 0,  -1, 0, 0
  ];

  this.uvCoords = [
    // Front
    0, 0.66, 0,1, 0.5, 1, 0, 0.66, 0.5, 1, 0.5, 0.66,
    // Back
    0.5, 0, 0.5, 0.33, 1, 0.33, 0.5, 0,  1, 0.33, 1, 0,
    // Top
    0, 0, 0, 0.33, 0.5, 0.33, 0, 0, 0.5, 0.33, 0.5, 0,
    // Bottom
    0.5, 0.66, 0.5, 1, 1, 1, 0.5, 0.66, 1, 1, 1, 0.66,
    // Right
    0, 0.33, 0, 0.66, 0.5, 0.66, 0, 0.33, 0.5, 0.66, 0.5, 0.33,
    // Left
    0.5, 0.33, 0.5, 0.66, 1, 0.66, 0.5, 0.33, 1, 0.66, 1, 0.33
  ];
}

TriangleMesh.prototype.createSphere = function(numStacks, numSectors) {
  // TODO: populate unit sphere vertex positions, normals, uv coordinates, and indices
  // this.positions = quad.positions.slice(0, 9).map(p => p * 0.5);
  // this.normals = quad.normals.slice(0, 9);
  // this.uvCoords = quad.uvCoords.slice(0, 6);
  // this.indices = [0, 1, 2];

  this.positions = [];
  this.normals = [];
  this.uvCoords = [];
  this.indices = [];

  var vertices = [];
  var radius = 1;
  let x, y, z, xy;
  let nx, ny, nz, lengthInv = 1 / radius;
  let s, t;

  let sectorStep = 2 * Math.PI / numSectors;
  let stackStep = Math.PI / numStacks;
  let sectorAngle, stackAngle; 

  for(var i = 0; i <= numStacks; ++i)
  {
      stackAngle = Math.PI / 2 - i * stackStep;
      xy = radius * Math.cos(stackAngle);
      z = radius * Math.sin(stackAngle);

      for(var j = 0; j <= numSectors; ++j)
      {
          sectorAngle = -j * sectorStep;

          x = xy * Math.cos(sectorAngle);
          y = xy * Math.sin(sectorAngle);
          vertices.push(x);
          vertices.push(y);
          vertices.push(z);

          nx = x * lengthInv;
          ny = y * lengthInv;
          nz = z * lengthInv;
          this.normals.push(nx);
          this.normals.push(ny);
          this.normals.push(nz);

          s = j / numSectors;
          t = i / numStacks;
          this.uvCoords.push(s);
          this.uvCoords.push(t);
      }
    }

  for(let i = 0; i < numStacks; ++i){
    let k1 = i * (numSectors + 1);
    let k2 = k1 + numSectors + 1;
    for(let j = 0; j < numSectors; ++j, ++k1, ++k2){
      if(i !== 0){
        this.indices.push(k1, k2, k1 + 1);
      }
      if(i !== (numStacks-1)){
        this.indices.push(k1 + 1, k2, k2 + 1);
      }
    }
  }
  this.positions = vertices;
}

Scene.prototype.computeTransformation = function(transformSequence) {
  // TODO: go through transform sequence and compose into overallTransform
  let overallTransform = Mat4.create();  // identity matrix

  transformSequence.forEach(transform => {
    let type = transform[0];
    let args = transform.slice(1).map(Number);
    let matrix = Mat4.create();

    switch (type) {
      case 'T':
        let [tx, ty, tz] = args;
        matrix = [
          1, 0, 0, 0,
          0, 1, 0, 0,
          0, 0, 1, 0,
          tx, ty, tz, 1
        ];
        break;
      case 'S':
        let [sx, sy, sz] = args;
        matrix = [
          sx, 0, 0, 0,
          0, sy, 0, 0,
          0, 0, sz, 0,
          0, 0, 0, 1
        ];
        break;
      case 'Rx':
        let thetaX = -args[0] * Math.PI / 180;
        matrix = [
          1, 0, 0, 0,
          0, Math.cos(thetaX), -Math.sin(thetaX), 0,
          0, Math.sin(thetaX), Math.cos(thetaX), 0,
          0, 0, 0, 1
        ];
        break;
      case 'Ry':
        let thetaY = -args[0] * Math.PI / 180;
        matrix = [
          Math.cos(thetaY), 0, Math.sin(thetaY), 0,
          0, 1, 0, 0,
          -Math.sin(thetaY), 0, Math.cos(thetaY), 0,
          0, 0, 0, 1
        ];
        break;
      case 'Rz':
        let thetaZ = -args[0] * Math.PI / 180;
        matrix = [
          Math.cos(thetaZ), -Math.sin(thetaZ), 0, 0,
          Math.sin(thetaZ), Math.cos(thetaZ), 0, 0,
          0, 0, 1, 0,
          0, 0, 0, 1
        ];
        break;
    }
    overallTransform = multiplyMatrices(overallTransform, matrix);
  });
  return overallTransform;
}

function multiplyMatrices(a, b) {
  let result = new Array(16).fill(0);
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      for (let k = 0; k < 4; k++) {
        result[row * 4 + col] += a[row * 4 + k] * b[k * 4 + col];
      }
    }
  }
  return result;
}

Renderer.prototype.VERTEX_SHADER = `
precision mediump float;
attribute vec3 position, normal;
attribute vec2 uvCoord;

uniform vec3 lightPosition;
uniform mat4 projectionMatrix, viewMatrix, modelMatrix;
uniform mat3 normalMatrix;

varying vec2 vTexCoord;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vLightPosition;

void main() {
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);

    vNormal = normalize(normalMatrix * normal);

    vPosition = (viewMatrix * modelMatrix * vec4(position, 1.0)).xyz;

    vTexCoord = uvCoord;

    vLightPosition = (viewMatrix * vec4(lightPosition, 1.0)).xyz;
}
`;

Renderer.prototype.FRAGMENT_SHADER = `
precision mediump float;
uniform vec3 ka, kd, ks, lightIntensity;
uniform float shininess;
uniform sampler2D uTexture;
uniform bool hasTexture;
varying vec2 vTexCoord;

// TODO: implement fragment shader logic below

varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vLightPosition;

void main() {

    vec3 norm = normalize(vNormal);
    vec3 lightDir = vLightPosition - vPosition;
    vec3 viewDir = normalize(-vPosition);
    vec3 reflectDir = normalize(lightDir + viewDir);

    float dis = length(lightDir);
    float distance = dis*dis;

    lightDir = normalize(lightDir);

    float lambertian = max(dot(norm, lightDir), 0.0);

    float spec = 0.0;
    if(lambertian > 0.0) 
    {
      spec = pow(max(dot(reflectDir, norm), 0.0), shininess);
    }

    gl_FragColor = vec4(ka * lightIntensity + kd * lambertian * lightIntensity + ks/distance * spec * lightIntensity, 1.0);

    if (hasTexture) {
      gl_FragColor = gl_FragColor * texture2D(uTexture, vTexCoord);
    }
    
}
`;

////////////////////////////////////////////////////////////////////////////////
// EXTRA CREDIT: change DEF_INPUT to create something interesting!
////////////////////////////////////////////////////////////////////////////////
const DEF_INPUT = [
  "c,myCamera,perspective,5,5,5,0,0,0,0,1,0;",
  "l,myLight,point,0,5,0,2,2,2;",
  "p,unitCube,cube;",
  "p,unitSphere,sphere,20,20;",
  "m,redDiceMat,0.3,0,0,0.7,0,0,1,1,1,15,dice.jpg;",
  "m,grnDiceMat,0,0.3,0,0,0.7,0,1,1,1,15,dice.jpg;",
  "m,bluDiceMat,0,0,0.3,0,0,0.7,1,1,1,15,dice.jpg;",
  "m,globeMat,0.3,0.3,0.3,0.7,0.7,0.7,1,1,1,5,globe.jpg;",
  "o,rd,unitCube,redDiceMat;",
  "o,gd,unitCube,grnDiceMat;",
  "o,bd,unitCube,bluDiceMat;",
  "o,gl,unitSphere,globeMat;",
  "X,rd,Rz,75;X,rd,Rx,90;X,rd,S,0.5,0.5,0.5;X,rd,T,-1,0,2;",
  "X,gd,Ry,45;X,gd,S,0.5,0.5,0.5;X,gd,T,2,0,2;",
  "X,bd,S,0.5,0.5,0.5;X,bd,Rx,90;X,bd,T,2,0,-1;",
  "X,gl,S,1.5,1.5,1.5;X,gl,Rx,90;X,gl,Ry,-150;X,gl,T,0,1.5,0;",
].join("\n");

// DO NOT CHANGE ANYTHING BELOW HERE
export { Parser, Scene, Renderer, DEF_INPUT };

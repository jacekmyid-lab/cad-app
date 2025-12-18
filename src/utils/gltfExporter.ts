import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import type { CADObject } from '../types/cad';

export async function exportToGLTF(objects: CADObject[]): Promise<void> {
  const scene = new THREE.Scene();

  // Tworzenie geometrii dla każdego obiektu
  objects.forEach(obj => {
    let geometry: THREE.BufferGeometry;
    
    switch (obj.type) {
      case 'box':
        geometry = new THREE.BoxGeometry(
          obj.metadata.dimensions?.width || 1,
          obj.metadata.dimensions?.height || 1,
          obj.metadata.dimensions?.depth || 1
        );
        break;
      case 'sphere':
        geometry = new THREE.SphereGeometry(
          obj.metadata.dimensions?.radius || 0.5,
          32,
          32
        );
        break;
      case 'cylinder':
        geometry = new THREE.CylinderGeometry(
          obj.metadata.dimensions?.radius || 0.5,
          obj.metadata.dimensions?.radius || 0.5,
          obj.metadata.dimensions?.length || 1,
          32
        );
        break;
      case 'plane':
        geometry = new THREE.PlaneGeometry(2, 2);
        break;
      case 'sketch':
        geometry = new THREE.PlaneGeometry(1, 1);
        break;
      default:
        return;
    }

    const material = new THREE.MeshStandardMaterial({
      color: obj.metadata.color || '#3b82f6'
    });

    const mesh = new THREE.Mesh(geometry, material);
    
    // Ustawienie transformacji
    mesh.position.set(...obj.transform.position);
    mesh.rotation.set(
      ...obj.transform.rotation.map(r => (r * Math.PI) / 180) as [number, number, number]
    );
    mesh.scale.set(...obj.transform.scale);
    
    // Dodanie metadanych CAD jako userData
    mesh.userData = {
      cadType: obj.type,
      cadName: obj.name,
      cadMetadata: obj.metadata
    };

    scene.add(mesh);
  });

  // Eksport do glTF
  const exporter = new GLTFExporter();
  
  exporter.parse(
    scene,
    (gltf) => {
      const output = JSON.stringify(gltf, null, 2);
      const blob = new Blob([output], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `cad_export_${Date.now()}.gltf`;
      link.click();
      
      URL.revokeObjectURL(url);
    },
    (error) => {
      console.error('Błąd podczas eksportu:', error);
      alert('Błąd podczas eksportu do glTF!');
    },
    { binary: false }
  );
}
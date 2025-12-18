import type { CADObject, PrimitiveType } from '../types/cad';

export function createObject(type: PrimitiveType, count: number): CADObject {
  return {
    id: `obj_${Date.now()}`,
    type,
    name: `${type}_${count + 1}`,
    metadata: {
      dimensions: type === 'box' 
        ? { width: 1, height: 1, depth: 1 }
        : type === 'sphere'
        ? { radius: 0.5 }
        : type === 'cylinder'
        ? { radius: 0.5, length: 1 }
        : {},
      smoothness: 1,
      tolerance: 0.01,
      color: '#3b82f6'
    },
    transform: {
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1]
    }
  };
}
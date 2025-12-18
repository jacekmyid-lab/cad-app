export type PrimitiveType = 'box' | 'sphere' | 'cylinder' | 'sketch' | 'plane';

export type SketchMode = 'none' | 'drawing' | 'extruding';

export interface CADMetadata {
  sketchData: any;
  dimensions?: {
    width?: number;
    height?: number;
    depth?: number;
    radius?: number;
    length?: number;
  };
  smoothness?: number;
  tolerance?: number;
  color?: string;
}

export interface SketchPoint {
  x: number;
  y: number;
}

export interface SketchData {
  points: SketchPoint[];
  closed: boolean;
  planePosition: [number, number, number];
  planeRotation: [number, number, number];
  extrudeHeight?: number;
}


export interface CADObject {
  id: string;
  type: PrimitiveType;
  name: string;
  metadata: CADMetadata;
  transform: {
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
  };
}

export type Tool = 'select' | 'box' | 'sphere' | 'cylinder' | 'sketch' | 'plane' | 'rotate';
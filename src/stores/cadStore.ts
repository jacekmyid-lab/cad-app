import { writable } from 'svelte/store';
import type { CADObject, Tool, SketchMode } from '../types/cad';

export const activeTool = writable<Tool>('select');
export const objects = writable<CADObject[]>([]);
export const selectedObjectId = writable<string | null>(null);
export const sketchMode = writable<SketchMode>('none');
export const currentSketchId = writable<string | null>(null);
export const isExtruding = writable<boolean>(false);
export const extrudeHeight = writable<number>(1);
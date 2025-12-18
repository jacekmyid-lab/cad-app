<script lang="ts">
  import { useThrelte } from '@threlte/core';
  import { onMount, onDestroy } from 'svelte';
  import * as THREE from 'three';
  import { TransformControls as ThreeTransformControls } from 'three/examples/jsm/controls/TransformControls.js';
  import { activeTool, selectedObjectId, objects } from '../stores/cadStore';

  interface Props {
    orbitControls: any;
  }

  let { orbitControls }: Props = $props();

  const { scene, camera, renderer } = useThrelte();
  let transformControls: ThreeTransformControls | null = null;
  let currentObject: THREE.Object3D | null = null;

  onMount(() => {
    // @ts-ignore - Threlte ma dziwne typy dla camera i renderer
    const cam: THREE.Camera = camera.current || camera;
    // @ts-ignore
    const rend: THREE.WebGLRenderer = renderer.current || renderer;
    
    if (!cam || !rend) {
      console.error('Camera or renderer not available');
      return;
    }

    console.log('TransformControls: Initializing...');
    transformControls = new ThreeTransformControls(cam, rend.domElement);
    transformControls.size = 0.8;
    
    // Wyłącz OrbitControls podczas transformacji
    transformControls.addEventListener('dragging-changed', (event: any) => {
      console.log('TransformControls: Dragging changed', event.value);
      if (orbitControls) {
        orbitControls.enabled = !event.value;
      }
    });

    // Aktualizuj pozycję obiektu podczas przesuwania
    transformControls.addEventListener('objectChange', () => {
      if (currentObject && $selectedObjectId) {
        const position = currentObject.position;
        const rotation = currentObject.rotation;
        const scale = currentObject.scale;

        console.log('TransformControls: Object changed', position);

        objects.update(objs => objs.map(obj => {
          if (obj.id === $selectedObjectId) {
            return {
              ...obj,
              transform: {
                position: [position.x, position.y, position.z],
                rotation: [
                  (rotation.x * 180) / Math.PI,
                  (rotation.y * 180) / Math.PI,
                  (rotation.z * 180) / Math.PI
                ],
                scale: [scale.x, scale.y, scale.z]
              }
            };
          }
          return obj;
        }));
      }
    });

    scene.add(transformControls as unknown as THREE.Object3D);
    console.log('TransformControls: Added to scene');
  });

  onDestroy(() => {
    if (transformControls) {
      scene.remove(transformControls as unknown as THREE.Object3D);
      transformControls.dispose();
      console.log('TransformControls: Cleaned up');
    }
  });

  // Aktualizuj tryb transformacji
  $effect(() => {
    if (transformControls) {
      console.log('TransformControls: Mode changed to', $activeTool);
      switch ($activeTool) {
        case 'select':
          transformControls.setMode('translate');
          break;
        case 'rotate':
          transformControls.setMode('rotate');
          break;
        default:
          transformControls.setMode('translate');
      }
    }
  });

  // Aktualizuj zaznaczony obiekt
  $effect(() => {
    if (!transformControls) return;

    console.log('TransformControls: Selected object changed', $selectedObjectId);

    if ($selectedObjectId) {
      // Znajdź obiekt THREE.js w scenie - szukaj w Group'ach
      let foundObject: THREE.Object3D | null = null;
      
      scene.traverse((child) => {
        if (child.userData?.cadId === $selectedObjectId) {
          foundObject = child;
          console.log('TransformControls: Found object', child);
        }
      });

      if (foundObject) {
        currentObject = foundObject;
        transformControls.attach(foundObject);
        console.log('TransformControls: Attached to object');
      } else {
        transformControls.detach();
        currentObject = null;
        console.log('TransformControls: Object not found in scene');
      }
    } else {
      transformControls.detach();
      currentObject = null;
      console.log('TransformControls: Detached');
    }
  });
</script>
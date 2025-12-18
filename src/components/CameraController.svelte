<script lang="ts">
  import { useThrelte } from '@threlte/core';
  import { onMount } from 'svelte';
  import * as THREE from 'three';
  import { sketchMode } from '../stores/cadStore';

  const { camera } = useThrelte();
  
  let originalPosition = new THREE.Vector3(5, 5, 5);
  let originalRotation = new THREE.Euler();
  let isAnimating = false;

  // Zapisz początkową pozycję kamery
  onMount(() => {
    // @ts-ignore
    const cam = camera.current || camera;
    if (cam) {
      originalPosition.copy(cam.position);
      originalRotation.copy(cam.rotation);
    }
  });

  // Reaguj na zmianę sketch mode
  $effect(() => {
    if (isAnimating) return;

    // @ts-ignore
    const cam = camera.current || camera;
    if (!cam) return;

    if ($sketchMode === 'drawing') {
      // Zapisz aktualną pozycję przed animacją
      originalPosition.copy(cam.position);
      originalRotation.copy(cam.rotation);
      
      // Animuj do widoku sketch (ortogonalny widok z góry, bliżej)
      animateCamera(cam, new THREE.Vector3(0, 0, 15), new THREE.Euler(0, 0, 0));
    } else if ($sketchMode === 'none') {
      // Wróć do oryginalnej pozycji
      animateCamera(cam, originalPosition, originalRotation);
    }
  });

  function animateCamera(cam: any, targetPosition: THREE.Vector3, targetRotation: THREE.Euler) {
    isAnimating = true;

    const startPosition = cam.position.clone();
    const startRotation = cam.rotation.clone();
    const duration = 1000; // ms
    const startTime = Date.now();

    function animate() {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-in-out cubic)
      const eased = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      // Interpoluj pozycję
      cam.position.lerpVectors(startPosition, targetPosition, eased);

      // Interpoluj rotację
      cam.rotation.x = startRotation.x + (targetRotation.x - startRotation.x) * eased;
      cam.rotation.y = startRotation.y + (targetRotation.y - startRotation.y) * eased;
      cam.rotation.z = startRotation.z + (targetRotation.z - startRotation.z) * eased;

      // Upewnij się że kamera patrzy na środek
      cam.lookAt(0, 0, 0);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        isAnimating = false;
      }
    }

    animate();
  }
</script>
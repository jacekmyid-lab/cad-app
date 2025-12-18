<script lang="ts">
  import { T } from '@threlte/core';
  import type { CADObject } from '../types/cad';
  import * as THREE from 'three';

  interface Props {
    object: CADObject;
    selected?: boolean;
    onselect?: () => void;
  }

  let { object, selected = false, onselect }: Props = $props();
  let hovered = $state(false);
  
  let position = $derived(object.transform.position);
  let rotation = $derived(object.transform.rotation.map(r => (r * Math.PI) / 180) as [number, number, number]);
  let scale = $derived(object.transform.scale);
  let color = $derived(object.metadata.color || '#3b82f6');

  // Tworzenie geometrii dla edges
  let boxGeometry = $derived(object.type === 'box' ? new THREE.BoxGeometry(
    object.metadata.dimensions?.width || 1,
    object.metadata.dimensions?.height || 1,
    object.metadata.dimensions?.depth || 1
  ) : null);
  
  let sphereGeometry = $derived(object.type === 'sphere' ? new THREE.SphereGeometry(
    object.metadata.dimensions?.radius || 0.5,
    32,
    32
  ) : null);
  
  let cylinderGeometry = $derived(object.type === 'cylinder' ? new THREE.CylinderGeometry(
    object.metadata.dimensions?.radius || 0.5,
    object.metadata.dimensions?.radius || 0.5,
    object.metadata.dimensions?.length || 1,
    32
  ) : null);
</script>

<T.Group {position} rotation={rotation} {scale}>
  {#if object.type === 'box'}
    <T.Mesh
      interactive
      castShadow
      receiveShadow
      onclick={() => {
        console.log('Box clicked!');
        onselect?.();
      }}
      onpointerenter={() => {
        console.log('Box hover');
        hovered = true;
      }}
      onpointerleave={() => {
        console.log('Box leave');
        hovered = false;
      }}
    >
      <T.BoxGeometry 
        args={[
          object.metadata.dimensions?.width || 1,
          object.metadata.dimensions?.height || 1,
          object.metadata.dimensions?.depth || 1
        ]} 
      />
      <T.MeshStandardMaterial 
        color={color} 
        emissive={selected ? '#ffff00' : hovered ? '#4444ff' : '#000000'}
        emissiveIntensity={selected ? 0.3 : hovered ? 0.2 : 0}
      />
    </T.Mesh>
    {#if boxGeometry}
      <T.LineSegments>
        <T.EdgesGeometry args={[boxGeometry]} />
        <T.LineBasicMaterial
          color={hovered ? '#ff0000' : selected ? '#ffff00' : '#000000'}
        />
      </T.LineSegments>
    {/if}

  {:else if object.type === 'sphere'}
    <T.Mesh
      interactive
      castShadow
      receiveShadow
      onclick={() => {
        console.log('Sphere clicked!');
        onselect?.();
      }}
      onpointerenter={() => {
        console.log('Sphere hover');
        hovered = true;
      }}
      onpointerleave={() => {
        console.log('Sphere leave');
        hovered = false;
      }}
    >
      <T.SphereGeometry 
        args={[
          object.metadata.dimensions?.radius || 0.5,
          32,
          32
        ]} 
      />
      <T.MeshStandardMaterial 
        color={color}
        emissive={selected ? '#ffff00' : hovered ? '#4444ff' : '#000000'}
        emissiveIntensity={selected ? 0.3 : hovered ? 0.2 : 0}
      />
    </T.Mesh>
    {#if sphereGeometry}
      <T.LineSegments>
        <T.EdgesGeometry args={[sphereGeometry]} />
        <T.LineBasicMaterial 
          color={hovered ? '#ff0000' : selected ? '#ffff00' : '#000000'} 
        />
      </T.LineSegments>
    {/if}

  {:else if object.type === 'cylinder'}
    <T.Mesh
      interactive
      castShadow
      receiveShadow
      onclick={() => {
        console.log('Cylinder clicked!');
        onselect?.();
      }}
      onpointerenter={() => {
        console.log('Cylinder hover');
        hovered = true;
      }}
      onpointerleave={() => {
        console.log('Cylinder leave');
        hovered = false;
      }}
    >
      <T.CylinderGeometry 
        args={[
          object.metadata.dimensions?.radius || 0.5,
          object.metadata.dimensions?.radius || 0.5,
          object.metadata.dimensions?.length || 1,
          32
        ]} 
      />
      <T.MeshStandardMaterial 
        color={color}
        emissive={selected ? '#ffff00' : hovered ? '#4444ff' : '#000000'}
        emissiveIntensity={selected ? 0.3 : hovered ? 0.2 : 0}
      />
    </T.Mesh>
    {#if cylinderGeometry}
      <T.LineSegments>
        <T.EdgesGeometry args={[cylinderGeometry]} />
        <T.LineBasicMaterial 
          color={hovered ? '#ff0000' : selected ? '#ffff00' : '#000000'} 
        />
      </T.LineSegments>
    {/if}

  {:else if object.type === 'plane'}
    <T.Mesh
      interactive
      receiveShadow
      rotation={[-Math.PI / 2, 0, 0]}
      onclick={() => {
        console.log('Plane clicked!');
        onselect?.();
      }}
      onpointerenter={() => {
        console.log('Plane hover');
        hovered = true;
      }}
      onpointerleave={() => {
        console.log('Plane leave');
        hovered = false;
      }}
    >
      <T.PlaneGeometry args={[2, 2]} />
      <T.MeshStandardMaterial 
        color={color}
        side={2}
        emissive={selected ? '#ffff00' : hovered ? '#4444ff' : '#000000'}
        emissiveIntensity={selected ? 0.3 : hovered ? 0.2 : 0}
      />
    </T.Mesh>

  {:else if object.type === 'sketch'}
    <T.Mesh 
      interactive
      onclick={() => {
        console.log('Sketch clicked!');
        onselect?.();
      }}
      onpointerenter={() => {
        console.log('Sketch hover');
        hovered = true;
      }}
      onpointerleave={() => {
        console.log('Sketch leave');
        hovered = false;
      }}
    >
      <T.PlaneGeometry args={[1, 1]} />
      <T.MeshBasicMaterial 
        color={hovered ? '#ff0000' : selected ? '#ffff00' : color}
        side={2}
        wireframe={true}
      />
    </T.Mesh>
  {/if}
</T.Group>
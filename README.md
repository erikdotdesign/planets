# Planets — Figma Plugin  

Animated **3D renders** of the Sun, planets, dwarf planets, and moons — right inside Figma.  
Export still images or looping videos of celestial objects with full control over **lighting, rotation, and layers**.  

![cover](planets-cover.png) 

## Features  

- **21 celestial models** included:  
  Sun, Mercury, Venus, Earth, Moon, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto, Ganymede, Titan, Callisto, Io, Europa, Triton, Ceres, Haumea, Makemake, Eris

- **Controls for realism & style**  
  - Lighting intensity & direction  
  - Planetary rotation speed and tilt
  - Background, elevation, and atmosphere toggles

- **Export options**  
  - 1200×1200 still images (`.png`)  
  - Looping videos (`.webm`, up to 1 minute)  

- **Smart resizing**  
  - Export matches selection bounds  
  - Defaults to viewport size if nothing selected  

- **Theme support**  
  - Adapts seamlessly to Figma’s **Light** and **Dark** modes  

## Getting Started  

1. Open the **Figma Community** and search for **Planets** 
2. Select a frame or leave nothing selected to use your viewport  
3. Launch **Planets** from the plugin menu  
4. Choose your object, adjust settings, and **Render → Export**  

## Controls  

- **Object:** Pick a planet, dwarf planet, moon, or the sun  
- **Lighting:** Adjust intensity, position, and shadow detail  
- **Rotation:** Static or animated spin, with or without tilt
- **Layers:** Transparent or starfield background, plus optional elevation and atmosphere

## Exports  

- **Still Image (PNG):** 1200×1200 max resolution  
- **Animated Video (WEBM):** Up to 60 seconds  
- **Smart Fit:** Automatically scales export to match your selection or viewport  

## Development  

This plugin is built with:  
- [Three.js](https://threejs.org/) for 3D rendering  
- [Figma Plugin API](https://www.figma.com/plugin-docs/)  
- React + TypeScript  

## License 

MIT
# 🖼️ Image Comparator

An interactive image comparison tool built with **React** and **Vite**.  
Easily compare two images using a draggable slider, with optional zoom and drag features.

![demo](https://user-images.githubusercontent.com/your-gif-or-screenshot.gif)

## ✨ Features

- ⚖️ **Side-by-side comparison** of two images
- 🖱️ **Draggable slider** to reveal before/after sections
- 🔍 **Zoom** and **pan** support (mouse wheel + drag)
- 🔄 **Image switch** (via middle-click or right-click)
- 📂 **Drag and drop** image upload (single or both sides)
- 📏 Dynamic image labels with filenames and sizes
- 🎯 Reset button to restore zoom and position

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run the app
npm run dev
```

Then open your browser to http://localhost:5173

## 📁 Project Structure
.
├── img-comparator/
│   └── ReactCompareImage.tsx  # Main component
├── uploader/
│   └── ImageUploader.tsx      # Optional uploader (WIP)
├── App.tsx
├── main.tsx
└── index.css / img-compare.css

## 🛠️ Tech Stack
- React 18
- TypeScript
- Vite
- CSS Modules

## 📸 Sample Images
This project includes two test images (before.jpg and after.jpg) for demonstration purposes. Replace them with your own!

## 📄 License
MIT

--- 

# 🖼️ Comparateur d'Images

Un outil interactif de comparaison d’images, développé avec **React** et **Vite**.  
Comparez facilement deux images grâce à un curseur glissant, avec prise en charge du zoom, du déplacement et du glisser-déposer.

![démo](https://user-images.githubusercontent.com/ton-gif-ou-capture.gif)

## ✨ Fonctionnalités

- ⚖️ **Comparaison côte à côte** de deux images
- 🖱️ **Curseur glissable** pour révéler les zones avant/après
- 🔍 Support du **zoom** et du **déplacement** (molette + drag)
- 🔄 **Inversion des images** (clic du milieu ou clic droit)
- 📂 **Glisser-déposer** des images (une ou deux à la fois)
- 📏 Affichage dynamique du nom de fichier et de sa taille
- 🎯 Bouton de **réinitialisation** (zoom + position)

## 🚀 Lancer le projet

```bash
# Installer les dépendances
npm install

# Lancer l'application
npm run dev
```

Puis ouvrez votre navigateur à l’adresse http://localhost:5173

## 📁 Structure du projet
.
├── img-comparator/
│   └── ReactCompareImage.tsx  # Composant principal
├── uploader/
│   └── ImageUploader.tsx      # Uploader optionnel (en cours)
├── App.tsx
├── main.tsx
└── index.css / img-compare.css

## 🛠️ Stack Technique
- React 18
- TypeScript
- Vite
- CSS Modules

## 📄 Licence
MIT

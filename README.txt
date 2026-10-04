Mankar Dosa - Full website source

Extract this ZIP, then open index.html in your browser. No login or build required.

Runtime files: index.html, style.css, script.js, translations.js, assets/

Alternatively, open the folder in VS Code and use Live Server.
Google Fonts needs an internet connection; system fonts are used as fallback.
The design uses Tailwind CSS utility classes in index.html and plain JavaScript.
style.css is generated locally; keep it with the website when sharing or hosting.
Do not edit style.css directly.

To change the design:
1. Install Node.js, then run npm ci in this folder.
2. Edit Tailwind classes in index.html. Brand colors, fonts, breakpoints and
   animation definitions live in src/tailwind.css.
3. Run npm run build to regenerate style.css, or npm run dev to watch changes.

Only the theme and custom animation keyframes are handwritten CSS.

GitHub Pages: https://marutikesarkar.github.io/mankardosa/
Pages publishes the root folder of the main branch. After editing Tailwind
classes, run npm run build and commit style.css before pushing to main.
.nojekyll keeps GitHub Pages serving these files as a plain static website.
The build also versions local CSS and JavaScript URLs by their contents so
returning visitors load current assets instead of older cached files.

The English / मराठी buttons switch all website copy without reloading.
translations.js contains the English and Marathi text, image descriptions,
gallery captions and accessibility labels. The visitor's choice is saved in
browser storage when available. Phone numbers remain the same in both languages.

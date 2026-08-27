# Cape Coral butterflies

Local static preview of the first-ship field guide (20 species).

## Open

From this directory:

```
python3 -m http.server 8080
```

Then open http://127.0.0.1:8080/

`index.html` also opens as a file. Filters and chips do not need a server.

## Layout

- `index.html` — home list, date-ranked for late August
- `species/` — one HTML page per species
- `data/species.json` — copy fields and image paths (swap placeholders later)
- `css/guide.css`
- `js/guide.js` — filters (OR within a group, AND across) and America/New_York chips
- `img/` — 4:3 placeholder SVGs (hero / underside / caterpillar)

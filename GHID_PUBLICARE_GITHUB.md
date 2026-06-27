# GHID EXACT DE PUBLICARE PE GITHUB PAGES

Repository: `laboratorcdl/laboratorcdl.github.io`
Site public: `https://laboratorcdl.github.io/`

## 1. Alege o singura varianta pentru publicare

- `CDL_ULTRA_PREMIUM.zip` — imagine luxoasa, sofisticata, cu accent pe prestigiu.
- `CDL_CONVERSIE.zip` — accent pe solicitari de colaborare si pe trimiterea unui prim caz.
- `CDL_MULTIPAGE.zip` — site complet cu pagini separate: Acasa, Servicii, Implanturi, Portofoliu, Contact.

Recomandare pentru site-ul principal: `CDL_MULTIPAGE.zip`.

## 2. Regula cea mai importanta

NU urca fisierul ZIP in repository.

1. Descarca ZIP-ul ales.
2. Click dreapta pe el in Windows.
3. Alege `Extract All... / Extrage tot...`.
4. Deschide folderul extras.
5. Trebuie sa vezi direct `index.html`, `assets`, `robots.txt`, `sitemap.xml` si celelalte fisiere.
6. Urca ACESTE CONTINUTURI in radacina repository-ului, nu folderul exterior care le contine.

`index.html` trebuie sa fie direct in radacina repository-ului.

---

# METODA RECOMANDATA: GITHUB DESKTOP

Aceasta metoda face o inlocuire curata si elimina fisierele vechi ramase nefolosite.

## Pasul 1 — Pastreaza o copie de siguranta

1. Deschide repository-ul pe GitHub.
2. Apasa butonul verde `Code`.
3. Apasa `Download ZIP`.
4. Pastreaza arhiva actuala intr-un folder separat.

## Pasul 2 — Cloneaza repository-ul

1. Instaleaza si deschide GitHub Desktop.
2. Intra cu acelasi cont GitHub care detine repository-ul.
3. Apasa `File` → `Clone repository...`.
4. Selecteaza fila `URL`.
5. La Repository URL introdu:

   `https://github.com/laboratorcdl/laboratorcdl.github.io.git`

6. Alege un folder local usor de gasit.
7. Apasa `Clone`.

## Pasul 3 — Inlocuieste site-ul vechi

1. In GitHub Desktop apasa `Repository` → `Show in Explorer`.
2. In folderul deschis, sterge toate fisierele si folderele vizibile ale site-ului vechi.
3. NU sterge folderul ascuns `.git` si nu sterge folderul principal al repository-ului.
4. Deschide folderul extras al variantei alese.
5. Copiaza toate continuturile lui in folderul repository-ului clonat:
   - `index.html`
   - celelalte fisiere `.html`, daca exista
   - folderul `assets`
   - `404.html`
   - `robots.txt`
   - `sitemap.xml`
   - `.nojekyll`, daca este vizibil

## Pasul 4 — Publica modificarile

1. Revino in GitHub Desktop.
2. In partea stanga trebuie sa apara toate fisierele modificate, adaugate si sterse.
3. In campul `Summary` scrie:

   `Publicare nou site Laborator Dentar CDL`

4. Apasa `Commit to main`.
5. Apasa `Push origin`.

---

# METODA RAPIDA: DIRECT DIN BROWSER

Aceasta metoda este mai simpla, dar poate lasa in repository fisiere vechi nefolosite. Ele nu ar trebui sa afecteze site-ul daca `index.html` si folderul `assets` sunt suprascrise corect.

## Pasul 1

Deschide:

`https://github.com/laboratorcdl/laboratorcdl.github.io`

## Pasul 2

1. Ramai in fila `Code`.
2. Asigura-te ca branch-ul selectat este `main`.
3. Apasa `Add file`.
4. Apasa `Upload files`.

## Pasul 3

1. Deschide in Windows folderul extras al variantei alese.
2. Selecteaza TOATE continuturile din interior.
3. Trage-le in zona de upload GitHub.
4. Nu trage fisierul ZIP.
5. Nu trage doar folderul exterior al variantei.

## Pasul 4

1. La mesajul commitului scrie:

   `Actualizare completa site Laborator Dentar CDL`

2. Selecteaza `Commit directly to the main branch`.
3. Apasa `Commit changes`.

---

# ACTIVAREA / VERIFICAREA GITHUB PAGES

1. In repository, deschide `Settings`.
2. In meniul din stanga, la `Code and automation`, apasa `Pages`.
3. La `Build and deployment` seteaza:
   - `Source`: `Deploy from a branch`
   - `Branch`: `main`
   - Folder: `/(root)`
4. Apasa `Save`.
5. Deschide fila `Actions` si verifica daca deployment-ul GitHub Pages este verde.
6. Deschide:

   `https://laboratorcdl.github.io/`

7. Pentru reincarcarea completa in Chrome apasa `Ctrl + F5`.

---

# CE URCI PENTRU FIECARE VARIANTA

## Ultra Premium

- `index.html`
- `404.html`
- `robots.txt`
- `sitemap.xml`
- `.nojekyll`
- folderul complet `assets`

## Conversie

- `index.html`
- `404.html`
- `robots.txt`
- `sitemap.xml`
- `.nojekyll`
- folderul complet `assets`

## Multipage

- `index.html`
- `servicii.html`
- `implanturi.html`
- `portofoliu.html`
- `contact.html`
- `404.html`
- `robots.txt`
- `sitemap.xml`
- `.nojekyll`
- folderul complet `assets`

---

# ERORI DE EVITAT

1. Nu urca ZIP-ul ca site.
2. Nu lasa `index.html` intr-un subfolder de tipul `CDL_MULTIPAGE/index.html`.
3. Nu redenumi folderul `assets`.
4. Nu modifica extensiile imaginilor.
5. Nu sterge fisiere din `assets/images` fara sa modifici si paginile HTML.
6. Nu introduce parole, chei API sau date confidentiale in repository.
7. Nu folosi formularul pentru date identificabile ale pacientilor.

# DACA SITE-UL VECHI RAMANE VIZIBIL

1. Apasa `Ctrl + F5`.
2. Verifica in repository daca noul `index.html` este direct in radacina.
3. Verifica `Settings` → `Pages`: `main` si `/(root)`.
4. Verifica fila `Actions` pentru eroarea de deployment.
5. Verifica daca ai apasat `Push origin` in GitHub Desktop.

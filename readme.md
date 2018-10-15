## MakersMaker Editor
- This is a lecture page for online coding education flatform called MakersMaker.

### Feature
- A tutor & A tutee can pair programming by Live Editor feature
- Students can make a Video Call to a tutor for getting help directly
- Video Recording for review 

### Start Server
```sh
npm i
npm start
```

### Develop the editor
- This will start webpack dev server
```sh
# wevpack dev server
npm dev
# or to build
npm build
```

### Files Storage
- Files are stored in `api/public/files`
- whenever a file is edited, the changes are persisted in the server
- Synchronised among connected clients (browsers)

```sh
cd api
npm start
```

# to run this system, use these commands in the terminal

/backend 
```
npm i drizzle-orm pg dotenv
npm i -D drizzle-kit tsx @types/pg
npm install bcrypt jsonwebtoken

docker compose up -d
npx drizzle-kit push
node seed.js
npx drizzle-kit studio

npm start
```
/frontend
```
npm i react-router-dom

npm run dev
```
/backend/.env (include these lines )
```
DATABASE_URL=postgres://postgres:mypassword@localhost:5432/anydbname
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

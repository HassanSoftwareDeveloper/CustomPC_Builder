cd backend
npm install
npm run dev

cd frontend
npm install
npm run dev
## Production deployment

The recommended production setup is:

- **MongoDB Atlas** for the database
- **Render** for the `backend` Node/Express service
- **Vercel** for the `frontend` Vite application

### 1. Configure MongoDB Atlas

Create a database user and database in MongoDB Atlas. In **Network Access**, allow the IP ranges used by the backend host. Copy the Atlas connection string and replace its username, password, and database name.

### 2. Deploy the backend to Render

Create a new **Web Service** from this repository with:

- Root directory: `backend`
- Build command: `npm ci`
- Start command: `npm start`

Set these Render environment variables:

```text
MONGO_URI=<MongoDB Atlas connection string>
JWT_SECRET=<long random secret>
CLIENT_URL=https://<your-vercel-domain>
```

After deployment, verify `https://<your-render-domain>/api/health`.

### 3. Deploy the frontend to Vercel

Import the repository into Vercel and set the project root directory to `frontend`. Use `npm run build` with `dist` as the output directory, then add:

```text
VITE_API_URL=https://<your-render-domain>/api
```

Redeploy after setting the variable. The included `frontend/vercel.json` preserves React Router routes on refresh.

The example environment files are `backend/.env.example` and `frontend/.env.example`. Never commit real environment files, Atlas credentials, or JWT secrets.

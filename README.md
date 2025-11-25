PetCare SaaS — Project scaffold
==============================

Conteúdo:
- backend/ (Node.js + Express skeleton + migrations)
- frontend/ (React + Vite sample UI)
- docker-compose.yml (Postgres + Redis + backend + frontend)
- figma-design/ (assets + instructions to recreate design in Figma)

Como rodar (local):
1. Instale Docker e Docker Compose
2. Copie .env.example para backend/.env e ajuste variáveis (DATABASE_URL, JWT_SECRET, etc.)
3. rode: docker-compose up --build
4. Backend disponível em http://localhost:4000, Frontend em http://localhost:5173

Observações:
- Este é um scaffold inicial. Para produção, configure autenticação JWT real, SSL, variáveis seguras e jobs.
- A pasta figma-design contém imagens e um README com o design system (tokens, cores, tipografia) para importar no Figma.

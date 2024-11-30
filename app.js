const express = require("express");
const cors = require("cors");
const { PrismaClient } = require('@prisma/client'); // Importando Prisma Client

const prisma = new PrismaClient(); // Instanciando o cliente Prisma
const app = express();
const port = 3000;

// Middleware para tratar JSON
//app.use(cors()); // Habilitando CORS para permitir que o frontend acesse a API
//app.use(bodyParser.json()); // Para processar JSON no corpo da requisição

app.use(cors({
    origin: "*", // Permite todas as origens
  }));
  
app.use(express.json());

// Endpoint para cadastrar pessoa
app.post("/api/cadastrar", async (req, res) => {
    const { nome, sobrenome, cpf, telefone, email, senha } = req.body;
  
    if (!nome || !sobrenome || !cpf || !telefone || !email || !senha) {
      return res.status(400).json({ message: "Todos os campos são obrigatórios!" });
    }
  
    try {
      // Tenta criar o novo cadastro no banco de dados
      const pessoa = await prisma.pessoa.create({
        data: {
          nome: `${nome} ${sobrenome}`,
          cpf,
          senha,
          telefone,
          email,
        },
      });
  
      // Caso o cadastro seja bem-sucedido
      res.status(200).json({ message: "Cadastro realizado com sucesso!" });
    } catch (error) {
      // Captura do erro detalhado
      console.error("Erro ao salvar no banco de dados:", error);  // Log detalhado no servidor
  
      // Responde ao cliente com mais informações sobre o erro
      res.status(500).json({
        message: "Erro ao salvar no banco de dados.",
        error: error.message,  // Mensagem do erro
        stack: error.stack  // Rastro da execução (stack trace)
      });
    }
  });
  
  app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
  });

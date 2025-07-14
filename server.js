import express from "express";
import { PrismaClient } from "./generated/prisma/index.js";
import cors from 'cors'

const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(cors());

// cria personagem
app.post("/characters", async (req, res) => {
  try {
    const personagem = await prisma.character.create({
      data: {
        name: req.body.name,
        age: req.body.age,
        specie: req.body.specie,
        planet: req.body.planet,
        side: req.body.side,
        master: req.body.master || null,
      },
    });
    res.status(201).json({ message: "Personagem criado!", personagem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar personagem" });
  }
});

app.put("/characters/:id", async (req, res) => {
  try {
    const personagem = await prisma.character.update({
      where: {
        id: req.params.id,
      },
      data: {
        name: req.body.name,
        age: req.body.age,
        specie: req.body.specie,
        planet: req.body.planet,
        side: req.body.side,
        master: req.body.master || null,
      },
    });
    res.status(201).json({ message: "Personagem Editado!!", personagem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao editar personagem" });
  }
});


app.delete("/characters/:id", async (req, res) => {
  try {
    const personagem = await prisma.character.delete({
      where: {
        id: req.params.id
      },
    });
    res.status(201).json({ message: "Personagem Deletado!!", personagem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao deletar personagem" });
  }
});

// lista personagens
// app.get("/characters", async (req, res) => {
//   try {
//     const personagens = await prisma.character.findMany(); //findmany procura todos os personagens e retorna.
//     res.status(200).json(personagens);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Erro ao buscar personagens" });
//   }
// });





app.get("/characters", async (req, res) => {
  try {
    const { name } = req.query; // ← pega o nome da URL, ex: /characters?name=obi
    let personagens;

    if (name) {
      // Se tem name, busca só quem tem esse nome
      personagens = await prisma.character.findMany({
        where: {
          name: {
            contains: name,
            mode: 'insensitive', // ignora maiúsculas
          },
        },
      });
    } else {
      // Se não tem name, busca todos
      personagens = await prisma.character.findMany();
    }

    res.status(200).json(personagens);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar personagens" });
  }
});

app.listen(2264, () => {
  console.log("Servidor rodando na porta 2264");
});


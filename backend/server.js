// backend/server.js

require('dotenv').config(); // Carrega as variáveis de ambiente do arquivo .env
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Importa o pacote CORS

const app = express();
const PORT = process.env.PORT || 5000; // Porta do servidor, 5000 por padrão

// --- Middlewares ---
// Permite que o servidor aceite requisições de diferentes origens (seu frontend)
app.use(cors());
// Permite que o servidor entenda JSON nas requisições
app.use(express.json());

// --- Conexão com o Banco de Dados MongoDB ---
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Conectado ao MongoDB Atlas!'))
.catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// --- Definição do Modelo (Schema) ---
const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    price: Number,
    createdAt: { type: Date, default: Date.now }
});

const Item = mongoose.model('Item', itemSchema);

// --- Rotas da API ---

// Obter todos os itens
app.get('/api/items', async (req, res) => {
    try {
        const items = await Item.find().sort({ createdAt: -1 });
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Criar um novo item
app.post('/api/items', async (req, res) => {
    const item = new Item(req.body);
    try {
        const newItem = await item.save();
        res.status(201).json(newItem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Obter item específico por ID
app.get('/api/items/:id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item não encontrado' });
        res.json(item);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Atualizar item por ID
app.put('/api/items/:id', async (req, res) => {
    try {
        const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedItem) return res.status(404).json({ message: 'Item não encontrado' });
        res.json(updatedItem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Deletar item por ID
app.delete('/api/items/:id', async (req, res) => {
    try {
        const deletedItem = await Item.findByIdAndDelete(req.params.id);
        if (!deletedItem) return res.status(404).json({ message: 'Item não encontrado' });
        res.json({ message: 'Item deletado com sucesso' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- Iniciar o Servidor ---
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

const express = require('express');
const server = express();

server.use(express.json());

// Middleware global
function logRequests(req, res, next) {
    console.count("Número de requisições");
    return next();
}
server.use(logRequests);

// Middleware local que utilizarei em todas as rotas que o id é passado como parâmetro
function checkProjectExists(req, res, next) {
    const { id } = req.params;
    const project = projects.find(p => p.id == id);
    if(!project) {
        return res.status(400).json({ error: "Project not found!" });
    }
    return next();
}

const projects = [];

server.get('/projects', (req, res) => {
    return res.json(projects);
})

server.post('/projects', (req, res) => {
    const { id, title } = req.body;
    const project = {
        id,
        title,
        tasks: []
    };
    projects.push(project);
    return res.json(project);
})

/* Esta roda deve alterar apenas o título do projeto com o id presente 
 * nos parâmetros da rota */
server.put('/projects/:id', checkProjectExists, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    // Uso a função find para encontrar o projeto que tem o mesmo id passado
    // por parâmetro da rota
    const project = projects.find(p => p.id == id);
    project.title = title;
    return res.json(project);
})


/* Esta rota deve deletar o projeto com o id presente nos parâmetros da rota */
server.delete('/projects/:id', checkProjectExists, (req, res) => {
    const { id } = req.params;
    // Uso o método findIndex() para retornar o índice do elemento no array
    // que satisfaça minha condição
    const projectIndex = projects.findIndex(p => p.id == id);
    projects.splice(projectIndex, 1);
    // Uso o método send() para informar que o usuário foi deletado
    return res.send();
})

/* A rota deve receber um campo title e armazenar uma nova tarefa no array
 * de tarefas de um projeto especifíco escolhido através do id presente nos
 * parâmetros da rota
 */
server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    // Uso o método find() para encontrar o valor do primeiro elemento
    // que satisfaça a condição que passei
    const project = projects.find(p => p.id == id);
    
    project.tasks.push(title);
    
    return res.json(project);
})
server.listen(3000);
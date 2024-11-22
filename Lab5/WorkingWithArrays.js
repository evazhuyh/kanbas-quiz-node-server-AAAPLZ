let todos = [ { id: 1, title: "Task 1", completed: false },  { id: 2, title: "Task 2", completed: true },
              { id: 3, title: "Task 3", completed: false },  { id: 4, title: "Task 4", completed: true }, ];
export default function WorkingWithArrays(app) {
  app.get("/lab5/todos", (req, res) => {
    res.json(todos);
  });
};

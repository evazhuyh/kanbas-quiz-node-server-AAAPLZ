export default function PathParameters(app) {
  app.get("/lab5/add/:a/:b", (req, res) => {
    const { a, b, c, d } = req.params;
    const sum = parseInt(a) + parseInt(b);
    res.send(sum.toString());
  });
  app.get("/lab5/subtract/:a/:b", (req, res) => {
    const { a, b } = req.params;
    const sum = parseInt(a) - parseInt(b);
    res.send(sum.toString());
  });
  app.get("/lab5/multiply/:c/:d", (req, res) => {
    const { c, d } = req.params;
    const sum = parseInt(c) * parseInt(d);
    res.send(sum.toString());
  });
  app.get("/lab5/divide/:c/:d", (req, res) => {
    const { c, d } = req.params;
    const sum = parseInt(c) / parseInt(d);
    res.send(sum.toString());
  });
};

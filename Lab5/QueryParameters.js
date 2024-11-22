export default function QueryParameters(app) {
  app.get("/lab5/calculator", (req, res) => {
    const { a, b, c, d, operation } = req.query;
    let result = 0;
    switch (operation) {
      case "add":
        result = parseInt(a) + parseInt(b);
        break;
      case "subtract":
        result = parseInt(a) - parseInt(b);
        break;
      case "multiply":
        result = parseInt(c) * parseInt(d);
        break;
      case "divide":
        result = parseInt(c) / parseInt(d);
        break;
      default:
        result = "Invalid operation";
    }
    res.send(result.toString());
  });
}

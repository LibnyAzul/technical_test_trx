import app from "./app";
import "./database";

app.listen(app.get("port"), () => {
  console.log("Start server on port: ", app.get("port"));
});

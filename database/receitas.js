const sqlite3 = require('sqlite3');

let open = () => {
  return new sqlite3.Database('tudogostoso.db');
}

let setup = () => {

  // Abre o banco.
  db = open();
  // Inicializa uma execução sequencial.
  db.serialize(() => {
    let sqlReceitas = "CREATE TABLE IF NOT EXISTS receitas (id INTEGER PRIMARY KEY, nome TEXT, tempoPreparo INTEGER, redimento INTEGER, favoritos INTEGER, url TEXT)";
    db.run(sqlReceitas,(err) => {err !== null && console.log(err)});
    let sqlIngredientes = "CREATE TABLE IF NOT EXISTS ingredientes (id INTEGER PRIMARY KEY, idReceita INTEGER, descricao TEXT, FOREIGN KEY (idReceita) REFERENCES receitas (id))";
    db.run(sqlIngredientes,(err) => {err !== null && console.log(err)});
  });
  // Fecha o banco.
  db.close();
};

let insertRecipe = (recipe) => {
  // Abre o banco.
  db = open();
  // Inicializa uma execução sequencial.
  db.serialize(() => {
    let stmRecipe = db.prepare('INSERT INTO receitas (id, nome, tempoPreparo, rendimento, favoritos, url) VALUES (?,?,?,?,?,?)');
    stmRecipe.run(recipe.id, recipe.nome, recipe.tempoPreparo, recipe.rendimento, recipe.favoritos, recipe.url);
    stmRecipe.finalize();

    let stmIngredient = db.prepare('INSERT INTO ingredientes (idReceita, descricao) VALUES (?,?)');
    recipe.ingredientes.forEach( (ingrediente) => {
      stmIngredient.run(recipe.id, ingrediente.descricao);
    });
    stmIngredient.finalize();
  });
  // Fecha o banco.
  db.close();
}


module.exports = {
  setup : setup,
  insert : insertRecipe
}

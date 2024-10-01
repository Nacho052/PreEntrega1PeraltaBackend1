import express from "express";
import { Products } from "./products.js";
import { Carts } from "./carts.js"

const app = express();

app.use(express.json());

app.use('/api/products', new Products().router)
app.use('/api/carts', new Carts().router)

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server activo en puerto ${PORT}`)
})


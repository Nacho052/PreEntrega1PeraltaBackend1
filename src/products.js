import express from "express";
import fs from "fs";


export class Products {
    constructor() {
        this.productos = [];
        this.file = "./products.json";
        this.router = express.Router();
        this.cargarProducts();
        this.iniciarRoutes();
    }

    cargarProducts() {
        fs.readFile(this.file, 'utf-8', (err, data) => {
            if (!err) {
                this.productos = JSON.parse(data);
            }
        });
    }

    guardarProducts() {
        fs.writeFileSync(this.file, JSON.stringify(this.productos, null, 2));
    }

    iniciarRoutes() {
        this.router.get('/', this.leerProducts.bind(this));
        this.router.get('/:pid', this.leerProductPorId.bind(this));
        this.router.post('/', this.crearProduct.bind(this));
        this.router.delete('/:pid', this.borrarProduct.bind(this));
        this.router.put('/:pid', this.actProduct.bind(this));
    }

    leerProducts(req, res) {
        const limit = req.query.limit;
        if (limit) {
            return res.json(this.productos.slice(0, limit));
        }
        res.json(this.productos);
    }

    leerProductPorId(req, res) {
        const product = this.productos.find(p => p.id == req.params.pid);
        if (!product) {
            return res.status(404).json({error: 'Producto no encontrado'});
        }
        res.json(product);
    }

    crearProduct(req, res) {
        const { title, description, code, price, stock, category, thumbnails = [] } = req.body;
        if (!title || !description || !code || !price || !stock || !category) {
            return res.status(400).json({ error: 'Faltan datos obligatorios' });
        }
        const id = this.productos.reduce(((max,obj) => (obj.id > max ? obj.id : max)),0) + 1;

        const actualProduct = {
            id: id,
            title,
            description,
            code,
            price,
            status: true,
            stock,
            category,
            thumbnails
        };

        this.productos.push(actualProduct);
        this.guardarProducts();
        res.status(201).json(actualProduct);
    }

    borrarProduct(req, res) {
        const indexProduct = this.productos.findIndex(p => p.id == req.params.pid);
        if (indexProduct === -1) {
            return res.status(404).json({ error: 'No se encuentra el producto' });
        }

        this.productos.splice(indexProduct, 1);
        this.guardarProducts();
        res.status(204).send();
    }

    actProduct(req, res) {
        const indexProduct = this.productos.findIndex(p => p.id == req.params.pid);
        if (indexProduct === -1) {
            return res.status(404).json({ error: 'No se encuentra el producto' });
        }

        const productActu = { ...this.productos[indexProduct], ...req.body, id: this.productos[indexProduct].id };
        this.productos[indexProduct] = productActu;
        this.guardarProducts();
        res.json(productActu);
    }
}
import express from "express";
import fs from "fs";


export class Carts {
    constructor() {
        this.carritos = [];
        this.file = "./carts.json";
        this.router = express.Router();
        this.cargarCarts();
        this.iniciarRoutes();
    }

    cargarCarts() {
        fs.readFile(this.file, 'utf-8', (err, data) => {
            if (!err) {
                this.carritos = JSON.parse(data);
            }
        });
    }

    guardarCarts() {
        fs.writeFileSync(this.file, JSON.stringify(this.carritos, null, 2));
    }

    iniciarRoutes() {
        this.router.get('/:cid', this.leerCartPorId.bind(this));
        this.router.post('/', this.crearCart.bind(this));
        this.router.post('/:cid/product/:pid', this.añadirProductAlCarrito.bind(this));
    }

    leerCartPorId(req, res) {
        const carrito = this.carritos.find(c => c.id == req.params.cid);
        if (!carrito) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        res.json(carrito);
    }

    crearCart(req, res) {
        const carrito = this.carritos.find(c => c.id === 1);
        let id= 0
        if (!carrito) {
            id = 1;
        } else {
            id = this.carritos.reduce(((max,obj) => (obj.id > max ? obj.id : max)),0) + 1;
        }
        
        const newCart = {
            id: id,
            products: []
        };

        this.carritos.push(newCart);
        this.guardarCarts();
        res.status(201).json(newCart);
    }

    añadirProductAlCarrito(req, res) {
        const cart = this.carritos.find(c => c.id == req.params.cid);
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        const indexProduct = cart.products.findIndex(p => p.id == req.params.pid);
        if (indexProduct !== -1) {
            cart.products[indexProduct].quantity += 1;
        } else {
            cart.products.push({ id: parseInt(req.params.pid), quantity: 1 });
        }

        this.guardarCarts();
        res.json(cart);
    }
}


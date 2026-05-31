import express from "express";
import cors from "cors";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.use(
    cors({
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "OPTIONS"],
        allowedHeaders: ["Content-Type"]
    })
);

app.use(express.json());

app.post("/create-checkout-session", async (req, res) => {
    try {
        const { items } = req.body;

        if (!items || items.length === 0) {
        return res.status(400).json({
            error: "El carrito está vacío."
        });
        }

        const line_items = items.map((item) => ({
        price_data: {
            currency: "eur",
            product_data: {
            name: item.nombre
            },
            unit_amount: Math.round(Number(item.precio) * 100)
        },
        quantity: Number(item.qty)
        }));

        const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items,
        success_url: "http://localhost:5173/success",
        cancel_url: "http://localhost:5173/cart"
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error("ERROR REAL DE STRIPE:", error);

        res.status(500).json({
            error: error.message || "Error creando sesión de pago"
        });
    }
    });

app.listen(4242, () => {
    console.log("Servidor Stripe escuchando en puerto 4242");
});
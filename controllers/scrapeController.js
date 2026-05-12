const scrapeService = require('../services/scrapeService');

const scrapeProductos = async (req, res) => {

    try {

        const productos = await scrapeService.obtenerProductos();

        if (productos.length === 0) {
            return res.status(404).json({
                ok: false,
                mensaje: 'No se encontraron productos'
            });
        }

        res.status(200).json({
            ok: true,
            total: productos.length,
            productos
        });

    } catch (error) {

        res.status(400).json({
            ok: false,
            error: error.message
        });

    }

};


const verStats = async (req, res) => {

    try {

        const productos = await scrapeService.obtenerProductos();

        const precios = productos.map(p =>
            Number(
                p.precio
                    .replace('$', '')
                    .replace('.', '')
                    .trim()
            )
        );

        const total = precios.length;

        const minimo = Math.min(...precios);

        const maximo = Math.max(...precios);

        const promedio =
            precios.reduce((a, b) => a + b, 0) / total;

        res.json({
            ok: true,
            stats: {
                total_productos: total,
                precio_minimo: minimo,
                precio_maximo: maximo,
                precio_promedio: Number(promedio.toFixed(2))
            }
        });

    } catch (error) {

        res.status(500).json({
            ok: false,
            error: error.message
        });

    }

};




const buscarProductos = async (req, res) => {

    try {

        const categoria = req.query.categoria;

        if (!categoria) {
            return res.status(400).json({
                ok: false,
                error: 'Debes indicar una categoria'
            });
        }

        const productos = await scrapeService.obtenerProductos();

        const filtrados = productos.filter(p =>
            p.categoria.toLowerCase() === categoria.toLowerCase()
        );

        res.json({
            ok: true,
            categoria,
            total: filtrados.length,
            productos: filtrados
        });

    } catch (error) {

        res.status(500).json({
            ok: false,
            error: error.message
        });

    }

};

module.exports = {
    scrapeProductos,
    verStats,
    buscarProductos
};
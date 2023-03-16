const Product = require('../models/product')

exports.createProduct = (req, res, next) => {
    const product = new Product({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        image: req.body.image,
    });
    product.save();
    res.status(201).json({
        message: "Product Added Successfully"
    });
}

exports.getAllProducts = (req, res, next) => {
    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.page;
    let fetchedProducts;
    const productQuery = Product.find();
    if (pageSize && currentPage) {
        productQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    productQuery.then((documents) => {
        fetchedProducts = documents;
        return Product.count();
    }).then(count => {
        res.status(200).json({
            message: "Products Fetched Successfully",
            products: fetchedProducts,
            maxProducts: count
        })
    })

}

exports.getById = (req, res, next) => {
    Product.findById(req.params.id).then((product) => {
        if (product) {
            res.status(200).json(product);
        }
        else {
            res.status(404).json({
                message: "Product Not Found"
            })
        }
    })
}

exports.search = (req, res, next) => {
    const searchQuery = req.params.name;
    const regex = new RegExp(searchQuery, 'i');
    Product.find({ name: regex }).then((product) => {
        // console.log(product);
        if (product) {
            res.status(200).json({
                message: "Product Found",
                products: product,
                maxProducts: product.length
            })
        }
        else {
            res.status(404).json({
                message: "Product Not Found"
            })
        }
    })
}

exports.update = (req, res, next) => {
    const product = new Product({
        _id: req.body.id,
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        image: req.body.image
    })
    Product.updateOne({ _id: req.params.id }, product).then(result => {
        console.log(result);
        res.status(200).json({
            message: "Product Updated Succesfully"
        })
    })
}

exports.delete = (req, res, next) => {
    Product.deleteOne({ _id: req.params.id }).then((result) => {
        res.status(200).json({
            message: "Product Deleted Successfully"
        });
    }).catch(err => {
        console.log(err);
    })
}
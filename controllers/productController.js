const Product = require('../models/product');

const createProduct = async (req, res) => {
  try {
    const duplicateProduct = await Product.findOne({ productName: req.body.productName });
    if (duplicateProduct) {
      return res.status(409).send({ message: 'A product with this name already exists.' });
    }
    const product = new Product(req.body);
    console.log(req.body);
    await product.save();
    res.status(201).send(product);
  } catch (error) {
    res.status(400).send(error);
  }
};

const updateProduct = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['productPrice', 'productQuantity', 'productType'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates Product!' });
  }

  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send({ error: 'Product not fount' });
    }

    updates.forEach((update) => product[update] = req.body[update]);
    await product.save();
    res.send(product);
  } catch (error) {
    res.status(400).send(error);
  }
};

const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const productType = req.query.productType;
    const sortPrice = req.query.sortPrice === 'desc' ? { productPrice: -1 } : { productPrice: 1 };

    let query = {};
    if (productType) {
      query.productType = productType;
    }

    const products = await Product.find(query)
                                  .sort(sortPrice)
                                  .skip(skip)
                                  .limit(limit);
    const total = await Product.countDocuments(query);

    const result = products.map(product => ({
      productid: product._id,
      productName: product.productName,
      productPrice: product.productPrice,
      productType: product.productType,
      productImage: product.productImage,
      productSize: product.productSize,
      dateImport: product.dateImport,
      productQuantity: product.productQuantity,
      productMaterial: product.productMaterial,
      productDescription: product.productDescription
    }));

    res.status(200).send({ total, page, pages: Math.ceil(total / limit), data: result });
  } catch (error) {
    res.status(500).send(error);
  }
};



const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    // .populate('habitat', 'habitatName habitatType habitatSize condition -_id');
    if (!product) {
      return res.status(404).send({ message: 'Product not found' });
    }
    const result = {
      productid: product._id,
      productName: product.productName,
      productPrice: product.productPrice,
      productType: product.productType,
      productImage: product.productImage,
      productSize: product.productSize,
      dateImport: product.dateImport,
      productQuantity: product.productQuantity,
      productMaterial: product.productMaterial,
      productDescription: product.productDescription
      // habitat: animal.habitat
    };
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error);
  }
};


//   try {
//     const productType = req.params.type;
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const skip = (page - 1) * limit;

//     const products = await Product.find({ productType }).skip(skip).limit(limit);
//     const total = await Product.countDocuments({ productType });

//     const result = products.map(product => ({
//       productid: product._id,
//       productName: product.productName,
//       productPrice: product.productPrice,
//       productType: product.productType,
//       productImage: product.productImage,
//       productSize: product.productSize,
//       dateImport: product.dateImport,
//       productQuantity: product.productQuantity,
//       productMaterial: product.productMaterial,
//       productDescription: product.productDescription
//     }));

//     res.status(200).send({ total, page, pages: Math.ceil(total / limit), data: result });
//   } catch (error) {
//     res.status(500).send(error);
//   }
// };


// const filterProductByPriceAsc = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const skip = (page - 1) * limit;

//     const products = await Product.find({}).sort({ productPrice: 1 })
//                                            .skip(skip)
                                          //  .limit(limit);
//     const total = await Product.countDocuments();

//     const result = products.map(product => ({
//       productid: product._id,
//       productName: product.productName,
//       productPrice: product.productPrice,
//       productImage: product.productImage,
//       productSize: product.productSize,
//       dateImport: product.dateImport,
//       productQuantity: product.productQuantity,
//       productMaterial: product.productMaterial,
//       productDescription: product.productDescription
//     }));

//     res.status(200).send({ total, page, pages: Math.ceil(total / limit), data: result });
//   } catch (error) {
//     res.status(500).send(error);
//   }
// };


// const filterProductByPriceDesc = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const skip = (page - 1) * limit;

//     const products = await Product.find({})
//                                    .sort({ productPrice: -1 })
//                                    .skip(skip)
//                                    .limit(limit);
//     const total = await Product.countDocuments();

//     const result = products.map(product => ({
//       productid: product._id,
//       productName: product.productName,
//       productPrice: product.productPrice,
//       productImage: product.productImage,
//       productSize: product.productSize,
//       dateImport: product.dateImport,
//       productQuantity: product.productQuantity,
//       productMaterial: product.productMaterial,
//       productDescription: product.productDescription
//     }));

//     res.status(200).send({ total, page, pages: Math.ceil(total / limit), data: result });
//   } catch (error) {
//     res.status(500).send(error);
//   }
// };
// const filterProductByNameA_Z = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const skip = (page - 1) * limit;

//     const products = await Product.find({}).sort({ productName: 1 }).skip(skip).limit(limit);
//     res.status(200).send(products);

//     const result = products.map(product => ({
//       productid: product._id,
//       productName: product.productName,
//       productPrice: product.productPrice,
//       productImage: product.productImage,
//       productSize: product.productSize,
//       dateImport: product.dateImport,
//       productQuantity: product.productQuantity,
//       productMaterial: product.productMaterial,
//       productDescription: product.productDescription
//     }));

//     res.status(200).send({ total, page, pages: Math.ceil(total / limit), data: result });
//   } catch (error) {
//     res.status(500).send(error);
//   }
// };

const getProductByName = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const searchTerm = req.params.name;
    const regex = new RegExp(searchTerm, 'i');

    const products = await Product.find({ productName: { $regex: regex } })
                                  .skip(skip)
                                  .limit(limit);
    
    if (!products.length) {
      return res.status(404).send({ message: 'No products found' });
    }

    const total = await Product.countDocuments({ productName: { $regex: regex } });

    const results = products.map(product => ({
      productid: product._id,
      productName: product.productName,
      productPrice: product.productPrice,
      productType: product.productType,
      productImage: product.productImage,
      productSize: product.productSize,
      dateImport: product.dateImport,
      productQuantity: product.productQuantity,
      productMaterial: product.productMaterial,
      productDescription: product.productDescription
    }));

    res.status(200).send({ total, pages: Math.ceil(total / limit), data: results });
  } catch (error) {
    res.status(500).send(error);
  }
};


//     try {
//       const habitatId = req.params.habitatId;
//       const habitat = await Habitat.findById(habitatId, 'habitatName habitatType condition -_id');

//       if (!habitat) {
//         return res.status(404).send({ message: 'Habitat not found' });
//       }

//       const animals = await Animal.find({ habitat: habitatId }, '_id animalName animalSpecies dateOfBirth animalSex');

//       const result = {
//         habitat: {
//           habitatName: habitat.habitatName,
//           habitatType: habitat.habitatType,
//           condition: habitat.condition,
//           animals: animals.map(animal => ({
//             animalid: animal._id,
//             animalName: animal.animalName,
//             animalSpecies: animal.animalSpecies,
//             dateOfBirth: animal.dateOfBirth,
//             animalSex: animal.animalSex
//           }))
//         }
//       };

//       res.status(200).send(result);
//     } catch (error) {
//       res.status(500).send(error);
//     }
//   };

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).send({ message: 'Product not found' });
    }
    res.status(200).send({ message: 'Product deleted successfully.' });
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  // getProductByType,
  // filterProductByPriceAsc,
  // filterProductByPriceDesc,
  // filterProductByNameA_Z,
  updateProduct,
  getProductByName,
  deleteProduct
};

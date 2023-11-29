import React, { useState, ChangeEvent } from 'react';
interface Product {
  id: number;
  name: string;
  price: string;
}
interface ProductFormProps {
  onAddProduct: (product: Product) => void;
}
const ProductForm: React.FC<ProductFormProps> = ({}) => {
  const [productName, setProductName] = useState<string>('');
  const [productPrice, setProductPrice] = useState<string>('');
  const onAddProduct = (newProduct: Product) => {
    console.log(newProduct);
  };
  const handleAddProduct = (): void => {
    // Perform validation if needed
    if (productName && productPrice) {
      const newProduct: Product = {
        id: Date.now(), // For simplicity, using timestamp as ID
        name: productName,
        price: productPrice,
      };
      onAddProduct(newProduct);
      // Clear the form fields after adding the product
      setProductName('');
      setProductPrice('');
    }
  };
  return (
    <div>
      <h2 className={'text-red-700'}>Add New Product</h2>
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={productName}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setProductName(e.target.value)
          }
        />
      </div>
      <div>
        <label>Price:</label>
        <input
          type="text"
          value={productPrice}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setProductPrice(e.target.value)
          }
        />
      </div>
      <button onClick={handleAddProduct}>Add Product</button>
    </div>
  );
};
export default ProductForm;

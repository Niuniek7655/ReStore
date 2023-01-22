import { Product } from '../../app/modules/product'
import React from 'react'
import ProductList from './ProductList'
import { useEffect, useState } from 'react'

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then((response) => response.json())
      .then((data) => setProducts(data))
  }, [])

  return (
    <>
      <ProductList products={products} />
    </>
  )
}

import { Product } from '../../app/modules/product'
import ProductCard from './ProductCard'
import React from 'react'
import Grid from '@mui/material/Grid/Grid'

interface Props {
  products: Product[]
}

export default function ProductList({ products }: Props) {
  return (
    <>
      <Grid container spacing={4}>
        {products.map((product) => (
          <Grid item xs={4} key={product.id}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </>
  )
}

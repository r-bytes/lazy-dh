import { type SchemaTypeDefinition } from 'sanity'
import product from './lazo-dh/schemas/product'
import category from './lazo-dh/schemas/category'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [product, category],
}

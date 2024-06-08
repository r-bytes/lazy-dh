import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
    }),
    defineField({
      name: 'name',
      title: 'Name',
      description: 'Naam van het product',
      type: 'string',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      description: 'Categorie van het product',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'string',
      description: 'Omschrijving van het product (maximaal 100 tekens)',
      validation: (Rule) => Rule.min(0).max(200),
    }),
    defineField({
      name: 'price',
      title: 'Price',
      description: 'Prijs van het product',
      type: 'number',
    }),
    defineField({
      name: 'volume',
      title: 'Volume (cl)',
      description: 'Hoeveelheid per eenheid (bijv. per fles)',
      type: 'number',
    }),
    defineField({
      name: 'percentage',
      title: 'Percentage',
      description: 'Percentage per eenheid (bijv. per fles)',
      type: 'number',
    }),
    defineField({
      name: 'inStock',
      title: 'In Stock',
      description: 'Aantal stuks op voorraad',
      type: 'number',
    }),
    defineField({
      name: 'inSale',
      title: 'In Sale',
      description: 'Product is in de aanbieding',
      type: 'boolean',
    }),
    defineField({
      name: 'isNew',
      title: 'Is New',
      description: 'Product is nieuw',
      type: 'boolean',
    }),
  ],
})

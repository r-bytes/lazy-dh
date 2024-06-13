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
      initialValue: 'Rakia',
      options: {
        list: [
          {title: 'Likeur', value: 'Likeur'},
          {title: 'Ouzo', value: 'Ouzo'},
          {title: 'Rakia', value: 'Rakia'},
          {title: 'Vodka', value: 'Vodka'},
          {title: 'Whisky', value: 'Whisky'},
          {title: 'Wijn', value: 'Wijn'},
        ],
      },
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
      type: 'string',
      initialValue: '70cl',
      options: {
        list: [
          {title: '20cl', value: '20cl'},
          {title: '50cl', value: '50cl'},
          {title: '70cl', value: '70cl'},
          {title: '100cl', value: '100cl'},
          {title: '175cl', value: '175cl'},
          {title: '200cl', value: '200cl'},
        ],
      },
    }),
    defineField({
      name: 'percentage',
      title: 'Percentage',
      description: 'Percentage per eenheid (bijv. per fles)',
      type: 'string',
      initialValue: '40%',
      options: {
        list: [
          {title: '12%', value: '12%'},
          {title: '25%', value: '25%'},
          {title: '25%', value: '25%'},
          {title: '35%', value: '35%'},
          {title: '36%', value: '36%'},
          {title: '37.5%', value: '37.5%'},
          {title: '38%', value: '38%'},
          {title: '40%', value: '40%'},
          {title: '42.5%', value: '42.5%'},
          {title: '43%', value: '43%'},
          {title: '47%', value: '47%'},
        ],
      },
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

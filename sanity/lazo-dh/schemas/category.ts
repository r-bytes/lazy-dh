import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'category',
  title: 'Categorie',
  type: 'document',
  fields: [
    defineField({
      name: 'order',
      title: 'Volgorde',
      type: 'number',
    }),
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
      name: 'slug',
      title: 'Slug',
      description: 'Slug van het product',
      type: 'string',
    }),
  ],
})

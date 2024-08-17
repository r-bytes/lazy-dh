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
      title: 'Afbeelding',
      type: 'image',
    }),
    defineField({
      name: 'name',
      title: 'Naam',
      description: 'Naam van de categorie',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'URL',
      description: 'Slug van het product',
      type: 'string',
    }),
  ],
})

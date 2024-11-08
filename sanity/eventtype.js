import {defineField, defineType} from 'sanity'

export const eventType = defineType({
  name: 'course',
  title: 'course',
  type: 'document',
     fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Post Title',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heading1',
      type: 'string',
      title: 'Heading 1',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heading2',
      type: 'string',
      title: 'Heading 2',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heading3',
      type: 'string',
      title: 'Heading 3',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heading4', // Removed space from the field name
      type: 'string',
      title: 'Heading 4',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
        }),
      ],
    }),
    defineField({
      title: 'Description',
      name: 'description',
      type: 'text',
      validation: (Rule) => Rule.required().max(200),
    }),
  // Main content block
    defineField({
      title: 'Main Content',
      name: 'content',
      type: 'array',
      description: 'Add the main content of the post here. You can format it using headings, paragraphs, images, links, etc.',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Heading 1', value: 'h1' },
            { title: 'Heading 2', value: 'h2' },
            { title: 'Heading 3', value: 'h3' },
            { title: 'Heading 4', value: 'h4' },
            { title: 'Heading 5', value: 'h5' },
            { title: 'Heading 6', value: 'h6' },
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Numbered', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
              { title: 'Underline', value: 'underline' },
            ],
            annotations: [
              {
                title: 'URL',
                name: 'link',
                type: 'object',
                fields: [
                  {
                    title: 'URL',
                    name: 'href',
                    type: 'url',
                  },
                  {
                    title: 'Open in New Tab',
                    name: 'blank',
                    type: 'boolean',
                  },
                ],
              },
            ],
          },
        },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              title: 'Caption',
              name: 'caption',
              type: 'string',
              options: { isHighlighted: true },
            },
            {
              title: 'Alt Text',
              name: 'alt',
              type: 'string',
              validation: (Rule) => Rule.required().warning('Alt text is important for accessibility.'),
            },
          ],
        },
        {
          type: 'object',
          name: 'customEmbed',
          title: 'Custom Embed',
          fields: [
            {
              title: 'Embed URL',
              name: 'embedUrl',
              type: 'url',
            },
          ],
          preview: {
            select: {
              title: 'embedUrl',
            },
            prepare(selection) {
              const { title } = selection;
              return {
                title: `Embed: ${title}`,
              };
            },
          },
        },
      ],
    }),
    
    defineField({
      name: 'tags',
      type: 'array',
      title: 'Tags',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      title: 'Link',
      name: 'href',
      type: 'url',
      validation: Rule => Rule.uri({
        scheme: ['http', 'https', 'mailto', 'tel']
      })
    }),
    defineField({
      name: 'publishedAt',
      type: 'datetime',
      title: 'Published At',
    }),
  ],
});

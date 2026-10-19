'use client'
// إعداد لوحة Sanity Studio المضمنة داخل Next.js على المسار /studio
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './src/sanity/schemaTypes'
import { projectId, dataset } from './src/sanity/env'

export default defineConfig({
  name: 'default',
  title: 'معرض السيارات',
  basePath: '/studio',
  projectId,
  dataset,
  plugins: [structureTool(), visionTool()], // visionTool لتجربة استعلامات GROQ
  schema: { types: schemaTypes },
})

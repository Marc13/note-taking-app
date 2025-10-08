import { PrismaClient, NoteStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Clean up existing data (optional - remove if you want to keep existing data)
  await prisma.noteTag.deleteMany()
  await prisma.note.deleteMany()
  await prisma.category.deleteMany()
  await prisma.tag.deleteMany()
  await prisma.user.deleteMany()

  // Create a demo user
  const user = await prisma.user.create({
    data: {
      name: 'Demo User',
      email: 'demo@example.com',
      emailVerified: new Date(),
    },
  })

  console.log('✅ Created demo user:', user.email)

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Personal',
        description: 'Personal thoughts and reflections',
        color: '#10B981', // Green
        userId: user.id,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Work',
        description: 'Work-related notes and tasks',
        color: '#3B82F6', // Blue
        userId: user.id,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Ideas',
        description: 'Creative ideas and inspiration',
        color: '#8B5CF6', // Purple
        userId: user.id,
      },
    }),
  ])

  console.log('✅ Created categories:', categories.map(c => c.name).join(', '))

  // Create tags
  const tags = await Promise.all([
    prisma.tag.create({
      data: {
        name: 'important',
        color: '#EF4444', // Red
      },
    }),
    prisma.tag.create({
      data: {
        name: 'todo',
        color: '#F59E0B', // Amber
      },
    }),
    prisma.tag.create({
      data: {
        name: 'meeting',
        color: '#06B6D4', // Cyan
      },
    }),
    prisma.tag.create({
      data: {
        name: 'project',
        color: '#8B5CF6', // Purple
      },
    }),
    prisma.tag.create({
      data: {
        name: 'brainstorm',
        color: '#EC4899', // Pink
      },
    }),
  ])

  console.log('✅ Created tags:', tags.map(t => t.name).join(', '))

  // Create sample notes
  const notes = [
    {
      title: 'Welcome to Your Note-Taking App!',
      content: `# Welcome! 🎉

This is your first note in the note-taking app. Here are some features you can explore:

## Features
- **Rich text content** - Write detailed notes with formatting
- **Categories** - Organize your notes into different categories
- **Tags** - Add multiple tags to notes for better organization
- **Status tracking** - Mark notes as draft, published, or archived

## Getting Started
1. Create new categories for your different types of notes
2. Add tags to help you find notes quickly
3. Start writing your thoughts and ideas!

Happy note-taking! ✨`,
      status: NoteStatus.PUBLISHED,
      categoryId: categories[0].id, // Personal
      tagIds: [tags[0].id], // important
    },
    {
      title: 'Project Planning Meeting Notes',
      content: `# Project Planning Meeting - ${new Date().toLocaleDateString()}

## Attendees
- John Smith (Project Manager)
- Sarah Johnson (Developer)
- Mike Chen (Designer)

## Key Points Discussed
1. **Timeline**: Project deadline set for end of month
2. **Resources**: Need to allocate 2 additional developers
3. **Budget**: Approved additional $5,000 for external tools

## Action Items
- [ ] Sarah: Set up development environment by Friday
- [ ] Mike: Create wireframes for main user flows
- [ ] John: Schedule follow-up meeting for next week

## Next Steps
Review progress in weekly standup and adjust timeline if needed.`,
      status: NoteStatus.PUBLISHED,
      categoryId: categories[1].id, // Work
      tagIds: [tags[0].id, tags[2].id], // important, meeting
    },
    {
      title: 'App Feature Ideas',
      content: `# New Feature Ideas 💡

## High Priority
1. **Dark Mode Toggle**
   - User preference setting
   - System theme detection
   - Smooth transitions

2. **Search Functionality**
   - Full-text search across all notes
   - Filter by tags and categories
   - Recent searches

## Medium Priority
3. **Export Options**
   - PDF export
   - Markdown export
   - Bulk export

4. **Collaboration Features**
   - Share notes with others
   - Real-time editing
   - Comments system

## Low Priority
5. **Mobile App**
   - React Native implementation
   - Offline sync
   - Push notifications

## Research Needed
- User authentication providers
- Database optimization strategies
- Performance monitoring tools`,
      status: NoteStatus.DRAFT,
      categoryId: categories[2].id, // Ideas
      tagIds: [tags[1].id, tags[3].id, tags[4].id], // todo, project, brainstorm
    },
    {
      title: 'Daily Reflection',
      content: `# Today's Reflection - ${new Date().toLocaleDateString()}

## What went well today?
- Completed the database schema design
- Had a productive meeting with the team
- Made good progress on the authentication system

## What could be improved?
- Need to focus more on testing
- Should spend more time on documentation
- Could improve time management

## Tomorrow's goals
1. Write unit tests for the new features
2. Update the project documentation
3. Review and merge pending pull requests

## Gratitude
Grateful for the supportive team and the opportunity to work on interesting projects.`,
      status: NoteStatus.PUBLISHED,
      categoryId: categories[0].id, // Personal
      tagIds: [], // No tags
    },
    {
      title: 'Learning Notes: TypeScript Best Practices',
      content: `# TypeScript Best Practices

## Type Definitions
\`\`\`typescript
// Use interfaces for object shapes
interface User {
  id: string
  name: string
  email: string
}

// Use types for unions and computed types
type Status = 'loading' | 'success' | 'error'
type UserKeys = keyof User
\`\`\`

## Utility Types
- \`Partial<T>\` - Makes all properties optional
- \`Required<T>\` - Makes all properties required
- \`Pick<T, K>\` - Creates type with subset of properties
- \`Omit<T, K>\` - Creates type without specified properties

## Best Practices
1. **Strict Mode**: Always enable strict mode in tsconfig.json
2. **Explicit Return Types**: Define return types for functions
3. **Avoid \`any\`**: Use \`unknown\` instead when type is uncertain
4. **Use Type Guards**: Create custom type guards for runtime checks

## Resources
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- [Effective TypeScript](https://effectivetypescript.com/)`,
      status: NoteStatus.ARCHIVED,
      categoryId: categories[1].id, // Work
      tagIds: [tags[3].id], // project
    },
  ]

  // Create notes with their tag relationships
  for (const noteData of notes) {
    const { tagIds, ...noteInfo } = noteData
    
    const note = await prisma.note.create({
      data: {
        ...noteInfo,
        userId: user.id,
      },
    })

    // Create tag relationships
    if (tagIds && tagIds.length > 0) {
      await Promise.all(
        tagIds.map(tagId =>
          prisma.noteTag.create({
            data: {
              noteId: note.id,
              tagId: tagId,
            },
          })
        )
      )
    }

    console.log('✅ Created note:', note.title)
  }

  console.log('🎉 Seed completed successfully!')
  
  // Print summary
  const counts = await Promise.all([
    prisma.user.count(),
    prisma.category.count(),
    prisma.tag.count(),
    prisma.note.count(),
    prisma.noteTag.count(),
  ])

  console.log('\n📊 Database Summary:')
  console.log(`- Users: ${counts[0]}`)
  console.log(`- Categories: ${counts[1]}`)
  console.log(`- Tags: ${counts[2]}`)
  console.log(`- Notes: ${counts[3]}`)
  console.log(`- Note-Tag relationships: ${counts[4]}`)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

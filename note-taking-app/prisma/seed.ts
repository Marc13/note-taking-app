import { PrismaClient, NoteStatus, TaskPriority } from '@prisma/client'

const prisma = new PrismaClient()

// Helper function to get date X days ago
function daysAgo(days: number): Date {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date
}

// Helper function to get date X days from now
function daysFromNow(days: number): Date {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date
}

async function main() {
  try {
    console.log('🌱 Starting comprehensive seed...\n')

    // ============================================
    // STEP 1: Clear all existing data
    // ============================================
    console.log('🧹 Cleaning existing data...')
    await prisma.noteTag.deleteMany()
  await prisma.note.deleteMany()
  await prisma.category.deleteMany()
  await prisma.tag.deleteMany()
    await prisma.task.deleteMany()
    await prisma.project.deleteMany()
    await prisma.dailyNote.deleteMany()
    await prisma.template.deleteMany()
    await prisma.knowledgeArticle.deleteMany()
  await prisma.user.deleteMany()
    console.log('✅ Cleaned all existing data\n')

    // ============================================
    // STEP 2: Create Demo User
    // ============================================
    console.log('👤 Creating demo user...')
  const user = await prisma.user.create({
    data: {
        name: 'Alex Morgan',
        email: 'alex.morgan@example.com',
        emailVerified: daysAgo(30),
        createdAt: daysAgo(60),
        updatedAt: daysAgo(1),
      },
    })
    console.log(`✅ Created user: ${user.email}\n`)

    // ============================================
    // STEP 3: Create 5 Categories
    // ============================================
    console.log('📁 Creating categories...')
  const categories = await Promise.all([
    prisma.category.create({
      data: {
          name: 'Work',
          description: 'Professional tasks, meetings, and work-related documentation',
          color: '#0046FF',
        userId: user.id,
          createdAt: daysAgo(50),
          updatedAt: daysAgo(10),
      },
    }),
    prisma.category.create({
      data: {
          name: 'Personal',
          description: 'Personal reflections, goals, and life planning',
          color: '#73C8D2',
        userId: user.id,
          createdAt: daysAgo(48),
          updatedAt: daysAgo(8),
      },
    }),
    prisma.category.create({
      data: {
        name: 'Ideas',
          description: 'Creative brainstorming, innovation, and future concepts',
          color: '#FF9013',
        userId: user.id,
          createdAt: daysAgo(45),
          updatedAt: daysAgo(5),
      },
    }),
      prisma.category.create({
      data: {
          name: 'Learning',
          description: 'Educational content, tutorials, and skill development notes',
          color: '#0046FF',
          userId: user.id,
          createdAt: daysAgo(40),
          updatedAt: daysAgo(3),
      },
    }),
      prisma.category.create({
      data: {
          name: 'Projects',
          description: 'Project planning, progress tracking, and deliverables',
          color: '#73C8D2',
          userId: user.id,
          createdAt: daysAgo(35),
          updatedAt: daysAgo(2),
      },
    }),
    ])
    console.log(`✅ Created ${categories.length} categories: ${categories.map(c => c.name).join(', ')}\n`)

    // ============================================
    // STEP 4: Create 8 Tags
    // ============================================
    console.log('🏷️  Creating tags...')
    const tags = await Promise.all([
      prisma.tag.create({ data: { name: 'Important', color: '#EF4444' } }),
      prisma.tag.create({ data: { name: 'Urgent', color: '#DC2626' } }),
      prisma.tag.create({ data: { name: 'Reference', color: '#0046FF' } }),
      prisma.tag.create({ data: { name: 'Tutorial', color: '#73C8D2' } }),
      prisma.tag.create({ data: { name: 'Meeting', color: '#8B5CF6' } }),
      prisma.tag.create({ data: { name: 'Quick Win', color: '#10B981' } }),
      prisma.tag.create({ data: { name: 'Long-term', color: '#FF9013' } }),
      prisma.tag.create({ data: { name: 'Review', color: '#F59E0B' } }),
    ])
    console.log(`✅ Created ${tags.length} tags: ${tags.map(t => t.name).join(', ')}\n`)

    // ============================================
    // STEP 5: Create 15 Notes
    // ============================================
    console.log('📝 Creating notes...')
    const notesData = [
      // PUBLISHED Notes (7-8 notes = ~50%)
      {
        title: 'Project Meeting Notes - January 2025',
        content: `# Project Kickoff Meeting - January 15, 2025

## Overview
Today we held our quarterly planning meeting to discuss the roadmap for Q1 2025. The team was energized and ready to tackle new challenges.

## Key Decisions
We decided to prioritize the mobile app redesign over the web dashboard updates. The reasoning behind this is that 65% of our users access the platform via mobile devices, and the current experience needs significant improvement.

## Team Assignments
Sarah will lead the frontend development, Marcus will handle the backend API updates, and Jennifer will coordinate with the design team. We're aiming for a beta release by end of February.

## Budget Allocation
The finance team approved an additional $15,000 for external consultants and premium tools. This will help us accelerate development and ensure we meet our aggressive timeline.

## Next Steps
We'll have daily standups at 9:30 AM and a comprehensive review every Friday afternoon. All documentation should be updated in Confluence by end of week.`,
        status: NoteStatus.PUBLISHED,
        categoryId: categories[0].id, // Work
        tagIds: [tags[0].id, tags[4].id], // Important, Meeting
        createdAt: daysAgo(13),
        updatedAt: daysAgo(13),
      },
      {
        title: 'Q1 2025 Goals and Objectives',
        content: `# First Quarter Goals

## Professional Goals
This quarter I'm focusing on three main areas: improving my technical leadership skills, completing the AWS certification, and mentoring two junior developers on the team.

I've already started the AWS Solutions Architect course and I'm about 40% through the material. The exam is scheduled for March 20th, which gives me plenty of time to prepare.

## Personal Development
On the personal side, I want to establish a better work-life balance. This means no emails after 7 PM and dedicating weekends to family time and hobbies.

I'm also committing to reading one technical book per month. January's pick is "Designing Data-Intensive Applications" by Martin Kleppmann.

## Health and Wellness
Exercise routine: gym three times per week, yoga on Sundays. Meal prep on Sundays to ensure healthy eating throughout the week. Target is to lose 10 pounds by end of March through consistent effort.`,
        status: NoteStatus.PUBLISHED,
        categoryId: categories[1].id, // Personal
        tagIds: [tags[0].id, tags[6].id], // Important, Long-term
        createdAt: daysAgo(25),
        updatedAt: daysAgo(20),
      },
      {
        title: 'Tech Stack Research for New Project',
        content: `# Technology Stack Evaluation

## Frontend Options
After extensive research, I've narrowed down our frontend options to Next.js 14 with App Router or Remix. Both offer excellent performance and developer experience.

Next.js Pros: Established ecosystem, great documentation, built-in image optimization, and excellent TypeScript support. The App Router is production-ready and offers significant performance improvements.

Remix Pros: Better form handling out of the box, progressive enhancement philosophy, and excellent nested routing. The learning curve is steeper but the architecture is cleaner.

## Backend Considerations
For the backend, we're leaning towards Node.js with Fastify instead of Express. Fastify offers better performance and built-in TypeScript support. We'll use Prisma as our ORM for type-safe database access.

## Database Decision
PostgreSQL is the clear winner for our use case. We need ACID compliance, complex queries, and excellent JSON support. Supabase or Railway for hosting makes deployment straightforward.

## Deployment Strategy
Vercel for frontend, Railway for backend and database. This gives us automatic deployments, preview environments, and excellent observability. Total cost estimate: $150/month for production.`,
        status: NoteStatus.PUBLISHED,
        categoryId: categories[4].id, // Projects
        tagIds: [tags[2].id, tags[7].id], // Reference, Review
        createdAt: daysAgo(18),
        updatedAt: daysAgo(15),
      },
      {
        title: 'Client Feedback Session Summary',
        content: `# Client Review Meeting - Week 3

## Overall Satisfaction
The client expressed high satisfaction with our progress so far. They particularly appreciated the weekly demos and transparent communication about challenges.

## Feature Requests
They've requested three new features: bulk export functionality, advanced filtering options, and integration with their existing CRM system. We discussed feasibility and timeline.

The bulk export is straightforward and can be delivered next sprint. Advanced filtering will require some database optimization but is doable. The CRM integration is more complex and needs a separate discovery phase.

## Timeline Concerns
The client is hoping to launch by end of Q2 instead of Q3 as originally planned. We explained the risks of rushing and agreed to evaluate after the next milestone.

## Action Items
Schedule a technical deep-dive with their IT team for the CRM integration. Prepare a revised timeline with three scenarios: aggressive, realistic, and conservative. Update the project brief with the new feature requests.`,
        status: NoteStatus.PUBLISHED,
        categoryId: categories[0].id, // Work
        tagIds: [tags[4].id, tags[7].id], // Meeting, Review
        createdAt: daysAgo(8),
        updatedAt: daysAgo(8),
      },
      {
        title: 'Weekend Hiking Trip Planning',
        content: `# Mt. Rainier Hiking Adventure

## Trip Details
Planning a three-day hiking trip to Mt. Rainier National Park for the first weekend of March. The weather should be perfect - crisp mornings and sunny afternoons.

## Trail Selection
Day 1: Skyline Trail (5.5 miles, moderate difficulty)
Day 2: Paradise to Camp Muir (9 miles round trip, challenging)
Day 3: Grove of the Patriarchs (1.3 miles, easy recovery hike)

## Gear Checklist
Need to get new hiking boots - current ones are worn out. Also need to replace the water filter and get a new sleeping bag rated for colder temperatures.

## Group Coordination
Invited Sarah, Mike, and Jessica. Everyone confirmed except Mike who has a conflict. We'll carpool from Seattle, leaving Friday at 5 AM to beat traffic.

## Reservations
Campsite reserved at Cougar Rock Campground. Permits acquired for Camp Muir. Made dinner reservations at the Paradise Inn for Saturday night as a treat.`,
      status: NoteStatus.PUBLISHED,
        categoryId: categories[1].id, // Personal
        tagIds: [tags[5].id], // Quick Win
        createdAt: daysAgo(12),
        updatedAt: daysAgo(10),
      },
      {
        title: 'Performance Optimization Findings',
        content: `# Application Performance Analysis

## Current State
Our application is experiencing slow load times during peak hours. Average page load time is 4.2 seconds, which is well above our target of under 2 seconds.

## Bottlenecks Identified
Database queries are the primary culprit. We're making too many round trips and not utilizing indexes effectively. The N+1 query problem is prevalent in several key endpoints.

## Optimization Strategy
First priority: add database indexes on frequently queried columns. Second: implement query batching using DataLoader pattern. Third: add Redis caching layer for frequently accessed data.

## Expected Improvements
Based on similar optimizations in past projects, we should see a 60-70% reduction in load times. This will significantly improve user experience and reduce server costs.

## Implementation Timeline
Week 1: Database indexes and query optimization
Week 2: Implement caching layer
Week 3: Load testing and fine-tuning
Week 4: Deploy to production with monitoring`,
      status: NoteStatus.PUBLISHED,
        categoryId: categories[0].id, // Work
        tagIds: [tags[0].id, tags[2].id], // Important, Reference
        createdAt: daysAgo(6),
        updatedAt: daysAgo(5),
      },
      {
        title: 'Book Notes: Atomic Habits',
        content: `# Atomic Habits by James Clear - Key Takeaways

## Core Concepts
The book emphasizes that small, incremental improvements compound over time. A 1% improvement each day leads to being 37 times better after one year.

## The Four Laws of Behavior Change
Make it obvious, make it attractive, make it easy, make it satisfying. These four laws can be used to build good habits and inverted to break bad ones.

## Identity-Based Habits
Instead of focusing on outcomes, focus on becoming the type of person who achieves those outcomes. Don't aim to read more books; aim to become a reader.

## Environment Design
Your environment shapes your behavior more than motivation does. Design your environment to make good habits easier and bad habits harder.

## Implementation Intentions
Use the formula "I will [BEHAVIOR] at [TIME] in [LOCATION]" to make habits more concrete and increase the likelihood of following through.

## Habit Stacking
Link new habits to existing ones: "After I [CURRENT HABIT], I will [NEW HABIT]." This leverages existing neural pathways to build new behaviors.`,
        status: NoteStatus.PUBLISHED,
        categoryId: categories[3].id, // Learning
        tagIds: [tags[2].id, tags[6].id], // Reference, Long-term
        createdAt: daysAgo(22),
        updatedAt: daysAgo(22),
      },

      // DRAFT Notes (6 notes = 40%)
      {
        title: 'New Feature Ideas for Q2',
        content: `# Brainstorming Session - Future Features

## User-Requested Features
Dark mode implementation - this has been the most requested feature for months. Should be straightforward with our current CSS architecture.

Advanced search with filters - users want to search by date range, tags, categories, and content. Need to evaluate if we need Elasticsearch or if PostgreSQL full-text search is sufficient.

## Innovation Ideas
AI-powered note summarization using GPT-4. Could automatically generate summaries of long notes and suggest relevant tags.

Collaboration features - real-time editing, comments, and sharing. This would be a major undertaking but could differentiate us from competitors.

## Mobile App
Native mobile apps for iOS and Android. React Native seems like the right choice to maximize code reuse. Need to research offline sync strategies.

## Integration Opportunities
Slack integration for sharing notes and getting notifications. Google Drive sync for backup. Zapier integration for workflow automation.`,
      status: NoteStatus.DRAFT,
      categoryId: categories[2].id, // Ideas
        tagIds: [tags[6].id], // Long-term
        createdAt: daysAgo(4),
        updatedAt: daysAgo(3),
      },
      {
        title: 'Database Migration Strategy',
        content: `# Planning Database Migration to PostgreSQL

## Current Situation
We're currently using MySQL but need to migrate to PostgreSQL for better JSON support and more advanced features.

## Migration Approach
Option 1: Big bang migration during maintenance window
Option 2: Gradual migration with dual-write strategy
Option 3: Blue-green deployment with data sync

## Risk Assessment
Data loss is the primary concern. Need comprehensive backup strategy and rollback plan. Estimate 4-6 hours of downtime for big bang approach.

## Testing Strategy
Create staging environment with production data snapshot. Run migration scripts and validate data integrity. Performance testing with realistic load.`,
        status: NoteStatus.DRAFT,
        categoryId: categories[4].id, // Projects
        tagIds: [tags[0].id, tags[1].id], // Important, Urgent
        createdAt: daysAgo(7),
        updatedAt: daysAgo(6),
      },
      {
        title: 'Learning Rust - Getting Started',
        content: `# Rust Programming Language Notes

## Why Rust?
Memory safety without garbage collection, fearless concurrency, and excellent performance. These features make it ideal for systems programming.

## Ownership System
The ownership system is unique and takes time to understand. Every value has a single owner, and when the owner goes out of scope, the value is dropped.

## Borrowing and References
You can borrow references to values without taking ownership. References can be immutable or mutable, but not both simultaneously.

## Next Steps
Complete the Rust Book chapters 1-10. Build a small CLI tool to practice. Join the Rust community Discord for help and discussions.`,
        status: NoteStatus.DRAFT,
        categoryId: categories[3].id, // Learning
        tagIds: [tags[3].id], // Tutorial
        createdAt: daysAgo(2),
        updatedAt: daysAgo(1),
      },
      {
        title: 'Marketing Campaign Ideas',
        content: `# Q2 Marketing Strategy Brainstorm

## Content Marketing
Start a technical blog with weekly posts. Topics: best practices, case studies, tutorials. Goal: establish thought leadership and improve SEO.

## Social Media
Increase LinkedIn presence with daily posts. Share customer success stories, product updates, and industry insights.

## Email Campaign
Monthly newsletter with product updates, tips and tricks, and exclusive offers. Segment audience by usage patterns for personalized content.

## Partnership Opportunities
Reach out to complementary SaaS products for co-marketing opportunities. Joint webinars, guest blog posts, and cross-promotions.`,
        status: NoteStatus.DRAFT,
        categoryId: categories[0].id, // Work
        tagIds: [tags[6].id], // Long-term
        createdAt: daysAgo(9),
        updatedAt: daysAgo(9),
      },
      {
        title: 'Home Office Upgrade Plans',
        content: `# Creating the Perfect Home Office

## Current Issues
Desk is too small, chair is uncomfortable after long sessions, lighting is poor in the afternoons, and cable management is a mess.

## Upgrade List
Standing desk with electric adjustment (budget: $800)
Ergonomic chair - Herman Miller Aeron or Steelcase Leap (budget: $1,200)
Monitor arm for better positioning (budget: $150)
Better lighting - LED panel lights (budget: $200)

## Layout Redesign
Move desk to face the window for natural light. Add plants for better air quality and aesthetics. Install floating shelves for books and equipment.

## Tech Upgrades
Upgrade to dual 4K monitors. Get a mechanical keyboard for better typing experience. Invest in quality webcam and microphone for video calls.`,
        status: NoteStatus.DRAFT,
        categoryId: categories[1].id, // Personal
        tagIds: [tags[5].id], // Quick Win
        createdAt: daysAgo(5),
        updatedAt: daysAgo(4),
      },
      {
        title: 'API Documentation Improvements',
        content: `# Enhancing Developer Documentation

## Current State
Our API documentation is outdated and lacks examples. Developers are frequently confused about authentication and rate limiting.

## Improvement Plan
Migrate from static docs to interactive documentation using Swagger/OpenAPI. Add code examples in multiple languages (JavaScript, Python, Ruby).

Include common use cases and recipes. Add troubleshooting section with FAQ. Implement API playground for testing endpoints.

## Timeline
Week 1-2: Audit current documentation and identify gaps
Week 3-4: Write new content and examples
Week 5: Set up Swagger UI and integrate
Week 6: Review and launch`,
        status: NoteStatus.DRAFT,
        categoryId: categories[4].id, // Projects
        tagIds: [tags[0].id, tags[3].id], // Important, Tutorial
        createdAt: daysAgo(11),
        updatedAt: daysAgo(11),
      },

      // ARCHIVED Notes (1-2 notes = ~10%)
      {
        title: 'Old Project Retrospective - 2024',
        content: `# 2024 Project Retrospective

## What Went Well
The team collaboration was excellent throughout the project. We delivered on time and within budget, which is rare for projects of this complexity.

## What Could Be Improved
Communication with stakeholders could have been better. We should have scheduled more frequent check-ins to manage expectations.

## Lessons Learned
Always build in buffer time for unexpected issues. Invest in automated testing early - it pays off. Document decisions as you go, not at the end.

## Recommendations for Future Projects
Use this retrospective as a template. Schedule retrospectives at project milestones, not just at the end. Create action items and assign owners.`,
      status: NoteStatus.ARCHIVED,
        categoryId: categories[0].id, // Work
        tagIds: [tags[7].id], // Review
        createdAt: daysAgo(28),
        updatedAt: daysAgo(28),
      },
      {
        title: 'Deprecated API Endpoints Documentation',
        content: `# Legacy API Endpoints - Deprecated

## Overview
These endpoints are deprecated as of January 1, 2025 and will be removed on July 1, 2025. Please migrate to the new v2 API.

## Deprecated Endpoints
GET /api/v1/users - Replace with GET /api/v2/users
POST /api/v1/auth/login - Replace with POST /api/v2/auth/login
PUT /api/v1/profile - Replace with PATCH /api/v2/profile

## Migration Guide
The new API uses different authentication (JWT instead of session cookies) and different response formats (camelCase instead of snake_case).

## Support
Contact support@example.com for migration assistance. We offer free migration support until March 31, 2025.`,
        status: NoteStatus.ARCHIVED,
        categoryId: categories[3].id, // Learning
        tagIds: [tags[2].id], // Reference
        createdAt: daysAgo(27),
        updatedAt: daysAgo(27),
      },
    ]

    const createdNotes = []
    for (const noteData of notesData) {
      const { tagIds, createdAt, updatedAt, ...noteInfo } = noteData
    
    const note = await prisma.note.create({
      data: {
        ...noteInfo,
        userId: user.id,
          createdAt,
          updatedAt,
      },
    })
      createdNotes.push(note)

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
    }
    console.log(`✅ Created ${createdNotes.length} notes\n`)

    // ============================================
    // STEP 6: Create 8 Templates
    // ============================================
    console.log('📋 Creating templates...')
    const templates = await Promise.all([
      prisma.template.create({
        data: {
          name: 'Meeting Notes',
          description: 'Standard template for meeting documentation',
          category: 'Work',
          content: `# Meeting Notes - [Date]

## Attendees
- [Name] - [Role]
- [Name] - [Role]

## Agenda
1. [Topic 1]
2. [Topic 2]
3. [Topic 3]

## Discussion Points
### [Topic 1]
[Notes]

### [Topic 2]
[Notes]

## Decisions Made
- [Decision 1]
- [Decision 2]

## Action Items
- [ ] [Task] - [Owner] - [Due Date]
- [ ] [Task] - [Owner] - [Due Date]

## Next Meeting
Date: [Date]
Time: [Time]
Location: [Location]`,
          createdAt: daysAgo(55),
          updatedAt: daysAgo(55),
        },
      }),
      prisma.template.create({
        data: {
          name: 'Daily Standup',
          description: 'Quick daily team sync template',
          category: 'Work',
          content: `# Daily Standup - [Date]

## What I did yesterday
- [Task 1]
- [Task 2]

## What I'm doing today
- [Task 1]
- [Task 2]

## Blockers
- [Blocker 1 or "None"]

## Notes
[Any additional context or updates]`,
          createdAt: daysAgo(54),
          updatedAt: daysAgo(54),
        },
      }),
      prisma.template.create({
        data: {
          name: 'Project Plan',
          description: 'Comprehensive project planning template',
          category: 'Projects',
          content: `# Project Plan - [Project Name]

## Executive Summary
[Brief overview of the project]

## Objectives
1. [Objective 1]
2. [Objective 2]
3. [Objective 3]

## Scope
### In Scope
- [Item 1]
- [Item 2]

### Out of Scope
- [Item 1]
- [Item 2]

## Timeline
- Phase 1: [Start Date] - [End Date]
- Phase 2: [Start Date] - [End Date]
- Phase 3: [Start Date] - [End Date]

## Resources
- Team Members: [Names and roles]
- Budget: [Amount]
- Tools: [List of tools]

## Risks and Mitigation
| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| [Risk 1] | [High/Medium/Low] | [High/Medium/Low] | [Strategy] |

## Success Metrics
- [Metric 1]
- [Metric 2]`,
          createdAt: daysAgo(53),
          updatedAt: daysAgo(53),
        },
      }),
      prisma.template.create({
        data: {
          name: 'Bug Report',
          description: 'Detailed bug reporting template',
          category: 'Work',
          content: `# Bug Report - [Bug Title]

## Description
[Clear description of the bug]

## Steps to Reproduce
1. [Step 1]
2. [Step 2]
3. [Step 3]

## Expected Behavior
[What should happen]

## Actual Behavior
[What actually happens]

## Environment
- Browser: [Browser name and version]
- OS: [Operating system]
- Version: [Application version]

## Screenshots
[Add screenshots if applicable]

## Additional Context
[Any other relevant information]

## Priority
[High/Medium/Low]`,
          createdAt: daysAgo(52),
          updatedAt: daysAgo(52),
        },
      }),
      prisma.template.create({
        data: {
          name: 'Weekly Review',
          description: 'Personal weekly reflection template',
          category: 'Personal',
          content: `# Weekly Review - Week of [Date]

## Accomplishments
- [Achievement 1]
- [Achievement 2]
- [Achievement 3]

## Challenges
- [Challenge 1]
- [Challenge 2]

## Lessons Learned
- [Lesson 1]
- [Lesson 2]

## Next Week's Goals
1. [Goal 1]
2. [Goal 2]
3. [Goal 3]

## Personal Notes
[Reflections, thoughts, ideas]

## Gratitude
- [Thing 1]
- [Thing 2]
- [Thing 3]`,
          createdAt: daysAgo(51),
          updatedAt: daysAgo(51),
        },
      }),
      prisma.template.create({
        data: {
          name: 'Brainstorming',
          description: 'Creative ideation session template',
          category: 'Ideas',
          content: `# Brainstorming Session - [Topic]

## Goal
[What are we trying to solve or create?]

## Ideas
### Idea 1: [Title]
- Description: [Details]
- Pros: [Advantages]
- Cons: [Disadvantages]

### Idea 2: [Title]
- Description: [Details]
- Pros: [Advantages]
- Cons: [Disadvantages]

### Idea 3: [Title]
- Description: [Details]
- Pros: [Advantages]
- Cons: [Disadvantages]

## Top Picks
1. [Idea name] - [Reason]
2. [Idea name] - [Reason]

## Next Steps
- [ ] [Action item 1]
- [ ] [Action item 2]`,
          createdAt: daysAgo(50),
          updatedAt: daysAgo(50),
        },
      }),
      prisma.template.create({
        data: {
          name: 'Research Notes',
          description: 'Academic or technical research template',
          category: 'Learning',
          content: `# Research Notes - [Topic]

## Source
- Title: [Title]
- Author: [Author]
- Date: [Date]
- URL: [Link if applicable]

## Summary
[Brief overview of the content]

## Key Points
1. [Point 1]
2. [Point 2]
3. [Point 3]

## Quotes
> "[Quote 1]"

> "[Quote 2]"

## My Thoughts
[Your analysis and reflections]

## Related Topics
- [Topic 1]
- [Topic 2]

## Action Items
- [ ] [Follow-up research]
- [ ] [Practical application]`,
          createdAt: daysAgo(49),
          updatedAt: daysAgo(49),
        },
      }),
      prisma.template.create({
        data: {
          name: 'Decision Log',
          description: 'Document important decisions and rationale',
          category: 'Work',
          content: `# Decision Log - [Decision Title]

## Date
[Date of decision]

## Context
[What led to this decision?]

## Options Considered
### Option 1: [Name]
- Pros: [List]
- Cons: [List]

### Option 2: [Name]
- Pros: [List]
- Cons: [List]

### Option 3: [Name]
- Pros: [List]
- Cons: [List]

## Decision
[What was decided]

## Rationale
[Why this decision was made]

## Stakeholders
- [Name] - [Role]
- [Name] - [Role]

## Impact
[Expected outcomes and consequences]

## Review Date
[When to revisit this decision]`,
          createdAt: daysAgo(48),
          updatedAt: daysAgo(48),
        },
      }),
    ])
    console.log(`✅ Created ${templates.length} templates\n`)

    // ============================================
    // STEP 7: Create 7 DailyNotes
    // ============================================
    console.log('📅 Creating daily notes...')
    
    // Helper function to create a date at start of day (midnight)
    function startOfDay(daysAgo: number): Date {
      const date = new Date()
      date.setDate(date.getDate() - daysAgo)
      date.setHours(0, 0, 0, 0) // Set to midnight
      return date
    }
    
    const dailyNotes = await Promise.all([
      prisma.dailyNote.create({
        data: {
          date: startOfDay(0), // Today
          mood: 'productive',
          content: `Today was incredibly productive. Started the morning with a clear plan and managed to check off all major tasks from my list. The new project kickoff meeting went smoothly, and the team is excited about the direction we're heading.

Had a great brainstorming session in the afternoon where we came up with some innovative solutions to the performance issues we've been facing. Sometimes the best ideas come when you least expect them.

Ended the day with a workout session, which really helped clear my mind. Feeling energized and ready to tackle tomorrow's challenges.`,
          createdAt: startOfDay(0),
          updatedAt: startOfDay(0),
        },
      }),
      prisma.dailyNote.create({
        data: {
          date: startOfDay(1), // Yesterday
          mood: 'focused',
          content: `Deep work day today. Turned off all notifications and spent 6 solid hours coding. Made significant progress on the authentication system refactor. The new architecture is much cleaner and more maintainable.

Skipped lunch to stay in the flow state, which I don't usually do, but it felt right today. Sometimes you just need to ride the wave of productivity when it comes.

Evening was quiet - just some light reading and planning for tomorrow. These focused days are rare but incredibly valuable.`,
          createdAt: startOfDay(1),
          updatedAt: startOfDay(1),
        },
      }),
      prisma.dailyNote.create({
        data: {
          date: startOfDay(2), // 2 days ago
          mood: 'energized',
          content: `Woke up early and went for a run before work. There's something about morning exercise that sets a positive tone for the entire day. Felt sharp and alert during all my meetings.

The client presentation went exceptionally well. They loved the new designs and approved the next phase without any hesitation. This is a huge win for the team and validates all the hard work we've put in.

Celebrated with the team over a virtual happy hour. It's important to acknowledge these milestones and build team morale. Looking forward to the next phase of the project.`,
          createdAt: startOfDay(2),
          updatedAt: startOfDay(2),
        },
      }),
      prisma.dailyNote.create({
        data: {
          date: startOfDay(3), // 3 days ago
          mood: 'neutral',
          content: `A pretty standard day. Nothing particularly exciting or challenging. Worked through my task list methodically and made steady progress on several fronts.

Had a few meetings that could have been emails, but that's just how it goes sometimes. Used the time between meetings to catch up on documentation and code reviews.

Feeling neither particularly energized nor drained. Just a solid, productive day of work. Sometimes these unremarkable days are exactly what you need.`,
          createdAt: startOfDay(3),
          updatedAt: startOfDay(3),
        },
      }),
      prisma.dailyNote.create({
        data: {
          date: startOfDay(4), // 4 days ago
          mood: 'stressed',
          content: `Challenging day. Discovered a critical bug in production that affected several customers. Spent most of the day in crisis mode, coordinating with the team to identify the root cause and deploy a fix.

The pressure was intense, but the team rallied together and we got it resolved within 4 hours. Sent apology emails to affected customers and implemented additional monitoring to prevent similar issues.

These days are tough, but they're also learning opportunities. We're already discussing improvements to our testing and deployment processes. Need to decompress this evening and come back fresh tomorrow.`,
          createdAt: startOfDay(4),
          updatedAt: startOfDay(4),
        },
      }),
      prisma.dailyNote.create({
        data: {
          date: startOfDay(5), // 5 days ago
          mood: 'tired',
          content: `Didn't sleep well last night and it definitely showed today. Had trouble focusing during the morning standup and found myself re-reading the same code multiple times.

Decided to take it easy and focus on lighter tasks - documentation updates, responding to emails, and planning for next week. Sometimes you need to recognize when you're not operating at full capacity and adjust accordingly.

Left work early to get some rest. Tomorrow is a new day, and I'll be better prepared to tackle the more demanding tasks then.`,
          createdAt: startOfDay(5),
          updatedAt: startOfDay(5),
        },
      }),
      prisma.dailyNote.create({
        data: {
          date: startOfDay(6), // 6 days ago
          mood: 'happy',
          content: `Great day all around! Got positive feedback from my manager during our one-on-one. She specifically mentioned my leadership on the recent project and my mentorship of junior team members.

Also received a thank you note from a customer who said our product has transformed their workflow. These moments remind me why I love what I do - we're actually making a difference in people's lives.

Ended the day with dinner with friends. Good food, good conversation, and lots of laughs. Work-life balance is so important, and today felt perfectly balanced.`,
          createdAt: startOfDay(6),
          updatedAt: startOfDay(6),
        },
      }),
    ])
    console.log(`✅ Created ${dailyNotes.length} daily notes\n`)

    // ============================================
    // STEP 8: Create 4 Projects
    // ============================================
    console.log('🚀 Creating projects...')
    const projects = await Promise.all([
      prisma.project.create({
        data: {
          name: 'Website Redesign',
          description: 'Complete overhaul of the company website with modern design, improved UX, and better performance. Focus on mobile-first approach and accessibility.',
          status: 'active',
          progress: 65,
          createdAt: daysAgo(45),
          updatedAt: daysAgo(2),
        },
      }),
      prisma.project.create({
        data: {
          name: 'Mobile App V2',
          description: 'Second version of our mobile application with enhanced features, better offline support, and improved performance. Complete rewrite using React Native.',
          status: 'active',
          progress: 35,
          createdAt: daysAgo(38),
          updatedAt: daysAgo(1),
        },
      }),
      prisma.project.create({
        data: {
          name: 'Documentation Overhaul',
          description: 'Comprehensive update of all technical documentation including API docs, user guides, and developer onboarding materials.',
          status: 'completed',
          progress: 100,
          createdAt: daysAgo(60),
          updatedAt: daysAgo(15),
        },
      }),
      prisma.project.create({
        data: {
          name: 'Q1 Marketing Campaign',
          description: 'Multi-channel marketing campaign for Q1 including social media, email marketing, content creation, and paid advertising.',
          status: 'active',
          progress: 20,
          createdAt: daysAgo(25),
          updatedAt: daysAgo(3),
        },
      }),
    ])
    console.log(`✅ Created ${projects.length} projects\n`)

    // ============================================
    // STEP 9: Create 15 Tasks
    // ============================================
    console.log('✅ Creating tasks...')
    const tasks = await Promise.all([
      // Incomplete tasks (9 tasks = 60%)
      prisma.task.create({
        data: {
          title: 'Review pull request #42',
          description: 'Code review for the new authentication flow implementation. Check for security issues and code quality.',
          completed: false,
          priority: TaskPriority.HIGH,
          dueDate: daysFromNow(1), // Due soon
          projectId: projects[1].id, // Mobile App V2
          createdAt: daysAgo(5),
          updatedAt: daysAgo(5),
        },
      }),
      prisma.task.create({
        data: {
          title: 'Update API documentation',
          description: 'Add documentation for the new endpoints added in v2.3. Include examples and error codes.',
          completed: false,
          priority: TaskPriority.MEDIUM,
          dueDate: daysFromNow(7), // Future
          projectId: projects[2].id, // Documentation Overhaul
          createdAt: daysAgo(8),
          updatedAt: daysAgo(8),
        },
      }),
      prisma.task.create({
        data: {
          title: 'Fix mobile navigation bug',
          description: 'Navigation drawer not closing properly on iOS devices. Investigate and fix.',
          completed: false,
          priority: TaskPriority.HIGH,
          dueDate: daysAgo(2), // Overdue
          projectId: projects[1].id, // Mobile App V2
          createdAt: daysAgo(10),
          updatedAt: daysAgo(3),
        },
      }),
      prisma.task.create({
        data: {
          title: 'Prepare Q1 financial report',
          description: 'Compile financial data for Q1 and prepare presentation for board meeting.',
          completed: false,
          priority: TaskPriority.MEDIUM,
          dueDate: daysFromNow(10), // Future
          projectId: null,
          createdAt: daysAgo(12),
          updatedAt: daysAgo(12),
        },
      }),
      prisma.task.create({
        data: {
          title: 'Optimize database queries',
          description: 'Identify and optimize slow queries. Add indexes where needed.',
          completed: false,
          priority: TaskPriority.LOW,
          dueDate: daysFromNow(14), // Future
          projectId: projects[0].id, // Website Redesign
          createdAt: daysAgo(6),
          updatedAt: daysAgo(6),
        },
      }),
      prisma.task.create({
        data: {
          title: 'Schedule team building event',
          description: 'Plan and schedule Q1 team building activity. Get input from team members.',
          completed: false,
          priority: TaskPriority.LOW,
          dueDate: null,
          projectId: null,
          createdAt: daysAgo(15),
          updatedAt: daysAgo(15),
        },
      }),
      prisma.task.create({
        data: {
          title: 'Create social media content calendar',
          description: 'Plan social media posts for the next month. Include key dates and campaigns.',
          completed: false,
          priority: TaskPriority.MEDIUM,
          dueDate: daysFromNow(2), // Due soon
          projectId: projects[3].id, // Q1 Marketing Campaign
          createdAt: daysAgo(4),
          updatedAt: daysAgo(4),
        },
      }),
      prisma.task.create({
        data: {
          title: 'Conduct user testing session',
          description: 'Organize and conduct user testing for the new homepage design. Gather feedback.',
          completed: false,
          priority: TaskPriority.HIGH,
          dueDate: daysAgo(1), // Overdue
          projectId: projects[0].id, // Website Redesign
          createdAt: daysAgo(9),
          updatedAt: daysAgo(2),
        },
      }),
      prisma.task.create({
        data: {
          title: 'Research competitor features',
          description: 'Analyze competitor products and identify features we should consider implementing.',
          completed: false,
          priority: TaskPriority.LOW,
          dueDate: null,
          projectId: null,
          createdAt: daysAgo(7),
          updatedAt: daysAgo(7),
        },
      }),

      // Completed tasks (6 tasks = 40%)
      prisma.task.create({
        data: {
          title: 'Set up CI/CD pipeline',
          description: 'Configure GitHub Actions for automated testing and deployment.',
          completed: true,
          priority: TaskPriority.HIGH,
          dueDate: daysAgo(5),
          projectId: projects[1].id, // Mobile App V2
          createdAt: daysAgo(20),
          updatedAt: daysAgo(5),
        },
      }),
      prisma.task.create({
        data: {
          title: 'Write unit tests for auth module',
          description: 'Achieve 80% code coverage for authentication module.',
          completed: true,
          priority: TaskPriority.MEDIUM,
          dueDate: daysAgo(8),
          projectId: projects[1].id, // Mobile App V2
          createdAt: daysAgo(18),
          updatedAt: daysAgo(8),
        },
      }),
      prisma.task.create({
        data: {
          title: 'Design new landing page mockups',
          description: 'Create high-fidelity mockups for the new landing page in Figma.',
          completed: true,
          priority: TaskPriority.HIGH,
          dueDate: daysAgo(12),
          projectId: projects[0].id, // Website Redesign
          createdAt: daysAgo(25),
          updatedAt: daysAgo(12),
        },
      }),
      prisma.task.create({
        data: {
          title: 'Migrate to new hosting provider',
          description: 'Move production environment to new hosting provider with zero downtime.',
          completed: true,
          priority: TaskPriority.MEDIUM,
          dueDate: daysAgo(15),
          projectId: null,
          createdAt: daysAgo(30),
          updatedAt: daysAgo(15),
        },
      }),
      prisma.task.create({
        data: {
          title: 'Onboard new team member',
          description: 'Complete onboarding process for Sarah including access setup and training.',
          completed: true,
          priority: TaskPriority.LOW,
          dueDate: daysAgo(10),
          projectId: null,
          createdAt: daysAgo(22),
          updatedAt: daysAgo(10),
        },
      }),
      prisma.task.create({
        data: {
          title: 'Launch email newsletter',
          description: 'Send first edition of monthly newsletter to subscriber list.',
          completed: true,
          priority: TaskPriority.MEDIUM,
          dueDate: daysAgo(3),
          projectId: projects[3].id, // Q1 Marketing Campaign
          createdAt: daysAgo(14),
          updatedAt: daysAgo(3),
        },
      }),
    ])
    console.log(`✅ Created ${tasks.length} tasks\n`)

    // ============================================
    // STEP 10: Create 7 KnowledgeArticles
    // ============================================
    console.log('📚 Creating knowledge articles...')
    const knowledgeArticles = await Promise.all([
      prisma.knowledgeArticle.create({
        data: {
          title: 'Getting Started Guide',
          category: 'Documentation',
          tags: ['Tutorial', 'Quick Win', 'Important'],
          content: `Welcome to our platform! This guide will help you get up and running in just a few minutes.

## Account Setup
First, create your account by clicking the "Sign Up" button in the top right corner. You'll need to provide your email address and create a secure password. We'll send you a verification email to confirm your account.

## First Steps
Once you're logged in, take a moment to explore the dashboard. You'll see an overview of your workspace, recent activity, and quick access to key features. The navigation menu on the left provides access to all major sections of the application.

## Creating Your First Note
Click the "New Note" button to create your first note. You can add a title, write content using our rich text editor, and organize it with categories and tags. Don't worry about getting everything perfect - you can always edit your notes later.

## Organizing Your Content
Use categories to group related notes together. Tags provide an additional layer of organization and make it easy to find notes across different categories. You can create as many categories and tags as you need.

## Getting Help
If you need assistance, check out our comprehensive documentation or contact our support team. We're here to help you succeed!`,
          createdAt: daysAgo(55),
          updatedAt: daysAgo(55),
        },
      }),
      prisma.knowledgeArticle.create({
        data: {
          title: 'API Documentation',
          category: 'Reference',
          tags: ['Reference', 'Tutorial', 'Important'],
          content: `Our API provides programmatic access to all platform features. This documentation covers authentication, endpoints, and best practices.

## Authentication
All API requests require authentication using an API key. You can generate an API key from your account settings. Include the key in the Authorization header: \`Authorization: Bearer YOUR_API_KEY\`

## Rate Limiting
API requests are limited to 1000 requests per hour per API key. If you exceed this limit, you'll receive a 429 Too Many Requests response. The response headers include information about your current rate limit status.

## Endpoints
Our API follows RESTful conventions. All endpoints return JSON responses and use standard HTTP methods (GET, POST, PUT, DELETE). The base URL for all API requests is \`https://api.example.com/v1\`

## Error Handling
The API uses standard HTTP status codes to indicate success or failure. Error responses include a detailed error message and error code to help you troubleshoot issues. Common status codes include 200 (success), 400 (bad request), 401 (unauthorized), and 500 (server error).

## Best Practices
Always use HTTPS for API requests. Implement exponential backoff for retries. Cache responses when appropriate to reduce API calls. Keep your API key secure and never expose it in client-side code.`,
          createdAt: daysAgo(52),
          updatedAt: daysAgo(20),
        },
      }),
      prisma.knowledgeArticle.create({
        data: {
          title: 'Best Practices for Note Organization',
          category: 'Guide',
          tags: ['Tutorial', 'Long-term', 'Reference'],
          content: `Effective note organization is key to maximizing productivity. Here are proven strategies to keep your notes organized and easily accessible.

## Use a Consistent Naming Convention
Develop a naming system for your notes and stick to it. Include dates for time-sensitive notes (e.g., "Meeting Notes - 2025-01-15"). Use descriptive titles that clearly indicate the content. Avoid generic titles like "Notes" or "Untitled."

## Leverage Categories Strategically
Create categories based on your workflow, not just topics. Consider categories like "Active Projects," "Reference Material," and "Archive." Don't create too many categories - aim for 5-10 main categories that cover your primary needs.

## Master the Art of Tagging
Tags are more flexible than categories and allow for cross-referencing. Use tags for themes that span multiple categories, such as "urgent," "review," or "ideas." Create a tag taxonomy and document it so you use tags consistently.

## Regular Maintenance
Schedule time weekly to review and organize your notes. Archive completed projects and outdated information. Update tags and categories as your needs evolve. Delete notes that are no longer relevant.

## Search and Retrieval
Take advantage of search features to find notes quickly. Use filters to narrow down results by category, tag, or date. Create saved searches for frequently accessed note collections.`,
          createdAt: daysAgo(48),
          updatedAt: daysAgo(15),
        },
      }),
      prisma.knowledgeArticle.create({
        data: {
          title: 'Common Troubleshooting Steps',
          category: 'Support',
          tags: ['Reference', 'Quick Win'],
          content: `Encountering issues? This guide covers the most common problems and their solutions.

## Login Problems
If you're having trouble logging in, first verify that you're using the correct email address and password. Check that Caps Lock is off. If you've forgotten your password, use the "Forgot Password" link to reset it. Clear your browser cache and cookies if problems persist.

## Sync Issues
If your notes aren't syncing across devices, check your internet connection. Ensure you're logged into the same account on all devices. Try logging out and back in to force a sync. Check that you're using the latest version of the app.

## Performance Issues
Slow performance can often be resolved by clearing your browser cache. Close unnecessary browser tabs to free up memory. Disable browser extensions that might interfere with the application. If problems persist, try using a different browser.

## Missing Notes
Check the Archive section - notes might have been archived accidentally. Use the search function to locate notes by title or content. Check if filters are applied that might be hiding notes. Review the trash folder for recently deleted notes.

## Contact Support
If these steps don't resolve your issue, contact our support team at support@example.com. Include details about your browser, operating system, and steps to reproduce the problem.`,
          createdAt: daysAgo(45),
          updatedAt: daysAgo(10),
        },
      }),
      prisma.knowledgeArticle.create({
        data: {
          title: 'Feature Overview and Capabilities',
          category: 'Documentation',
          tags: ['Tutorial', 'Reference', 'Important', 'Quick Win'],
          content: `Our platform offers a comprehensive suite of features designed to enhance your productivity and organization.

## Note Management
Create, edit, and organize notes with our intuitive interface. Support for rich text formatting, including headings, lists, links, and code blocks. Attach files and images to notes. Version history allows you to view and restore previous versions.

## Organization Tools
Categories provide high-level organization for your notes. Tags offer flexible cross-referencing across categories. Favorites feature for quick access to frequently used notes. Custom views and filters to display notes exactly how you want.

## Collaboration Features
Share notes with team members with customizable permissions. Real-time collaboration allows multiple users to edit simultaneously. Comments and discussions on shared notes. Activity feed shows who made what changes and when.

## Search and Discovery
Powerful full-text search across all your notes. Advanced filters by date, category, tag, and status. Saved searches for frequently used queries. Related notes suggestions based on content similarity.

## Productivity Tools
Templates for common note types save time. Daily notes feature for journaling and daily planning. Task management with due dates and priorities. Project tracking with progress indicators.`,
          createdAt: daysAgo(50),
          updatedAt: daysAgo(25),
        },
      }),
      prisma.knowledgeArticle.create({
        data: {
          title: 'Integration Guide for Third-Party Tools',
          category: 'Tutorial',
          tags: ['Tutorial', 'Reference', 'Long-term'],
          content: `Extend the functionality of our platform by integrating with your favorite tools and services.

## Slack Integration
Connect your workspace to Slack to receive notifications and share notes directly in channels. Install the integration from the Integrations page in settings. Authorize access to your Slack workspace. Configure which events trigger Slack notifications.

## Google Drive Sync
Automatically backup your notes to Google Drive for extra peace of mind. Enable the integration and grant necessary permissions. Choose which categories to sync. Set sync frequency (real-time, hourly, or daily).

## Zapier Automation
Create powerful workflows using Zapier's automation platform. Connect our platform to thousands of other apps. Set up triggers (e.g., new note created) and actions (e.g., send email). Popular workflows include creating notes from emails and syncing tasks to project management tools.

## API Integration
For custom integrations, use our REST API. Generate an API key from account settings. Review the API documentation for available endpoints. Implement authentication and error handling. Test in a development environment before deploying to production.

## Webhook Support
Configure webhooks to receive real-time notifications of events. Set up webhook URLs in your account settings. Choose which events to subscribe to. Implement webhook handlers in your application to process incoming data.`,
          createdAt: daysAgo(42),
          updatedAt: daysAgo(18),
        },
      }),
      prisma.knowledgeArticle.create({
        data: {
          title: 'Frequently Asked Questions',
          category: 'FAQ',
          tags: ['Reference', 'Quick Win', 'Review'],
          content: `Quick answers to the most commonly asked questions about our platform.

## General Questions

**Q: Is my data secure?**
A: Yes, we use industry-standard encryption for data at rest and in transit. All data is backed up daily. We never share your data with third parties.

**Q: Can I export my notes?**
A: Absolutely! You can export individual notes or your entire workspace in multiple formats including Markdown, PDF, and JSON.

**Q: What happens if I delete a note?**
A: Deleted notes are moved to the trash where they remain for 30 days before permanent deletion. You can restore notes from the trash at any time during this period.

## Account Questions

**Q: Can I change my email address?**
A: Yes, you can update your email address in account settings. You'll need to verify the new email address before the change takes effect.

**Q: How do I cancel my subscription?**
A: You can cancel your subscription at any time from the billing section in settings. You'll retain access until the end of your current billing period.

## Technical Questions

**Q: Which browsers are supported?**
A: We support the latest versions of Chrome, Firefox, Safari, and Edge. For the best experience, we recommend Chrome or Firefox.

**Q: Is there a mobile app?**
A: Yes, we have native apps for both iOS and Android. The mobile apps sync seamlessly with the web version.`,
          createdAt: daysAgo(58),
          updatedAt: daysAgo(5),
        },
      }),
    ])
    console.log(`✅ Created ${knowledgeArticles.length} knowledge articles\n`)

    // ============================================
    // FINAL: Print Summary
    // ============================================
    console.log('🎉 Seed completed successfully!\n')
    
  const counts = await Promise.all([
    prisma.user.count(),
    prisma.category.count(),
    prisma.tag.count(),
    prisma.note.count(),
      prisma.noteTag.count(),
      prisma.template.count(),
      prisma.dailyNote.count(),
      prisma.project.count(),
      prisma.task.count(),
      prisma.knowledgeArticle.count(),
    ])

    console.log('📊 Database Summary:')
    console.log('═══════════════════════════════════')
    console.log(`✓ Users:              ${counts[0]}`)
    console.log(`✓ Categories:         ${counts[1]}`)
    console.log(`✓ Tags:               ${counts[2]}`)
    console.log(`✓ Notes:              ${counts[3]}`)
    console.log(`✓ Note-Tag Links:     ${counts[4]}`)
    console.log(`✓ Templates:          ${counts[5]}`)
    console.log(`✓ Daily Notes:        ${counts[6]}`)
    console.log(`✓ Projects:           ${counts[7]}`)
    console.log(`✓ Tasks:              ${counts[8]}`)
    console.log(`✓ Knowledge Articles: ${counts[9]}`)
    console.log('═══════════════════════════════════')
    console.log(`Total Records: ${counts.reduce((a, b) => a + b, 0)}`)
    console.log('\n✨ Your database is now populated with realistic data!')

  } catch (error) {
    console.error('❌ Seed failed:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error('❌ Fatal error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    console.log('\n👋 Disconnected from database')
  })
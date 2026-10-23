import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Cleaning existing database...");
  await prisma.task.deleteMany({});
  await prisma.projectDeliverable.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.user.deleteMany({});

  const defaultPassword = await bcrypt.hash("password123", 10);

  console.log("👥 Creating Staff & Management Users...");

  // 1. Management Users
  const sarah = await prisma.user.create({
    data: {
      name: "Sarah Jenkins",
      username: "sarah.director",
      password: defaultPassword,
      role: "MANAGEMENT",
      position: "Head of Agency & Executive Creative Director",
      department: "Management",
      bio: "12+ years steering award-winning brand transformations, global campaigns, and design strategy.",
      avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    },
  });

  const marcus = await prisma.user.create({
    data: {
      name: "Marcus Chen",
      username: "marcus.ops",
      password: defaultPassword,
      role: "MANAGEMENT",
      position: "Operations & Resource Director",
      department: "Operations",
      bio: "Mastering capacity allocation, agency workflows, and multi-team delivery timelines.",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    },
  });

  // 2. Staff Users with various departments and workload states
  // Elena: Overloaded (6 active tasks)
  const elena = await prisma.user.create({
    data: {
      name: "Elena Rostova",
      username: "elena.design",
      password: defaultPassword,
      role: "STAFF",
      position: "Lead UI/UX & Visual Designer",
      department: "Creative",
      bio: "Passionate about typography, modern design systems, micro-interactions, and visual storytelling.",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    },
  });

  // David: Optimal (3 active tasks)
  const david = await prisma.user.create({
    data: {
      name: "David Kim",
      username: "david.dev",
      password: defaultPassword,
      role: "STAFF",
      position: "Senior Full-Stack Web Developer",
      department: "Tech",
      bio: "Specializing in Next.js, WebGL, three.js, headless CMS, and ultra-fast responsive web builds.",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    },
  });

  // Maya: Optimal (3 active tasks)
  const maya = await prisma.user.create({
    data: {
      name: "Maya Patel",
      username: "maya.content",
      password: defaultPassword,
      role: "STAFF",
      position: "Senior Copywriter & Strategist",
      department: "Strategy",
      bio: "Crafting bold copy, campaign narratives, brand voice manuals, and social media hooks.",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
  });

  // Liam: Available / Idle (1 active task)
  const liam = await prisma.user.create({
    data: {
      name: "Liam O'Connor",
      username: "liam.motion",
      password: defaultPassword,
      role: "STAFF",
      position: "3D & Motion Graphics Specialist",
      department: "Creative",
      bio: "After Effects wizard, Cinema4D, Blender artist creating kinetic promos and CGI assets.",
      avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    },
  });

  // Sofia: Available / Idle (0 active tasks, 2 archived)
  const sofia = await prisma.user.create({
    data: {
      name: "Sofia Rodriguez",
      username: "sofia.media",
      password: defaultPassword,
      role: "STAFF",
      position: "Paid Media & Growth Strategist",
      department: "Media",
      bio: "Driving multi-channel ROAS, TikTok spark ads, programmatic DOOH, and search analytics.",
      avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    },
  });

  // Jordan: Optimal (2 active tasks)
  const jordan = await prisma.user.create({
    data: {
      name: "Jordan Blake",
      username: "jordan.acct",
      password: defaultPassword,
      role: "STAFF",
      position: "Senior Client Account Director",
      department: "Accounts",
      bio: "Managing Fortune 500 client relationships, sprint scopes, budget allocation, and executive reviews.",
      avatarUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
    },
  });

  console.log("🚀 Creating Agency Projects...");

  // Project 1: Nike Air Max
  const pNike = await prisma.project.create({
    data: {
      code: "LOCO-NK-01",
      name: "Air Max Day 2026 Immersive Experience",
      clientName: "Nike Global",
      status: "ACTIVE",
      priority: "URGENT",
      category: "Digital Experience & 3D Web",
      budget: "$120,000",
      startDate: new Date("2026-09-01"),
      deadline: new Date("2026-11-15"),
      brief:
        "Develop an interactive WebGL 3D virtual fitting room and social hub for Nike Air Max Day 2026. The experience must allow sneakerheads to inspect shoe anatomy in 3D, customize colorways, and unlock exclusive digital drops.",
      goals:
        "1. Achieve 3.0M+ unique global site visitors during the 10-day activation.\n2. 45% interactive engagement in customizer.\n3. Capture 150k waitlist sign-ups for the limited-edition sneaker release.",
      description:
        "Locomotion is handling full creative direction, 3D assets pipeline, WebGL development, and social motion teasers. High-touch brand guidelines, fast-loading 60fps graphics across mobile and desktop.",
      previewUrl: "https://staging-airmax-loco.agency/v2",
      pitchDeckUrl: "https://slides.google.com/presentation/d/nike-airmax-pitch-2026",
      creativeDeckUrl: "https://figma.com/file/loco-nike-airmax-design-system",
      finalAssetsUrl: "https://drive.google.com/drive/folders/nike-airmax-approved-deliverables",
      createdById: sarah.id,
      deliverables: {
        create: [
          {
            title: "Figma Master Design Tokens & UI System",
            url: "https://figma.com/file/loco-nike-airmax-design-system",
            type: "CREATIVE_DECK",
            status: "APPROVED",
          },
          {
            title: "Interactive WebGL Staging Build (v2.4)",
            url: "https://staging-airmax-loco.agency/v2",
            type: "PREVIEW",
            status: "IN_PROGRESS",
          },
          {
            title: "Approved Key Visuals & 3D Renders",
            url: "https://drive.google.com/drive/folders/nike-airmax-renders",
            type: "FINAL_ASSET",
            status: "APPROVED",
          },
        ],
      },
    },
  });

  // Project 2: Spotify Sound Odyssey
  const pSpotify = await prisma.project.create({
    data: {
      code: "LOCO-SPT-04",
      name: "Sound Odyssey Live Wrapped",
      clientName: "Spotify Studios",
      status: "ACTIVE",
      priority: "HIGH",
      category: "Interactive Audio Experience",
      budget: "$85,000",
      startDate: new Date("2026-09-20"),
      deadline: new Date("2026-12-05"),
      brief:
        "Design a vibrant companion web application for Spotify's live festival stream, translating sonic frequencies into algorithmic visual art shareable directly to Instagram Stories and TikTok.",
      goals:
        "1. Drive 25% lift in live stream audience engagement.\n2. Facilitate over 500,000 generated generative music cards shared organically.\n3. Seamless sync with Spotify Web API.",
      description:
        "Dynamic audio visualizer powered by Web Audio API, kinetic Swiss typography, and bold contrasting neon palettes reflecting Spotify's bold brand refresh.",
      previewUrl: "https://preview.spotify-soundodyssey.locomotion.studio",
      pitchDeckUrl: "https://slides.google.com/presentation/d/spotify-sound-pitch",
      creativeDeckUrl: "https://figma.com/file/spotify-sound-odyssey-ui",
      finalAssetsUrl: "https://frame.io/projects/spotify-audio-motion-masters",
      createdById: sarah.id,
      deliverables: {
        create: [
          {
            title: "Spotify Sound Odyssey Interactive Prototype",
            url: "https://preview.spotify-soundodyssey.locomotion.studio",
            type: "PREVIEW",
            status: "IN_PROGRESS",
          },
          {
            title: "Brand Voice Manual & Social Copy Deck",
            url: "https://docs.google.com/document/d/spotify-brand-copy",
            type: "PITCH_DECK",
            status: "APPROVED",
          },
        ],
      },
    },
  });

  // Project 3: Red Bull HyperDrive
  const pRedBull = await prisma.project.create({
    data: {
      code: "LOCO-RB-09",
      name: "HyperDrive Esports Championship Portal",
      clientName: "Red Bull Media House",
      status: "IN_REVIEW",
      priority: "HIGH",
      category: "Web Platform & Live Telemetry",
      budget: "$95,000",
      startDate: new Date("2026-08-15"),
      deadline: new Date("2026-10-30"),
      brief:
        "Build a high-performance tournament dashboard displaying live race driver telemetry, real-time leaderboard brackets, and audience fantasy picks.",
      goals:
        "1. Sub-100ms real-time latency for live racer telemetry.\n2. Support 400k concurrent tournament viewers.\n3. Integrate Twitch chat and live streamer overlays.",
      description:
        "Dark cockpit UI with neon telemetry gauges, instant replay clips, driver telemetry graphs, and interactive prediction widgets.",
      previewUrl: "https://hyperdrive.redbull.locomotion.dev",
      pitchDeckUrl: "https://gamma.app/docs/redbull-hyperdrive-strategy",
      creativeDeckUrl: "https://figma.com/file/redbull-hyperdrive-cockpit",
      finalAssetsUrl: "https://drive.google.com/drive/folders/redbull-hyperdrive-assets",
      createdById: marcus.id,
      deliverables: {
        create: [
          {
            title: "Live Production Dashboard URL",
            url: "https://hyperdrive.redbull.locomotion.dev",
            type: "PREVIEW",
            status: "APPROVED",
          },
          {
            title: "Twitch Broadcast Stream Overlays (4K)",
            url: "https://drive.google.com/drive/folders/redbull-overlays",
            type: "FINAL_ASSET",
            status: "APPROVED",
          },
        ],
      },
    },
  });

  // Project 4: Apple Music Spatial Showcase
  const pApple = await prisma.project.create({
    data: {
      code: "LOCO-APL-12",
      name: "Spatial Audio Creator Showcase",
      clientName: "Apple Music Marketing",
      status: "PITCH",
      priority: "MEDIUM",
      category: "Editorial & Strategy Pitch",
      budget: "$60,000",
      startDate: new Date("2026-10-01"),
      deadline: new Date("2026-11-28"),
      brief:
        "Prepare an agency pitch deck and interactive concept demonstrating how Apple Music can showcase grassroots indie producers mastering in Dolby Atmos Spatial Audio.",
      goals:
        "1. Win master agency creative retainer for Apple Music's Fall 2026 Indie Series.\n2. Establish Locomotion as primary spatial audio creative agency.",
      description:
        "Minimalist Apple-grade editorial design, typographic purity, tactile audio previews, and artist interview video treatments.",
      pitchDeckUrl: "https://keynote.icloud.com/locomotion-apple-spatial-pitch",
      creativeDeckUrl: "https://figma.com/file/apple-music-spatial-moodboard",
      createdById: sarah.id,
      deliverables: {
        create: [
          {
            title: "Keynote Strategic Pitch Deck",
            url: "https://keynote.icloud.com/locomotion-apple-spatial-pitch",
            type: "PITCH_DECK",
            status: "IN_PROGRESS",
          },
        ],
      },
    },
  });

  // Project 5: Acme FinTech
  const pAcme = await prisma.project.create({
    data: {
      code: "LOCO-ACM-02",
      name: "Next-Gen Mobile Banking Platform",
      clientName: "Acme Financial Corp",
      status: "DELIVERED",
      priority: "LOW",
      category: "FinTech Design System",
      budget: "$150,000",
      startDate: new Date("2026-04-01"),
      deadline: new Date("2026-09-15"),
      brief:
        "Complete overhaul of Acme's legacy mobile banking app, creating a unified cross-platform design system and accessible design tokens.",
      goals:
        "1. WCAG 2.1 AA accessibility compliance.\n2. 60% reduction in frontend design-to-code turnarounds.",
      description:
        "Comprehensive Figma token library, React Native component library, customer journey maps, and documentation portal.",
      previewUrl: "https://design.acmebank.locomotion.com",
      pitchDeckUrl: "https://slides.google.com/presentation/d/acme-fintech-pitch",
      creativeDeckUrl: "https://figma.com/file/acme-design-system-complete",
      finalAssetsUrl: "https://drive.google.com/drive/folders/acme-final-deliverables",
      createdById: marcus.id,
      deliverables: {
        create: [
          {
            title: "Figma Component Library & Token Specs",
            url: "https://figma.com/file/acme-design-system-complete",
            type: "CREATIVE_DECK",
            status: "APPROVED",
          },
        ],
      },
    },
  });

  console.log("📝 Creating Tasks linked to Users and Projects...");

  // ELENA'S TASKS (Staff - Overloaded with 6 active tasks)
  await prisma.task.createMany({
    data: [
      {
        title: "3D Sneaker Anatomy Interactive UI Layouts",
        description: "Design the modal UI that pops up when a user clicks on the Air Max sole or air pocket.",
        status: "On Progress",
        priority: "URGENT",
        dueDate: new Date("2026-10-26"),
        estimatedHours: 6.0,
        userId: elena.id,
        projectId: pNike.id,
      },
      {
        title: "Nike Mobile Customizer Bottom Sheet Components",
        description: "Create fluid draggable bottom sheet controls for colorway selection on iOS Safari.",
        status: "To Do",
        priority: "HIGH",
        dueDate: new Date("2026-10-28"),
        estimatedHours: 4.5,
        userId: elena.id,
        projectId: pNike.id,
      },
      {
        title: "Spotify Wrapped Kinetic Typography System",
        description: "Define motion rules and responsive text layouts for the live stream companion card.",
        status: "On Progress",
        priority: "HIGH",
        dueDate: new Date("2026-10-29"),
        estimatedHours: 8.0,
        userId: elena.id,
        projectId: pSpotify.id,
      },
      {
        title: "Spotify Social Share Card Generator Mockups",
        description: "Design 9:16 Instagram Story and TikTok templates for user listening recaps.",
        status: "To Do",
        priority: "MEDIUM",
        dueDate: new Date("2026-11-02"),
        estimatedHours: 5.0,
        userId: elena.id,
        projectId: pSpotify.id,
      },
      {
        title: "Red Bull Telemetry Dashboard Polish & Dark Mode Review",
        description: "Fine-tune neon contrast levels and high-DPI speedometer gauges for twitch broadcast.",
        status: "On Progress",
        priority: "MEDIUM",
        dueDate: new Date("2026-10-31"),
        estimatedHours: 4.0,
        userId: elena.id,
        projectId: pRedBull.id,
      },
      {
        title: "Internal Locomotion Brand Assets Refresh",
        description: "Update agency business cards and digital email signatures with modern badge.",
        status: "To Do",
        priority: "LOW",
        dueDate: new Date("2026-11-10"),
        estimatedHours: 3.0,
        userId: elena.id,
        projectId: null,
      },
      // Elena's completed task in Archive
      {
        title: "Nike Moodboard & Creative Direction Approval",
        description: "Compile visual references, lighting setup, and materials breakdown for client sign-off.",
        status: "Done",
        priority: "HIGH",
        dueDate: new Date("2026-09-20"),
        estimatedHours: 10.0,
        userId: elena.id,
        projectId: pNike.id,
        completedAt: new Date("2026-09-19"),
      },
    ],
  });

  // DAVID'S TASKS (Staff - Optimal with 3 active tasks)
  await prisma.task.createMany({
    data: [
      {
        title: "Three.js Sneaker Model GLTF Optimization & Texture Compression",
        description: "Compress 4K textures with KTX2 / Basis Universal to ensure sub-2s mobile loading.",
        status: "On Progress",
        priority: "URGENT",
        dueDate: new Date("2026-10-27"),
        estimatedHours: 8.0,
        userId: david.id,
        projectId: pNike.id,
      },
      {
        title: "Nike WebGL Orbit Controls & Camera Zoom Clamping",
        description: "Implement smooth easing on pinch zoom and orbit controls across touch devices.",
        status: "To Do",
        priority: "HIGH",
        dueDate: new Date("2026-10-30"),
        estimatedHours: 5.0,
        userId: david.id,
        projectId: pNike.id,
      },
      {
        title: "Spotify Web Audio API Realtime Frequency Visualizer Engine",
        description: "Build canvas-based FFT frequency analyzer responding dynamically to live track audio.",
        status: "On Progress",
        priority: "HIGH",
        dueDate: new Date("2026-11-04"),
        estimatedHours: 9.0,
        userId: david.id,
        projectId: pSpotify.id,
      },
      // Archived
      {
        title: "Setup CI/CD Pipeline on Vercel for Nike Staging",
        description: "Automated preview deployments and branch previews on GitHub pull requests.",
        status: "Done",
        priority: "MEDIUM",
        dueDate: new Date("2026-09-10"),
        estimatedHours: 3.5,
        userId: david.id,
        projectId: pNike.id,
        completedAt: new Date("2026-09-09"),
      },
      {
        title: "Acme FinTech Web Component Documentation Site",
        description: "Deploy Storybook documentation portal for banking client engineering handoff.",
        status: "Done",
        priority: "MEDIUM",
        dueDate: new Date("2026-08-30"),
        estimatedHours: 12.0,
        userId: david.id,
        projectId: pAcme.id,
        completedAt: new Date("2026-08-28"),
      },
    ],
  });

  // MAYA'S TASKS (Staff - Optimal with 3 active tasks)
  await prisma.task.createMany({
    data: [
      {
        title: "Nike Air Max Copywriting & Microcopy Guidelines",
        description: "Write punchy sneakerhead-authentic copy for CTA buttons, tooltips, and drop alerts.",
        status: "On Progress",
        priority: "HIGH",
        dueDate: new Date("2026-10-28"),
        estimatedHours: 5.0,
        userId: maya.id,
        projectId: pNike.id,
      },
      {
        title: "Spotify Wrapped Narrative Storyline & Prompt Generator",
        description: "Draft 20 humorous music archetype profiles for the sound personality generator.",
        status: "On Progress",
        priority: "MEDIUM",
        dueDate: new Date("2026-11-01"),
        estimatedHours: 6.0,
        userId: maya.id,
        projectId: pSpotify.id,
      },
      {
        title: "Apple Music Pitch Manifesto & Executive Summary",
        description: "Write the compelling opening letter and creative thesis for Apple Music execs.",
        status: "To Do",
        priority: "MEDIUM",
        dueDate: new Date("2026-11-05"),
        estimatedHours: 4.0,
        userId: maya.id,
        projectId: pApple.id,
      },
      // Archived
      {
        title: "Red Bull Esports Press Release Draft",
        description: "Write official press kit copy for the championship broadcast launch.",
        status: "Done",
        priority: "LOW",
        dueDate: new Date("2026-09-18"),
        estimatedHours: 3.0,
        userId: maya.id,
        projectId: pRedBull.id,
        completedAt: new Date("2026-09-17"),
      },
    ],
  });

  // LIAM'S TASKS (Staff - Available / Idle with 1 active task)
  await prisma.task.createMany({
    data: [
      {
        title: "Nike Air Max 15s 3D Particle Explosion Teaser",
        description: "Render high-octane 3D shoe disintegration into air bubbles in Cinema4D.",
        status: "On Progress",
        priority: "HIGH",
        dueDate: new Date("2026-11-03"),
        estimatedHours: 8.0,
        userId: liam.id,
        projectId: pNike.id,
      },
      // Archived
      {
        title: "Red Bull Twitch Intro Video Motion Stingers",
        description: "Deliver 10-second neon stinger transitions for OBS broadcast switcher.",
        status: "Done",
        priority: "HIGH",
        dueDate: new Date("2026-10-05"),
        estimatedHours: 7.0,
        userId: liam.id,
        projectId: pRedBull.id,
        completedAt: new Date("2026-10-04"),
      },
    ],
  });

  // SOFIA'S TASKS (Staff - Available / Idle with 0 active tasks! Ready for new project!)
  await prisma.task.createMany({
    data: [
      // Archived tasks only
      {
        title: "Red Bull Paid Media Campaign Post-Mortem Analytics",
        description: "Compiled comprehensive CAC and conversion analysis across Meta and YouTube.",
        status: "Done",
        priority: "MEDIUM",
        dueDate: new Date("2026-10-12"),
        estimatedHours: 6.0,
        userId: sofia.id,
        projectId: pRedBull.id,
        completedAt: new Date("2026-10-11"),
      },
      {
        title: "Acme FinTech Launch App Store Acquisition Funnel",
        description: "Optimized Apple Search Ads keyword campaign structure.",
        status: "Done",
        priority: "MEDIUM",
        dueDate: new Date("2026-09-02"),
        estimatedHours: 8.0,
        userId: sofia.id,
        projectId: pAcme.id,
        completedAt: new Date("2026-09-01"),
      },
    ],
  });

  // JORDAN'S TASKS (Staff - Optimal with 2 active tasks)
  await prisma.task.createMany({
    data: [
      {
        title: "Nike Bi-Weekly Stakeholder Sprint Review Preparation",
        description: "Consolidate creative status, velocity chart, and deliverable review agenda.",
        status: "On Progress",
        priority: "HIGH",
        dueDate: new Date("2026-10-25"),
        estimatedHours: 3.0,
        userId: jordan.id,
        projectId: pNike.id,
      },
      {
        title: "Apple Music Strategy Scope & SOW Contract Alignment",
        description: "Draft scope of work appendix with legal and procurement teams.",
        status: "To Do",
        priority: "MEDIUM",
        dueDate: new Date("2026-11-08"),
        estimatedHours: 4.0,
        userId: jordan.id,
        projectId: pApple.id,
      },
    ],
  });

  console.log("✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

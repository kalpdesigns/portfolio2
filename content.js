/* ==========================================================================
   SITE CONTENT — edit everything you see on the website here.

   How to edit:
   - Change only the text between the quotes "like this".
   - Keep the commas at the end of lines.
   - To add an image, run compress-images.sh (see that file), then write
     its path here, e.g. image: "images/me.jpg". Leave it as "" to show a soft
     gradient placeholder instead.
   ========================================================================== */

window.CONTENT = {

  /* ---------- Browser tab ---------- */
  pageTitle: "Kalpesh — Product Designer",
  pageDescription: "Product designer who designs products that go live.",

  /* ---------- Landing section ---------- */
  landing: {
    greeting: "Hello, I'm Kalpesh",
    // Words between *stars* are set in italics
    headline: "A product designer who turns complex problems into products that *go live.*",
    // The three ideas under the headline. Each sits on a highlighter stroke; pointing at one shows its line.
    pillars: [
      { text: "Context first", more: "Who it's for, where it lives, what's at stake; before any screen.", color: "#ffe066" },
      { text: "System underneath", more: "The structure that the product can scale with.", color: "#9fd4ff" },
      { text: "Craft on top", more: "Refining the tiny details, done tastefully.", color: "#ffb3cb" }
    ],
    // Buttons on the landing. As you scroll they fly down into the bottom bar.
    contact: "Contact",
    resume: "Resume"
  },

  /* ---------- Nav bar (bottom of screen) ---------- */
  nav: {
    home: "Home",
    about: "About",
    work: "Work",
    resume: "Resume",
    resumeFile: "Kalpesh_Bhavsar_Resume%202026.pdf",   // the PDF inside the "website" folder (%20 = the space in its name)
    // Pictures of each resume page for the on-page viewer. After replacing the PDF, run: sh tools/resume-pages.sh
    resumePages: ["images/resume-page-1.jpg"]
  },

  /* ---------- About section ---------- */
  about: {
    heading: "Who is Kalpesh?",
    // Shown first; then each scroll brings in the next item below it
    text: "Kalpesh is a designer who designs products, and occasionally things that are harder to categorize, like",
    steps: [
      "an AR app that brought a 430‑ft facade to life at India Art Fair 2026",
      "an ecosystem of EdTech video & LMS apps",
      "a series of board games to reinforce sustainable aquaculture"
    ],
    // Polaroids: they glide past in the depth carousel; the one marked "main: true" starts in the middle.
    polaroids: [
      { image: "images/polaroid-lamp.jpg", caption: "Folded paper lamp" },
      { image: "images/polaroid-sunset.jpg", caption: "Sunset over the sea" },
      { image: "images/polaroid-skateboard.jpg", caption: "Skateboard" },
      { image: "images/polaroid-main.jpg", caption: "Kalpesh", main: true },
      { image: "images/polaroid-paperform.jpg", caption: "Paper form" },
      { image: "images/polaroid-moon.jpg", caption: "Clouds and the moon" },
      { image: "images/polaroid-window.jpg", caption: "Dusk through a window" },
      { image: "images/polaroid-silhouette.jpg", caption: "Kalpesh at the beach" }
    ]
  },

  /* ---------- Work section ---------- */
  work: {
    heading: "Work",
    viewLabel: "View case study",
    projects: [
      {
        id: "india-art-fair",
        tags: ["AR app", "Mobile"],
        title: "Designed an AR app for India Art Fair 2026",
        description: "I designed an AR app bringing a 430 ft facade to life. Bespoke visual style as an extension of the artwork. Live on iOS and Android.",
        metrics: [
          { value: "430 ft", label: "Facade brought to life" },
          { value: "3 weeks", label: "From design to launch" },
          { value: "5", label: "Publications covered it" }
        ],
        image: ""
      },
      {
        id: "edtech-ecosystem",
        tags: ["EdTech", "Product design"],
        title: "Designed an EdTech ecosystem of 3 apps for video-based learning",
        description: "I led UX UI design for a suite of 3 gamified video-creation apps for K-12 students, built on one shared design system. Live on iOS, Android and web.",
        metrics: [
          { value: "40,000+", label: "Downloads across the apps" },
          { value: "4.5+", label: "Star rating on app stores" },
          { value: "3", label: "Apps launched" }
        ],
        image: "images/FVL-hero.jpg"
      },
      {
        id: "admin-dashboard",
        tags: ["Dashboard", "Enterprise UX"],
        title: "Designed an admin dashboard to create & manage users & content",
        description: "I designed the role-based control centre for the Fyule ecosystem, letting admins and schools manage users, content and events without any training.",
        metrics: [
          { value: "3", label: "User roles served" },
          { value: "6", label: "Admin modules designed" },
          { value: "3", label: "Apps managed in one place" }
        ],
        image: ""
      }
    ]
  },

  /* ---------- Case study pages ----------
     Each case study is listed under the same "id" as its project above.
     Projects without one show a simple "coming soon" page.

     Text tricks:  *words*  become italic,  **words**  become bold.

     At the top of each case study: title, subtitle (line under the title),
     tags, and info (the Role / Collaboration strip).

     Each section has a "nav" label (shown in the sidebar) and a list of
     blocks. Block types you can use:
       { type: "heading", text: "..." }            heading inside a section
       { type: "subheading", text: "..." }         smaller heading, e.g. one point under "Decisions"
       { type: "text", text: "..." }               a paragraph
       { type: "lead", text: "..." }               larger intro sentence
       { type: "list", items: ["...", "..."] }     bullet points
       { type: "image", image: "", caption: "" }   picture (leave "" for a placeholder); an .mp4 plays like a silent looping GIF
                                                   (add controls: true for play and sound buttons)
       { type: "note", text: "..." }               small label with an arrow, above an image
       { type: "tldr", challenge: "...", challengeList: ["..."], solution: "..." or ["...", "..."] }
       { type: "callout", title: "Note", text: "..." }   boxed side note
       { type: "tiles", items: [{ label: "...", icon: "" }] }   grid of small cards
       { type: "links", items: [{ label: "...", icon: "apple" / "googleplay" / "web", url: "..." }] }
       { type: "video", youtube: "VIDEO_ID", vertical: true }   (add autoplay: true to start it silently on scroll; ratio: "4 / 3" for other shapes)
       { type: "carousel", images: ["images/a.jpg", "images/b.jpg"] }   several images sliding in one frame
  */
  caseStudy: {
    comingSoon: "Full case study coming soon.",
    backLabel: "Back to work",
    sectionsLabel: "On this page",
    clientLabel: "Client",
    nextLabel: "Next case study",

    studies: {
      "india-art-fair": {
        title: "*AR experience* for India Art Fair 2026",
        subtitle: "I designed the AR app that animates a 430 ft embroidered facade at India Art Fair 2026, end to end as the sole designer. Live on the App Store and Google Play.",
        tags: ["Mobile app", "AR app", "UX design", "Visual design"],
        info: [
          { label: "Role", text: "Sole designer- research, UX design, visual design, prototyping, developer handoff." },
          { label: "Collaboration", items: ["Artist- Afrah Shafiq", "2 developers", "1 animator"] }
        ],
        // Images: put the file in Assets, run compress-images.sh, and it shows up here.
        // Until then a soft gradient fills the spot.
        heroImage: "images/IAF-hero.mp4",
        sections: [
          {
            nav: "Overview",
            blocks: [
              { type: "heading", text: "What is Sample This!" },
              { type: "text", text: "India Art Fair is South Asia's leading modern and contemporary art fair, held each year in New Delhi. For the 2026 edition, artist Afrah Shafiq created *The Giant Sampler*, a 430 ft outdoor installation that treats the facade as a giant embroidery sampler. It ran across four tent facades with about 120 motifs." },
              { type: "text", text: "I designed the AR app that animates the facade, letting visitors simply point a phone at it and watch it move." }
            ]
          },
          {
            nav: "TL;DR",
            blocks: [
              {
                type: "tldr",
                challenge: "Most visitors are new to AR, and nobody at a busy fair stops to learn a new tool.",
                solution: [
                  "Onboarding that explains the app and artwork.",
                  "In-moment guidance while scanning",
                  "A bespoke visual system drafted from embroidery traditions and materials."
                ]
              }
            ]
          },
          {
            nav: "Preview",
            blocks: [
              { type: "heading", text: "Sample This!" },
              { type: "image", image: "images/IAF-preview.jpg", caption: "" },
              { type: "note", text: "Check out the live app on the app stores" },
              {
                type: "links",
                items: [
                  { label: "App Store", icon: "apple", url: "https://apps.apple.com/us/app/sample-this/id6757216004" },
                  { label: "Google Play", icon: "googleplay", url: "https://play.google.com/store/apps/details?id=com.paxmah.fasacde&hl=en_IN" }
                ]
              }
            ]
          },
          {
            nav: "Deepdive",
            blocks: [
              { type: "heading", text: "My role" },
              { type: "text", text: "I ran discovery, mapped the information architecture, wrote the wireframes, and designed the interface and visual system with Afrah. I handed sections to developers as each one was ready." },

              { type: "heading", text: "Constraints" },
              { type: "subheading", text: "Audience" },
              { type: "text", text: "IAF visitors, i.e. art collectors, curators, enthusiasts are moving through a busy outdoor fair, with limited patience for friction. In such moments, users abandon the task." },
              { type: "subheading", text: "Time" },
              { type: "text", text: "The strict timeline left no room for a linear process. I ran IA, wireframes and visual design in parallel and handed sections to developers as they were done; keeping iterations faster." },
              { type: "image", image: "images/IAF-uxdesign.jpg", caption: "" },

              { type: "heading", text: "Decisions" },
              { type: "subheading", text: "Onboarding as introduction" },
              { type: "text", text: "Instead of explaining AR in the abstract, onboarding introduces the embroidery and what visitors are about to see. The first screens give people a reason to continue before they need to learn a gesture" },
              { type: "subheading", text: "Guidance while scanning, in the moment" },
              { type: "text", text: "Toast messages appear in real time as people scan, telling them what to do next. Visitors do not need a separate tutorial, and the screens stay minimal. This came straight from the research: unfamiliar AR gets abandoned, so help has to arrive exactly where people get stuck." },
              { type: "subheading", text: "App as an extension of the artwork" },
              { type: "text", text: "Since the start, my aim was to make the app a part of the art; hence I drafted the visual system from embroidery itself." },
              { type: "image", image: "images/IAF-visual1.mp4", caption: "" },
              {
                type: "list",
                items: [
                  "Cards use aida fabric textures.",
                  "Borders and dividers use embroidery stitch patterns.",
                  "The palette comes from embroidery thread colours.",
                  "The rattle motif from Karnataka's Kasuti tradition anchors the identity.",
                  "Typography and layout follow an editorial feel."
                ]
              },
              { type: "image", image: "images/IAF-visual2.mp4", caption: "" }
            ]
          },
          {
            nav: "Testing",
            blocks: [
              { type: "heading", text: "Testing" },
              { type: "text", text: "Early on, I tested with a printed sample of the facade. The final test took place at the fair venue in Delhi, with feedback relayed remotely by the on-site team." },
              { type: "image", image: "images/IAF-testing.mp4", caption: "", controls: true }
            ]
          },
          {
            nav: "Troubleshooting",
            blocks: [
              { type: "heading", text: "Troubleshooting ⚠️" },
              { type: "text", text: "The original design had two scan modes on the home screen: scan facade (to see the animations) and scan motif (to trigger a motif card for individual motifs). The scan motif feature required image recognition technology that the initial development team could not reliably implement within the timeline." },
              { type: "text", text: "A new developer was brought in at a late stage. With limited time remaining before the fair, a difficult decision was made: the scan motif feature was removed from the final product. I pushed for retaining the motif cards accessible via gallery, but the direct scan-to-card flow was cut." },
              { type: "text", text: "This wasn't the outcome I wanted. But the decision was the right one. A partially working feature that misfires in the field is worse than no feature. The motif gallery remained fully functional, and the scan facade experience worked smoothly." },
              { type: "text", text: "If I were to redesign this, I would have pressed harder for technical feasibility validation earlier in the process, and would have advocated for locking the developer team before the design process began." },
              { type: "image", image: "images/IAF-motifgallery.jpg", caption: "" }
            ]
          },
          {
            nav: "Outcome",
            blocks: [
              { type: "heading", text: "Outcome" },
              { type: "text", text: "The app launched on the App Store and Google Play in February 2026, live across all four tent facades." },
              { type: "text", text: "The project was covered by *Outlook India*, *Harper's Bazaar India*, *STIRworld*, *The Voice of Fashion* and *FE Leisure*." },
              { type: "image", image: "images/IAF-response.mp4", caption: "", vertical: true }
            ]
          },
          {
            nav: "Reflection",
            blocks: [
              { type: "heading", text: "What I'd do differently" },
              { type: "text", text: "I would check technical feasibility in the first week, and agree on the team and approach before design begins." },
              { type: "text", text: "With more time I'd bring motif scanning back, add deeper motif stories, and design for people who can't stand in front of the facade." }
            ]
          }
        ]
      },

      "edtech-ecosystem": {
        title: "*Gamified* video-making apps for students",
        subtitle: "I led UX/UI for three video-making apps and an admin dashboard that help children create and help schools manage it. 40,000+ downloads on iOS and Android.",
        tags: ["Mobile app", "Web app", "UX UI design", "Design system"],
        info: [
          { label: "Role", text: "Lead UX/UI designer: research, UX design, visual design, design system, prototyping, developer handoff." },
          {
            label: "Collaboration",
            items: [
              "Client: Fyule (executives, content developers, teachers, trainers)",
              "Developers",
              "Consultancy: Crossed Design",
              "Platforms: iOS, Android, web"
            ]
          }
        ],
        heroImage: "images/FVL-hero.jpg",
        sections: [
          {
            nav: "Overview",
            blocks: [
              { type: "heading", text: "What is Fyule Video Lab" },
              { type: "text", text: "Fyule teaches art through video-making. Its students relied on third-party editing and animation tools built for adults. Those tools overwhelmed children and did not follow Fyule's syllabus." },
              { type: "text", text: "Fyule Video Lab replaces them with three apps for K-12 students: a stop-motion animator, a video editor and a showcase platform. An admin dashboard lets teachers and administrators manage users, content and data across all of them." }
            ]
          },
          {
            nav: "TL;DR",
            blocks: [
              {
                type: "tldr",
                challenge: "Make video-making simple enough for children to start on their own, and structured enough for schools to trust.",
                solution: "Three apps on one design system, a reward loop that keeps children creating, and an admin dashboard that follows the syllabus."
              }
            ]
          },
          {
            nav: "Preview",
            blocks: [
              { type: "heading", text: "Fyule Video Lab" },
              { type: "carousel", images: ["images/FVL-preview-a.jpg", "images/FVL-preview-b.jpg", "images/FVL-preview-c.jpg"] },
              { type: "text", text: "The apps are live on iOS, Android and the web, with 40,000+ downloads and store ratings of 4.5 stars or higher." },
              { type: "note", text: "Check out the live apps on the app stores" },
              {
                type: "links",
                items: [
                  { label: "App Store", icon: "apple", url: "https://apps.apple.com/in/app/fyule-video-lab/id1638889550" },
                  { label: "Google Play", icon: "googleplay", url: "https://play.google.com/store/apps/dev?id=6526336937043336042&hl=en_IN" },
                  { label: "Website", icon: "web", url: "https://fyule.io/" }
                ]
              }
            ]
          },
          {
            nav: "Deepdive",
            blocks: [
              { type: "heading", text: "My role" },
              { type: "text", text: "I led UX/UI across the whole product lineup. I ran research and co-creation workshops, mapped the information architecture, designed the flows and screens, built the design system in Figma and handed it to developers. The work came to about 300 screens across 35 to 40 flows, an admin dashboard of about 80 screens and a UI kit of 100+ components." },

              { type: "heading", text: "Research and alignment" },
              { type: "text", text: "Research showed three types of student creator. Some managed the existing tools alone. Others needed a lot of guidance. The tools were built for adults, so they overwhelmed students and did not match the syllabus, which created friction for students and teachers." },
              { type: "text", text: "I ran co-creation workshops with executives, content developers, teachers and trainers to map goals and priorities. The result was a design brief that balanced usability with business goals." },
              { type: "image", image: "images/FVL-persona.jpg", caption: "" },

              { type: "heading", text: "Constraints" },
              { type: "subheading", text: "Audience" },
              { type: "text", text: "Children in K-12, with limited dexterity and little adult help. When an interface felt like an obstacle, they disengaged." },
              { type: "subheading", text: "Schools" },
              { type: "text", text: "Teachers needed control without complexity. Content had to follow the syllabus across standards, sections and subjects." },
              // { type: "image", image: "images/FVL-principles.jpg", caption: "" },   ← hidden until this image is ready

              { type: "heading", text: "Decisions" },
              { type: "subheading", text: "Six principles from the research" },
              { type: "text", text: "The research became six rules every screen had to pass: an incentive to create, room to play, support for offline setup, constructive progression, less dependence on adults, and design for limited dexterity." },
              { type: "subheading", text: "One app first, then the system" },
              { type: "text", text: "The project started with the stop-motion animator. We began with defining its features, set priorities and mapped its information architecture before designing visuals. That app set the patterns, and the design system grew from it." },
              { type: "subheading", text: "A look drawn from games" },
              { type: "text", text: "The users are children, so I drew the look from game consoles and playing cards: bold, vivid colour and a playful feel that makes creating feel like play." },
              { type: "image", image: "images/FVL-figmaboard.mp4", caption: "" },
              { type: "image", image: "images/FVL-timelinemotion.mp4", caption: "" },
              { type: "subheading", text: "One system across three apps and a dashboard" },
              { type: "text", text: "A component-based design system in Figma covered colour, typography, iconography and spacing, with named variants and states for developer handoff. With 100+ components, it kept three apps and the dashboard consistent. In an ecosystem like this, one decision in the system reaches every screen." },
              // { type: "image", image: "images/FVL-allapps.jpg", caption: "" },   ← hidden until this image is ready
            ]
          },
          {
            nav: "Apps",
            blocks: [
              { type: "heading", text: "The three apps and the dashboard" },
              { type: "subheading", text: "Fyule Stopmotion Animator" },
              { type: "text", text: "An intuitive editor with adjustable frame rate and filters, green-screen support and rewards for exploring." },
              { type: "image", image: "images/FVL-animator.mp4", caption: "" },
              { type: "subheading", text: "Fyule Video Editor" },
              { type: "text", text: "Customisable templates that lower the barrier to starting, a content library organised by classroom subject and timeline-based editing." },
              { type: "image", image: "images/FVL-editor.mp4", caption: "" },
              { type: "subheading", text: "Fyule Video Lab Showcase" },
              { type: "text", text: "A place for young creators to share work, build portfolios, connect with other creators and manage profiles. It also holds curriculum-based lessons, contests and masterclasses." },
              { type: "image", image: "images/FVL-showcase.mp4", caption: "" }
            ]
          },
          {
            nav: "Testing",
            blocks: [
              { type: "heading", text: "Testing" },
              { type: "text", text: "I tested through feedback sessions with the Fyule team and stakeholders, and reviewed each build with them to find and remove friction. I did not run structured usability sessions with students." },
              // { type: "image", image: "images/FVL-testing.jpg", caption: "" },   ← hidden until this image is ready
            ]
          },
          {
            nav: "Outcome",
            blocks: [
              { type: "heading", text: "Outcome" },
              { type: "text", text: "The apps launched on iOS, Android and the web and became part of Fyule's video-based curriculum, under a freemium subscription model. Schools across India adopted them. The suite has 40,000+ downloads, with store ratings of 4.5 stars or higher." },
              // { type: "image", image: "images/FVL-response.jpg", caption: "" },   ← hidden until this image is ready
            ]
          },
          {
            nav: "Reflection",
            blocks: [
              { type: "heading", text: "What I'd do differently" },
              { type: "text", text: "I would run structured testing with real students. Without it, my iterations rested on stakeholder feedback and assumptions. I would also involve teachers in research as co-designers from the start." },
              { type: "text", text: "The biggest lesson: in an ecosystem like this, the design system is the product. Every system decision reaches every screen." }
            ]
          }
        ]
      },

      "admin-dashboard": {
        title: "Admin Dashboard *For* User & Content Management",
        tags: ["Dashboard", "Web app", "UX UI design", "Design system", "Information design"],
        client: "Fyule Video Lab w/ Crossed Design",
        heroImage: "",   // e.g. "images/dashboard-hero.jpg"
        sections: [
          {
            nav: "Introduction",
            blocks: [
              { type: "heading", text: "What is Fyule Admin Dashboard" },
              { type: "text", text: "Every app students use in the Fyule ecosystem is managed from the admin dashboard. It is used by administrators from Fyuele team and school representatives to manage users, assign content, track progress, and manage what students can access." },
              { type: "text", text: "I designed the admin dashboard as part of the broader Fyule ecosystem, alongside the three student-facing apps." },
              { type: "callout", title: "Note", text: "This dashboard is an internal product, hence specific details of the project are not disclosed here. This case study focuses on approach to design with representative visuals to maintain confidentiality." }
            ]
          },
          {
            nav: "TL;DR",
            blocks: [
              {
                type: "tldr",
                challenge: "Designing a control layer for non-technical users i.e. administrators and teachers; who needed meaningful oversight of a multi-product platform without any training or technical background. Complex data and multiple user roles to be catered with one interface.",
                challengeList: [
                  "Manage users, roles and content.",
                  "Create, Manage & Publish events/contests etc",
                  "Manage tutorials and training content in LMS",
                  "Schedule online masterclasses/cohorts etc.",
                  "Push notifications, announcements and other important updates"
                ],
                solution: "A role-based dashboard prioritising scanability and task speed over feature richness. Clear information hierarchy, a consistent component system shared across the ecosystem, and an interface structured around what administrators actually need to do within their defined scope."
              }
            ]
          },
          {
            nav: "Preview",
            blocks: [
              { type: "note", text: "Here's what the dashboard looked like" },
              { type: "video", youtube: "tqzosJIFiz8" }
            ]
          },
          {
            nav: "Deepdive",
            blocks: [
              { type: "lead", text: "Now let's dive deeper…" },
              { type: "heading", text: "Discovery" },
              { type: "text", text: "Research focused on understanding what administrators actually needed to do and what different levels of access, control and management is needed. Three primary tasks emerged from this:" },
              { type: "text", text: "**Managing users:** adding students, assigning them to classes, resetting access. This needed to be fast, repetitive-task friendly, and forgiving of errors." },
              { type: "text", text: "**Managing content:** assigning curriculum content to specific classes and standards. This required clear filtering and a structure that mapped to how schools actually organise teaching, not how the database organises data." },
              { type: "text", text: "**Monitoring activity:** understanding whether students were engaging with the platform, which content was being used, and where drop-off occurred. This needed to be scannable at a glance, not a detailed analytics report." },
              {
                type: "tiles",
                items: [
                  { label: "Manage admins roles & access", icon: "" },
                  { label: "Administer users & content", icon: "" },
                  { label: "Manage LMS & learning content", icon: "" },
                  { label: "Create, manage & publish events & contests", icon: "" },
                  { label: "Schedule & manage online cohorts & masterclasses", icon: "" },
                  { label: "Push announcements, notifications & updates", icon: "" }
                ]
              },
              { type: "heading", text: "Information architecture" },
              { type: "text", text: "The IA was structured around these three tasks putting priority needs to the front making it effective for different user groups." },
              { type: "text", text: "Primary navigation covered three areas: Users, Content, and Activity. Everything else including settings, account management, support was secondary navigation." },
              { type: "image", image: "", caption: "" },   // e.g. "images/dashboard-ia.jpg"
              { type: "heading", text: "Designing for role based access" },
              { type: "text", text: "The dashboard served multiple user types with different levels of access:" },
              { type: "list", items: ["Master admin with full access", "Co-admins with specialized access", "School admins with school facing access"] },
              { type: "text", text: "Role-based design meant the same interface needed to surface different information depending on who was logged in, without creating confusion when a user's scope changed or when they needed to understand what they couldn't access and why." },
              { type: "image", image: "", caption: "" },   // e.g. "images/dashboard-roles.jpg"
              { type: "text", text: "The dashboard shared the Fyule design system's colour tokens, typography, and component library ensuring visual consistency across the entire ecosystem. But the application was different." },
              { type: "text", text: "Where the student apps were playful and high-contrast, the dashboard was calm and information-dense. The same system, applied with restraint. Tables, filters, and status indicators replaced animations and reward mechanics." },
              { type: "callout", title: "Note", text: "Detailed screen designs are partially confidential. The GIFs below show the interaction patterns and key flows." },
              { type: "image", image: "", caption: "" }    // e.g. "images/dashboard-flows.gif"
            ]
          },
          {
            nav: "Reception",
            blocks: [
              { type: "heading", text: "Reception and impact" },
              { type: "text", text: "The Fyule admin dashboard streamlines administrative processes, enhancing efficiency in user & content management. Master admins gain comprehensive control, while school admins effectively manage their schools profile & students' content." }
            ]
          },
          {
            nav: "Reflection",
            blocks: [
              { type: "heading", text: "Reflection" },
              { type: "text", text: "Designing a dashboard is a specific discipline in itself with the goal to make it effective without overwhelming." },
              { type: "text", text: "The most useful constraint on this project was designing within an existing system. Having worked with the cross-functional stakeholders allowed me to design for an array of users." },
              { type: "text", text: "If I were doing it again, I'd involve at least one teacher in the discovery phase as a research participan, because the people who understand the workflow best are the ones using it daily." }
            ]
          }
        ]
      }

    }
  },

  /* ---------- Logo strip ---------- */
  logos: {
    heading: "Teams I've worked with",
    // Leave logo as "" to show the name as text instead. scale makes one logo bigger or smaller (1 = normal).
    items: [
      { name: "India Art Fair", logo: "images/logo-india-art-fair.png" },
      { name: "Fyule", logo: "images/logo-fyule.png" },
      { name: "Crossed Design", logo: "images/logo-crossed-design.png" },
      { name: "GIZ", logo: "images/logo-giz.png" },
      { name: "Direct Create", logo: "images/logo-direct-create.png" },
      { name: "Love and Other Outdoor Games", logo: "images/logo-love-and-other-outdoor-games.png", scale: 1.3 },
      { name: "Bhavya Desai Illustrations", logo: "images/logo-bhavya-desai.png" }
    ]
  },

  /* ---------- Footer ---------- */
  footer: {
    heading: "Let's build something",
    headingItalic: "that goes live.",
    email: "kabhavsar.1996@gmail.com",
    // The typewriter contact form. accessKey comes from web3forms.com (free): until it's
    // filled in, Send opens the visitor's email app with their note instead.
    typewriter: {
      accessKey: "",
      greeting: "Dear Kalpesh,",
      placeholder: "Click here and start typing…",
      emailPlaceholder: "Your email, so I can reply",
      send: "Send",
      thanks: "Thank you! Your note is on its way. I'll write back to {email} soon.",
      error: "Hmm, the plane got lost on the way. Please email me at {to} instead.",
      another: "Write another"
    },
    links: [
      { label: "LinkedIn", url: "https://www.linkedin.com/in/kalpeshab/" },
      { label: "Resume", url: "Kalpesh_Bhavsar_Resume%202026.pdf" }
    ],
    // These two sit on either side of the bottom bar at the very end of the page.
    // {figma} and {claude} are replaced by the Figma and Claude Code logos.
    copyright: "© 2026 Kalpesh Bhavsar",
    madeWith: "Designed with {figma}, built with {claude}"
  }
};

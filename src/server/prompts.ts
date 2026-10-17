/**
 * Dedicated server-side prompt templates for WriteGenius Tools
 */

export interface PromptPayload {
  toolSlug: string;
  input: string;
  secondaryInput?: string;
  options?: Record<string, string | number | boolean>;
  mode?: 'generate' | 'improve' | 'rewrite' | 'shorten' | 'expand';
}

export function buildSystemInstruction(toolSlug: string): string {
  const baseRules = `You are the core intelligence of WriteGenius Tools, a professional writing suite.
Rules:
1. Deliver pristine, publication-grade prose adhering to the user's explicit task and constraints.
2. For emails, job applications, resumes, and bios: NEVER fabricate qualifications, degrees, employment history, names, or metrics not provided by the user. If information is missing, use clean bracketed placeholders like [Company Name] or [Metric %].
3. For academic essays and articles: Do not invent fake DOI numbers or fabricated scholarly citations. Construct rigorous, logical argument frameworks.
4. For SEO tools: Deliver realistic suggestions based on search intent; do not guarantee Google rank positions.
5. Provide pure output text ready for immediate use. Do NOT preface responses with conversational commentary like "Sure, here is your essay:" or "Here are some options:". Start directly with the content.`;

  return baseRules;
}

export function buildUserPrompt(payload: PromptPayload): string {
  const { toolSlug, input, secondaryInput, options = {}, mode = 'generate' } = payload;

  const tone = options.tone ? `Tone: ${options.tone}` : '';
  const length = options.length ? `Length: ${options.length}` : '';
  const intent = options.intent ? `Intent: ${options.intent}` : '';
  const format = options.format ? `Format: ${options.format}` : '';
  const essayType = options.essayType ? `Essay Type: ${options.essayType}` : '';
  const academicLevel = options.academicLevel ? `Academic Level: ${options.academicLevel}` : '';
  const targetAudience = options.targetAudience ? `Target Audience: ${options.targetAudience}` : '';
  const genre = options.genre ? `Genre: ${options.genre}` : '';

  const optionsSummary = [tone, length, intent, format, essayType, academicLevel, targetAudience, genre]
    .filter(Boolean)
    .join(' | ');

  // Quick mode handlers
  if (mode === 'improve') {
    return `Task: Substantially improve the clarity, vocabulary, syntax, and flow of the following text while preserving its exact factual meaning.\n\nText:\n${input}`;
  }
  if (mode === 'rewrite') {
    return `Task: Completely rewrite the following text with fresh phrasing, strong cadence, and zero grammatical friction.\nTarget Style: ${tone || 'Professional & Crisp'}\n\nOriginal Text:\n${input}`;
  }
  if (mode === 'shorten') {
    return `Task: Make the following text significantly more concise, eliminating filler words and redundant clauses while preserving key facts.\n\nOriginal Text:\n${input}`;
  }
  if (mode === 'expand') {
    return `Task: Expand the following brief text by introducing vivid examples, supporting context, and logical transitions.\n\nOriginal Text:\n${input}`;
  }

  // Tool-specific prompt templates
  switch (toolSlug) {
    case 'ai-paragraph-writer':
      return `Task: Write a focused, cohesive paragraph on the following topic.
Topic: ${input}
Constraints: ${optionsSummary}
Structure: Strong opening topic sentence, 3-4 supporting and explanatory sentences, and a smooth concluding synthesis sentence.`;

    case 'ai-essay-writer':
      return `Task: Draft a well-structured academic essay based on the prompt below.
Prompt: ${input}
${secondaryInput ? `Key Arguments / Thesis: ${secondaryInput}` : ''}
Parameters: ${optionsSummary}
Format: Include Title, Introduction with clear Thesis Statement, Body Paragraphs with analytical topic sentences and evidence discussion, and a Synthesis Conclusion. Use clean Markdown headers.`;

    case 'ai-article-writer':
      return `Task: Write an in-depth, publication-quality article.
Topic / Headline: ${input}
${secondaryInput ? `Audience Context: ${secondaryInput}` : ''}
Format: ${optionsSummary}
Requirements: Include catchy headline, engaging introduction, informative H2/H3 subsections with actionable takeaways, and a decisive conclusion.`;

    case 'ai-blog-post-writer':
      return `Task: Write an engaging, reader-friendly blog post optimized for online readability.
Topic / Keyword: ${input}
Style: ${optionsSummary}
Format: Engaging opening hook, short skimmable paragraphs, bullet points where appropriate, and a concluding discussion question.`;

    case 'paragraph-rewriter':
      return `Task: Rewrite the following paragraph according to the objective: ${options.mode || 'clarity and flow'}.
Preserve all factual points, names, and statistics.
Original Paragraph:
${input}`;

    case 'sentence-rewriter':
      return `Task: Provide 4 distinct variations of the following sentence:
1. Concise & Punchy
2. Formal & Professional
3. Engaging & Conversational
4. Expressive & Narrative

Original Sentence: "${input}"`;

    case 'ai-text-improver':
      return `Task: Edit and elevate the following text. Fix grammatical awkwardness, eliminate weak passive verbs, and enhance rhythm.
Editing Intensity: ${options.intensity || 'balanced'}
Original Draft:
${input}`;

    case 'ai-introduction-generator':
      return `Task: Write 2 distinct, high-impact introductory opening paragraphs for the following topic:
Topic: ${input}
Hook Style: ${options.hookType || 'Engaging'}
Structure: Sentence 1 hook, Sentences 2-3 contextual tension, Sentence 4 clear thesis / roadmap statement.`;

    case 'ai-conclusion-generator':
      return `Task: Write a synthesis conclusion based on the following key points:
Summary of Content: ${input}
Focus: ${options.callToAction || 'synthesis'}
Deliverable: A memorable closing that reinforces key takeaways and delivers a forward-looking perspective.`;

    case 'text-expander':
      return `Task: Elaborate on the following concept into a well-developed, detailed explanation with concrete examples.
Seed Concept: ${input}
Depth: ${options.expansionFactor || 'moderate'}`;

    case 'text-shortener':
      return `Task: Condense the following verbose text into a crisp, high-impact version.
Reduction Target: ${options.targetReduction || '50%'}
Original Text:
${input}`;

    case 'tone-changer':
      return `Task: Rewrite the following text into the specified tone of voice: "${options.targetTone || 'diplomatic'}".
Original Text:
${input}`;

    case 'ai-email-writer':
      return `Task: Write a complete professional email based on the following details.
Email Purpose: ${input}
${secondaryInput ? `Recipient Context: ${secondaryInput}` : ''}
Tone: ${options.tone || 'professional'}
Format:
Provide 2 Subject Line options, followed by the complete email body (Greeting, Opening, Core Message, Call to Action, and Professional Sign-off).`;

    case 'professional-email-reply-generator':
      return `Task: Draft a courteous and professional response to the incoming email below.
Received Email:
"${input}"
Desired Decision / Action: ${secondaryInput || 'Acknowledge receipt and follow up'}
Stance: ${options.stance || 'diplomatic'}
Format: Subject line reply (Re: ...) and complete email body.`;

    case 'follow-up-email-generator':
      return `Task: Write a polite, effective follow-up email.
Context / Previous Message: ${input}
Scenario: ${options.scenario || 'proposal'}
Tone: Courteous, professional, and clear about requested next steps.`;

    case 'cover-letter-writer':
      return `Task: Write a compelling, tailored cover letter.
Target Role & Company: ${input}
Candidate Background & Key Wins: ${secondaryInput || 'Experience relevant to the role'}
Style: ${options.style || 'compelling'}
Structure:
- Formal Letter Header
- Opening: Hook explaining enthusiasm and immediate alignment
- Body Paragraph 1: Key technical or domain achievement with metrics
- Body Paragraph 2: Cultural fit and value proposition
- Closing: Professional call-to-action requesting interview.`;

    case 'job-application-letter-generator':
      return `Task: Draft a formal job application inquiry letter.
Position & Organization: ${input}
Qualifications Summary: ${secondaryInput || 'Relevant experience'}
Tone: Articulate, respectful, and focused on value delivery.`;

    case 'resume-bullet-point-writer':
      return `Task: Transform the following everyday job duty into 4 high-impact resume accomplishment bullet points using the XYZ formula (Accomplished [X], as measured by [Y], by doing [Z]).
Job Responsibility: ${input}
${secondaryInput ? `Known Results / Tools: ${secondaryInput}` : ''}
Requirements: Start each bullet with a strong past-tense action verb. Do not fabricate false company names.`;

    case 'professional-bio-generator':
      return `Task: Write an authoritative professional biography.
Background & Highlights: ${input}
Perspective: ${options.perspective === 'first' ? 'First Person (I/my)' : 'Third Person (He/She/They/Name)'}
Target Length: ${options.length || 'medium'} (~100-150 words).`;

    case 'meeting-summary-formatter':
      return `Task: Parse and organize the following rough meeting notes into a clean executive summary.
Raw Notes:
${input}
Format Structure:
1. Executive Summary (2-3 sentences)
2. Key Decisions Made (bullet points)
3. Action Items (Action | Owner | Target Date)
4. Open Questions / Next Steps`;

    case 'business-proposal-outline-generator':
      return `Task: Build a comprehensive business proposal outline.
Project & Client Context: ${input}
Structure:
1. Executive Problem Statement
2. Proposed Solution & Architecture
3. Scope of Work & Key Deliverables
4. Milestones & Timeline
5. Investment / Engagement Model
6. Success Metrics & Guarantees`;

    case 'seo-title-generator':
      return `Task: Generate 5 high-CTR, SEO-optimized title tags for Google Search.
Target Keyword: ${input}
Search Intent: ${options.intent || 'commercial'}
Constraint: Keep every title strictly between 45 and 60 characters so it fits on Google's desktop and mobile SERPs without truncation. Include character count beside each.`;

    case 'meta-description-generator':
      return `Task: Generate 4 compelling meta descriptions for Google Search.
Page Topic: ${input}
${secondaryInput ? `Keywords / Benefit: ${secondaryInput}` : ''}
Constraint: Each description MUST be between 130 and 155 characters long. Include character count for each. Include an actionable call to action.`;

    case 'blog-outline-generator':
      return `Task: Generate an exhaustive H2 and H3 blog outline designed to rank on Google.
Topic / Target Keyword: ${input}
Include:
- Introduction hook outline
- 5 to 7 detailed H2 sections with nested H3 bullet points
- Recommended FAQ section answering common "People Also Ask" search questions
- Conclusion and call-to-action`;

    case 'blog-introduction-generator':
      return `Task: Generate 2 irresistible blog introductions using the PAS (Problem-Agitate-Solution) framework.
Topic: ${input}
Goal: Hook reader immediately in first 2 sentences, build curiosity, and outline what the article reveals.`;

    case 'faq-generator':
      return `Task: Generate 5 high-value FAQ questions and concise answers for the following product or topic.
Subject: ${input}
Format: Question in bold, followed by a direct 2-3 sentence authoritative answer suitable for rich search snippets.`;

    case 'product-description-writer':
      return `Task: Write a high-converting e-commerce product description.
Product & Specs: ${input}
Target Buyer Persona: ${options.targetAudience || 'General'}
Format:
1. Catchy headline
2. Engaging benefit-driven narrative paragraph (translating specs into daily emotional value)
3. Key Features list (bullet points with bold benefit lead-ins)
4. Suitable call-to-action`;

    case 'article-headline-generator':
      return `Task: Brainstorm 10 catchy headline variations for the topic below across these angles:
- 2 How-To / Process headlines
- 2 Listicle / Numbered headlines
- 2 Contrarian / Myth-busting headlines
- 2 Curiosity / Secret headlines
- 2 Direct Benefit headlines

Topic: ${input}`;

    case 'blog-conclusion-generator':
      return `Task: Write an engaging blog conclusion.
Topic and Takeaways: ${input}
Deliverable: A 1-2 paragraph wrap-up summarizing main insights, followed by a provocative discussion question to drive reader comments.`;

    case 'content-brief-generator':
      return `Task: Create an editorial content brief for a content creator.
Primary Keyword: ${input}
Include:
- Primary & Secondary Search Intent
- Target Word Count Recommendation
- Suggested SEO Title & Meta Description
- Section Heading Outline (H2 / H3)
- Key Competitor Gap / Differentiator
- 3 Questions the article must answer`;

    case 'search-intent-brainstorming-tool':
      return `Task: Analyze search intent for the keyword phrase: "${input}".
Provide:
1. Dominant Search Intent classification (Informational / Commercial / Transactional)
2. Primary User Pain Points & Underlying Frustrations
3. Top 5 Sub-queries & Related Questions
4. Recommended Content Format (Guide, Tool, Comparison, Calculator)
5. Crucial elements needed to satisfy the searcher`;

    case 'youtube-description-writer':
      return `Task: Write an SEO-optimized YouTube video description.
Video Title & Contents: ${input}
Format:
- First 2 lines (Hook + keyword rich summary visible above "Show More")
- Detailed Video Summary (1-2 paragraphs)
- Chapter Timestamps Placeholder ([00:00] Intro, etc.)
- Links / Resource Callouts
- 3 to 5 targeted hashtags`;

    case 'youtube-title-generator':
      return `Task: Generate 8 high-CTR YouTube titles for the topic: "${input}".
Include a mix of:
- High Curiosity / Story titles
- How-To / Educational titles
- Contrarian / Shock titles
- Clean Minimalist titles
Keep all titles under 70 characters for mobile display.`;

    case 'social-media-caption-generator':
      return `Task: Write 3 engaging social media captions for platform: "${options.platform || 'instagram'}".
Topic: ${input}
Include:
- 1-line scroll-stopping hook
- Spaced paragraph structure for mobile readability
- Call to action
- 3 to 5 relevant hashtags`;

    case 'hashtag-suggestion-generator':
      return `Task: Generate a curated cluster of 20 relevant hashtags for: "${input}".
Group them into:
- 5 High Volume / Broad hashtags
- 10 Niche / Community hashtags (best for engagement)
- 5 Specific / Location or Long-tail hashtags`;

    case 'instagram-bio-generator':
      return `Task: Generate 4 distinct Instagram bio concepts for:
Profile Details: ${input}
Constraint: Each bio MUST be under 150 characters. Use vertical line breaks, clean typography, and a clear call-to-action pointer for the link.`;

    case 'facebook-post-writer':
      return `Task: Write a conversational, community-oriented Facebook post.
Subject: ${input}
Tone: Authentic, relatable, and designed to generate comments and discussions.`;

    case 'linkedin-post-writer':
      return `Task: Write a high-engagement LinkedIn post.
Insight / Story: ${input}
Format Style: ${options.format || 'story'}
Structure:
- Arresting 1-line hook
- Generous white space between sentences
- The conflict or challenge
- The key business/life takeaway
- An open question asking the network for their thoughts.`;

    case 'short-story-writer':
      return `Task: Write a compelling narrative short story or scene based on the premise below.
Premise: ${input}
Genre: ${genre || 'Speculative / Literary'}
Focus: Rich sensory atmosphere, character motivation, and narrative tension.`;

    case 'creative-writing-assistant':
      return `Task: Assist with the following creative writing scene or dilemma:
Scene / Challenge: ${input}
Provide:
1. Sensory atmospheric details (sight, sound, tactile textures)
2. 2 Realistic dialogue exchanges with subtext
3. 2 Unexpected plot twist or character choice directions.`;

    case 'speech-writer':
      return `Task: Write an engaging, moving speech calibrated for live oral delivery.
Occasion & Context: ${input}
Type: ${options.occasion || 'wedding / toast'}
Tone: Heartfelt, conversational, with natural pauses and comedic beats. Length ~350-450 words.`;

    case 'slogan-generator':
      return `Task: Generate 10 catchy, memorable brand slogans and taglines for:
Brand / Mission: ${input}
Group them into:
- 3 Short & Punchy (under 4 words)
- 3 Benefit-Driven
- 2 Emotional / Inspiring
- 2 Playful / Rhyming`;

    case 'thank-you-message-writer':
      return `Task: Write 3 sincere, personalized thank-you messages.
Context: ${input}
Options:
1. Warm & Personal (suitable for greeting card)
2. Professional & Polite (suitable for workplace/mentor)
3. Short & Sweet (suitable for text message).`;

    case 'birthday-message-writer':
      return `Task: Write 3 personalized birthday messages for:
Recipient / Relationship: ${input}
Tone: ${options.tone || 'warm'}
Options:
1. Heartfelt & Meaningful
2. Witty & Humorous
3. Short & Catchy.`;

    case 'instagram-caption-generator':
      return `Task: Write 3 engaging Instagram captions for the following topic or photo.
Topic / Concept: ${input}
Include:
- Eye-catching 1st line hook
- Spaced line breaks for clean mobile scannability
- Conversational call-to-action
- 4 to 6 relevant niche hashtags.`;

    case 'twitter-post-generator':
      return `Task: Write 4 distinct X / Twitter posts or thread hooks for:
Topic / Idea: ${input}
Options:
1. Punchy 1-Liner (under 140 chars)
2. Contrarian Question
3. Actionable Tip
4. Thread Starter (Hook + Promise).`;

    case 'youtube-title-and-description':
      return `Task: Generate 5 high-CTR YouTube video titles and a complete SEO description for:
Video Subject: ${input}
Format:
- 5 Catchy Title Options (under 70 characters)
- First 2 lines hook (visible above "Show More")
- Video Overview (1-2 paragraphs)
- Timestamps placeholder outline ([00:00] Intro, etc.)
- 3 to 5 targeted tags/hashtags.`;

    case 'social-media-content-ideas':
      return `Task: Brainstorm 7 high-engagement social media content ideas for:
Niche / Industry: ${input}
Provide for each: Content Angle, Suggested Format (Reel/Carousel/Post), and Why It Works.`;

    case 'short-video-script-generator':
      return `Task: Write a 30-to-60 second Short/Reels/TikTok video script.
Topic: ${input}
Format:
- [0-3s Hook]: Visual and spoken pattern-interrupt hook
- [4-25s Value]: Fast-paced core insight or demonstration
- [26-30s CTA]: Specific follow/share action prompt.`;

    case 'product-promotion-post-writer':
      return `Task: Write a promotional social media post that drives clicks and sales.
Product & Benefits: ${input}
Structure: Hook addressing customer pain point, the solution, social proof angle, and clear limited-time/exclusive CTA.`;

    case 'content-calendar-generator':
      return `Task: Build a 7-day social media content calendar for:
Brand / Niche: ${input}
Provide for Day 1 to Day 7: Theme (Educational, Behind-the-scenes, Community, Promotional, etc.), Post Hook, and Best Platform.`;

    case 'blog-title-generator':
      return `Task: Generate 10 high-CTR blog post titles for:
Topic / Keyword: ${input}
Include: How-To, Listicle, Case Study, Contrarian, and Direct Benefit titles.`;

    case 'keyword-content-idea-generator':
      return `Task: Brainstorm 10 keyword themes and content ideas for:
Seed Topic: ${input}
Group by: Top-of-Funnel (Informational), Middle-of-Funnel (Comparison/Evaluation), and Bottom-of-Funnel (Decision).`;

    case 'cta-generator':
      return `Task: Generate 10 compelling Call-to-Action (CTA) phrases for buttons and landing pages.
Offer / Objective: ${input}
Provide options for: High Urgency, Low Friction / Free Trial, Value-Focused, and Curiosity-Driven.`;

    default:
      return `Task: Generate high-quality text for tool "${toolSlug}".
Input: ${input}
${secondaryInput ? `Additional Context: ${secondaryInput}` : ''}
Options: ${optionsSummary}`;
  }
}

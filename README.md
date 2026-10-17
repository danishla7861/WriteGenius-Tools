# WriteGenius Tools – All-in-One AI Writing & Text Productivity Toolkit

WriteGenius Tools is a production-grade, full-stack web application delivering **56 free text utilities and AI-assisted writing tools** for students, copywriters, researchers, and professionals worldwide.

---

## Table of Contents
1. [Core Features & Architecture](#core-features--architecture)
2. [56 Tools Directory Overview](#56-tools-directory-overview)
3. [Local Development Setup](#local-development-setup)
4. [AI Provider Configuration Guide](#ai-provider-configuration-guide)
5. [Testing Guide](#testing-guide)
6. [Production Deployment Guide](#production-deployment-guide)
7. [SEO Launch Checklist](#seo-launch-checklist)
8. [Security & Privacy Checklist](#security--privacy-checklist)
9. [Feature Completion Status](#feature-completion-status)

---

## Core Features & Architecture

- **Full-Stack Architecture**: React 19 + TypeScript SPA on Vite, powered by an Express backend proxy mounted with Vite dev middleware (`server.ts`).
- **Real-Time Client Utilities (100% Free)**: Word Counter, Character Counter, Paragraph Counter, Text Case Converter (9 formats), Duplicate Line Remover, Readability Score (Flesch Reading Ease, Grade Level, ARI), Heuristic Grammar/Spell Checker, Sentence Simplifier, Voice Converter, and Extractive Summarizer. These run entirely in the user's browser with zero server transmission.
- **Provider-Independent AI Service Layer**: Secure server-side execution via `@google/genai` utilizing the flagship text model `gemini-3.8-flash`. Prompts enforce strict fact preservation and prevent hallucinated qualifications or fake DOI citations.
- **Light & Dark Mode**: Seamless theme switching with system detection and `localStorage` persistence. Zero theme flashing on initial load.
- **Top Bar Contract & Anti-Slop Design**: Built according to human-crafted SaaS guidelines—no pill-badge clutter, no code-comment titles, no decorative pulse dots, and clean tabular numerals (`tabular-nums`).
- **Comprehensive SEO Architecture**: Dedicated indexable routes for all 56 tools with dynamic metadata (`<title>`, `<meta name="description">`), OpenGraph tags, Schema.org `WebApplication` JSON-LD structured data, dynamic XML sitemap (`/sitemap.xml`), and `robots.txt`.

---

## 56 Tools Directory Overview

### Category A: AI Writing Tools (12 Tools)
1. `/ai-paragraph-writer` – AI Paragraph Writer
2. `/ai-essay-writer` – AI Essay Writer
3. `/ai-article-writer` – AI Article Writer
4. `/ai-blog-post-writer` – AI Blog Post Writer
5. `/paragraph-rewriter` – Paragraph Rewriter
6. `/sentence-rewriter` – Sentence Rewriter
7. `/ai-text-improver` – AI Text Improver
8. `/ai-introduction-generator` – AI Introduction Generator
9. `/ai-conclusion-generator` – AI Conclusion Generator
10. `/text-expander` – Text Expander
11. `/text-shortener` – Text Shortener
12. `/tone-changer` – Tone Changer

### Category B: Grammar and Text Utilities (12 Tools)
13. `/free-grammar-checker` – Grammar Checker
14. `/spell-checker` – Spell Checker
15. `/text-summarizer` – Text Summarizer
16. `/readability-checker` – Readability Checker
17. `/sentence-simplifier` – Sentence Simplifier
18. `/active-to-passive-converter` – Active-to-Passive Voice Converter
19. `/passive-to-active-converter` – Passive-to-Active Voice Converter
20. `/text-case-converter` – Text Case Converter
21. `/word-counter` – Word Counter
22. `/character-counter` – Character Counter
23. `/paragraph-counter` – Paragraph Counter
24. `/duplicate-line-remover` – Duplicate Line Remover

### Category C: Email and Professional Writing (9 Tools)
25. `/ai-email-writer` – AI Email Writer
26. `/professional-email-reply-generator` – Professional Email Reply Generator
27. `/follow-up-email-generator` – Follow-up Email Generator
28. `/cover-letter-writer` – Cover Letter Writer
29. `/job-application-letter-generator` – Job Application Letter Generator
30. `/resume-bullet-point-writer` – Resume Bullet Point Writer
31. `/professional-bio-generator` – Professional Bio Generator
32. `/meeting-summary-formatter` – Meeting Summary Formatter
33. `/business-proposal-outline-generator` – Business Proposal Outline Generator

### Category D: SEO and Blogging (10 Tools)
34. `/seo-title-generator` – SEO Title Generator
35. `/meta-description-generator` – Meta Description Generator
36. `/blog-outline-generator` – Blog Outline Generator
37. `/blog-introduction-generator` – Blog Introduction Generator
38. `/faq-generator` – FAQ Generator
39. `/product-description-writer` – Product Description Writer
40. `/article-headline-generator` – Article Headline Generator
41. `/blog-conclusion-generator` – Blog Conclusion Generator
42. `/content-brief-generator` – Content Brief Generator
43. `/search-intent-brainstorming-tool` – Search Intent Brainstorming Tool

### Category E: Social and Creative Writing (13 Tools)
44. `/youtube-description-writer` – YouTube Description Writer
45. `/youtube-title-generator` – YouTube Title Generator
46. `/social-media-caption-generator` – Social Media Caption Generator
47. `/hashtag-suggestion-generator` – Hashtag Suggestion Generator
48. `/instagram-bio-generator` – Instagram Bio Generator
49. `/facebook-post-writer` – Facebook Post Writer
50. `/linkedin-post-writer` – LinkedIn Post Writer
51. `/short-story-writer` – Short Story Writer
52. `/creative-writing-assistant` – Creative Writing Assistant
53. `/speech-writer` – Speech Writer
54. `/slogan-generator` – Slogan Generator
55. `/thank-you-message-writer` – Thank-You Message Writer
56. `/birthday-message-writer` – Birthday Message Writer

---

## Local Development Setup

### Prerequisites
- Node.js 18+ (Node 20+ recommended)
- npm or yarn or pnpm

### Step-by-Step Installation
```bash
# 1. Clone repository & install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Open .env and insert your GEMINI_API_KEY if testing AI generation

# 3. Start development server (serves frontend + backend on port 3000)
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## AI Provider Configuration Guide

WriteGenius Tools utilizes the `@google/genai` TypeScript SDK on the server with model `gemini-3.8-flash`.

1. **Obtaining an API Key**:
   - Visit [Google AI Studio](https://aistudio.google.com/) and create a free or paid API key.
2. **Injecting the Secret**:
   - In Google AI Studio Build: Open **Settings > Secrets** and ensure `GEMINI_API_KEY` is attached.
   - In local development: Add `GEMINI_API_KEY="your_api_key_here"` into your local `.env` file.
   - In cloud hosting (Cloud Run, Render, Railway, AWS): Set `GEMINI_API_KEY` as a secure environment variable in your dashboard.
3. **Graceful Fallback**:
   - If `GEMINI_API_KEY` is not present, all client-side tools (Word Counter, Readability, Case Converter, Duplicate Remover, etc.) continue to work 100% normally. AI endpoints will return a clean 503 HTTP status with instructions explaining how to configure the key, without throwing unhandled exceptions.

---

## Testing Guide

WriteGenius Tools includes a comprehensive automated test suite powered by Vitest:

```bash
# Run unit and integration tests
npm test

# Run type-checking
npm run lint
```

### Covered Test Areas:
- **Math & Formulas**: Syllable counters, Flesch Reading Ease, Flesch-Kincaid Grade Level, and Automated Readability Index.
- **Text Transformations**: 9 text case converters, duplicate line removals (case-sensitivity, trimming, sorting).
- **Linguistic Heuristics**: Typo detection, double-word flags, passive/active voice shifts, plain English simplification.
- **Catalog Integrity**: Verification of all 56 tool slugs, unique URLs, category bindings, examples, and prompt builds.
- **Edge Cases**: Empty inputs, whitespace normalization, unicode and multilingual characters.

---

## Production Deployment Guide

### Building the Bundle
```bash
npm run build
```
This generates the optimized static assets in `/dist`.

### Running in Production
```bash
# Set production environment and launch server
NODE_ENV=production npm start
```

### Deployment Options:
- **Cloud Run / Docker**: The repository is already configured to run `server.ts` on port 3000. Build the container and expose port 3000.
- **Render / Railway**: Set Build Command to `npm run build` and Start Command to `npm run start`.
- **Vercel / Netlify**: Deploy the `/dist` directory for static hosting, and configure serverless functions pointing to `/api/v1/*`.

---

## SEO Launch Checklist

- [x] Dedicated crawlable URL route for every tool (e.g. `/ai-essay-writer`, `/word-counter`).
- [x] Unique `<title>` and `<meta name="description">` customized per tool.
- [x] Canonical URL resolution using current origin.
- [x] OpenGraph (`og:title`, `og:description`, `og:url`, `og:type`) tags on every route.
- [x] Valid Schema.org `WebApplication` structured data JSON-LD.
- [x] Valid XML Sitemap (`/sitemap.xml`) indexing all 56 tools and informational pages.
- [x] Valid `robots.txt` pointing to sitemap.
- [x] Custom, user-friendly 404 error page.

---

## Security & Privacy Checklist

- [x] Zero server-side persistence of private user draft text.
- [x] No client-side exposure of API keys (server-side proxy only).
- [x] Strict input validation and size limits (15,000 character maximum).
- [x] IP-based sliding-window rate limiting on AI endpoints (60 req / 10 min).
- [x] Strict security headers (`X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy`).
- [x] No sensitive data stored in browser `localStorage` (theme preference only).
- [x] Fact-preservation rules in AI prompts preventing hallucinated qualifications or false citations.

---

## Feature Completion Status

| Feature / Category | Status | Notes |
| :--- | :--- | :--- |
| **All 56 Tools & Routes** | **Complete** | Every tool has a dedicated route, form, options, and actions. |
| **Free Client Utilities** | **Complete** | Real mathematical & heuristic calculations with zero server calls. |
| **Server-Side AI Adapter** | **Complete** | Connected via `@google/genai` with `gemini-3.8-flash`. |
| **Light & Dark Mode** | **Complete** | Instant toggle, system detection, and `localStorage` persistence. |
| **SEO & Sitemap** | **Complete** | Dynamic meta tags, OpenGraph, JSON-LD, `/sitemap.xml`, and `/robots.txt`. |
| **Automated Tests** | **Complete** | 30 tests in Vitest passing with 100% clean status. |
| **Third-Party Advertising** | **Prepared** | Non-intrusive placeholder slots in place ready for publisher keys. |

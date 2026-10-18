import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowRight, CheckCircle2, Home, ChevronRight, BookOpen } from 'lucide-react';
import { updateDocumentSeo } from '../utils/seoUtils';

export const AcademicWritingGuidePage: React.FC = () => {
  useEffect(() => {
    updateDocumentSeo({
      title: 'College Essay Architecture, Thesis Formulation & GPA Strategies',
      description: 'A practical student guide on crafting strong thesis statements, drafting body paragraphs with topic sentences, and calculating cumulative GPA.',
      canonicalPath: '/guides/academic-writing-and-gpa-guide',
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'Guides', url: '/guides' },
        { name: 'Academic Writing & GPA Guide', url: '/guides/academic-writing-and-gpa-guide' },
      ],
      schema: {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'College Essay Architecture, Thesis Formulation & GPA Strategies',
        description: 'Comprehensive guide to thesis construction, argumentative essays, and semester grade point calculation.',
        author: {
          '@type': 'Organization',
          name: 'WriteGenius Tools Editorial Team',
        },
      },
    });
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="space-y-10 max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <section className="p-8 sm:p-10 rounded-3xl bg-[#0D1424] border border-[#263653] shadow-2xl space-y-4">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#AAB8D0]">
          <Link to="/" className="flex items-center gap-1 hover:text-[#F8FAFF] transition-colors">
            <Home className="w-3.5 h-3.5 text-[#4776FF]" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#263653]" />
          <Link to="/guides" className="hover:text-[#F8FAFF] transition-colors">
            Guides
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#263653]" />
          <span className="text-[#F8FAFF] font-medium" aria-current="page">
            Academic Writing & GPA Guide
          </span>
        </nav>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111A2E] border border-[#263653] text-xs font-semibold text-[#4776FF]">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Student Academic Excellence</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F8FAFF] tracking-tight">
            College Essay Architecture, Thesis Formulation & GPA Strategies
          </h1>
          <p className="text-sm sm:text-base text-[#AAB8D0] leading-relaxed">
            Master the structural anatomy of argumentative papers, overcome writing paralysis with AI drafting aids, and track your graduation honors with weighted GPA calculations.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="space-y-8 text-sm text-[#AAB8D0] leading-relaxed">
        
        {/* Section 1: Thesis Construction */}
        <section className="p-6 sm:p-8 rounded-2xl bg-[#0D1424] border border-[#263653] shadow-xl space-y-4">
          <h2 className="text-xl font-bold text-[#F8FAFF]">
            1. Constructing a Debatable Thesis Statement
          </h2>
          <p>
            The foundation of every high-scoring university essay is a specific, debatable thesis statement. A weak thesis simply states an uncontested fact (e.g., &quot;Social media has changed human communication&quot;). A strong thesis makes an analytical claim with a clear rationale (e.g., &quot;While social media provides instant global connectivity, its algorithmic feed incentives polarize civic discourse by rewarding emotional outrage over nuanced empirical debate&quot;).
          </p>
          <p>
            When drafting, test your thesis with the &quot;So What?&quot; question. If a reader cannot reasonably take an opposing stance, your claim needs deeper critical specificity.
          </p>
        </section>

        {/* Section 2: Body Paragraph Anatomy (MEAL Plan) */}
        <section className="p-6 sm:p-8 rounded-2xl bg-[#0D1424] border border-[#263653] shadow-xl space-y-4">
          <h2 className="text-xl font-bold text-[#F8FAFF]">
            2. The MEAL Framework for Academic Paragraphs
          </h2>
          <p>
            Top composition departments recommend the <strong>MEAL</strong> framework to guarantee that every paragraph contributes directly to your overarching thesis:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            <div className="p-4 rounded-xl bg-[#090F1D] border border-[#263653] space-y-1">
              <span className="font-bold text-[#4776FF] text-xs">M — Main Idea</span>
              <p className="text-xs">A clear topic sentence that states the claim of the paragraph.</p>
            </div>
            <div className="p-4 rounded-xl bg-[#090F1D] border border-[#263653] space-y-1">
              <span className="font-bold text-emerald-400 text-xs">E — Evidence</span>
              <p className="text-xs">Data, scholarly citations, textual quotes, or concrete examples.</p>
            </div>
            <div className="p-4 rounded-xl bg-[#090F1D] border border-[#263653] space-y-1">
              <span className="font-bold text-[#8957FF] text-xs">A — Analysis</span>
              <p className="text-xs">Your explanation of how the evidence proves your main claim.</p>
            </div>
            <div className="p-4 rounded-xl bg-[#090F1D] border border-[#263653] space-y-1">
              <span className="font-bold text-amber-400 text-xs">L — Link / Transition</span>
              <p className="text-xs">Connecting the insight back to the thesis and preparing the next topic.</p>
            </div>
          </div>
        </section>

        {/* Section 3: Understanding Weighted GPA */}
        <section className="p-6 sm:p-8 rounded-2xl bg-[#0D1424] border border-[#263653] shadow-xl space-y-4">
          <h2 className="text-xl font-bold text-[#F8FAFF]">
            3. Calculating Grade Point Averages Accurately
          </h2>
          <p>
            Many students mistake simple arithmetic average grades for their actual Grade Point Average (GPA). In collegiate systems, GPA is credit-hour weighted:
          </p>
          <div className="p-4 rounded-xl bg-[#090F1D] border border-[#263653] font-mono text-xs text-[#F8FAFF]">
            GPA = (Sum of [Course Grade Points × Credit Hours]) / (Total Credit Hours)
          </div>
          <p>
            This means earning an &quot;A&quot; in a 4-credit science laboratory carries twice the statistical weight of an &quot;A&quot; in a 2-credit seminar.
          </p>
        </section>

        {/* Section 4: Relevant Student Tools */}
        <section className="p-6 sm:p-8 rounded-2xl bg-[#0D1424] border border-[#263653] shadow-xl space-y-4">
          <h2 className="text-xl font-bold text-[#F8FAFF]">
            4. Useful WriteGenius Student Tools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <Link
              to="/tools/ai-essay-writer"
              className="p-4 rounded-xl bg-[#090F1D] border border-[#263653] hover:border-[#4776FF] transition-all group"
            >
              <h3 className="text-xs font-bold text-[#F8FAFF] group-hover:text-[#4776FF]">AI Essay Writer</h3>
              <p className="text-[11px] text-[#AAB8D0] mt-1">Generate thesis-driven essay outlines and arguments.</p>
            </Link>
            <Link
              to="/tools/gpa-calculator"
              className="p-4 rounded-xl bg-[#090F1D] border border-[#263653] hover:border-[#4776FF] transition-all group"
            >
              <h3 className="text-xs font-bold text-[#F8FAFF] group-hover:text-[#4776FF]">GPA Calculator</h3>
              <p className="text-[11px] text-[#AAB8D0] mt-1">Compute semester and cumulative 4.0 scale GPA.</p>
            </Link>
            <Link
              to="/tools/word-counter"
              className="p-4 rounded-xl bg-[#090F1D] border border-[#263653] hover:border-[#4776FF] transition-all group"
            >
              <h3 className="text-xs font-bold text-[#F8FAFF] group-hover:text-[#4776FF]">Word Counter</h3>
              <p className="text-[11px] text-[#AAB8D0] mt-1">Track word limits, character counts, and readability.</p>
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
};

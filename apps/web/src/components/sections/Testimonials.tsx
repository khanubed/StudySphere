import React from 'react';

interface Testimonial {
  initials: string;
  quote: string;
  author: string;
  role: string;
}

const testimonials: Testimonial[] = [
  {
    initials: 'AD',
    quote: "I used to swap between Notion, Quizlet, and Google Drive just to keep track of my database systems class. StudySphere does all of it on one sheet. The AI summarizer saved me during midterms.",
    author: 'ARUN DEV',
    role: 'STUDENT, B.TECH CSE'
  },
  {
    initials: 'SK',
    quote: "Distributing lecture handouts and generating class practice quizzes used to consume my weekends. Now I upload the PDF, verify the AI-compiled questions, and push it to all 120 students in minutes.",
    author: 'PROF. S. KRISHNAN',
    role: 'DEPT. OF COMPUTER SCIENCE'
  },
  {
    initials: 'MR',
    quote: "When students reach out to me here, I can see their actual coursework profile, verified projects, and GPA index. It makes routing them to internal referrals at Stripe much easier.",
    author: 'MEERA RAO',
    role: 'ALUMNI, STAFF ENGINEER AT STRIPE'
  }
];

export const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="py-24 px-6 bg-paper border-t border-border/60 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="mb-16 text-left max-w-2xl">
          <span className="font-mono text-xs font-semibold text-quad tracking-widest uppercase mb-4 block">
            09 — USER VERDICT
          </span>
          <h2 className="font-display text-ink font-bold text-[36px] sm:text-[44px] leading-[1.1] tracking-tight mb-4">
            Audited testimonies.
          </h2>
          <p className="font-body text-[16px] md:text-[17px] text-graphite leading-relaxed">
            Read comments from verified students, faculty members, and graduates who have integrated the StudySphere ecosystem.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div 
              key={t.author}
              className="border border-border/80 bg-paper rounded-[6px] p-6 flex flex-col justify-between text-left hover:border-quad/60 transition-colors duration-150"
            >
              <div>
                {/* Plain Initials-based avatar in a Quad-tinted circle */}
                <div className="w-10 h-10 rounded-full bg-quad text-paper flex items-center justify-center font-mono font-bold text-xs mb-6 select-none">
                  {t.initials}
                </div>

                {/* Quote in Inter */}
                <p className="font-sans text-[15px] md:text-[16px] text-ink leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>

              {/* Author name + role in mono caption underneath */}
              <div className="mt-8 pt-4 border-t border-border/40 font-mono text-[11px] leading-none">
                <span className="font-bold text-ink block mb-1">{t.author}</span>
                <span className="text-graphite">{t.role}</span>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

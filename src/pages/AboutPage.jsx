import React from 'react';

const PROFILE_IMG = '/youcef-brahim.jpg';  

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-slate-50 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
         <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            About this application
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Overview of what this web application does, how it was built, and who created it.
          </p>
        </div>

        {/* Fancy gradient card */}
        <div className="relative rounded-[1.9rem] bg-gradient-to-br from-cyan-500/40 via-indigo-500/30 to-emerald-400/30 p-[1px] shadow-[0_24px_80px_rgba(15,23,42,0.95)]">
          <div className="relative overflow-hidden rounded-[1.75rem] bg-slate-950/95">
            {/* background decorations */}
            <div className="pointer-events-none absolute inset-0 opacity-60 mix-blend-soft-light">
              <div className="absolute -left-16 -top-10 h-44 w-44 rounded-full bg-cyan-500/35 blur-3xl" />
              <div className="absolute right-[-4rem] top-10 h-52 w-52 rounded-full bg-indigo-500/30 blur-3xl" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_0,rgba(148,163,184,0.35),transparent_55%),radial-gradient(circle_at_90%_120%,rgba(56,189,248,0.35),transparent_55%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(15,23,42,0.75)_1px,transparent_1px),linear-gradient(210deg,rgba(15,23,42,0.9)_1px,transparent_1px)] bg-[length:140px_140px]" />
            </div>

            <div className="relative px-6 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-9 space-y-8">
               <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                 <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-500 to-indigo-500 text-lg font-semibold text-slate-950 shadow-lg shadow-cyan-500/40">
                    FMI
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold sm:text-2xl">
                      PROGRES FMI Tiaret – Web Client
                    </h2>
                    <p className="text-xs font-medium text-slate-400">
                      Unofficial web portal for the PROGRES system
                    </p>
                  </div>
                </div>

                 <div className="flex items-center gap-3 rounded-2xl border border-slate-800/80 bg-slate-900/70 px-3 py-2.5 sm:px-4">
                  <div className="relative h-11 w-11 overflow-hidden rounded-full border border-slate-700 bg-slate-800">
                     <img
                      src={PROFILE_IMG}
                      alt="Youcef Brahim"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                         e.currentTarget.style.display = 'none';
                      }}
                    />
                    {/* fallback initials */}
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-slate-200">
                      
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Youcef Brahim</p>
                    <p className="text-[11px] text-slate-400">
                      Frontend web developer (FMI student)
                    </p>
                  </div>
                </div>
              </div>

              {/* Middle: description & tech stack */}
              <div className="grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
                {/* Description + features */}
                <div className="space-y-4">
                  <p className="text-sm leading-relaxed text-slate-200">
                    This web application allows FMI Tiaret students to access their academic
                    information from the official PROGRES system through a fast, clean, and
                    modern interface directly in the browser.
                  </p>
                  <p className="text-sm leading-relaxed text-slate-300">
                    It focuses on the user experience: organizing grades, student cards,
                    groups, and subjects in a clear layout, optimized for both desktop and
                    mobile, without requiring any installation or complex setup.
                  </p>
                  <p className="text-sm leading-relaxed text-slate-300">
                    All data is fetched from an existing PROGRES API originally created as
                    part of an open-source hackathon project on GitHub. This project
                    concentrates entirely on the frontend layer and enhances how students
                    interact with that data.
                  </p>

                  {/* Key features */}
                  <div className="mt-4 space-y-2">
                    <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                      Key features
                    </h3>
                    <ul className="space-y-1.5 text-sm text-slate-200">
                      <li className="flex items-start gap-2">
                        <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        <span>Clean dashboard for grades, student cards, and groups.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-cyan-400" />
                        <span>Fast data fetching with cached requests using React Query.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-indigo-400" />
                        <span>Responsive design tailored for both laptops and phones.</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Tech + API + links */}
                <div className="space-y-5 rounded-2xl border border-slate-800/80 bg-slate-900/70 p-4 sm:p-5">
                  <div className="space-y-3">
                    <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                      Tech stack
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <TechPill>React + Vite</TechPill>
                      <TechPill>TypeScript (optional)</TechPill>
                      <TechPill>Tailwind CSS</TechPill>
                      <TechPill>@tanstack/react-query</TechPill>
                      <TechPill>REST API</TechPill>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                      API &amp; data source
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-200">
                      The app consumes an existing PROGRES API from an open-source hackathon
                      project hosted on GitHub, reusing its backend integration while
                      providing a new web interface on top.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                      Links
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <a
                        href="https://github.com/joseph-cef"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-medium text-slate-200 hover:border-slate-500 hover:bg-slate-800"
                      >
                        GitHub
                      </a>
                      <a
                        href="https://my-links-joseph.netlify.app/"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-medium text-slate-200 hover:border-slate-500 hover:bg-slate-800"
                      >
                        Personal links
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <p className="border-t border-slate-900/80 pt-4 text-[11px] text-slate-500">
                This is an unofficial web client and is not affiliated with the Ministry of
                Higher Education or the official PROGRES team.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TechPill({ children }) {
  return (
    <span className="inline-flex items-center rounded-full bg-slate-800/85 px-3 py-1 text-[11px] font-medium text-slate-100">
      {children}
    </span>
  );
}

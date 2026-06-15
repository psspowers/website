# Bolt Task: Mission Section + About Page Rewrite
## Two tasks. Exact find/replace. No decisions required.

---

# TASK 1 — Update Mission section on Landing Page
## File: `src/pages/index.astro`

### Change 1 of 2 — Replace the two body paragraphs

FIND this exact text (around line 263):
```
            Founded in Bangkok in 2012, <BrandName /> bridges the gap between ambitious
            renewable energy targets and the rigorous financial standards demanded by
            institutional investors. We combine deep local market knowledge with
            international project finance expertise.
          </p>
          <p class="text-slate-400 text-lg leading-relaxed mb-8">
            Our team of 50+ engineers, financiers, and project managers operates across
            Thailand, India, Singapore, Vietnam, the Philippines, and Japan — delivering
            technically excellent, commercially bankable projects at every scale.
```

REPLACE WITH:
```
            Renewable energy — solar, wind, BESS, and hybrid — should cost less
            than the grid, emit less than coal, and be as predictable as a fixed-rate
            contract. That is the standard <BrandName /> holds every project to —
            and delivers through long-term Power Purchase Agreements structured at
            zero upfront cost to the customer.
          </p>
          <p class="text-slate-400 text-lg leading-relaxed mb-8">
            Our 85+ team of engineers, financiers, and project developers operates across
            Thailand, India, Singapore, Vietnam, the Philippines, and Japan. With a
            combined track record spanning over a decade and institutional backing from
            I Squared Capital, we take every project from signature to commissioning —
            and stay accountable for the lifetime of every asset.
```

### Change 2 of 2 — Update the link text

FIND:
```
            Learn about our team
```

REPLACE WITH:
```
            Our story →
```

---

# TASK 2 — Rewrite the About Page
## File: `src/pages/about.astro`

Keep ALL of the following UNCHANGED:
- The entire `---` frontmatter block (all Supabase imports and data fetching)
- The `<Layout>` opening tag and its attributes
- The Stats section (AnimatedStats component)
- The Leadership section (team cards with photos)
- The Milestones / Timeline section
- The `</main>` and `</Layout>` closing tags

Only replace the CONTENT sections listed below.

---

### Change 1 — Update page meta (inside the Layout tag)

FIND:
```
  title="About Pss.Orange - Leading Renewable Energy Provider"
  description="Learn about Pss.Orange's journey in renewable energy, our expert team, and partnership with I Squared Capital. Discover how we're shaping a sustainable future."
```

REPLACE WITH:
```
  title="About Pss.Orange — Two Teams, One Asian Platform"
  description="Pss.Orange was formed from the merger of two specialist renewable energy firms — PSS in Thailand and Orange Circle in India. Backed by I Squared Capital, we develop, build, and operate solar, wind, BESS, and hybrid projects at institutional grade across Asia."
```

---

### Change 2 — Replace the Hero section

FIND:
```
    <!-- Hero -->
    <section class="dark-gradient-header relative">
      <FinancialPartnerBadge stats={partnerStats} logoUrl={partnerLogoUrl} class="hidden lg:block absolute top-8 right-12 z-50" />
      <div class="max-w-screen-2xl mx-auto px-6 lg:px-8">
        <div class="max-w-3xl text-white" data-aos="fade-up">
          <p class="text-emerald-400 text-sm font-semibold tracking-widest uppercase mb-4">Who We Are</p>
          <h1 class="font-display text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Our Journey in Renewable Energy
          </h1>
          <p class="text-xl text-slate-300 leading-relaxed">
            Since 2012, <BrandName /> has been at the forefront of the renewable energy revolution,
            delivering innovative solutions and driving sustainable change across Asia.
          </p>
          <FinancialPartnerBadge logoUrl={partnerLogoUrl} compact={true} class="mt-8 lg:hidden" />
        </div>
      </div>
    </section>
```

REPLACE WITH:
```
    <!-- Hero -->
    <section class="dark-gradient-header relative">
      <FinancialPartnerBadge stats={partnerStats} logoUrl={partnerLogoUrl} class="hidden lg:block absolute top-8 right-12 z-50" />
      <div class="max-w-screen-2xl mx-auto px-6 lg:px-8">
        <div class="max-w-3xl text-white" data-aos="fade-up">
          <p class="text-emerald-400 text-sm font-semibold tracking-widest uppercase mb-4">Who We Are</p>
          <h1 class="font-display text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Two proven teams.<br />One Asian platform.
          </h1>
          <p class="text-xl text-slate-300 leading-relaxed mb-4">
            <BrandName /> was built from the merger of two specialist firms — one that
            spent a decade mastering India's solar market, one that built Thailand's from
            the ground up. Together, backed by I Squared Capital, we are the platform
            that knows how to make clean energy bankable across Asia.
          </p>
          <p class="text-lg text-slate-400 leading-relaxed">
            Renewable energy — solar, wind, BESS, and hybrid — cheaper, cleaner, and more predictable than the alternatives.
          </p>
          <FinancialPartnerBadge logoUrl={partnerLogoUrl} compact={true} class="mt-8 lg:hidden" />
        </div>
      </div>
    </section>
```

---

### Change 3 — Replace the History / Background section

FIND:
```
    <!-- History -->
    <section class="py-20">
      <div class="max-w-screen-2xl mx-auto px-6 lg:px-8">
        <div class="text-center mb-12" data-aos="fade-up">
          <p class="text-emerald-400 text-sm font-semibold tracking-widest uppercase mb-3">Background</p>
          <h2 class="font-display text-3xl md:text-4xl font-bold text-white tracking-tight">From Yesterday to Today</h2>
        </div>
        <div class="max-w-4xl mx-auto">
          <div class="glass rounded-2xl p-8 md:p-10" data-aos="fade-up" data-aos-delay="100">
            <p class="text-slate-400 mb-8 leading-relaxed">
              <BrandName />, an independent energy producer, was founded in 2012 through the collaboration of two industry leaders with complementary expertise.
            </p>
            <div class="space-y-6">
              <div class="border-l-2 border-emerald-500 pl-6">
                <p class="text-slate-300 leading-relaxed">
                  Sam Yamdagni entered the renewable energy sector in 2015, developing over 100 MW of projects with an in-house EPC and O&M team. He previously served as Country Head of the ib Vogt JV in Thailand and as MD APAC for Amarenco JV. He is a graduate of IIT Kharagpur.
                </p>
              </div>
              <div class="border-l-2 border-emerald-500 pl-6">
                <p class="text-slate-300 leading-relaxed">
                  Nikesh Sinha has been in the renewable energy industry since 2011, developing over 350 MW of projects. He previously led investment for ib Vogt in APAC under the NV Vogt JV. He holds degrees from IIT Chennai and IIM Ahmedabad.
                </p>
              </div>
            </div>
            <p class="text-slate-400 mt-8 leading-relaxed">
              With their combined expertise, <BrandName /> has established itself as a trusted partner for renewable energy investments in the region, driving sustainable growth and innovation with a strong pipeline.
            </p>
          </div>
        </div>
      </div>
    </section>
```

REPLACE WITH:
```
    <!-- Origin Story -->
    <section class="py-20">
      <div class="max-w-screen-2xl mx-auto px-6 lg:px-8">
        <div class="text-center mb-16" data-aos="fade-up">
          <p class="text-emerald-400 text-sm font-semibold tracking-widest uppercase mb-3">The Origin</p>
          <h2 class="font-display text-3xl md:text-4xl font-bold text-white tracking-tight">The name says everything</h2>
        </div>
        <div class="max-w-4xl mx-auto space-y-6">
          <div class="grid md:grid-cols-2 gap-6">
            <div class="glass rounded-2xl p-8" data-aos="fade-up" data-aos-delay="100">
              <div class="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6">
                <svg class="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                </svg>
              </div>
              <p class="text-emerald-400 text-xs font-semibold tracking-widest uppercase mb-3">Orange Circle — India</p>
              <p class="text-white font-display text-xl font-bold mb-3">Built India's solar market from 2012</p>
              <p class="text-slate-400 leading-relaxed text-sm">
                Founded in 2012, Orange Circle spent a decade developing and operating solar
                projects across India — mastering one of Asia's most complex regulatory
                environments and building a track record of over 350 MW developed.
              </p>
            </div>
            <div class="glass rounded-2xl p-8" data-aos="fade-up" data-aos-delay="200">
              <div class="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6">
                <svg class="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <p class="text-emerald-400 text-xs font-semibold tracking-widest uppercase mb-3">PSS — Thailand</p>
              <p class="text-white font-display text-xl font-bold mb-3">Built Thailand's solar market from 2016</p>
              <p class="text-slate-400 leading-relaxed text-sm">
                Founded in 2016, Power Systems and Solutions developed Thailand's first large-scale
                captive solar projects — pioneering the floating solar and C&I segments with
                an in-house EPC and O&M capability that competitors couldn't match.
              </p>
            </div>
          </div>
          <div class="glass rounded-2xl p-8" data-aos="fade-up" data-aos-delay="300">
            <p class="text-white font-display text-xl font-bold mb-4">When the two teams merged, <BrandName /> was born.</p>
            <p class="text-slate-400 leading-relaxed mb-4">
              Not as a startup — but as a proven platform with a combined track record spanning
              over a decade across two of Asia's fastest-growing energy markets. The name encodes
              the story: <span class="text-white font-semibold">PSS</span> + <span class="text-orange-400 font-semibold">Orange</span> = <BrandName />.
            </p>
            <p class="text-slate-400 leading-relaxed">
              Today, backed by I Squared Capital through the Berde PSS Renewable Investment joint
              venture, we have the institutional depth to develop, finance, build, and operate
              projects at scale — from a single rooftop in Bangkok to a 55 MW captive plant in Punjab.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Differentiator -->
    <section class="py-20 bg-slate-900">
      <div class="max-w-screen-2xl mx-auto px-6 lg:px-8">
        <div class="max-w-4xl mx-auto">
          <div class="text-center mb-16" data-aos="fade-up">
            <p class="text-emerald-400 text-sm font-semibold tracking-widest uppercase mb-3">What Makes Us Different</p>
            <h2 class="font-display text-3xl md:text-4xl font-bold text-white tracking-tight">
              Most developers build and sell.<br class="hidden md:block" /> We build and stay.
            </h2>
          </div>
          <div class="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',
                label: 'Institutionally Bankable',
                desc: 'Every project is structured to meet the due diligence standards of major financial institutions — because our own investor, I Squared Capital, demands nothing less.'
              },
              {
                icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z',
                label: 'Genuinely Local',
                desc: 'We do not manage Asia from Singapore. Our engineers, developers, and O&M teams live and work in the markets they serve — Thailand and India first, now expanding across the region.'
              },
              {
                icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
                label: 'Full Asset Lifecycle',
                desc: 'From the first feasibility study through to O&M two decades later — and repowering when the time comes — we remain accountable for every megawatt we touch.'
              },
            ].map((item, i) => (
              <div class="glass rounded-2xl p-8" data-aos="fade-up" data-aos-delay={i * 100}>
                <div class="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6">
                  <svg class="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d={item.icon} />
                  </svg>
                </div>
                <h3 class="text-white font-semibold text-lg mb-3">{item.label}</h3>
                <p class="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
```

---

### Change 4 — Replace the Mission section (currently called "Purpose")

FIND:
```
    <!-- Mission -->
    <section class="py-20 solar-gradient">
      <div class="max-w-screen-2xl mx-auto px-6 lg:px-8">
        <div class="max-w-3xl mx-auto text-center">
          <p class="text-emerald-400 text-sm font-semibold tracking-widest uppercase mb-4" data-aos="fade-up">Purpose</p>
          <h2 class="font-display text-3xl md:text-4xl font-bold text-white tracking-tight mb-6" data-aos="fade-up">Our Mission</h2>
          <p class="text-xl text-slate-300 leading-relaxed" data-aos="fade-up" data-aos-delay="100">
            To accelerate the transition to sustainable energy by providing innovative renewable solutions
            that empower businesses and communities to achieve their environmental goals while ensuring economic benefits.
          </p>
        </div>
      </div>
    </section>
```

REPLACE WITH:
```
    <!-- Mission -->
    <section class="py-20 solar-gradient">
      <div class="max-w-screen-2xl mx-auto px-6 lg:px-8">
        <div class="max-w-4xl mx-auto">
          <div class="text-center mb-16" data-aos="fade-up">
            <p class="text-emerald-400 text-sm font-semibold tracking-widest uppercase mb-4">Our Mission</p>
            <h2 class="font-display text-3xl md:text-4xl font-bold text-white tracking-tight mb-6">
              Making clean energy bankable across Asia
            </h2>
            <p class="text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Renewable energy — solar, wind, BESS, and hybrid — should cost less than
              the grid, emit less than coal, and be as reliable as a fixed-rate contract.
              That is the standard we hold every project to.
            </p>
          </div>
          <div class="grid md:grid-cols-3 gap-6">
            {[
              {
                badge: 'Cheaper',
                color: 'text-emerald-400',
                heading: 'Zero upfront. Day-one savings.',
                body: 'We structure every project as a long-term PPA — customers pay a discounted rate for renewable energy, with no capital expenditure. Cheaper from the first invoice.'
              },
              {
                badge: 'Cleaner',
                color: 'text-blue-400',
                heading: 'Coal displaced. CO₂ reduced.',
                body: 'Every project we deliver directly displaces grid electricity generated by coal and gas. We track, report, and verify the environmental impact of every megawatt-hour we generate.'
              },
              {
                badge: 'Predictable',
                color: 'text-amber-400',
                heading: 'Fixed rates. No surprises.',
                body: 'Under a PPA, customers know exactly what they will pay for renewable energy for 15 years — and receive it free for the remainder of the plant's life. No fuel price risk. No surprises.'
              },
            ].map((item, i) => (
              <div class="glass rounded-2xl p-8" data-aos="fade-up" data-aos-delay={i * 100}>
                <p class={`text-xs font-bold tracking-widest uppercase mb-3 ${item.color}`}>{item.badge}</p>
                <h3 class="text-white font-semibold text-lg mb-3">{item.heading}</h3>
                <p class="text-slate-400 text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
```

---

### Change 5 — Replace the Values section

FIND:
```
    <!-- Values -->
    <section class="py-20">
      <div class="max-w-screen-2xl mx-auto px-6 lg:px-8">
        <div class="text-center mb-16" data-aos="fade-up">
          <p class="text-emerald-400 text-sm font-semibold tracking-widest uppercase mb-3">Principles</p>
          <h2 class="font-display text-3xl md:text-4xl font-bold text-white tracking-tight">Our Values</h2>
        </div>
        <div class="grid md:grid-cols-3 gap-6">
          {[
            { title: 'Innovation', desc: 'Continuously pushing boundaries to develop and implement cutting-edge renewable energy solutions.' },
            { title: 'Sustainability', desc: 'Committed to environmental stewardship and promoting sustainable practices in everything we do.' },
            { title: 'Excellence', desc: 'Delivering superior quality and reliability in every project and service we provide.' },
          ].map((v, i) => (
            <div class="glass rounded-2xl p-8" data-aos="fade-up" data-aos-delay={i * 100}>
              <h3 class="text-emerald-400 font-bold text-xl mb-3">{v.title}</h3>
              <p class="text-slate-400 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
```

REPLACE WITH:
```
    <!-- Vision Tease -->
    <section class="py-20">
      <div class="max-w-screen-2xl mx-auto px-6 lg:px-8">
        <div class="max-w-3xl mx-auto">
          <div class="glass rounded-2xl p-10 md:p-14 text-center" data-aos="fade-up">
            <p class="text-emerald-400 text-sm font-semibold tracking-widest uppercase mb-4">Our Vision</p>
            <h2 class="font-display text-3xl md:text-4xl font-bold text-white tracking-tight mb-6">
              Where we are going is a conversation<br class="hidden md:block" /> best had in person.
            </h2>
            <p class="text-slate-400 text-lg leading-relaxed mb-8 max-w-xl mx-auto">
              The scale of what we are building across Asia is something we share with partners
              directly — when the right alignment is there. If you think that might be you,
              let's meet.
            </p>
            <a
              href="/contact"
              class="inline-flex items-center gap-x-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 transition-colors text-slate-950 font-semibold rounded-full"
              style="min-height: auto;"
            >
              Let's talk
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
```

---

### Change 6 — Replace the CTA section

FIND:
```
    <!-- CTA -->
    <section class="py-20 bg-slate-900">
      <div class="max-w-screen-2xl mx-auto px-6 lg:px-8 text-center">
        <h2 class="font-display text-3xl md:text-4xl font-bold text-white tracking-tight mb-6" data-aos="fade-up">
          Join Us in Shaping a Sustainable Future
        </h2>
        <p class="text-slate-400 text-lg mb-8 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">
          Partner with <BrandName /> to accelerate your transition to renewable energy and contribute to a cleaner, more sustainable world.
        </p>
        <a
          href="/contact"
          class="inline-flex items-center gap-x-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 transition-colors text-slate-950 font-semibold rounded-full"
          data-aos="fade-up"
          data-aos-delay="200"
          style="min-height: auto;"
        >
          Contact Us
        </a>
      </div>
    </section>
```

REPLACE WITH:
```
    <!-- CTA -->
    <section class="py-20 bg-slate-900">
      <div class="max-w-screen-2xl mx-auto px-6 lg:px-8">
        <div class="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div class="glass rounded-2xl p-8" data-aos="fade-up">
            <p class="text-emerald-400 text-sm font-semibold tracking-widest uppercase mb-3">For C&I Customers</p>
            <h3 class="text-white font-display text-2xl font-bold mb-3">Save from day one</h3>
            <p class="text-slate-400 text-sm leading-relaxed mb-6">
              Find out how much you can save with a <BrandName /> PPA.
              Answer four quick questions and get an instant estimate.
            </p>
            <a
              href="/#calculator"
              class="inline-flex items-center gap-x-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 transition-colors text-slate-950 font-semibold rounded-full text-sm"
              style="min-height: auto;"
            >
              Try the savings calculator
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </a>
          </div>
          <div class="glass rounded-2xl p-8" data-aos="fade-up" data-aos-delay="100">
            <p class="text-emerald-400 text-sm font-semibold tracking-widest uppercase mb-3">For Partners & Investors</p>
            <h3 class="text-white font-display text-2xl font-bold mb-3">Build with us</h3>
            <p class="text-slate-400 text-sm leading-relaxed mb-6">
              We work with strategic partners, capital partners, and technology suppliers
              across Asia. Tell us about your interest and let's explore the fit.
            </p>
            <a
              href="/partner-with-us"
              class="inline-flex items-center gap-x-2 px-6 py-3 border border-emerald-500 text-emerald-400 hover:bg-emerald-500/10 transition-colors font-semibold rounded-full text-sm"
              style="min-height: auto;"
            >
              Partner with us
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
```

---

## Testing Checklist

- [ ] Landing page Mission section no longer says "Founded in Bangkok in 2012"
- [ ] Landing page Mission first paragraph unpacks Cheaper / Cleaner / Predictable
- [ ] Landing page Mission mentions "85+" team (not 50+)
- [ ] Landing page Mission mentions I Squared Capital
- [ ] Landing page "Learn about our team" link now reads "Our story →"
- [ ] About page hero says "Two proven teams. One Asian platform."
- [ ] About page shows two side-by-side cards: Orange Circle (India, 2012) and PSS (Thailand, 2016)
- [ ] About page has Differentiator section: "Most developers build and sell. We build and stay."
- [ ] About page Mission section has 3 cards: Cheaper / Cleaner / Predictable
- [ ] About page Vision section says "a conversation best had in person"
- [ ] About page CTA has two cards: C&I customers + Partners & Investors
- [ ] Stats, Leadership/team cards, and Milestones timeline are UNCHANGED
- [ ] All existing Supabase data still loads correctly
- [ ] No console errors

## What NOT to change
- Frontmatter / Supabase data fetching
- Stats section
- Leadership / team cards section
- Milestones / Timeline section
- Navigation, Footer, Layout
- Any other pages

## Estimated time: 2–3 hours

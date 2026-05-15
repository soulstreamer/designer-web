import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'ro' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  ro: {
    // Navigation
    'nav.servicii': 'Servicii',
    'nav.portofoliu': 'Portofoliu',
    'nav.despre': 'Despre Noi',
    'nav.recenzii': 'Recenzii',
    'nav.contact': 'Contact',
    'nav.portofoliu_btn': 'Portofoliu',
    
    // Hero
    'hero.title': 'AVEȚI',
    'hero.need': 'Nevoie',
    'hero.of': 'de',
    'hero.page': 'o Pagină',
    'hero.web': 'Web?',
    'hero.subtitle': 'Creăm website-uri moderne, rapide și unice pentru afacerea ta. Designeri profesioniști, livrare în 1-2 zile.',
    'hero.cta1': 'Comandă o Pagină Web',
    'hero.cta2': 'Portofoliu',
    
    // Trusted By
    'trusted.title': 'Colaborăm cu',
    
    // Features Bar
    'featuresbar.delivery': 'Livrare 1-2 Zile',
    'featuresbar.delivery_desc': 'Termen rapid de execuție pentru fiecare proiect',
    'featuresbar.payments': 'Plăți Securizate',
    'featuresbar.payments_desc': 'Visa, Mastercard cu protecție SSL completă',
    'featuresbar.projects': '200+ Proiecte',
    'featuresbar.projects_desc': 'Website-uri livrate cu succes în toată țara',
    'featuresbar.support': 'Suport 24/7',
    'featuresbar.support_desc': 'Asistență tehnică permanentă pentru clienți',
    
    // Process
    'process.subtitle': 'Cum Funcționează?',
    'process.title': '3 Pași Simpli',
    'process.step1': 'Alege Pachetul',
    'process.step1_desc': 'Selectează între Pagina Prezentare sau Magazin Online. Completează datele de contact.',
    'process.step2': 'Contact cu Designerul',
    'process.step2_desc': 'Un designer te contactează pentru a discuta detalii: culori, logo, conținut și preferințe.',
    'process.step3': 'Livrare și Publicare',
    'process.step3_desc': 'Primești website-ul finalizat în 1-2 zile. Revizii incluse. Publicare gratuită.',
    
    // Services
    'services.subtitle': 'Serviciile Noastre',
    'services.title': 'Soluții Complete pentru Prezența Online',
    'services.desc': 'Alege pachetul potrivit pentru afacerea ta. Ambele variante includ design unicat, optimizare SEO și suport tehnic.',
    'services.prezentare': 'Pagină Prezentare Unicat',
    'services.prezentare_price': '1.000 RON',
    'services.magazin': 'Pagină Magazin Online',
    'services.magazin_price': '1.500 RON',
    'services.feature1': 'Design 100% Unicat',
    'services.feature2': 'Până la 5 Secțiuni',
    'services.feature3': 'Formular Contact',
    'services.feature4': 'Optimizare SEO',
    'services.feature5': 'Responsive Mobile',
    'services.feature6': 'Tot ce include Prezentare +',
    'services.feature7': 'Coș de Cumpărături',
    'services.feature8': 'Plăți Online',
    'services.feature9': 'Panou Administrare',
    'services.feature10': 'Facturare Automată',
    'services.feature11': 'Integrare Curier',
    'services.name_placeholder': 'Nume și Prenume *',
    'services.phone_placeholder': 'Număr Telefon (10 cifre) *',
    'services.phone_count': '{count}/10 cifre',
    'services.submit': 'Trimite Comanda',
    'services.sending': 'Se trimite...',
    'services.order_btn': 'Comandă Acum',
    'services.footer_note': 'După achitarea plății ofertei, un designer {site} te va contacta pentru detalii: paletă de culori, preferințe personale, identitate vizuală — pentru a crea un proiect unicat.',
    'services.submit_success': 'Comanda a fost trimisă! Un designer te va contacta în curând.',
    'services.error_name': 'Numele este obligatoriu',
    'services.error_phone': 'Numărul de telefon este obligatoriu',
    'services.error_phone_digits': 'Numărul trebuie să aibă exact 10 cifre',
    
    // About
    'about.subtitle': 'Despre Noi',
    'about.title': 'Designer-Web.ro — Partenerul Tău Digital',
    'about.desc1': 'Suntem o echipă de developeri și designeri pasionați, cu experiență de peste 8 ani în domeniul web design-ului. Am livrat peste 200 de proiecte pentru clienți din întreaga țară, de la pagini de prezentare simple la magazine online complexe. Fiecare proiect este tratat cu aceeași atenție la detalii și dedicare.',
    'about.desc2': 'Credem într-un proces transparent: plătești oferta, un designer te contactează pentru detalii personalizate, iar în 1-2 zile primești un website unic, optimizat și gata de publicare.',
    'about.stat1': '8+',
    'about.stat1_label': 'Ani Experiență',
    'about.stat2': '200+',
    'about.stat2_label': 'Proiecte Livrate',
    'about.stat3': '50+',
    'about.stat3_label': 'Clienți Recurenți',
    'about.cta': 'Hai să Vorbim',
    
    // Developer
    'developer.subtitle': 'Echipa Noastră',
    'developer.title': 'Dezvoltatori Profesioniști',
    'developer.desc1': 'Fiecare developer din echipa noastră aduce expertiză tehnică și creativitate în fiecare proiect. Absolvenți ai facultăților de profil din România, cu experiență solidă în dezvoltarea web modernă — de la React și Next.js la platforme CMS personalizate.',
    'developer.desc2': 'Lucrăm cu pasiune și precizie, transformând ideile clienților în experiențe digitale de excepție. Fiecare linie de cod este scrisă cu grijă pentru performanță, securitate și scalabilitate.',
    'developer.edu': 'Facultate',
    'developer.edu_value': 'Universitatea Politehnică București',
    'developer.exp': 'Vechime',
    'developer.exp_value': '8+ ani în dezvoltare web',
    'developer.spec': 'Specializare',
    'developer.spec_value': 'React, Node.js, Full Stack',
    
    // Showcase/Portfolio
    'showcase.subtitle': 'Portofoliu',
    'showcase.title': 'Proiectele Noastre',
    'showcase.desc': 'Peste 200 de proiecte finalizate cu succes pentru clienți din întreaga țară. De la pagini de prezentare elegante la magazine online complexe, fiecare proiect este o poveste de succes.',
    'showcase.click_preview': 'Click pentru preview',
    'showcase.close': 'Închide',
    'showcase.zoom': 'Zoom',
    'showcase.zoom_out': 'Micșorează',
    'showcase.reset': 'Reset',
    'showcase.zoom_hint': 'Scroll pentru zoom | Drag pentru a muta',
    'showcase.demo': 'Vezi site',
    
    // Reviews
    'reviews.subtitle': 'Recenzii',
    'reviews.title': 'Ce Spun Clienții Noștri',
    
    // Features (De Ce Noi)
    'features.subtitle': 'De Ce Noi?',
    'features.title': 'Agenția care Livrează Rezultate',
    'features.desc': 'Experiență, viteză și profesionalism în fiecare proiect.',
    
    // Contact
    'contact.subtitle': 'Contact',
    'contact.title': 'Hai să Începem Proiectul Tău',
    'contact.address': 'Alexandria, Teleorman, România',
    'contact.address_detail': 'Bl. BM3A, Sc. A, Etaj 5',
    'contact.whatsapp': 'Sau scrie-ne direct pe WhatsApp',
    'contact.form_title': 'Trimite-ne un Mesaj',
    'contact.name_placeholder': 'Nume și Prenume *',
    'contact.email_placeholder': 'Email *',
    'contact.message_placeholder': 'Mesajul tău *',
    'contact.submit': 'Trimite Mesajul',
    'contact.sending': 'Se trimite...',
    'contact.success': 'Mesajul a fost trimis! Te contactăm curând.',
    'contact.error_name': 'Numele este obligatoriu',
    'contact.error_email': 'Email-ul este obligatoriu',
    'contact.error_message': 'Mesajul este obligatoriu',
    
    // Footer
    'footer.services': 'Servicii',
    'footer.company': 'Companie',
    'footer.support': 'Suport',
    'footer.contact': 'Contact',
    'footer.copyright': '© 2025 Designer-Web.ro. Toate drepturile rezervate.',
    'footer.developed': 'Dezvoltat cu pasiune de echipa Designer-Web.ro',
    'footer.optimizare_seo': 'Optimizare SEO',
    'footer.mentenanta': 'Mentenanță',
    'footer.faq': 'Întrebări Frecvente',
    'footer.terms': 'Termeni și Condiții',
    'footer.privacy': 'Politica de Confidențialitate',
    
    // SEO Page
    'seo.title': 'Optimizare SEO',
    'seo.free_title': 'SEO Gratuit pentru Clienții Noștri',
    'seo.free_desc': 'La Designer-Web.ro, oferim optimizare SEO gratuită pentru toți clienții care achiziționează o pagină web de la noi. Fiecare site este construit cu cele mai bune practici SEO pentru a vă ajuta să vă clasați mai bine în motoarele de căutare.',
    'seo.includes_title': 'Ce Include Optimizarea SEO?',
    'seo.includes': [
      'Cercetare și implementare cuvinte cheie relevante',
      'Optimizare meta tag-uri (title, description)',
      'Structură URL optimizată',
      'Optimizare imagini (alt text, dimensiuni)',
      'Site map XML generat automat',
      'Optimizare viteză de încărcare',
      'Design responsive (mobile-friendly)',
      'Integrare Google Analytics',
      'Integrare Google Search Console'
    ],
    'seo.why_title': 'De Ce Este Important SEO?',
    'seo.why_desc': 'Optimizarea SEO este esențială pentru a fi găsit online de către clienții potențiali. Un site bine optimizat va atrage mai mult trafic organic, va genera mai multe lead-uri și va crește vânzările afacerii dumneavoastră. Cu SEO-ul nostru gratuit, veți avea un avantaj competitiv semnificativ față de concurență.',
    
    // Mentenanta Page
    'mentenanta.title': 'Mentenanță',
    'mentenanta.free_title': 'Mentenanță Gratuită 12 Luni',
    'mentenanta.free_desc': 'Oferim mentenanță gratuită timp de 12 luni pentru toți clienții noștri. Aceasta include actualizări de securitate, backup-uri regulate și suport tehnic pentru orice problemă întâmpinați.',
    'mentenanta.includes_title': 'Ce Include Mentenanța?',
    'mentenanta.includes': [
      'Actualizări de securitate și patch-uri',
      'Backup-uri săptămânale automate',
      'Monitorizare uptime 24/7',
      'Corectarea erorilor tehnice',
      'Actualizări de conținut (până la 4 modificări/lună)',
      'Suport tehnic prin email și telefon',
      'Optimizare performanță lunară',
      'Raport lunar de performanță'
    ],
    'mentenanta.why_title': 'De Ce Avem Nevoie de Mentenanță?',
    'mentenanta.why_desc': 'Un site web necesită îngrijire constantă pentru a funcționa optim și a rămâne securizat. Cu mentenanța noastră gratuită, vă puteți concentra pe afacerea dumneavoastră în timp ce noi ne ocupăm de aspectele tehnice. După perioada gratuită, puteți opta pentru un abonament de mentenanță la prețuri accesibile.',
    
    // FAQ Page
    'faq.title': 'Întrebări Frecvente',
    'faq.q1': 'Cât timp durează realizarea unui site web?',
    'faq.a1': 'Termenul de livrare este de 1-2 zile lucrătoare pentru o pagină de prezentare și 2-3 zile pentru un magazin online.',
    'faq.q2': 'Ce include prețul de 1.000 RON pentru pagina de prezentare?',
    'faq.a2': 'Prețul include design unicat, până la 5 secțiuni, formular de contact, optimizare SEO de bază, responsive design, mentenanță gratuită 12 luni și găzduire primul an.',
    'faq.q3': 'Pot modifica conținutul site-ului după livrare?',
    'faq.a3': 'Da, oferim mentenanță gratuită care include până la 4 modificări de conținut pe lună în primul an.',
    'faq.q4': 'Oferiți SEO gratuit?',
    'faq.a4': 'Da! Oferim optimizare SEO gratuită pentru toți clienții. Aceasta include cercetare cuvinte cheie, optimizare meta tag-uri, site map XML și integrare Google Analytics.',
    'faq.q5': 'După cât timp apare site-ul în Google?',
    'faq.a5': 'Indexarea în Google poate dura între câteva zile și câteva săptămâni. Noi înregistrăm site-ul în Google Search Console pentru a grăbi procesul.',
    
    // Privacy Page
    'privacy.title': 'Politica de Confidențialitate',
    'privacy.sec1_title': '1. Colectarea Informațiilor',
    'privacy.sec1': 'Colectăm informații personale precum numele, adresa de email, numărul de telefon și informații despre proiect atunci când ne contactați sau comandați un serviciu. Aceste informații sunt necesare pentru a vă putea oferi serviciile solicitate.',
    'privacy.sec2_title': '2. Utilizarea Informațiilor',
    'privacy.sec2': 'Utilizăm informațiile dumneavoastră pentru: a furniza și gestiona serviciile solicitate, a comunica cu dumneavoastră despre proiect, a trimite actualizări și informații relevante, a îmbunătăți serviciile noastre.',
    'privacy.sec3_title': '3. Protecția Datelor',
    'privacy.sec3': 'Luăm măsuri de securitate adecvate pentru a proteja informațiile dumneavoastră împotriva accesului neautorizat, modificării, divulgării sau distrugerii. Datele sunt stocate pe servere securizate și accesul este limitat doar personalului autorizat.',
    'privacy.sec4_title': '4. Partajarea Informațiilor',
    'privacy.sec4': 'Nu vindem, nu închiriem și nu împărtășim informațiile dumneavoastră personale cu terți pentru scopuri de marketing. Putem dezvălui informații doar atunci când este cerut de lege sau pentru a ne proteja drepturile.',
    'privacy.sec5_title': '5. Drepturile Dumneavoastră',
    'privacy.sec5': 'Aveți dreptul de a accesa, modifica sau șterge informațiile personale pe care le deținem despre dumneavoastră. Pentru orice solicitare, ne puteți contacta la designerwebinquiry@gmail.com.',
    
    // Terms Page
    'terms.title': 'Termeni și Condiții',
    'terms.sec1_title': '1. Acceptarea Termenilor',
    'terms.sec1': 'Prin utilizarea serviciilor Designer-Web.ro, sunteți de acord cu acești termeni și condiții. Vă rugăm să citiți cu atenție înainte de a plasa o comandă.',
    'terms.sec2_title': '2. Drepturi de Autor',
    'terms.sec2': 'După finalizarea plății integrale, clientul primește drepturile complete asupra site-ului creat. Designer-Web.ro își rezervă dreptul de a include proiectul în portofoliu, cu acordul clientului.',
    'terms.sec3_title': '3. Mentenanță și Suport',
    'terms.sec3': 'Oferim mentenanță gratuită timp de 12 luni, care include actualizări de securitate, backup și suport tehnic. Aceasta nu include modificări majore de design sau adăugarea de funcționalități noi.',
    'terms.sec4_title': '4. Modificări ale Termenilor',
    'terms.sec4': 'Ne rezervăm dreptul de a modifica acești termeni în orice moment. Modificările vor intra în vigoare imediat ce sunt publicate pe site.'
  },
  en: {
    // Navigation
    'nav.servicii': 'Services',
    'nav.portofoliu': 'Portfolio',
    'nav.despre': 'About Us',
    'nav.recenzii': 'Reviews',
    'nav.contact': 'Contact',
    'nav.portofoliu_btn': 'Portfolio',
    
    // Hero
    'hero.title': 'DO YOU',
    'hero.need': 'Need',
    'hero.of': 'a',
    'hero.page': 'Website',
    'hero.web': '?',
    'hero.subtitle': 'We create modern, fast and unique websites for your business. Professional designers, delivery in 1-2 days.',
    'hero.cta1': 'Order a Website',
    'hero.cta2': 'Portfolio',
    
    // Trusted By
    'trusted.title': 'We Work With',
    
    // Features Bar
    'featuresbar.delivery': '1-2 Day Delivery',
    'featuresbar.delivery_desc': 'Fast execution time for each project',
    'featuresbar.payments': 'Secure Payments',
    'featuresbar.payments_desc': 'Visa, Mastercard with full SSL protection',
    'featuresbar.projects': '200+ Projects',
    'featuresbar.projects_desc': 'Successfully delivered websites nationwide',
    'featuresbar.support': '24/7 Support',
    'featuresbar.support_desc': 'Permanent technical assistance for clients',
    
    // Process
    'process.subtitle': 'How It Works?',
    'process.title': '3 Simple Steps',
    'process.step1': 'Choose Package',
    'process.step1_desc': 'Select between Landing Page or Online Store. Fill in your contact details.',
    'process.step2': 'Designer Contact',
    'process.step2_desc': 'A designer contacts you to discuss details: colors, logo, content and preferences.',
    'process.step3': 'Delivery & Publishing',
    'process.step3_desc': 'Receive your completed website in 1-2 days. Revisions included. Free publishing.',
    
    // Services
    'services.subtitle': 'Our Services',
    'services.title': 'Complete Solutions for Online Presence',
    'services.desc': 'Choose the right package for your business. Both variants include unique design, SEO optimization and technical support.',
    'services.prezentare': 'Unique Landing Page',
    'services.prezentare_price': '€200',
    'services.magazin': 'Online Store Page',
    'services.magazin_price': '€300',
    'services.feature1': '100% Unique Design',
    'services.feature2': 'Up to 5 Sections',
    'services.feature3': 'Contact Form',
    'services.feature4': 'SEO Optimization',
    'services.feature5': 'Mobile Responsive',
    'services.feature6': 'Everything in Landing +',
    'services.feature7': 'Shopping Cart',
    'services.feature8': 'Online Payments',
    'services.feature9': 'Admin Panel',
    'services.feature10': 'Automatic Invoicing',
    'services.feature11': 'Courier Integration',
    'services.name_placeholder': 'Full Name *',
    'services.phone_placeholder': 'Phone Number *',
    'services.phone_count': '{count} digits',
    'services.submit': 'Send Order',
    'services.sending': 'Sending...',
    'services.order_btn': 'Order Now',
    'services.footer_note': 'After paying the offer, a designer from {site} will contact you for details: color palette, personal preferences, visual identity — to create a unique project.',
    'services.submit_success': 'Order submitted! A designer will contact you soon.',
    'services.error_name': 'Name is required',
    'services.error_phone': 'Phone number is required',
    'services.error_phone_digits': 'Phone number must have exactly 10 digits',
    
    // About
    'about.subtitle': 'About Us',
    'about.title': 'Designer-Web.ro — Your Digital Partner',
    'about.desc1': 'We are a team of passionate developers and designers with over 8 years of experience in web design. We have delivered over 200 projects for clients across the country, from simple landing pages to complex online stores. Each project is treated with the same attention to detail and dedication.',
    'about.desc2': 'We believe in a transparent process: you pay for the offer, a designer contacts you for personalized details, and in 1-2 days you receive a unique, optimized website ready for publishing.',
    'about.stat1': '8+',
    'about.stat1_label': 'Years Experience',
    'about.stat2': '200+',
    'about.stat2_label': 'Projects Delivered',
    'about.stat3': '50+',
    'about.stat3_label': 'Returning Clients',
    'about.cta': 'Let\'s Talk',
    
    // Developer
    'developer.subtitle': 'Our Team',
    'developer.title': 'Professional Developers',
    'developer.desc1': 'Each developer in our team brings technical expertise and creativity to every project. Graduates of specialized universities in Romania, with solid experience in modern web development — from React and Next.js to custom CMS platforms.',
    'developer.desc2': 'We work with passion and precision, transforming clients\' ideas into exceptional digital experiences. Every line of code is written with care for performance, security and scalability.',
    'developer.edu': 'Education',
    'developer.edu_value': 'Politehnica University of Bucharest',
    'developer.exp': 'Experience',
    'developer.exp_value': '8+ years in web development',
    'developer.spec': 'Specialization',
    'developer.spec_value': 'React, Node.js, Full Stack',
    
    // Showcase/Portfolio
    'showcase.subtitle': 'Portfolio',
    'showcase.title': 'Our Projects',
    'showcase.desc': 'Over 200 successfully completed projects for clients across the country. From elegant landing pages to complex online stores, each project is a success story.',
    'showcase.click_preview': 'Click for preview',
    'showcase.close': 'Close',
    'showcase.zoom': 'Zoom In',
    'showcase.zoom_out': 'Zoom Out',
    'showcase.reset': 'Reset',
    'showcase.zoom_hint': 'Scroll to zoom | Drag to move',
    'showcase.demo': 'View Site',
    
    // Reviews
    'reviews.subtitle': 'Reviews',
    'reviews.title': 'What Our Clients Say',
    
    // Features (De Ce Noi)
    'features.subtitle': 'Why Us?',
    'features.title': 'The Agency That Delivers Results',
    'features.desc': 'Experience, speed and professionalism in every project.',
    
    // Contact
    'contact.subtitle': 'Contact',
    'contact.title': 'Let\'s Start Your Project',
    'contact.address': 'Alexandria, Teleorman, Romania',
    'contact.address_detail': 'Bl. BM3A, Sc. A, Floor 5',
    'contact.whatsapp': 'Or message us directly on WhatsApp',
    'contact.form_title': 'Send Us a Message',
    'contact.name_placeholder': 'Full Name *',
    'contact.email_placeholder': 'Email *',
    'contact.message_placeholder': 'Your message *',
    'contact.submit': 'Send Message',
    'contact.sending': 'Sending...',
    'contact.success': 'Message sent! We\'ll contact you soon.',
    'contact.error_name': 'Name is required',
    'contact.error_email': 'Email is required',
    'contact.error_message': 'Message is required',
    
    // Footer
    'footer.services': 'Services',
    'footer.company': 'Company',
    'footer.support': 'Support',
    'footer.contact': 'Contact',
    'footer.copyright': '© 2025 Designer-Web.ro. All rights reserved.',
    'footer.developed': 'Developed with passion by the Designer-Web.ro team',
    'footer.optimizare_seo': 'SEO Optimization',
    'footer.mentenanta': 'Maintenance',
    'footer.faq': 'FAQ',
    'footer.terms': 'Terms and Conditions',
    'footer.privacy': 'Privacy Policy',
    
    // SEO Page
    'seo.title': 'SEO Optimization',
    'seo.free_title': 'Free SEO for Our Clients',
    'seo.free_desc': 'At Designer-Web.ro, we offer free SEO optimization for all clients who purchase a website from us. Each site is built with the best SEO practices to help you rank better in search engines.',
    'seo.includes_title': 'What Does SEO Include?',
    'seo.includes': [
      'Relevant keyword research and implementation',
      'Meta tags optimization (title, description)',
      'Optimized URL structure',
      'Image optimization (alt text, dimensions)',
      'Automatic XML sitemap generation',
      'Loading speed optimization',
      'Responsive design (mobile-friendly)',
      'Google Analytics integration',
      'Google Search Console integration'
    ],
    'seo.why_title': 'Why Is SEO Important?',
    'seo.why_desc': 'SEO optimization is essential to be found online by potential customers. A well-optimized website will attract more organic traffic, generate more leads and increase your business sales. With our free SEO, you will have a significant competitive advantage over the competition.',
    
    // Mentenanta Page
    'mentenanta.title': 'Maintenance',
    'mentenanta.free_title': 'Free Maintenance 12 Months',
    'mentenanta.free_desc': 'We offer free maintenance for 12 months for all our clients. This includes security updates, regular backups and technical support for any issues you encounter.',
    'mentenanta.includes_title': 'What Does Maintenance Include?',
    'mentenanta.includes': [
      'Security updates and patches',
      'Automatic weekly backups',
      '24/7 uptime monitoring',
      'Technical error correction',
      'Content updates (up to 4 changes/month)',
      'Technical support via email and phone',
      'Monthly performance optimization',
      'Monthly performance report'
    ],
    'mentenanta.why_title': 'Why Do We Need Maintenance?',
    'mentenanta.why_desc': 'A website requires constant care to function optimally and remain secure. With our free maintenance, you can focus on your business while we handle the technical aspects. After the free period, you can opt for a maintenance subscription at affordable prices.',
    
    // FAQ Page
    'faq.title': 'Frequently Asked Questions',
    'faq.q1': 'How long does it take to create a website?',
    'faq.a1': 'The delivery time is 1-2 business days for a landing page and 2-3 days for an online store.',
    'faq.q2': 'What does the €200 price for the landing page include?',
    'faq.a2': 'The price includes unique design, up to 5 sections, contact form, basic SEO optimization, responsive design, free 12-month maintenance and first year hosting.',
    'faq.q3': 'Can I modify the website content after delivery?',
    'faq.a3': 'Yes, we offer free maintenance which includes up to 4 content changes per month in the first year.',
    'faq.q4': 'Do you offer free SEO?',
    'faq.a4': 'Yes! We offer free SEO optimization for all clients. This includes keyword research, meta tags optimization, XML sitemap and Google Analytics integration.',
    'faq.q5': 'How long until the site appears on Google?',
    'faq.a5': 'Indexing on Google can take anywhere from a few days to a few weeks. We register the site in Google Search Console to speed up the process.',
    
    // Privacy Page
    'privacy.title': 'Privacy Policy',
    'privacy.sec1_title': '1. Information Collection',
    'privacy.sec1': 'We collect personal information such as name, email address, phone number and project information when you contact us or order a service. This information is necessary to provide you with the requested services.',
    'privacy.sec2_title': '2. Use of Information',
    'privacy.sec2': 'We use your information to: provide and manage requested services, communicate with you about the project, send updates and relevant information, improve our services.',
    'privacy.sec3_title': '3. Data Protection',
    'privacy.sec3': 'We take appropriate security measures to protect your information against unauthorized access, modification, disclosure or destruction. Data is stored on secure servers and access is limited to authorized personnel only.',
    'privacy.sec4_title': '4. Information Sharing',
    'privacy.sec4': 'We do not sell, rent or share your personal information with third parties for marketing purposes. We may disclose information only when required by law or to protect our rights.',
    'privacy.sec5_title': '5. Your Rights',
    'privacy.sec5': 'You have the right to access, modify or delete the personal information we hold about you. For any request, you can contact us at designerwebinquiry@gmail.com.',
    
    // Terms Page
    'terms.title': 'Terms and Conditions',
    'terms.sec1_title': '1. Acceptance of Terms',
    'terms.sec1': 'By using Designer-Web.ro services, you agree to these terms and conditions. Please read carefully before placing an order.',
    'terms.sec2_title': '2. Copyright',
    'terms.sec2': 'After full payment completion, the client receives complete rights over the created website. Designer-Web.ro reserves the right to include the project in the portfolio, with the client\'s consent.',
    'terms.sec3_title': '3. Maintenance and Support',
    'terms.sec3': 'We offer free maintenance for 12 months, which includes security updates, backups and technical support. This does not include major design changes or adding new functionalities.',
    'terms.sec4_title': '4. Changes to Terms',
    'terms.sec4': 'We reserve the right to modify these terms at any time. Changes will take effect immediately upon being published on the site.'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('ro');

  // IP Geolocation detection
  useEffect(() => {
    const detectLanguage = async () => {
      try {
        const savedLang = localStorage.getItem('language') as Language;
        if (savedLang && (savedLang === 'ro' || savedLang === 'en')) {
          setLanguage(savedLang);
          return;
        }

        // Try to detect country by IP
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        // If country is Romania, use Romanian, otherwise use English
        if (data.country_code === 'RO') {
          setLanguage('ro');
        } else {
          setLanguage('en');
        }
      } catch (error) {
        // Default to Romanian if detection fails
        setLanguage('ro');
      }
    };

    detectLanguage();
  }, []);

  // Save language preference
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string): string | string[] => {
    // Look up the key directly in the flat translations object
    const translationSet = translations[language] as Record<string, string | string[]>;
    if (key in translationSet) {
      return translationSet[key];
    }
    
    // Return key if translation not found
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

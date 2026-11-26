import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { company } from '../data/company';
import { productDropdownOptions } from '../data/collections';
import { openWhatsApp, WHATSAPP_CHAT_URL } from '../utils/whatsapp';
import { getStoredAttribution } from '../utils/attribution';
import { events, trackEvent } from '../config/tracking';
import { useMagneticButton } from '../hooks/useMagneticButton';

gsap.registerPlugin(ScrollTrigger);

const budgetOptions = [
  'Under ₹5 Lakhs',
  '₹5 – ₹10 Lakhs',
  '₹10 – ₹20 Lakhs',
  '₹20 – ₹35 Lakhs',
  '₹35 Lakhs & Above',
  'Yet to Decide',
];

const enquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Please enter your full name (at least 2 characters).')
    .max(100, 'Name must be under 100 characters.'),
  mobile: z
    .string()
    .trim()
    .regex(/^\d{10}$/, 'Please enter a valid 10-digit mobile number.'),
  email: z
    .string()
    .trim()
    .email('Please enter a valid email address.')
    .optional()
    .or(z.literal('')),
  location: z
    .string()
    .trim()
    .min(2, 'Please enter your city or location.')
    .max(100, 'Location must be under 100 characters.'),
  product: z.string().min(1, 'Please select an interested product category.'),
  budget: z.string().optional().or(z.literal('')),
  message: z
    .string()
    .trim()
    .max(1000, 'Message must be under 1000 characters.')
    .optional()
    .or(z.literal('')),
  // Honeypot spam trap (must remain empty)
  website: z.string().max(0).optional().or(z.literal('')),
  consent: z.boolean().refine((val) => val === true, {
    message: 'Please accept the privacy consent to proceed.',
  }),
});

export default function Enquiry() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const formWrapRef = useRef(null);
  const decorWrapRef = useRef(null);
  const hasTrackedStartRef = useRef(false);
  const lastSubmittedHashRef = useRef('');
  const submitCooldownRef = useRef(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState(null); // null | 'backend_confirmed' | 'whatsapp_opened'
  const [submitError, setSubmitError] = useState('');
  const [duplicateNotice, setDuplicateNotice] = useState('');

  const magneticSubmit = useMagneticButton(0.15);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(enquirySchema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      mobile: '',
      email: '',
      location: '',
      product: '',
      budget: '',
      message: '',
      website: '',
      consent: false,
    },
  });

  // Listen for product preselection events from Collections, KitchenExperience, HardwareShowcase, etc.
  useEffect(() => {
    const handleCategorySelect = (event) => {
      const { category, note } = event.detail || {};
      if (category && productDropdownOptions.includes(category)) {
        setValue('product', category, { shouldValidate: true, shouldDirty: true });
      }
      if (note && !getValues('message')) {
        setValue('message', note, { shouldDirty: true });
      }
      setSubmitState(null);
      setSubmitError('');
    };

    window.addEventListener('kraft:select-enquiry-category', handleCategorySelect);
    return () => {
      window.removeEventListener('kraft:select-enquiry-category', handleCategorySelect);
    };
  }, [setValue, getValues]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.from(headerRef.current.children, {
          y: 40,
          opacity: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        });
      }

      if (formWrapRef.current) {
        gsap.from(formWrapRef.current, {
          y: 35,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: formWrapRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });
      }

      if (decorWrapRef.current) {
        gsap.from(decorWrapRef.current, {
          y: 45,
          opacity: 0,
          duration: 1,
          delay: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: decorWrapRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });
      }
    }, sectionRef);

    return () => {
      ctx.revert();
      if (submitCooldownRef.current) {
        clearTimeout(submitCooldownRef.current);
      }
    };
  }, []);

  const handleFormStart = () => {
    if (!hasTrackedStartRef.current) {
      hasTrackedStartRef.current = true;
      trackEvent(events.FORM_START, { form_name: 'whatsapp_enquiry' });
    }
  };

  const handleProductChange = (e) => {
    if (e.target.value) {
      trackEvent(events.PRODUCT_SELECT, {
        product_category: e.target.value,
        source: 'enquiry_form',
      });
    }
  };

  const onSubmit = async (data) => {
    if (isSubmitting) return;
    if (data.website) return; // Honeypot spam trap

    const payloadSignature = JSON.stringify({
      name: data.name,
      mobile: data.mobile,
      email: data.email || '',
      location: data.location,
      product: data.product,
      budget: data.budget || '',
      message: data.message || '',
    });

    if (lastSubmittedHashRef.current === payloadSignature) {
      setDuplicateNotice(
        'This enquiry was just submitted. Update your details above or wait a moment before sending again.'
      );
      return;
    }

    setDuplicateNotice('');
    setSubmitError('');
    setIsSubmitting(true);

    const apiUrl = import.meta.env.VITE_API_URL || '';

    try {
      trackEvent(events.FORM_SUBMIT, {
        form_name: 'whatsapp_enquiry',
        product_category: data.product,
        budget_range: data.budget || 'Not specified',
        location: data.location,
      });

      let backendConfirmed = false;
      if (apiUrl) {
        const res = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: data.name,
            mobile: data.mobile,
            email: data.email || '',
            location: data.location,
            product: data.product,
            budget: data.budget || '',
            message: data.message || '',
            consent: data.consent,
            attribution: getStoredAttribution(),
            submittedAt: new Date().toISOString(),
          }),
        });

        if (!res.ok) {
          throw new Error(`Enquiry service returned ${res.status}`);
        }
        backendConfirmed = true;
      }

      openWhatsApp(data);
      lastSubmittedHashRef.current = payloadSignature;

      if (backendConfirmed) {
        setSubmitState('backend_confirmed');
        trackEvent(events.ENQUIRY_CONFIRMED, {
          product_category: data.product,
          channel: 'backend_and_whatsapp',
        });
      } else {
        setSubmitState('whatsapp_opened');
        trackEvent(events.WHATSAPP_HANDOFF, {
          product_category: data.product,
          channel: 'whatsapp_click_to_chat',
        });
      }

      submitCooldownRef.current = setTimeout(() => {
        lastSubmittedHashRef.current = '';
      }, 30000);
    } catch {
      setSubmitError(
        'Unable to reach the lead capture server right now. Please try again or tap Direct WhatsApp Chat on the right.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetSuccess = () => {
    setSubmitState(null);
    setSubmitError('');
    setDuplicateNotice('');
    lastSubmittedHashRef.current = '';
    hasTrackedStartRef.current = false;
    reset();
  };

  const inputBaseClass =
    'w-full bg-transparent border-b border-warm-gray/30 focus:border-brand-red focus:outline-none py-3 text-pure-white placeholder:text-warm-gray/60 font-body text-sm md:text-base transition-colors duration-300';

  const labelBaseClass =
    'block font-body text-xs uppercase tracking-[0.18em] text-warm-gray mb-1.5';

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative bg-carbon text-pure-white py-24 md:py-32 overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            'radial-gradient(circle at 85% 20%, rgba(179, 154, 125, 0.14) 0%, transparent 45%), radial-gradient(circle at 10% 90%, rgba(215, 25, 32, 0.08) 0%, transparent 40%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div ref={headerRef} className="max-w-3xl mb-14 md:mb-20">
          <p className="eyebrow text-bronze mb-4">Private Consultation</p>
          <h2 className="heading-xl text-4xl sm:text-5xl md:text-6xl font-heading text-pure-white mb-5">
            Let&apos;s Create Your Dream Space.
          </h2>
          <p className="body-text text-warm-gray text-base md:text-lg max-w-2xl">
            Tell us what you have in mind. Our team will help you discover the perfect
            kitchen, appliances and interior solutions for your home.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-14 items-stretch">
          {/* Left 60%: Form */}
          <div ref={formWrapRef} className="w-full lg:w-[60%]">
            <div className="bg-dark-surface/70 border border-warm-gray/15 p-6 sm:p-10 md:p-12">
              {submitState ? (
                <div
                  role="status"
                  aria-live="polite"
                  className="py-10 text-center space-y-6"
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-brand-red/15 border border-brand-red/40 text-brand-red">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div className="space-y-3 max-w-md mx-auto">
                    <h3 className="heading-md font-heading text-3xl text-pure-white">
                      {submitState === 'backend_confirmed'
                        ? 'Enquiry Confirmed & WhatsApp Ready'
                        : 'WhatsApp Message Prepared'}
                    </h3>
                    <p className="body-text text-warm-gray text-sm md:text-base">
                      {submitState === 'backend_confirmed'
                        ? `Your consultation enquiry has been saved with ${company.name} and opened in WhatsApp. Tap Send in WhatsApp to start chatting immediately.`
                        : `Your enquiry details have been prefilled in WhatsApp. Please tap Send inside WhatsApp to transmit your message directly to our ${company.name} team.`}
                    </p>
                  </div>
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                      type="button"
                      onClick={handleResetSuccess}
                      className="px-7 py-3.5 border border-bronze/50 text-bronze hover:bg-bronze hover:text-carbon font-body text-xs uppercase tracking-[0.2em] transition-colors duration-300 cursor-pointer"
                    >
                      Submit Another Enquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  onFocus={handleFormStart}
                  noValidate
                  className="space-y-8"
                >
                  {/* Hidden Honeypot Spam Field */}
                  <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="hidden"
                    {...register('website')}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-7">
                    <div>
                      <label htmlFor="enquiry-name" className={labelBaseClass}>
                        Full Name <span className="text-brand-red">*</span>
                      </label>
                      <input
                        id="enquiry-name"
                        type="text"
                        autoComplete="name"
                        placeholder="Your full name"
                        aria-invalid={errors.name ? 'true' : 'false'}
                        className={`${inputBaseClass} ${
                          errors.name ? 'border-brand-red' : ''
                        }`}
                        {...register('name')}
                      />
                      {errors.name && (
                        <p role="alert" className="text-brand-red text-sm mt-1.5">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="enquiry-mobile" className={labelBaseClass}>
                        Mobile Number <span className="text-brand-red">*</span>
                      </label>
                      <input
                        id="enquiry-mobile"
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        autoComplete="tel-national"
                        placeholder="10-digit mobile number"
                        aria-invalid={errors.mobile ? 'true' : 'false'}
                        className={`${inputBaseClass} ${
                          errors.mobile ? 'border-brand-red' : ''
                        }`}
                        {...register('mobile')}
                      />
                      {errors.mobile && (
                        <p role="alert" className="text-brand-red text-sm mt-1.5">
                          {errors.mobile.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="enquiry-email" className={labelBaseClass}>
                        Email Address <span className="text-warm-gray/60">(Optional)</span>
                      </label>
                      <input
                        id="enquiry-email"
                        type="email"
                        autoComplete="email"
                        placeholder="name@example.com"
                        aria-invalid={errors.email ? 'true' : 'false'}
                        className={`${inputBaseClass} ${
                          errors.email ? 'border-brand-red' : ''
                        }`}
                        {...register('email')}
                      />
                      {errors.email && (
                        <p role="alert" className="text-brand-red text-sm mt-1.5">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="enquiry-location" className={labelBaseClass}>
                        City / Location <span className="text-brand-red">*</span>
                      </label>
                      <input
                        id="enquiry-location"
                        type="text"
                        autoComplete="address-level2"
                        placeholder="e.g. Salem"
                        aria-invalid={errors.location ? 'true' : 'false'}
                        className={`${inputBaseClass} ${
                          errors.location ? 'border-brand-red' : ''
                        }`}
                        {...register('location')}
                      />
                      {errors.location && (
                        <p role="alert" className="text-brand-red text-sm mt-1.5">
                          {errors.location.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="enquiry-product" className={labelBaseClass}>
                        Interested Product <span className="text-brand-red">*</span>
                      </label>
                      <select
                        id="enquiry-product"
                        aria-invalid={errors.product ? 'true' : 'false'}
                        className={`${inputBaseClass} cursor-pointer ${
                          errors.product ? 'border-brand-red' : ''
                        }`}
                        defaultValue=""
                        {...register('product', {
                          onChange: handleProductChange,
                        })}
                      >
                        <option value="" disabled className="bg-carbon text-warm-gray">
                          Select a category
                        </option>
                        {productDropdownOptions.map((option) => (
                          <option
                            key={option}
                            value={option}
                            className="bg-carbon text-pure-white"
                          >
                            {option}
                          </option>
                        ))}
                      </select>
                      {errors.product && (
                        <p role="alert" className="text-brand-red text-sm mt-1.5">
                          {errors.product.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="enquiry-budget" className={labelBaseClass}>
                        Estimated Budget{' '}
                        <span className="text-warm-gray/60">(Optional)</span>
                      </label>
                      <select
                        id="enquiry-budget"
                        className={`${inputBaseClass} cursor-pointer`}
                        defaultValue=""
                        {...register('budget')}
                      >
                        <option value="" className="bg-carbon text-warm-gray">
                          Select budget range
                        </option>
                        {budgetOptions.map((range) => (
                          <option
                            key={range}
                            value={range}
                            className="bg-carbon text-pure-white"
                          >
                            {range}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="enquiry-message" className={labelBaseClass}>
                        Project Requirement / Message{' '}
                        <span className="text-warm-gray/60">(Optional)</span>
                      </label>
                      <textarea
                        id="enquiry-message"
                        rows={3}
                        placeholder="Tell us about your residence, kitchen layout, timeline, or preferred finishes..."
                        aria-invalid={errors.message ? 'true' : 'false'}
                        className={`${inputBaseClass} resize-none ${
                          errors.message ? 'border-brand-red' : ''
                        }`}
                        {...register('message')}
                      />
                      {errors.message && (
                        <p role="alert" className="text-brand-red text-sm mt-1.5">
                          {errors.message.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Privacy Consent */}
                  <div className="pt-1">
                    <label
                      htmlFor="enquiry-consent"
                      className="flex items-start gap-3 cursor-pointer group"
                    >
                      <input
                        id="enquiry-consent"
                        type="checkbox"
                        aria-invalid={errors.consent ? 'true' : 'false'}
                        className="mt-1 h-4 w-4 shrink-0 accent-brand-red bg-transparent border border-warm-gray/40 cursor-pointer"
                        {...register('consent')}
                      />
                      <span className="text-xs sm:text-sm text-warm-gray leading-relaxed group-hover:text-pure-white/90 transition-colors">
                        I consent to {company.name} contacting me via WhatsApp, phone,
                        or email regarding my architectural &amp; interior enquiry.
                      </span>
                    </label>
                    {errors.consent && (
                      <p role="alert" className="text-brand-red text-sm mt-1.5">
                        {errors.consent.message}
                      </p>
                    )}
                  </div>

                  {submitError && (
                    <div
                      role="alert"
                      className="flex items-start gap-2.5 text-brand-red text-sm border-l-2 border-brand-red pl-3 py-1"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  {duplicateNotice && (
                    <p
                      role="status"
                      className="text-bronze text-sm border-l-2 border-bronze pl-3 py-1"
                    >
                      {duplicateNotice}
                    </p>
                  )}

                  <div className="pt-2">
                    <button
                      ref={magneticSubmit.ref}
                      onMouseMove={magneticSubmit.onMouseMove}
                      onMouseLeave={magneticSubmit.onMouseLeave}
                      type="submit"
                      disabled={isSubmitting}
                      className="magnetic-btn bg-brand-red w-full py-4 px-8 text-pure-white font-body text-xs sm:text-sm uppercase tracking-[0.2em] font-medium flex items-center justify-center gap-3 hover:bg-brand-red/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-300 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Submitting Enquiry...</span>
                        </>
                      ) : (
                        <>
                          <MessageCircle className="w-4 h-4" />
                          <span>Send Enquiry via WhatsApp</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Right 40%: Experience Centre Panel */}
          <div ref={decorWrapRef} className="w-full lg:w-[40%] flex">
            <aside className="relative w-full flex flex-col justify-between overflow-hidden border border-warm-gray/15 p-8 sm:p-10 bg-dark-surface">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'linear-gradient(145deg, rgba(179, 154, 125, 0.18) 0%, rgba(28, 28, 28, 0.92) 45%, rgba(20, 20, 20, 1) 100%)',
                }}
              />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-15"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, rgba(179, 154, 125, 0.25) 1px, transparent 1px), linear-gradient(to bottom, rgba(179, 154, 125, 0.25) 1px, transparent 1px)',
                  backgroundSize: '48px 48px',
                }}
              />

              <div className="relative z-10 space-y-8">
                <div>
                  <img
                    src={company.logos.headerLight}
                    alt={company.name}
                    className="h-9 w-auto object-contain mb-5"
                  />
                  <span className="eyebrow text-bronze block mb-3">
                    {company.parent} Legacy
                  </span>
                  <h3 className="heading-md font-heading text-3xl sm:text-4xl text-pure-white mb-3">
                    Experience Centre, Salem
                  </h3>
                  <p className="body-text text-warm-gray text-sm leading-relaxed">
                    {company.tagline}. Visit our display showroom to experience tactile
                    finishes, European hardware precision, and integrated appliances in
                    person.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {company.about.infrastructure.map((item) => (
                    <span
                      key={item}
                      className="px-3 py-1.5 text-[11px] uppercase tracking-[0.16em] font-body border border-bronze/30 text-bronze bg-carbon/60"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                <div className="h-px w-full bg-warm-gray/20" />

                <div className="space-y-6 text-sm font-body">
                  <div className="flex items-start gap-3.5">
                    <MapPin className="w-4 h-4 text-bronze shrink-0 mt-1" />
                    <div className="space-y-1">
                      <p className="text-xs uppercase tracking-[0.16em] text-warm-gray">
                        Showroom Address
                      </p>
                      <p className="text-pure-white/90 leading-relaxed">
                        {company.contact.address.line1}
                        <br />
                        {company.contact.address.line2}
                        <br />
                        {company.contact.address.line3}
                      </p>
                      <a
                        href={company.contact.googleMaps}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() =>
                          trackEvent(events.SHOWROOM_DIRECTIONS, {
                            source: 'enquiry_panel',
                          })
                        }
                        className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.16em] text-bronze hover:text-pure-white transition-colors pt-1"
                      >
                        <span>Get Directions</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <Phone className="w-4 h-4 text-bronze shrink-0 mt-1" />
                    <div>
                      <p className="text-xs uppercase tracking-[0.16em] text-warm-gray mb-1">
                        Direct Concierge
                      </p>
                      <a
                        href={`tel:+${company.contact.phoneClean}`}
                        onClick={() =>
                          trackEvent(events.PHONE_CLICK, {
                            source: 'enquiry_panel',
                          })
                        }
                        className="text-pure-white hover:text-bronze transition-colors text-base font-medium"
                      >
                        {company.contact.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <Mail className="w-4 h-4 text-bronze shrink-0 mt-1" />
                    <div>
                      <p className="text-xs uppercase tracking-[0.16em] text-warm-gray mb-1">
                        Email
                      </p>
                      <a
                        href={`mailto:${company.contact.email}`}
                        className="text-pure-white/90 hover:text-bronze transition-colors break-all"
                      >
                        {company.contact.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <Clock className="w-4 h-4 text-bronze shrink-0 mt-1" />
                    <div>
                      <p className="text-xs uppercase tracking-[0.16em] text-warm-gray mb-1">
                        Showroom Hours
                      </p>
                      <p className="text-pure-white/90">
                        {company.contact.hours.weekdays}
                      </p>
                      <p className="text-warm-gray text-xs mt-0.5">
                        {company.contact.hours.weekend}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative z-10 mt-10 pt-6 border-t border-warm-gray/20 space-y-4">
                <a
                  href={WHATSAPP_CHAT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackEvent(events.WHATSAPP_CLICK, {
                      source: 'enquiry_panel_direct',
                    })
                  }
                  className="flex items-center justify-between w-full px-5 py-3.5 border border-warm-gray/25 hover:border-bronze text-pure-white transition-colors duration-300 group"
                >
                  <span className="flex items-center gap-2.5 text-xs uppercase tracking-[0.18em]">
                    <MessageCircle className="w-4 h-4 text-bronze" />
                    <span>Direct WhatsApp Chat</span>
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-warm-gray group-hover:text-bronze transition-colors" />
                </a>

                <div className="flex items-center gap-2 text-xs text-warm-gray">
                  <ShieldCheck className="w-4 h-4 text-bronze shrink-0" />
                  <span>
                    Personalized consultation &amp; site measurement in Salem &amp; region
                  </span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}

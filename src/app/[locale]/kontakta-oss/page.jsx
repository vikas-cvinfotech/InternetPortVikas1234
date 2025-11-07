'use client';
import { useState, lazy, Suspense } from 'react';
import { useTranslations } from 'next-intl';

// Lazy load icons to reduce initial bundle size
const BuildingOffice2Icon = lazy(() =>
  import('@heroicons/react/24/outline').then((module) => ({ default: module.BuildingOffice2Icon }))
);
const EnvelopeIcon = lazy(() =>
  import('@heroicons/react/24/outline').then((module) => ({ default: module.EnvelopeIcon }))
);
const PhoneIcon = lazy(() =>
  import('@heroicons/react/24/outline').then((module) => ({ default: module.PhoneIcon }))
);

export default function ContactUsPage() {
  const t = useTranslations('contactUs');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const validate = () => {
    let newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = t('firstNameRequired');
    if (!formData.lastName.trim()) newErrors.lastName = t('lastNameRequired');
    if (!formData.email.trim()) newErrors.email = t('emailRequired');
    if (formData.message.trim().length === 0) newErrors.message = t('messageRequired');
    if (formData.message.length > 500) newErrors.message = t('messageTooLong');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    if (formSubmitted) return;
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await fetch('/api/hostbill/add-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          message: formData.message,
          dept_id: 13,
          subject: 'Meddelande via kontaktformulär',
          transformedBody: `
${formData.message}

Name: ${formData.firstName} ${formData.lastName},
Email: ${formData.email},
Tel: ${formData.phoneNumber || ''}
          `,
        }),
      });

      const data = await response.json();
      if (data.success === true && data.statusCode === 200) {
        setFormSubmitted(true);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          message: '',
        });
      } else {
        setFormError(t('formError'));
      }
    } catch (error) {
      setFormError(t('formError'));
    }
  };

  return (
    <div className="relative isolate bg-primary">
      <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-2">
        <div className="relative px-6 pt-24 pb-20 sm:pt-32 lg:static lg:px-8 lg:py-48">
          <div className="mx-auto max-w-xl lg:mx-0 lg:max-w-lg">
            <h2 className="text-4xl font-semibold tracking-tight text-secondary sm:text-5xl">
              {t('title')}
            </h2>
            <p className="mt-6 text-lg text-secondary">{t('description')}</p>
            <dl className="mt-10 space-y-4 text-base text-secondary">
              <div className="flex gap-x-4">
                <dt className="flex-none">
                  <Suspense
                    fallback={<div className="h-7 w-6 bg-secondary/10 rounded animate-pulse" />}
                  >
                    <BuildingOffice2Icon className="h-7 w-6 text-secondary/75" />
                  </Suspense>
                </dt>
                <dd>
                  {t('addressLine1')}
                  <br />
                  {t('addressLine2')}
                </dd>
              </div>
              <div className="flex gap-x-4">
                <dt className="flex-none">
                  <Suspense
                    fallback={<div className="h-7 w-6 bg-secondary/10 rounded animate-pulse" />}
                  >
                    <PhoneIcon className="h-7 w-6 text-secondary/75" />
                  </Suspense>
                </dt>
                <dd>
                  <a href="tel:+46 (0)650-40 20 00" className="hover:text-accent">
                    {t('phone')}
                  </a>
                </dd>
              </div>
              <div className="flex gap-x-4">
                <dt className="flex-none">
                  <Suspense
                    fallback={<div className="h-7 w-6 bg-secondary/10 rounded animate-pulse" />}
                  >
                    <EnvelopeIcon className="h-7 w-6 text-secondary/75" />
                  </Suspense>
                </dt>
                <dd>
                  <a href="mailto:support@internetport.se" className="hover:text-accent">
                    {t('supportEmail')}
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="px-6 pt-20 pb-24 sm:pb-32 lg:px-8 lg:py-48">
          <div className="mx-auto max-w-xl lg:mr-0 lg:max-w-lg">
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
              {['firstName', 'lastName', 'email', 'phoneNumber', 'message'].map((field) => (
                <div key={field} className={field === 'message' ? 'sm:col-span-2' : ''}>
                  <label htmlFor={field} className="block text-sm font-semibold text-secondary">
                    {t(field)}
                  </label>
                  <div className="mt-2.5">
                    {field === 'message' ? (
                      <textarea
                        id={field}
                        name={field}
                        rows={4}
                        maxLength={500}
                        value={formData[field]}
                        onChange={handleChange}
                        disabled={formSubmitted}
                        className="block w-full rounded-md border border-divider bg-primary px-3.5 py-2 text-base text-secondary placeholder:text-secondary/75"
                      />
                    ) : (
                      <input
                        id={field}
                        name={field}
                        type={
                          field === 'email' ? 'email' : field === 'phoneNumber' ? 'tel' : 'text'
                        }
                        autoComplete={field}
                        value={formData[field]}
                        onChange={handleChange}
                        disabled={formSubmitted}
                        className="block w-full rounded-md border border-divider bg-primary px-3.5 py-2 text-base text-secondary placeholder:text-secondary/75"
                      />
                    )}
                  </div>
                  {errors[field] && <p className="mt-1 text-sm text-accent">{errors[field]}</p>}
                </div>
              ))}
            </div>
            <div className="mt-8 flex justify-end">
              {formSubmitted && <div className="mr-4 mt-2 text-success">{t('successMessage')}</div>}
              {formError && <div className="mr-4 mt-2 text-failure">{formError}</div>}
              <button
                type="submit"
                disabled={formSubmitted}
                className="rounded-md bg-accent px-3.5 py-2.5 text-sm font-semibold text-primary shadow-xs hover:opacity-75"
              >
                {t('sendMessage')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

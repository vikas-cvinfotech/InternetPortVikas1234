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

export default function ContactForm() {
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
    <div className="relative">
      <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-1">
        <form onSubmit={handleSubmit}>
          <div className="mx-auto max-w-4xl bg-primary p-8 rounded-lg border border-borderGray">
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
              {['name', 'email', 'telephone', 'message'].map((field) => (
                <div
                  key={field}
                  className={field === 'message' || field === 'telephone' ? 'sm:col-span-2' : ''}
                >
                  <label htmlFor={field} className="block text-base font-medium text-paraSecondary">
                    {t(field)}
                  </label>
                  <div className="mt-2.5">
                    {field === 'message' ? (
                      <textarea
                        id={field}
                        name={field}
                        rows={8}
                        maxLength={500}
                        value={formData[field]}
                        onChange={handleChange}
                        disabled={formSubmitted}
                        placeholder={t(`${field}Placeholder`)}
                        className="block w-full rounded-md border border-divider bg-surfaceSecondary p-4 text-base text-secondary placeholder:text-mediumGray"
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
                        placeholder={t(`${field}Placeholder`)}
                        className="block w-full rounded-md border border-divider bg-surfaceSecondary p-4 text-base text-secondary placeholder:text-mediumGray"
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
                className="rounded-[4px] bg-accent w-full p-4 text-base font-semibold text-primary shadow-xs hover:opacity-75"
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

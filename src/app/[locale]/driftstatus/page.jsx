'use client';

import React from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useStatusData } from '@/hooks/useStatusData';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  WrenchScrewdriverIcon,
  CogIcon,
  MagnifyingGlassIcon,
  WrenchIcon,
} from '@heroicons/react/24/solid';

const componentStatusStyles = {
  1: {
    icon: CheckCircleIcon,
    iconColor: 'text-success',
    textColor: 'text-success-dark',
    bgColor: 'bg-success-light',
  },
  2: {
    icon: InformationCircleIcon,
    iconColor: 'text-warning',
    textColor: 'text-warning-dark',
    bgColor: 'bg-warning-light',
  },
  3: {
    icon: ExclamationTriangleIcon,
    iconColor: 'text-warning',
    textColor: 'text-warning-dark',
    bgColor: 'bg-warning-light',
  },
  4: {
    icon: WrenchScrewdriverIcon,
    iconColor: 'text-failure',
    textColor: 'text-failure-dark',
    bgColor: 'bg-failure-light',
  },
};

const incidentStatusConfig = {
  0: { icon: CogIcon, color: 'text-info', ring: 'ring-info/20', bgColor: 'bg-info-light' },
  1: {
    icon: MagnifyingGlassIcon,
    color: 'text-info',
    ring: 'ring-info/20',
    bgColor: 'bg-info-light',
  },
  2: { icon: WrenchIcon, color: 'text-info', ring: 'ring-info/20', bgColor: 'bg-info-light' },
  3: { icon: WrenchIcon, color: 'text-info', ring: 'ring-info/20', bgColor: 'bg-info-light' },
  4: {
    icon: CheckCircleIcon,
    color: 'text-success',
    ring: 'ring-success/20',
    bgColor: 'bg-success-light',
  },
};

const LoadingState = ({ t }) => (
  <div className="flex flex-col justify-center items-center py-20">
    <div className="h-12 w-12 animate-spin text-accent">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
          className="opacity-25"
        ></circle>
        <path
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          className="opacity-75"
        ></path>
      </svg>
    </div>
    <span className="ml-4 mt-4 text-lg font-medium text-secondary">{t('loading')}</span>
  </div>
);

const ErrorState = ({ error, t }) => (
  <div className="text-center py-20 text-failure-dark bg-failure-light rounded-lg border border-divider">
    <p className="text-xl font-semibold">{t('errorTitle')}</p>
    <p className="mt-2 text-secondary/80">{t('errorSubtitle')}</p>
    <pre className="mt-4 text-xs text-secondary/60 bg-secondary/5 p-2 rounded-md">
      {error?.message}
    </pre>
  </div>
);

const ComponentStatusList = ({ components, t }) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {components.map((component) => {
      const {
        icon: Icon,
        iconColor,
        textColor,
        bgColor,
      } = componentStatusStyles[component.status] || componentStatusStyles[1];
      return (
        <div
          key={component.id}
          className={`flex items-center justify-between rounded-lg p-4 border border-divider ${bgColor}`}
        >
          <p className="font-medium text-secondary">{component.name}</p>
          <div className="inline-flex items-center gap-x-2 text-sm font-semibold">
            <Icon className={`h-5 w-5 ${iconColor}`} aria-hidden="true" />
            <span className={textColor}>{t(component.statusTitleKey)}</span>
            <span className="sr-only">{t(component.statusTitleKey)}</span>
          </div>
        </div>
      );
    })}
  </div>
);

const IncidentCard = ({ incident, isLast, t }) => {
  const sanitizedHtml =
    typeof window !== 'undefined'
      ? DOMPurify.sanitize(marked.parse(incident.message))
      : incident.message;
  const config = incidentStatusConfig[incident.status] || incidentStatusConfig[1];
  const Icon = config.icon;

  return (
    <li>
      <div className="relative pb-8">
        {!isLast && (
          <span
            className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-divider"
            aria-hidden="true"
          />
        )}
        <div className="relative flex space-x-3">
          <span
            className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-primary ${config.ring} ${config.bgColor} flex-shrink-0`}
          >
            <Icon className={`h-5 w-5 ${config.color}`} aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1 pt-1.5">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-sm text-secondary/80 break-words">
                  <span className="font-bold text-secondary">
                    {incident.component_name || t('generalInfo')}
                  </span>{' '}
                  - {incident.name}
                </p>
                <div
                  className="mt-2 text-sm text-secondary/80 prose prose-sm max-w-full overflow-hidden prose-p:my-1 prose-ul:my-1 [&>*]:break-words"
                  dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
                />
              </div>
              <div className="text-left sm:text-right text-sm text-secondary/60 flex-shrink-0">
                <time dateTime={incident.created_at}>{incident.formatted_created_at}</time>
              </div>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

const IncidentList = ({ incidents, onLoadMore, isLastPage, isLoadingMore, t, commonT }) => (
  <div className="space-y-8">
    <div className="flow-root">
      <ul role="list" className="-mb-8">
        {incidents.map((incident, idx) => (
          <IncidentCard
            key={incident.id}
            incident={incident}
            isLast={idx === incidents.length - 1}
            t={t}
          />
        ))}
      </ul>
    </div>
    {!isLastPage && (
      <div className="mt-8 text-center">
        <button
          type="button"
          onClick={onLoadMore}
          disabled={isLoadingMore}
          className="rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-primary shadow-sm hover:bg-accent/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:bg-secondary/20 disabled:cursor-not-allowed disabled:text-secondary/50 transition-colors"
        >
          {isLoadingMore ? commonT('loadingMore') : t('loadMore')}
        </button>
      </div>
    )}
  </div>
);

export default function OperationalStatusPage() {
  const t = useTranslations('operationalStatus');
  const commonT = useTranslations('common');
  const locale = useLocale();
  const { components, incidents, error, isLoading, fetchNextPage, isLastPage, isLoadingMore } =
    useStatusData({ locale });

  if (isLoading)
    return (
      <main className="bg-primary min-h-screen">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <LoadingState t={t} />
        </div>
      </main>
    );
  if (error)
    return (
      <main className="bg-primary min-h-screen">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <ErrorState error={error} t={t} />
        </div>
      </main>
    );

  const hasOngoingIssues = components.some((c) => c.status !== 1);

  return (
    <main className="bg-primary min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="space-y-16">
          <header className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-secondary sm:text-5xl">
              {t('title')}
            </h1>
            <p className="mt-4 text-lg text-secondary/80">{t('subtitle')}</p>
            <div
              className={`mt-6 inline-flex items-center gap-x-2 rounded-md px-3 py-2 text-sm font-medium ${hasOngoingIssues ? 'bg-failure-light' : 'bg-success-light'}`}
            >
              <div
                className={`h-2.5 w-2.5 rounded-full ${hasOngoingIssues ? 'bg-failure' : 'bg-success'}`}
              />
              <span className={hasOngoingIssues ? 'text-failure-dark' : 'text-success-dark'}>
                {hasOngoingIssues ? t('someSystemsDown') : t('allSystemsUp')}
              </span>
            </div>
          </header>

          <section>
            <h2 className="text-2xl font-bold text-secondary mb-6">{t('fiberNetworkStatus')}</h2>
            <ComponentStatusList components={components} t={t} />
          </section>

          <section>
            <h2 className="text-2xl font-bold text-secondary mb-6">{t('incidentHistory')}</h2>
            {incidents.length > 0 ? (
              <IncidentList
                incidents={incidents}
                onLoadMore={fetchNextPage}
                isLastPage={isLastPage}
                isLoadingMore={isLoadingMore}
                t={t}
                commonT={commonT}
              />
            ) : (
              <div className="text-center py-10 text-secondary/80 border-2 border-dashed border-divider rounded-lg flex flex-col items-center">
                <InformationCircleIcon className="w-10 h-10 text-secondary/50" />
                <p className="mt-4 font-medium">{t('noIncidents')}</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

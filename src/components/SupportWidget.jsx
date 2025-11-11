'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useKnowledgeBase } from '@/hooks/useKnowledgeBase';
import { useDevice } from '@/hooks/useDevice';
import ArticleContent from './ArticleContent';
import {
  XMarkIcon,
  HomeIcon,
  ChatBubbleOvalLeftIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  WifiIcon,
  PhoneIcon,
  TvIcon,
  ServerIcon,
  QuestionMarkCircleIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  CreditCardIcon,
  ComputerDesktopIcon,
  CommandLineIcon,
  CircleStackIcon,
  BuildingStorefrontIcon,
  WrenchScrewdriverIcon,
  ServerStackIcon,
  LockClosedIcon,
  WindowIcon,
  EnvelopeIcon,
  LifebuoyIcon,
  PencilIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';

const categoryIcons = {
  'Virtuell Privat Server': LockClosedIcon,
  Windows: WindowIcon,
  Hosting: ServerIcon,
  'Dedikerad Server': ServerStackIcon,
  Linux: CommandLineIcon,
  Databas: CircleStackIcon,
  Webbhotellhanterare: WrenchScrewdriverIcon,
  Plesk: BuildingStorefrontIcon,
  cPanel: TvIcon,
  Ekonomi: CreditCardIcon,
  Fritidshusabonnemang: HomeIcon,
  'Domännamnsystemet (DNS)': GlobeAltIcon,
  'Cloud Desktop': ComputerDesktopIcon,
  Bredband: WifiIcon,
  'IP-telefoni': PhoneIcon,
  default: QuestionMarkCircleIcon,
};

// Reusable Header Component.
function WidgetHeader({
  title,
  showSearch,
  searchText,
  onSearchChange,
  onClose,
  searchPlaceholder,
  commonT,
}) {
  return (
    <div className="w-full bg-accent p-4 flex flex-col justify-between shrink-0">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-primary">{title}</h1>
        <div className="flex items-center gap-x-4">
          <button onClick={onClose} className="text-primary md:hidden">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
      {showSearch && (
        <div className="mt-4">
          <div className="relative">
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchText}
              onChange={onSearchChange}
              className="w-full h-12 pl-4 pr-12 rounded-lg border border-divider placeholder-secondary/50 focus:ring-2 focus:ring-accent focus:outline-none"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {searchText ? (
                <button
                  onClick={() => onSearchChange({ target: { value: '' } })}
                  className="text-secondary/70"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              ) : (
                <MagnifyingGlassIcon className="w-6 h-6 text-accent" />
              )}
            </div>
          </div>
          {searchText && searchText.trim().length > 0 && searchText.trim().length < 3 && (
            <p className="mt-2 text-sm text-primary/80">
              {commonT('typeMin3Chars')}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// Main Widget Component.
export default function SupportWidget() {
  const t = useTranslations('supportWidget');
  const commonT = useTranslations('common');
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [searchText, setSearchText] = useState('');
  const [view, setView] = useState('home');
  const [history, setHistory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [popularArticles, setPopularArticles] = useState([]);
  const [latestArticles, setLatestArticles] = useState([]);
  const [feedbackText, setFeedbackText] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [feedbackStatus, setFeedbackStatus] = useState('idle');
  const [chatStatus, setChatStatus] = useState(null);
  const [isTawkReady, setIsTawkReady] = useState(false);
  const widgetRef = useRef(null);
  const { isMobile } = useDevice();
  const locale = useLocale();
  const loadedLocaleRef = useRef(null);
  const tawkLoadingRef = useRef(false);

  // Get language key from environment variables
  const getLangKey = (currentLocale) => {
    switch (currentLocale) {
      case 'sv':
        return process.env.NEXT_PUBLIC_HOSTBILL_LANG_KEY_SV || '9';
      case 'en':
        return process.env.NEXT_PUBLIC_HOSTBILL_LANG_KEY_EN || '2';
      default:
        return process.env.NEXT_PUBLIC_HOSTBILL_LANG_KEY_SV || '9'; // Default to Swedish
    }
  };

  const langKey = getLangKey(locale);

  const cleanupTawk = useCallback(() => {
    const scripts = document.querySelectorAll('script[src*="embed.tawk.to"]');
    scripts.forEach((s) => s.parentElement?.removeChild(s));

    const widgetContainers = document.querySelectorAll('.tawk-widget-container');
    widgetContainers.forEach((container) => container.parentElement?.removeChild(container));

    const tawkIframes = document.querySelectorAll('iframe[src*="tawk.to"]');
    tawkIframes.forEach((iframe) => {
      let root = iframe;
      while (root.parentElement && root.parentElement !== document.body) {
        root = root.parentElement;
      }
      root.parentElement?.removeChild(root);
    });

    if (window.Tawk_API) {
      if (typeof window.Tawk_API.shutdown === 'function') {
        window.Tawk_API.shutdown();
      }
      delete window.Tawk_API;
    }
    Object.keys(window)
      .filter((key) => key.toLowerCase().startsWith('tawk_'))
      .forEach((key) => {
        try {
          delete window[key];
        } catch (e) {
          // Can fail on some locked properties, ignore.
        }
      });

    loadedLocaleRef.current = null;
    setIsTawkReady(false);
    setChatStatus(null);
  }, []);

  const loadTawkScript = useCallback(() => {
    if (tawkLoadingRef.current) {
      return;
    }
    if (
      loadedLocaleRef.current === locale &&
      window.Tawk_API &&
      typeof window.Tawk_API.maximize === 'function'
    ) {
      if (window.Tawk_API.getStatus) {
        setChatStatus(window.Tawk_API.getStatus());
      }
      setIsTawkReady(true);
      return;
    }

    cleanupTawk();
    tawkLoadingRef.current = true;

    setTimeout(() => {
      const getChatId = () => {
        const propertyId = process.env.NEXT_PUBLIC_TAWK_TO_PROPERTY_ID;
        if (!propertyId) return null;

        let widgetId;
        switch (locale) {
          case 'sv':
            widgetId = process.env.NEXT_PUBLIC_TAWK_TO_WIDGET_ID_SV;
            break;
          case 'en':
            widgetId = process.env.NEXT_PUBLIC_TAWK_TO_WIDGET_ID_EN;
            break;
          default:
            widgetId = process.env.NEXT_PUBLIC_TAWK_TO_WIDGET_ID;
            break;
        }

        if (!widgetId) {
          widgetId = process.env.NEXT_PUBLIC_TAWK_TO_WIDGET_ID;
        }

        return widgetId ? `${propertyId}/${widgetId}` : null;
      };

      const chatId = getChatId();
      if (!chatId) {
        tawkLoadingRef.current = false;
        setChatStatus('offline');
        setIsTawkReady(true); // Set to true so button isn't stuck loading
        return;
      }

      loadedLocaleRef.current = locale;

      window.Tawk_API = window.Tawk_API || {};

      // Ensure all critical functions exist before script loads to prevent $el errors
      window.Tawk_API.hideWidget = window.Tawk_API.hideWidget || (() => {});
      window.Tawk_API.showWidget = window.Tawk_API.showWidget || (() => {});
      window.Tawk_API.maximize = window.Tawk_API.maximize || (() => {});
      window.Tawk_API.getStatus = window.Tawk_API.getStatus || (() => 'offline');
      
      window.Tawk_API.onLoad = () => {
        try {
          // Immediately hide the widget to prevent flash
          if (window.Tawk_API && typeof window.Tawk_API.hideWidget === 'function') {
            window.Tawk_API.hideWidget();
          }

          // If user has accepted our cookie banner, start Tawk connection
          // This bypasses Tawk's own GDPR check since we handle consent
          const cookieConsent = localStorage.getItem('cookie_consent');
          if (cookieConsent && window.Tawk_API.start) {
            window.Tawk_API.start();
          }

          // Set ready state
          setIsTawkReady(true);
          tawkLoadingRef.current = false;

          // Handle status
          if (window.Tawk_API && typeof window.Tawk_API.getStatus === 'function') {
            const status = window.Tawk_API.getStatus();
            setChatStatus(status);
          }

          // Setup status change listener
          if (window.Tawk_API && window.Tawk_API.onStatusChange) {
            window.Tawk_API.onStatusChange = (status) => {
              setChatStatus(status);
            };
          }
        } catch (error) {
          console.error('Tawk.to onLoad error:', error);
          // Fallback to ensure widget is functional
          setIsTawkReady(true);
          tawkLoadingRef.current = false;
          setChatStatus('offline');
        }
      };
      window.Tawk_API.onChatMaximized = () => {
        setIsOpen(false);
      };
      window.Tawk_LoadStart = new Date();

      const script = document.createElement('script');
      script.async = true;
      script.src = `https://embed.tawk.to/${chatId}`;
      script.charset = 'UTF-8';
      script.setAttribute('crossorigin', '*');
      script.onerror = () => {
        tawkLoadingRef.current = false;
        setChatStatus('offline');
        setIsTawkReady(false);
      };
      
      // Add timeout fallback in case onLoad never fires
      setTimeout(() => {
        if (tawkLoadingRef.current) {
          tawkLoadingRef.current = false;
          setChatStatus('offline');
          setIsTawkReady(true); // Set to true so button isn't stuck loading
        }
      }, 10000); // 10 second timeout

      const firstScript = document.getElementsByTagName('script')[0];
      if (firstScript && firstScript.parentNode) {
        firstScript.parentNode.insertBefore(script, firstScript);
      } else {
        document.head.appendChild(script);
      }
    }, 100);
  }, [locale, cleanupTawk]);

  const handleStartChat = () => {
    if (isTawkReady && window.Tawk_API && typeof window.Tawk_API.maximize === 'function') {
      // Show the widget first, then maximize
      if (window.Tawk_API.showWidget) {
        window.Tawk_API.showWidget();
      }
      window.Tawk_API.maximize();
    } else {
      // Load Tawk script and then maximize when ready
      loadTawkScript();

      // Wait for Tawk to be ready and then maximize
      const checkAndMaximize = () => {
        if (window.Tawk_API && typeof window.Tawk_API.maximize === 'function') {
          window.Tawk_API.maximize();
        } else {
          setTimeout(checkAndMaximize, 100);
        }
      };
      setTimeout(checkAndMaximize, 500);
    }
  };

  // Auto-load Tawk script when widget opens - status will be ready when user clicks Chat tab
  useEffect(() => {
    if (isOpen) {
      loadTawkScript();
    }
  }, [isOpen, loadTawkScript]);

  useEffect(() => {
    return () => cleanupTawk();
  }, [cleanupTawk]);

  const { categories, loading: kbLoading } = useKnowledgeBase();

  const resetFeedbackForm = useCallback(() => {
    setFeedbackStatus('idle');
    setFirstName('');
    setLastName('');
    setEmail('');
    setFeedbackText('');
    setFormErrors({});
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      const allArticles = categories.flatMap((cat) => cat.articles);
      const sortedByViews = [...allArticles].sort(
        (a, b) => parseInt(b.views, 10) - parseInt(a.views, 10)
      );
      const sortedByDate = [...allArticles].sort((a, b) => parseInt(b.id, 10) - parseInt(a.id, 10));
      setPopularArticles(sortedByViews);
      setLatestArticles(sortedByDate);
    }
  }, [categories]);

  useEffect(() => {
    if (activeTab !== 'feedback' && feedbackStatus === 'success') {
      resetFeedbackForm();
    }
  }, [activeTab, feedbackStatus, resetFeedbackForm]);

  const changeView = (newView) => {
    const currentView = searchText ? 'search' : view;
    setHistory([...history, currentView]);
    setView(newView);
  };

  const goBack = () => {
    const previousView = history[history.length - 1];
    setHistory(history.slice(0, -1));
    setView(previousView);
  };

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    setView(tab);
    setHistory([]);
    setSelectedCategory(null);
    setSelectedArticle(null);
    setSearchText('');
  };

  const handleSearchChange = (e) => {
    const sanitized = e.target.value.replace(/[^a-zA-Z0-9\s]/g, '');
    setSearchText(sanitized);
    if (sanitized.trim().length >= 3) {
      setView('search');
      setHistory([]);
    } else if (sanitized.trim().length === 0) {
      setView(activeTab);
    }
    // Don't change view for 1-2 characters, stay on current view
  };

  const handleSendFeedback = async () => {
    setFormErrors({});
    const errors = {};
    if (!firstName.trim()) errors.firstName = t('feedback.firstNameRequired');
    if (!lastName.trim()) errors.lastName = t('feedback.lastNameRequired');
    if (!email.trim()) {
      errors.email = t('feedback.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = t('feedback.emailInvalid');
    }
    if (!feedbackText.trim()) errors.message = t('feedback.messageRequired');

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFeedbackStatus('submitting');
    try {
      const response = await fetch('/api/internal/hostbill/add-ticket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          message: feedbackText,
          subject: t('feedback.subject'),
          dept_id: process.env.NEXT_PUBLIC_HOSTBILL_FEEDBACK_DEPARTMENT_ID,
        }),
      });

      if (!response.ok) {
        throw new Error(t('feedback.sendError'));
      }

      setFeedbackStatus('success');
    } catch (error) {
      console.error('Feedback submission error:', error);
      setFormErrors({ api: t('feedback.sendErrorApi') });
      setFeedbackStatus('idle');
    }
  };

  const filteredArticles = useMemo(() => {
    if (!searchText) return [];
    const searchLower = searchText.toLowerCase();
    
    return categories
      .map((category) => ({
        ...category,
        articles: category.articles.filter((article) => {
          const titleToSearch = article.tag_title?.[langKey] ?? article.title;
          return titleToSearch?.toLowerCase().includes(searchLower);
        }),
      }))
      .filter((category) => category.articles.length > 0);
  }, [searchText, categories, langKey]);

  const renderBackButton = () => (
    <button onClick={goBack} className="text-accent font-semibold mb-2 flex items-center">
      <ChevronLeftIcon className="w-5 h-5" />
      {t('backButton')}
    </button>
  );

  const renderArticleList = (articles) => {
    return articles.map((article) => {
      return (
        <div key={article.id} className="py-2 border-b border-divider">
          <button
            onClick={() => {
              setSelectedArticle(article.id);
              changeView('article');
            }}
            className="font-semibold text-accent text-left w-full flex items-center gap-x-4"
          >
            <DocumentTextIcon className="h-6 w-6 text-secondary/50" />
            <span className="flex-1">{article.tag_title?.[langKey] ?? article.title}</span>
            <ChevronRightIcon className="h-5 w-5 text-secondary/30" />
          </button>
        </div>
      );
    });
  };

  const renderContent = () => {
    const itemsToShow = isMobile ? 5 : 3;

    if (view === 'chat') {
      const isOffline = chatStatus === 'offline';
      const isLoading = chatStatus === null; // Status not loaded yet
      // Disable button if: loading, offline, or Tawk not ready
      const isButtonDisabled = isLoading || (isOffline && isTawkReady) || !isTawkReady;

      return (
        <div className="p-4 text-center">
          <h3 className="text-lg font-semibold text-secondary">{t('chat.title')}</h3>
          <p className="text-sm text-secondary/70 my-4">
            {isLoading
              ? t('chat.checkingStatus')
              : isOffline
              ? t('chat.offlineMessage')
              : t('chat.onlineMessage')}
          </p>
          <button
            onClick={handleStartChat}
            disabled={isButtonDisabled}
            className="w-full bg-accent text-primary font-bold py-2 px-4 rounded-md hover:bg-accent/90 disabled:bg-secondary/30 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <LoadingSpinner />
                <span className="ml-2">{t('chat.checkingStatus')}</span>
              </>
            ) : isOffline && isTawkReady ? (
              t('chat.chatOffline')
            ) : (
              t('chat.startChat')
            )}
          </button>
        </div>
      );
    }

    if (view === 'feedback') {
      if (feedbackStatus === 'success') {
        return (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
            <h2 className="text-2xl font-semibold text-success">{t('feedback.thankYou')}</h2>
            <p className="text-secondary/80 mt-2 mb-6">{t('feedback.successMessage')}</p>
            <button
              onClick={resetFeedbackForm}
              className="w-full bg-accent text-primary font-bold py-2 px-4 rounded-md hover:bg-accent/90"
            >
              {t('feedback.sendAnother')}
            </button>
          </div>
        );
      }

      return (
        <div className="w-full h-full flex flex-col">
          <div className="p-4 flex-grow overflow-y-auto">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="firstName" className="sr-only">
                  {t('feedback.firstName')}
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder={t('feedback.firstName')}
                  className={`w-full p-2 border rounded-md bg-primary text-secondary placeholder-secondary/50 focus:ring-2 focus:outline-none ${
                    formErrors.firstName
                      ? 'border-failure focus:ring-failure'
                      : 'border-divider focus:ring-accent'
                  }`}
                />
                {formErrors.firstName && (
                  <p className="text-failure-dark text-xs mt-1">{formErrors.firstName}</p>
                )}
              </div>
              <div>
                <label htmlFor="lastName" className="sr-only">
                  {t('feedback.lastName')}
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder={t('feedback.lastName')}
                  className={`w-full p-2 border rounded-md bg-primary text-secondary placeholder-secondary/50 focus:ring-2 focus:outline-none ${
                    formErrors.lastName
                      ? 'border-failure focus:ring-failure'
                      : 'border-divider focus:ring-accent'
                  }`}
                />
                {formErrors.lastName && (
                  <p className="text-failure-dark text-xs mt-1">{formErrors.lastName}</p>
                )}
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="sr-only">
                {t('feedback.email')}
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('feedback.email')}
                className={`w-full p-2 border rounded-md bg-primary text-secondary placeholder-secondary/50 focus:ring-2 focus:outline-none ${
                  formErrors.email
                    ? 'border-failure focus:ring-failure'
                    : 'border-divider focus:ring-accent'
                }`}
              />
              {formErrors.email && (
                <p className="text-failure-dark text-xs mt-1">{formErrors.email}</p>
              )}
            </div>
            <label htmlFor="feedback-textarea" className="sr-only">
              {t('feedback.problemDescription')}
            </label>
            <textarea
              id="feedback-textarea"
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder={t('feedback.problemDescription')}
              className={`w-full h-32 p-2 border rounded-md bg-primary text-secondary placeholder-secondary/50 focus:ring-2 focus:outline-none ${
                formErrors.message
                  ? 'border-failure focus:ring-failure'
                  : 'border-divider focus:ring-accent'
              }`}
            />
            {formErrors.message && (
              <p className="text-failure-dark text-xs mt-1">{formErrors.message}</p>
            )}
            {formErrors.api && (
              <p className="text-failure-dark text-sm mt-4 text-center">{formErrors.api}</p>
            )}
          </div>
          <div className="p-4 flex-shrink-0">
            <button
              onClick={handleSendFeedback}
              disabled={feedbackStatus === 'submitting'}
              className="w-full bg-accent text-primary font-bold py-2 px-4 rounded-md hover:bg-accent/90 disabled:bg-secondary/30 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {feedbackStatus === 'submitting' ? <LoadingSpinner /> : t('feedback.sendButton')}
            </button>
          </div>
        </div>
      );
    }

    if (view === 'search') {
      return (
        <div className="p-4 overflow-y-auto h-full">
          {renderBackButton()}
          <h2 className="text-secondary font-semibold">{t('search.title')}</h2>
          {filteredArticles.length > 0 ? (
            filteredArticles.map((category) => (
              <div key={category.id} className="mt-2">
                <h3 className="font-bold text-lg text-secondary">{category.name}</h3>
                {renderArticleList(category.articles)}
              </div>
            ))
          ) : (
            <p className="text-secondary/70 mt-4">{t('search.noArticles', { searchText })}</p>
          )}
        </div>
      );
    }

    if (view === 'get-in-touch') {
      return (
        <div className="p-4">
          <div className="mt-4 space-y-2">
            <button
              onClick={() => handleNavClick('chat')}
              className="w-full text-left p-3 bg-primary border border-divider rounded-lg flex items-center gap-x-4 hover:bg-secondary/5 transition-colors"
            >
              <ChatBubbleOvalLeftIcon className="h-6 w-6 text-accent" />
              <div>
                <p className="font-semibold text-secondary">{t('contact.startChat')}</p>
                <p className="text-sm text-secondary/70">{t('contact.chatHours')}</p>
              </div>
            </button>
            <a
              href="mailto:support@internetport.se"
              className="w-full text-left p-3 bg-primary border border-divider rounded-lg flex items-center gap-x-4 hover:bg-secondary/5 transition-colors"
            >
              <EnvelopeIcon className="h-6 w-6 text-accent" />
              <div>
                <p className="font-semibold text-secondary">{t('contact.sendEmail')}</p>
                <p className="text-sm text-secondary/70">{t('contact.emailHours')}</p>
                <p className="text-sm text-accent font-medium">support@internetport.se</p>
              </div>
            </a>
            <a
              href="tel:+46650402000"
              className="w-full text-left p-3 bg-primary border border-divider rounded-lg flex items-center gap-x-4 hover:bg-secondary/5 transition-colors"
            >
              <PhoneIcon className="h-6 w-6 text-accent" />
              <div>
                <p className="font-semibold text-secondary">{t('contact.callUs')}</p>
                <p className="text-sm text-secondary/70">{t('contact.phoneHours')}</p>
                <p className="text-sm text-accent font-medium">0650-40 20 00</p>
              </div>
            </a>
            <div className="w-full text-left p-3 bg-primary border border-divider rounded-lg flex items-center gap-x-4">
              <InformationCircleIcon className="h-6 w-6 text-accent" />
              <div>
                <p className="text-sm text-secondary/70">{t('contact.lunchBreak')}</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (view === 'article') {
      return (
        <div className="p-4 overflow-y-auto h-full">
          {renderBackButton()}
          <ArticleContent articleId={selectedArticle} locale={locale} />
        </div>
      );
    }

    if (view === 'category') {
      const category = categories.find((c) => c.id === selectedCategory);
      return (
        <div className="p-4 overflow-y-auto h-full">
          {renderBackButton()}
          <h2 className="text-secondary font-semibold text-lg">{category?.name}</h2>
          {kbLoading ? (
            <p className="text-secondary/70">{commonT('loading')}...</p>
          ) : (
            renderArticleList(category?.articles || [])
          )}
        </div>
      );
    }

    if (view === 'all-categories' || view === 'all-popular' || view === 'all-latest') {
      let title, list;
      if (view === 'all-categories') {
        title = t('allCategories.title');
        list = categories.map((category) => {
          const Icon = categoryIcons[category.name.trim()] || categoryIcons.default;
          return (
            <div key={category.id} className="py-2 border-b border-divider">
              <button
                onClick={() => {
                  setSelectedCategory(category.id);
                  changeView('category');
                }}
                className="font-semibold text-accent text-left w-full flex items-center gap-x-4"
              >
                <Icon className="h-6 w-6 text-accent" />
                <span className="flex-1">{category.name}</span>
                <ChevronRightIcon className="h-5 w-5 text-secondary/30" />
              </button>
            </div>
          );
        });
      } else {
        title = view === 'all-popular' ? t('allPopular.title') : t('allLatest.title');
        list = renderArticleList(view === 'all-popular' ? popularArticles : latestArticles);
      }
      return (
        <div className="p-4 overflow-y-auto h-full">
          {renderBackButton()}
          <h2 className="text-secondary font-semibold">{title}</h2>
          {list}
        </div>
      );
    }

    // Default view (home).
    return (
      <div className="p-4 overflow-y-auto h-full">
        <div className="flex items-center justify-between">
          <h2 className="text-secondary font-semibold">{t('home.mostPopular')}</h2>
          {popularArticles.length > itemsToShow && (
            <button
              onClick={() => changeView('all-popular')}
              className="text-sm font-semibold text-accent"
            >
              {t('home.viewAll')}
            </button>
          )}
        </div>
        {kbLoading ? (
          <p className="text-secondary/70">{t('home.loading')}</p>
        ) : (
          renderArticleList(popularArticles.slice(0, itemsToShow))
        )}
        <div className="flex items-center justify-between mt-6">
          <h2 className="text-secondary font-semibold">{t('home.latestArticles')}</h2>
          {latestArticles.length > itemsToShow && (
            <button
              onClick={() => changeView('all-latest')}
              className="text-sm font-semibold text-accent"
            >
              {t('home.viewAll')}
            </button>
          )}
        </div>
        {kbLoading ? (
          <p className="text-secondary/70">{t('home.loading')}</p>
        ) : (
          renderArticleList(latestArticles.slice(0, itemsToShow))
        )}
        <div className="flex items-center justify-between mt-6">
          <h2 className="text-secondary font-semibold">{t('home.categories')}</h2>
          {categories.length > itemsToShow && (
            <button
              onClick={() => changeView('all-categories')}
              className="text-sm font-semibold text-accent"
            >
              {t('home.viewAll')}
            </button>
          )}
        </div>
        {kbLoading ? (
          <p className="text-secondary/70">{t('home.loading')}</p>
        ) : (
          categories.slice(0, itemsToShow).map((category) => {
            const Icon = categoryIcons[category.name.trim()] || categoryIcons.default;
            return (
              <div key={category.id} className="py-2 border-b border-divider">
                <button
                  onClick={() => {
                    setSelectedCategory(category.id);
                    changeView('category');
                  }}
                  className="font-semibold text-accent text-left w-full flex items-center gap-x-4"
                >
                  <Icon className="h-6 w-6 text-accent" />
                  <span className="flex-1">{category.name}</span>
                  <ChevronRightIcon className="h-5 w-5 text-secondary/30" />
                </button>
              </div>
            );
          })
        )}
      </div>
    );
  };

  const navItems = [
    { id: 'home', label: t('nav.home'), icon: HomeIcon },
    { id: 'get-in-touch', label: t('nav.contact'), icon: LifebuoyIcon },
    { id: 'feedback', label: t('nav.feedback'), icon: PencilIcon },
    { id: 'chat', label: t('nav.chat'), icon: ChatBubbleOvalLeftIcon },
  ];

  const sectionDetails = {
    home: { title: t('section.home') },
    'get-in-touch': { title: t('section.contact') },
    feedback: { title: t('section.feedback') },
    chat: { title: t('section.chat') },
  };

  const currentSection = sectionDetails[activeTab];
  const showHeader = ['home', 'get-in-touch', 'feedback', 'chat'].includes(activeTab);

  const widgetContainerClasses = `
    fixed z-50
    inset-0 md:inset-auto md:bottom-24 md:right-5
    transform transition-all duration-300 ease-out
    ${
      isOpen
        ? 'opacity-100 scale-100 translate-y-0'
        : 'opacity-0 scale-95 translate-y-full md:translate-y-10 pointer-events-none'
    }
  `;

  const widgetPanelClasses = `
    w-full h-full md:w-[360px] md:h-[640px]
    bg-primary rounded-none md:rounded-2xl
    shadow-2xl flex flex-col overflow-hidden
  `;

  return (
    <>
      <button
        id="support-fab"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 right-5 p-3 bg-accent rounded-full z-40 shadow-lg hover:scale-110 transition-transform duration-300"
        aria-label={t('openWidget')}
      >
        {isOpen ? (
          <XMarkIcon className="h-8 w-8 text-primary" />
        ) : (
          <ChatBubbleOvalLeftIcon className="w-8 w-8 text-primary" />
        )}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-darkblack/30 md:hidden z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className={widgetContainerClasses}>
        <div ref={widgetRef} className={widgetPanelClasses}>
          {showHeader && currentSection && (
            <WidgetHeader
              title={currentSection.title}
              showSearch={activeTab === 'home'}
              searchText={searchText}
              onSearchChange={handleSearchChange}
              onClose={() => setIsOpen(false)}
              searchPlaceholder={t('search.placeholder')}
              commonT={commonT}
            />
          )}
          <div className="flex-grow bg-primary overflow-y-auto">{renderContent()}</div>
          <div className="w-full h-[60px] bg-primary border-t border-divider flex justify-around items-center shrink-0">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="relative flex flex-col items-center justify-center w-1/4 h-full"
              >
                <div className="relative">
                  <item.icon
                    className={`w-6 h-6 ${
                      activeTab === item.id ? 'text-accent' : 'text-secondary/70'
                    }`}
                  />
                </div>
                <span
                  className={`text-xs mt-1 ${
                    activeTab === item.id ? 'text-accent font-semibold' : 'text-secondary/70'
                  }`}
                >
                  {item.label}
                </span>
                {activeTab === item.id && (
                  <div className="absolute bottom-0 w-12 h-1 bg-accent rounded-t-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function LoadingSpinner() {
  return (
    <svg
      className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
}

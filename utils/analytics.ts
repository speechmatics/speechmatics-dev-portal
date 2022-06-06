export const GA_TRACKING_ID = process.env.GTAG || 'G-WSYQJ34RYV';

export const trackPageview = (url: string) => {
  console.log('trackPageview', url);
  try {
    window.gtag('config', GA_TRACKING_ID, {
      page_location: url,
    });
  } catch (err) {
    console.error('Failed sending metrics', err);
  }
};

export const trackEvent = (action: string, category: string, label: string, value: any = {}) => {
  try {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      ...value,
    });
  } catch (err) {
    console.error('Failed sending metrics', err);
  }
};

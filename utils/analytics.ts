import { datadogRum } from '@datadog/browser-rum';

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

export const trackEvent = (
  action: string,
  category: string,
  label: string = '',
  value: any = {}
) => {
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

export function dataDogInit() {
  datadogRum.init({
    applicationId: 'b70b2550-dd21-4969-8be8-69debf8c7f58',
    clientToken: 'pubdc67de53d9467f199978f5bc86362a83',
    site: 'datadoghq.eu',
    service: 'speechmatics-self-service-portal',

    version: process.env.npm_package_version,
    sampleRate: 100,
    premiumSampleRate: 100,
    trackInteractions: true,
    defaultPrivacyLevel: 'mask-user-input',
    env: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  });

  datadogRum.startSessionReplayRecording();
}

/*

trackEvent('download_transcription_click', 'Action')
trackEvent('download_transcription_txt', 'Action')
trackEvent('download_transcription_srt', 'Action')
trackEvent('download_transcription_txt', 'Action')
trackEvent('download_transcription_audio', 'Action')
trackEvent('cancel_job', 'Action')
trackEvent('delete_job', 'Action')
trackEvent('delete_job_confirm', 'Action')
trackEvent('view_transcription', 'Action')
trackEvent('copy_transcription', 'Action')
trackEvent('close_transcription_viewer', 'Action')
trackEvent('usage_tab_limits', 'Navigation')
trackEvent('usage_tab_summary', 'Navigation')
trackEvent('usage_tab_details', 'Navigation')
trackEvent('usage_details_pagination', 'Navigation')
trackEvent('billing_add_card_click', 'Action')
trackEvent('billing_remove_card_click', 'Action')
trackEvent('billing_remove_card_confirm', 'Action')
trackEvent('billing_chargify_submit', 'Action')
trackEvent('billing_chargify_successful', 'Event')
trackEvent('billing_tab_settings', 'Navigation')
trackEvent('billing_tab_payments', 'Navigation')
trackEvent('billing_payments_pagination', 'Navigation')
  
trackEvent('billing_payments_download_invoice', 'Action')
*/

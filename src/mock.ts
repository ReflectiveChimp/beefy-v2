const mockInterface = {
  t: (a: string | string[], ...rest: any[]) => (Array.isArray(a) ? a[0] : a),
  i18n: {
    language: 'en',
    changeLanguage: (a: string) => {},
    exists: (a: string) => true,
  },
};

export function useTranslation() {
  return mockInterface;
}

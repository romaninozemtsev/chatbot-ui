
function fakeTranslation(key: string) {
  return key;
}

export default function useFakeTranslation(someParam: string) {
  return {t: fakeTranslation};
}

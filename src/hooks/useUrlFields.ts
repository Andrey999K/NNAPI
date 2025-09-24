import { useSearchParams } from "next/navigation";

export const useUrlFields = () => {
  const searchParams = useSearchParams();

  const wfId = searchParams.get("wf_id") || "";

  const getFieldsFromUrl = (): Record<string, string> => {
    return JSON.parse(decodeURIComponent(searchParams.get("fields") || "{}"));
  };

  const fields = getFieldsFromUrl();

  // обновляем значения полей в URL с сохранением порядка
  const updateURLFields = (newValue: Record<string, string>): void => {
    // Создаем новый объект, сохраняя порядок полей из исходного fields
    const updatedFields = { ...fields };

    // Обновляем только те поля, которые существуют в исходном fields
    Object.keys(newValue).forEach((key) => {
      if (key in updatedFields) {
        updatedFields[key] = newValue[key];
      }
    });

    const url = new URL(window.location.href);
    url.searchParams.set(
      "fields",
      encodeURIComponent(JSON.stringify(updatedFields))
    );
    window.history.pushState({}, "", url.toString());
  };

  return { wfId, getFieldsFromUrl, updateURLFields, fields };
};

export const useFetch = async (
  url: string,
  { method, body }: { method: string; body: string }
) => {
  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(JSON.parse(body)) : null, // Преобразуем строку в объект и обратно в строку
    });

    if (!response.ok) {
      throw new Error(`Ошибка при запросе ${url}: ${response.statusText}`);
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    console.error(error);
    return { data: null, error };
  }
};

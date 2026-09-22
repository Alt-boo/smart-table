import { createComparison, defaultRules } from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор
const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
  // @todo: #4.1 — заполнить выпадающие списки опциями
  Object.keys(indexes).forEach((elementName) => {
    elements[elementName].append(
      ...Object.values(indexes[elementName]).map((name) => {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        return option;
      }),
    );
  });

  return (data, state, action) => {
    // @todo: #4.2 — обработать очистку поля
    if (action && action.name === "clear") {
      const fieldName = action.dataset.field;
      const input = action.parentElement.querySelector(`[name="${fieldName}"]`);
      if (input) {
        input.value = "";
        state[fieldName] = "";
      }
    }

    // Преобразуем totalFrom и totalTo в массив [from, to] для правила arrayAsRange
    // и приводим к числам, если они заданы
    const totalFrom =
      state.totalFrom !== "" && state.totalFrom != null
        ? parseFloat(state.totalFrom)
        : undefined;
    const totalTo =
      state.totalTo !== "" && state.totalTo != null
        ? parseFloat(state.totalTo)
        : undefined;

    // Формируем объект состояния для компаратора
    const filterState = {
      ...state,
      // Заменяем отдельные поля на массив для total
      total: [totalFrom, totalTo],
    };
    // Удаляем оригинальные поля, чтобы компаратор не сравнивал их как строки
    delete filterState.totalFrom;
    delete filterState.totalTo;

    // @todo: #4.5 — отфильтровать данные используя компаратор
    return data.filter((row) => compare(row, filterState));
  };
}

export const steps1 = [
  {
    id: 1,
    type: "info",
    title: "Что такое HTML?",
    content: `
        HTML отвечает за структуру веб-страницы. Неверно закрытые теги могут нарушить верстку.
        Подробнее: <a href="https://developer.mozilla.org/ru/docs/Learn/Getting_started_with_the_web/HTML_basics" target="_blank">MDN HTML Basics</a>.
      `,
  },
  {
    id: 2,
    type: "info",
    title: "Блоки: div",
    content: `
        <strong>div</strong> — блочный элемент. Он занимает всю ширину. Подробнее: 
        <a href="https://developer.mozilla.org/ru/docs/Web/HTML/Element/div" target="_blank">MDN div</a>.
      `,
  },
  {
    id: 3,
    type: "info",
    title: "Элементы inline: span",
    content: `
        <strong>span</strong> — строчный элемент. Занимает ровно столько места, сколько нужно. Подробнее:
        <a href="https://developer.mozilla.org/ru/docs/Web/HTML/Element/span" target="_blank">MDN span</a>.
      `,
  },
  {
    id: 4,
    type: "task",
    title: "Практика: закрываем теги",
    task: "Найдите и исправьте ошибку в HTML-коде ниже:",
    code: `
        <div>
          <span>Привет мир!</div>
        </span>
      `,
    correctAnswer: ["<div>", "<span>Привет мир!</span>", "</div>"],
  },
  {
    id: 5,
    type: "info",
    title: "CSS: стилизация текста",
    content: `
        CSS позволяет изменять вид текста. Пример: 
        <code>color: red;</code> изменит цвет текста на красный.
      `,
  },
  {
    id: 6,
    type: "task",
    title: "Практика: стилизация текста",
    task: "Сделайте текст красным:",
    code: `
        <p style="">Этот текст должен быть красным</p>
      `,
    correctAnswer: [
      '<p style="color: red;">Этот текст должен быть красным</p>',
    ],
  },
  {
    id: 7,
    type: "info",
    title: "CSS: отступы и поля",
    content: `
        Отступы (margin) создают расстояние вокруг элемента. Поля (padding) увеличивают внутреннее пространство. 
        Подробнее: <a href="https://developer.mozilla.org/ru/docs/Web/CSS/margin" target="_blank">MDN margin</a>.
      `,
  },
  {
    id: 8,
    type: "task",
    title: "Практика: добавляем отступы",
    task: "Добавьте внешний отступ в 20px к параграфу:",
    code: `
        <p>Текст с отступами</p>
      `,
    correctAnswer: ['<p style="margin: 20px;">Текст с отступами</p>'],
  },
  {
    id: 9,
    type: "info",
    title: "JavaScript: переменные",
    content: `
        Переменные хранят данные. Пример: 
        <code>let name = "Иван";</code>
        Подробнее: <a href="https://developer.mozilla.org/ru/docs/Web/JavaScript/Guide/Grammar_and_types" target="_blank">MDN JavaScript Basics</a>.
      `,
  },
  {
    id: 10,
    type: "task",
    title: "Практика: создаем переменную",
    task: "Создайте переменную с именем 'userName' и значением 'Александр':",
    code: `
        // Ваш код здесь
      `,
    correctAnswer: ["let userName = 'Александр';"],
  },
  {
    id: 11,
    type: "info",
    title: "JavaScript: функции",
    content: `
        Функции выполняют действия. Пример:
        <code>function greet() { console.log("Привет!"); }</code>
      `,
  },
  {
    id: 12,
    type: "task",
    title: "Практика: создаем функцию",
    task: "Создайте функцию, которая возвращает 'Hello, world!':",
    code: `
        // Ваш код здесь
      `,
    correctAnswer: ["function sayHello() { return 'Hello, world!'; }"],
  },
  {
    id: 13,
    type: "info",
    title: "HTML: списки",
    content: `
        HTML поддерживает упорядоченные (ol) и неупорядоченные (ul) списки. Подробнее:
        <a href="https://developer.mozilla.org/ru/docs/Web/HTML/Element/ul" target="_blank">MDN ul</a>.
      `,
  },
  {
    id: 14,
    type: "task",
    title: "Практика: создаем список",
    task: "Создайте упорядоченный список с тремя элементами:",
    code: `
        // Ваш HTML здесь
      `,
    correctAnswer: [
      "<ol>",
      "  <li>Элемент 1</li>",
      "  <li>Элемент 2</li>",
      "  <li>Элемент 3</li>",
      "</ol>",
    ],
  },
  {
    id: 15,
    type: "info",
    title: "CSS: Flexbox",
    content: `
        Flexbox помогает выравнивать элементы. Пример:
        <code>display: flex;</code>. Подробнее:
        <a href="https://developer.mozilla.org/ru/docs/Web/CSS/CSS_Flexible_Box_Layout/Basic_Concepts_of_Flexbox" target="_blank">MDN Flexbox</a>.
      `,
  },
  {
    id: 16,
    type: "task",
    title: "Практика: Flexbox",
    task: "Сделайте элементы выровненными по центру:",
    code: `
        <div style="">
          <div>Элемент 1</div>
          <div>Элемент 2</div>
        </div>
      `,
    correctAnswer: [
      '<div style="display: flex; justify-content: center; align-items: center;">',
      "  <div>Элемент 1</div>",
      "  <div>Элемент 2</div>",
      "</div>",
    ],
  },
  {
    id: 17,
    type: "info",
    title: "JavaScript: события",
    content: `
        События позволяют реагировать на действия. Пример:
        <code>element.addEventListener('click', function() { ... })</code>
      `,
  },
  {
    id: 18,
    type: "task",
    title: "Практика: обработчик событий",
    task: "Добавьте обработчик клика, который выводит 'Кнопка нажата':",
    code: `
        <button>Кликни меня</button>
      `,
    correctAnswer: [
      "<button onclick=\"alert('Кнопка нажата')\">Кликни меня</button>",
    ],
  },
  {
    id: 19,
    type: "info",
    title: "HTML: формы",
    content: `
        Формы позволяют отправлять данные. Пример:
        <code>&lt;form&gt;&lt;input&gt;&lt;/form&gt;</code>. Подробнее:
        <a href="https://developer.mozilla.org/ru/docs/Web/HTML/Element/form" target="_blank">MDN Forms</a>.
      `,
  },
  {
    id: 20,
    type: "task",
    title: "Практика: создаем форму",
    task: "Создайте форму с текстовым полем и кнопкой отправки:",
    code: `
        // Ваш HTML здесь
      `,
    correctAnswer: [
      "<form>",
      '  <input type="text" name="username">',
      '  <button type="submit">Отправить</button>',
      "</form>",
    ],
  },
];

export const steps2 = [
  {
    id: 1,
    type: "info",
    title: "Что такое JavaScript?",
    content: `JavaScript — это язык программирования, который используется для создания интерактивных элементов на веб-страницах. Подробнее: 
        <a href="https://developer.mozilla.org/ru/docs/Web/JavaScript/Guide/Introduction" target="_blank">MDN JavaScript Basics</a>.`,
  },
  {
    id: 2,
    type: "info",
    title: "Переменные в JavaScript",
    content: `Переменные хранят данные. Пример:
        <code>let name = "Иван";</code> Подробнее: 
        <a href="https://developer.mozilla.org/ru/docs/Web/JavaScript/Guide/Grammar_and_types" target="_blank">MDN переменные</a>.`,
  },
  {
    id: 3,
    type: "task",
    title: "Практика: создаем переменную",
    task: "Создайте переменную с именем 'userName' и значением 'Александр':",
    code: `// Ваш код здесь`,
    correctAnswer: ["let userName = 'Александр';"],
  },
  {
    id: 4,
    type: "info",
    title: "Типы данных",
    content: `JavaScript поддерживает несколько типов данных, например: строки, числа, массивы и объекты. Подробнее:
        <a href="https://developer.mozilla.org/ru/docs/Web/JavaScript/Data_structures" target="_blank">MDN Типы данных</a>.`,
  },
  {
    id: 5,
    type: "task",
    title: "Практика: работа с типами данных",
    task: "Создайте переменную с числовым значением и строковую переменную:",
    code: `// Ваш код здесь`,
    correctAnswer: ["let num = 42;", "let str = 'Привет, мир!';"],
  },
  {
    id: 6,
    type: "info",
    title: "Функции в JavaScript",
    content: `Функции выполняют действия. Пример:
        <code>function greet() { console.log("Привет!"); }</code> Подробнее:
        <a href="https://developer.mozilla.org/ru/docs/Web/JavaScript/Guide/Functions" target="_blank">MDN Функции</a>.`,
  },
  {
    id: 7,
    type: "task",
    title: "Практика: создаем функцию",
    task: "Создайте функцию greet, которая выводит 'Привет, мир!':",
    code: `// Ваш код здесь`,
    correctAnswer: ["function greet() { console.log('Привет, мир!'); }"],
  },
  {
    id: 8,
    type: "info",
    title: "Условия (if-else)",
    content: `Условия помогают выполнять код в зависимости от условий. Пример:
        <code>if (age > 18) { console.log("Взрослый"); } else { console.log("Не взрослый"); }</code> Подробнее:
        <a href="https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Statements/if...else" target="_blank">MDN if-else</a>.`,
  },
  {
    id: 9,
    type: "task",
    title: "Практика: условие",
    task: "Напишите условие, которое проверяет, является ли число четным:",
    code: `// Ваш код здесь`,
    correctAnswer: [
      "if (num % 2 === 0) {",
      "  console.log('Четное');",
      "} else {",
      "  console.log('Нечетное');",
      "}",
    ],
  },
  {
    id: 10,
    type: "info",
    title: "Циклы в JavaScript",
    content: `Циклы помогают выполнять код несколько раз. Пример:
        <code>for (let i = 0; i < 5; i++) { console.log(i); }</code> Подробнее:
        <a href="https://developer.mozilla.org/ru/docs/Web/JavaScript/Guide/Loops_and_iteration" target="_blank">MDN Циклы</a>.`,
  },
  {
    id: 11,
    type: "task",
    title: "Практика: цикл",
    task: "Напишите цикл, который выводит числа от 1 до 5:",
    code: `// Ваш код здесь`,
    correctAnswer: ["for (let i = 1; i <= 5; i++) {", "  console.log(i);", "}"],
  },
  {
    id: 12,
    type: "info",
    title: "Массивы в JavaScript",
    content: `Массивы используются для хранения коллекций данных. Пример:
        <code>let arr = [1, 2, 3, 4];</code> Подробнее:
        <a href="https://developer.mozilla.org/ru/docs/Web/JavaScript/Guide/Working_with_arrays" target="_blank">MDN Массивы</a>.`,
  },
  {
    id: 13,
    type: "task",
    title: "Практика: создаем массив",
    task: "Создайте массив с 5 числами:",
    code: `// Ваш код здесь`,
    correctAnswer: ["let arr = [1, 2, 3, 4, 5];"],
  },
  {
    id: 14,
    type: "info",
    title: "Объекты в JavaScript",
    content: `Объекты хранят данные в виде пар "ключ-значение". Пример:
        <code>let person = { name: 'Иван', age: 30 };</code> Подробнее:
        <a href="https://developer.mozilla.org/ru/docs/Web/JavaScript/Guide/Working_with_Objects" target="_blank">MDN Объекты</a>.`,
  },
  {
    id: 15,
    type: "task",
    title: "Практика: создаем объект",
    task: "Создайте объект с данными пользователя: имя и возраст:",
    code: `// Ваш код здесь`,
    correctAnswer: ["let user = { name: 'Иван', age: 30 };"],
  },
  {
    id: 16,
    type: "info",
    title: "Асинхронный JavaScript (async/await)",
    content: `Асинхронные функции позволяют работать с операциями, которые занимают время, например, с запросами к серверу. Подробнее:
        <a href="https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Statements/async_function" target="_blank">MDN Async/Await</a>.`,
  },
  {
    id: 17,
    type: "task",
    title: "Практика: async/await",
    task: "Напишите асинхронную функцию, которая выводит 'Привет после 2 секунд':",
    code: `// Ваш код здесь`,
    correctAnswer: [
      "async function greet() {",
      "  await new Promise(resolve => setTimeout(resolve, 2000));",
      "  console.log('Привет после 2 секунд');",
      "}",
    ],
  },
  {
    id: 18,
    type: "info",
    title: "JavaScript: обработка ошибок",
    content: `Обработка ошибок позволяет ловить исключения и реагировать на них. Пример:
        <code>try { ... } catch (error) { console.error(error); }</code> Подробнее:
        <a href="https://developer.mozilla.org/ru/docs/Web/JavaScript/Guide/Control_flow_and_error_handling#try...catch" target="_blank">MDN Ошибки</a>.`,
  },
  {
    id: 19,
    type: "task",
    title: "Практика: обработка ошибок",
    task: "Напишите код с обработкой ошибки при делении на ноль:",
    code: `// Ваш код здесь`,
    correctAnswer: [
      "try {",
      "  let result = 10 / 0;",
      "  if (!isFinite(result)) throw 'Ошибка: деление на ноль';",
      "} catch (error) {",
      "  console.error(error);",
      "}",
    ],
  },
  {
    id: 20,
    type: "task",
    title: "Практика: создание функции и объекта",
    task: "Создайте функцию, которая принимает объект и выводит его имя и возраст:",
    code: `// Ваш код здесь`,
    correctAnswer: [
      "function displayUserInfo(user) {",
      "  console.log(user.name, user.age);",
      "}",
      "let user = { name: 'Иван', age: 30 };",
      "displayUserInfo(user);",
    ],
  },
];
